'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
}) => {
  const { theme } = useTheme();

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Detect success/action messages
  const isSuccessMessage =
    message.content.startsWith('✅') ||
    message.content.startsWith('🗑️') ||
    message.content.startsWith('✏️') ||
    message.content.startsWith('📋');

  return (
    <div
      className={`flex ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      } mb-2 slide-in-from-bottom`}
    >
      {!isOwnMessage && (
        <div className="mr-2 flex-shrink-0">
          {/* Assistant Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: theme.colors.accent,
              // FIX: removed non-existent `onAccent`
              color: theme.colors.text.primary,
            }}
          >
            AI
          </div>
        </div>
      )}

      <div className="flex flex-col max-w-[85%]">
        {!isOwnMessage && (
          <div
            className="text-xs font-semibold mb-1"
            style={{
              color: theme.colors.text.primary,
              fontWeight: '600',
            }}
          >
            TaskBot
          </div>
        )}

        <div
          className={`px-2 py-1.5 rounded-2xl transition-all duration-300 text-xs sm:text-sm ${
            isOwnMessage ? 'rounded-br-none' : 'rounded-bl-none'
          }`}
          style={{
            backgroundColor: isOwnMessage
              ? theme.colors.accent
              : theme.mode === 'dark'
              ? `${theme.colors.accent}20`
              : `${theme.colors.accent}10`,
            color: isOwnMessage
              ? theme.colors.text.primary
              : theme.colors.text.primary,
            border: isOwnMessage
              ? 'none'
              : `1px solid ${theme.colors.border}`,
            boxShadow: `0 1px 3px ${theme.colors.border}20`,
          }}
        >
          <div
            className="whitespace-pre-wrap break-words"
            style={{
              color: isOwnMessage
                ? theme.colors.text.primary
                : theme.colors.text.primary,
              lineHeight: '1.4',
              fontSize: '0.875rem',
            }}
          >
            {message.content}
          </div>

          <div
            className={`text-xs mt-1 ${
              isOwnMessage ? 'text-right' : 'text-left'
            }`}
            style={{
              color: isOwnMessage
                ? `${theme.colors.text.primary}CC`
                : theme.colors.text.muted,
              marginTop: '0.25rem',
            }}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>

      {isOwnMessage && (
        <div className="ml-2 flex-shrink-0">
          {/* User Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.text.primary,
            }}
          >
            {message.userId
              ? message.userId.charAt(0).toUpperCase()
              : 'U'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
