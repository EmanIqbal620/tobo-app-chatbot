'use client';

import React, { useState, FormEvent } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, inputValue, setInputValue, isLoading }) => {
  const { theme } = useTheme();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask to manage tasks..."
          disabled={isLoading}
          className="w-full pl-5 pr-12 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium transition-all"
          style={{
            backgroundColor: theme.mode === 'dark' ? theme.colors.surface : '#ffffff',
            borderColor: theme.colors.border,
            color: theme.colors.text.primary,
            boxShadow: theme.mode === 'dark' 
              ? '0 2px 8px rgba(0,0,0,0.2)' 
              : '0 2px 8px rgba(0,0,0,0.08)',
          }}
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => setInputValue('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            style={{
              color: theme.colors.text.muted,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className="w-14 h-14 rounded-2xl transition-all transform hover:scale-110 disabled:opacity-40 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center shadow-xl"
        style={{
          backgroundColor: inputValue.trim() && !isLoading ? theme.colors.accent : theme.colors.border,
          color: inputValue.trim() && !isLoading ? (theme.mode === 'dark' ? '#000000' : '#ffffff') : theme.colors.text.muted,
          boxShadow: inputValue.trim() && !isLoading 
            ? `0 4px 16px ${theme.colors.accent}66` 
            : 'none',
        }}
        title="Send message"
      >
        {isLoading ? (
          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13"></path>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor"></path>
          </svg>
        )}
      </button>
    </form>
  );
};

export default MessageInput;