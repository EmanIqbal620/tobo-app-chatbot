'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Send as SendIcon,
  RotateCcw as RefreshCwIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  MessageSquare as MessageSquareIcon,
  User as UserIcon
} from 'lucide-react';
import MatteCard from './ui/MatteCard';
import ThemeAwareButton from './ui/ThemeAwareButton';
import { useToast } from '@/contexts/ToastContext';
import { useTask } from '@/contexts/TaskContext';
import { Task } from '@/types/task';
import { NotificationTypeEnum } from '@/types/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  toolCallResults?: Array<{
    tool: string;
    status: string;
    result: any;
    error?: string;
    execution_time_ms?: number;
  }>;
}

interface Suggestion {
  id: string;
  text: string;
  type: 'task-creation' | 'task-completion' | 'reminder' | 'productivity';
  confidence: number;
}

interface ChatAnalytics {
  totalChats: number;
  tasksCreated: number;
  tasksCompleted: number;
  avgResponseTime: number;
  suggestionsUsed: number;
  weeklyActivity: Array<{ day: string; count: number }>;
}

interface ChatProps {
  userId: string;
  token: string;
  tasks?: Task[]; // Pass tasks for analytics and suggestions
}

const ChatInterface: React.FC<ChatProps> = ({ userId, token, tasks = [] }) => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { fetchTasks } = useTask();
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI task assistant. How can I help you manage your tasks today?',
      createdAt: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate analytics and suggestions based on tasks
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Calculate basic analytics
      const tasksCreated = tasks.length;
      const tasksCompleted = tasks.filter((t: any) => t.is_completed).length;

      const newAnalytics: ChatAnalytics = {
        totalChats: 24, // This would come from actual chat history
        tasksCreated,
        tasksCompleted,
        avgResponseTime: 1.2, // This would come from actual chat data
        suggestionsUsed: 8, // This would come from actual usage
        weeklyActivity: [
          { day: 'Mon', count: 3 },
          { day: 'Tue', count: 5 },
          { day: 'Wed', count: 2 },
          { day: 'Thu', count: 7 },
          { day: 'Fri', count: 4 },
          { day: 'Sat', count: 2 },
          { day: 'Sun', count: 1 },
        ]
      };

      setAnalytics(newAnalytics);

      // Generate smart suggestions based on tasks
      const newSuggestions: Suggestion[] = [];
      const incompleteTasks = tasks.filter((t: any) => !t.is_completed);
      const highPriorityTasks = incompleteTasks.filter((t: any) => t.priority === 'high');

      if (highPriorityTasks.length > 0) {
        newSuggestions.push({
          id: '1',
          text: `Complete your high priority task: "${highPriorityTasks[0].title}"`,
          type: 'task-completion',
          confidence: 0.9
        });
      }

      if (incompleteTasks.length > 5) {
        newSuggestions.push({
          id: '2',
          text: 'You have many pending tasks. Consider prioritizing them.',
          type: 'productivity',
          confidence: 0.75
        });
      }

      if (newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
      }
    }
  }, [tasks]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message immediately (optimistic update)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Use AbortController for 5s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // OPTIMIZATION: Direct fetch with timeout
      const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
      // Avoid Vercel rewrite auth header issue: use direct backend URL for relative paths
      const apiUrl = rawApiUrl.startsWith('/') ? 'https://emaniqbal-todoapp.hf.space' : rawApiUrl;
      const baseUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
      const response = await fetch(`${baseUrl}/chat-fast/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId || null,
          message: messageToSend,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Update conversation ID if new
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id.toString());
      }

      // OPTIMIZATION: Clean response (remove technical details)
      const cleanContent = data.response.split('\nActions Taken:')[0];

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: cleanContent,
        createdAt: new Date(),
        toolCallResults: data.tool_calls || [],
      };

      setMessages(prev => [...prev, assistantMessage]);

      // OPTIMIZATION: Parallel task refresh (don't block UI)
      if (['add', 'create', 'complete', 'delete', 'remove', 'update'].some(
            word => messageToSend.toLowerCase().includes(word)
          )) {
        // Refresh tasks in background
        fetchTasks?.().catch(console.error);
      }

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: error instanceof Error ? `Error: ${error.message}` : 'Sorry, I encountered an error.',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      showToast('Error sending message', NotificationTypeEnum.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your AI task assistant. How can I help you manage your tasks today?',
        createdAt: new Date()
      }
    ]);
    setConversationId(null);
  };

  const applySuggestion = (suggestionText: string) => {
    setInputValue(suggestionText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary
      }}
    >
      {/* Chat Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }}
      >
        <div className="flex items-center space-x-3">
          <MessageSquareIcon className="h-6 w-6" style={{ color: theme.colors.accent }} />
          <h2 className="text-xl font-bold">AI Task Assistant</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary
            }}
            title={showSuggestions ? "Hide suggestions" : "Show suggestions"}
          >
            <LightbulbIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary
            }}
            title={showAnalytics ? "Hide analytics" : "Show analytics"}
          >
            <TrendingUpIcon className="h-5 w-5" />
          </button>

          <button
            onClick={startNewConversation}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity flex items-center"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary
            }}
            title="Start new conversation"
          >
            <RefreshCwIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">New Chat</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Suggestions Panel */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="w-64 border-r p-4 overflow-y-auto"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h3 className="font-semibold mb-3 flex items-center">
              <LightbulbIcon className="h-4 w-4 mr-2" style={{ color: theme.colors.accent }} />
              Smart Suggestions
            </h3>

            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => applySuggestion(suggestion.text)}
                  className="p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity text-sm"
                  style={{
                    backgroundColor: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.text.primary
                  }}
                >
                  {suggestion.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* Analytics Panel */}
          {showAnalytics && analytics && (
            <MatteCard
              className="m-4 p-4"
            >
              <div className="flex items-center mb-2">
                <TrendingUpIcon className="h-4 w-4 mr-2" style={{ color: theme.colors.accent }} />
                <h3 className="font-semibold">Chat Analytics</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Total Chats</div>
                  <div className="font-semibold">{analytics.totalChats}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Tasks Created</div>
                  <div className="font-semibold">{analytics.tasksCreated}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Tasks Completed</div>
                  <div className="font-semibold">{analytics.tasksCompleted}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Avg Response</div>
                  <div className="font-semibold">{analytics.avgResponseTime}s</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Suggestions Used</div>
                  <div className="font-semibold">{analytics.suggestionsUsed}</div>
                </div>
              </div>
            </MatteCard>
          )}

          {/* Messages Container */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              backgroundColor: theme.colors.background
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquareIcon className="h-12 w-12 mb-4 opacity-50" style={{ color: theme.colors.text.secondary }} />
                <h3 className="text-lg font-medium mb-2">Welcome to AI Task Assistant</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Start a conversation by asking me to manage your tasks! I can help you create tasks,
                  mark tasks as complete, prioritize your work, and provide productivity suggestions.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'rounded-br-none'
                          : 'rounded-bl-none'
                      }`}
                      style={{
                        backgroundColor: message.role === 'user'
                          ? theme.colors.accent
                          : theme.colors.surface,
                        color: message.role === 'user' ? 'white' : theme.colors.text.primary
                      }}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <div className="mt-0.5 flex-shrink-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: theme.colors.accent }}
                            >
                              <span className="text-xs font-bold">AI</span>
                            </div>
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="whitespace-pre-wrap">{message.content}</div>

                          {/* Display tool call results if present */}
                          {message.toolCallResults && message.toolCallResults.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-300">Actions Taken:</div>
                              <ul className="space-y-1">
                                {message.toolCallResults.map((toolCall, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${
                                      toolCall.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                                    <div className="flex-1">
                                      <div className="text-xs">
                                        <strong>{toolCall.tool}:</strong> {toolCall.status === 'success' ? 'Completed' : `Error: ${toolCall.error || 'Unknown error'}`}
                                      </div>
                                      {toolCall.execution_time_ms !== undefined && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          Execution time: {toolCall.execution_time_ms.toFixed(2)}ms
                                        </div>
                                      )}
                                      {toolCall.result && toolCall.status === 'success' && (
                                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                          Result: {typeof toolCall.result === 'object'
                                            ? JSON.stringify(toolCall.result).substring(0, 100) + (JSON.stringify(toolCall.result).length > 100 ? '...' : '')
                                            : String(toolCall.result).substring(0, 100) + (String(toolCall.result).length > 100 ? '...' : '')}
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div
                            className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <div className="mt-0.5 flex-shrink-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: theme.colors.text.primary }}
                            >
                              <UserIcon className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="p-4 border-t"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex space-x-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to manage your tasks (e.g., 'Add a task to buy groceries')..."
                disabled={isLoading}
                className="flex-1 resize-none py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 max-h-32"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary
                }}
                rows={1}
              />

              <ThemeAwareButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-3 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <SendIcon className="h-5 w-5" />
                )}
              </ThemeAwareButton>
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;