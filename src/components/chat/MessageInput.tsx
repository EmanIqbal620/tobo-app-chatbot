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
    <form onSubmit={handleSubmit} className="flex items-center space-x-1 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask to manage tasks..."
          disabled={isLoading}
          className="w-full pl-3 pr-10 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-sm"
          style={{
            backgroundColor: theme.colors.background, // Use theme background for both modes
            borderColor: theme.colors.border,
            color: theme.colors.text.primary, // Use theme text for both modes
          }}
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => setInputValue('')}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:opacity-70 transition-opacity"
            style={{
              color: theme.colors.text.primary // Use theme text for both modes
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        className="p-2 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
        style={{
          backgroundColor: theme.colors.accent,
          color: theme.colors.accent,
        }}
        title="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;