'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTask } from '@/contexts/TaskContext'; // Import TaskContext
import { authService } from '@/services/authService';
import chatService from '@/services/chatService';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import QuickActions from './QuickActions';
import { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatWindowProps {
  user: any; // User object from parent component
  conversationId?: number | null;
  onConversationChange?: (id: number | null) => void;
  onTaskOperation?: () => void; // Callback to refresh task list after task operations
}

interface AIResponse {
  response: string;
  conversation_id: string | number;
  tool_usage?: any;
  task_operation?: {
    operation: 'create' | 'update' | 'delete' | 'list';
    result?: any;
    error?: string;
  };
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, conversationId, onConversationChange, onTaskOperation }) => {
  const { theme } = useTheme();
  const { fetchTasks } = useTask(); // Use TaskContext to refresh tasks
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Add function to clear conversation
  const clearConversation = () => {
    setMessages([]);
    // Optionally also reset conversation ID if needed
    if (onConversationChange) {
      onConversationChange(null);
    }
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history
  useEffect(() => {
    const loadConversation = async (convId: number) => {
      if (!user?.id) return;

      try {
        const token = authService.getToken();
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // For now, we're not loading historical messages since that endpoint may not exist yet
        // This can be implemented later when conversation history is properly supported
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations/${user?.id}/${convId}`, {
        //   headers,
        // });

        // if (response.ok) {
        //   const data = await response.json();
        //   const formattedMessages = data.messages?.map((msg: any) => ({
        //     id: msg.id,
        //     userId: msg.user_id,
        //     conversationId: msg.conversation_id,
        //     role: msg.role,
        //     content: msg.content,
        //     timestamp: new Date(msg.created_at || msg.timestamp),
        //     toolCallResults: msg.tool_call_results || null,
        //   })) || [];
        //   setMessages(formattedMessages);
        // } else {
        //   console.error('Failed to load conversation:', response.statusText);
        // }
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    };

    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!user?.id || !message.trim()) return;

    // Add user message to UI immediately
    const userMessage: ChatMessageType = {
      id: Date.now(), // Temporary ID
      userId: user.id,
      conversationId: conversationId || 0,
      role: 'user',
      content: message,
      timestamp: new Date(),
      toolCallResults: null,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue(''); // Clear input after sending

    try {
      // Use the chat service to send the message
      const response = await chatService.sendMessage(user.id, {
        conversation_id: conversationId || undefined, // Use undefined instead of null to match the interface
        message: message,
      });

      // Use the response directly from the backend which already has proper formatting
      let cleanResponse = response.response;

      // Extract the main response part before technical details if needed
      if (response.response && typeof response.response === 'string') {
        // Split the response at "Actions Taken" to get just the user-friendly part
        const responseParts = response.response.split('\nActions Taken:');
        cleanResponse = responseParts[0]; // Take only the main response
      }

      // Add AI response to messages
      const aiMessage: ChatMessageType = {
        id: Date.now() + 1,
        userId: user.id,
        conversationId: response.conversation_id,
        role: 'assistant',
        content: cleanResponse,
        timestamp: new Date(),
        toolCallResults: response.tool_calls,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update conversation ID if it was created
      if (!conversationId) {
        onConversationChange?.(response.conversation_id);
      }

      // Check if any tool calls were for task operations and notify parent
      const hasTaskOperations = response.tool_calls && response.tool_calls.some(toolCall =>
        toolCall.tool.toLowerCase().includes('task')
      );

      if (hasTaskOperations) {
        // Refresh tasks in context first
        setTimeout(() => {
          fetchTasks(); // Refresh tasks in the context

          // Notify parent component to refresh task lists as well
          onTaskOperation?.();
        }, 500); // Slightly longer delay to ensure backend operation completes
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to chat
      const errorMessage: ChatMessageType = {
        id: Date.now(),
        userId: user.id,
        conversationId: conversationId || 0,
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the AI service.',
        timestamp: new Date(),
        toolCallResults: null,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to group messages by time
  const groupMessagesByTime = () => {
    const grouped: { date: string; messages: ChatMessageType[] }[] = [];
    let currentDate = '';

    [...messages].reverse().forEach((message) => {
      const messageDate = message.timestamp.toDateString();

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        grouped.push({ date: messageDate, messages: [] });
      }

      grouped[grouped.length - 1].messages.unshift(message);
    });

    return grouped.reverse();
  };

  const groupedMessages = groupMessagesByTime();

  return (
    <div
      className="flex flex-col h-full w-full max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-120px)]"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
      }}
    >
      {/* Compact Chat Header */}
      <div className="p-2 border-b flex items-center justify-between" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <div className="flex items-center space-x-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.accent,
            }}
          >
            AI
          </div>
          <div className="flex items-center space-x-2 min-w-0">
            <h3 className="font-bold text-sm truncate" style={{
              color: theme.colors.text.primary // Use theme text for both modes
            }}>
              TaskBot
            </h3>
            <div className="flex items-center text-xs" style={{
              color: theme.colors.text.muted // Use theme muted text for both modes
            }}>
              <span
                className="w-1.5 h-1.5 rounded-full mr-1"
                style={{
                  backgroundColor: '#10b981' // Consistent green for both modes
                }}
              ></span>
              Online
            </div>
          </div>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <button
            onClick={clearConversation}
            className="p-1 rounded-full hover:opacity-70 transition-opacity"
            title="Clear conversation"
            style={{
              color: theme.colors.text.primary // Use theme text for both modes
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Chat messages container - largest area (70-75%) */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{
          maxHeight: 'calc(100vh - 150px)', // Adjusted to prevent touching navbar
          backgroundColor: theme.colors.background
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-4 sm:py-8">
            <div className="mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-1 sm:mb-2" style={{ backgroundColor: theme.colors.accent, color: theme.colors.accent }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h3 className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1" style={{
              color: theme.colors.text.primary // Use theme text for both modes
            }}>
              Welcome to TaskBot!
            </h3>
            <p className="text-xs sm:text-sm" style={{
              color: theme.colors.text.muted // Use theme muted text for both modes
            }}>
              Start a conversation to manage your tasks efficiently
            </p>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div
                className="text-center text-xs py-1 mb-2 rounded-full inline-block px-3 mx-auto"
                style={{
                  backgroundColor: `${theme.colors.surface}80`,
                  color: theme.colors.text.muted,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                {new Date(group.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              {group.messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isOwnMessage={msg.role === 'user'}
                />
              ))}
            </div>
          ))
        )}
        {isLoading && (
          <div
            className="flex items-center space-x-3 p-3 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface, // Use theme surface for both modes
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text.primary // Use theme text for both modes
            }}
          >
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  animationDelay: '0ms',
                  backgroundColor: theme.colors.text.muted // Use theme muted text color for both modes
                }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  animationDelay: '300ms',
                  backgroundColor: theme.colors.text.muted // Use theme muted text color for both modes
                }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  animationDelay: '600ms',
                  backgroundColor: theme.colors.text.muted // Use theme muted text color for both modes
                }}
              ></div>
            </div>
            <span style={{
              color: theme.colors.text.primary // Use theme text for both modes
            }}>
              Thinking...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions - more compact for mobile */}
      <div className="border-t p-1 sm:p-2" style={{ borderColor: theme.colors.border }}>
        <QuickActions onActionClick={(command) => setInputValue(command)} />
      </div>

      {/* Input area at bottom - more compact for mobile */}
      <div className="p-1 sm:p-2 border-t" style={{ borderColor: theme.colors.border }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatWindow;