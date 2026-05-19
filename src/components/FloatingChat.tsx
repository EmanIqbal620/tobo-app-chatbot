'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ChatWindow from './chat/ChatWindow';

const FloatingChat: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  // Handle new messages (for unread indicator)
  useEffect(() => {
    // In a real implementation, you'd listen for new messages from the chat
    // For now, we'll just simulate it
    if (isOpen) {
      // Reset unread when chat is opened
      setHasUnread(false);
    }
  }, [isOpen]);

  // Don't hide the chat button, but show different states based on auth
  const isAuthenticated = !!user;

  return (
    <>
      {/* Floating Chat Button - Positioned to avoid overlap with other icons */}
      <button
        onClick={isAuthenticated ? toggleChat : () => alert('Please log in to use the AI assistant')}
        className="fixed bottom-8 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 sm:bottom-8 sm:right-24"
        style={{
          backgroundColor: theme.colors.accent,
          color: theme.colors.text.primary,
          boxShadow: `0 4px 20px ${theme.colors.accent}40, 0 0 0 2px ${theme.colors.accent}20`,
          zIndex: 50
        }}
        aria-label={isAuthenticated ? "Open AI Assistant" : "Log in to use AI Assistant"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-message-circle"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>

        {/* Unread indicator */}
        {hasUnread && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs"
            style={{
              backgroundColor: '#ef4444', // Red for unread messages
              color: theme.colors.text.primary,
            }}
          >
            !
          </span>
        )}
      </button>

      {/* Chat Drawer/Modal - Responsive and properly themed header */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 left-4 z-40 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col sm:bottom-24 sm:right-8 sm:left-auto"
          style={{
            width: 'calc(100% - 2rem)', // Full width minus margins on mobile
            maxWidth: '400px', // Reduced width further for better laptop experience
            height: '75vh', // Increased height since icon is at bottom-8
            minHeight: '350px',
            maxHeight: '80vh', // Increased max height since icon is at bottom-8
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: '1px',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Responsive Header with proper theming */}
            <div
              className="p-3 sm:p-2 border-b flex justify-between items-center"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.text.primary,
                  }}
                >
                  AI
                </div>
                <h3
                  className="font-bold text-sm truncate"
                  style={{ color: theme.colors.text.primary }}
                >
                  TaskBot
                </h3>
                <span
                  className="text-xs hidden sm:inline"
                  style={{ color: theme.colors.text.muted }}
                >
                  ● Online
                </span>
              </div>
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:opacity-70 transition-opacity flex-shrink-0"
                style={{ color: theme.colors.text.primary }}
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {isAuthenticated ? (
                <ChatWindow user={user} conversationId={conversationId} onConversationChange={setConversationId} onTaskOperation={() => {
                  // Task operation callback - trigger UI refresh after task operations
                  // This could dispatch an event to refresh task lists in other parts of the UI
                  window.dispatchEvent(new CustomEvent('task-operation-performed'));
                }} />
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center p-4 text-center" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background }}>
                  <div className="mb-4 p-3 rounded-full" style={{ backgroundColor: theme.colors.surface }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-lock"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Authentication Required</h3>
                  <p className="text-sm mb-4" style={{ color: theme.colors.text.muted }}>
                    Please log in to use the AI assistant and manage your tasks.
                  </p>
                  <button
                    onClick={() => {
                      // Redirect to login page
                      window.location.href = '/login';
                    }}
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay when chat is open - with proper z-index and spacing */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-20 backdrop-blur-sm"
          onClick={toggleChat}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default FloatingChat;