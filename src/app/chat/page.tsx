'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useTask } from '@/contexts/TaskContext';
import { useTheme } from '@/contexts/ThemeContext';

const ChatPage: React.FC = () => {
  const { user, getToken, isAuthenticated } = useAuth();
  const token = getToken();
  const { showLoading, hideLoading } = useLoading();
  const { tasks } = useTask();
  const { theme } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isAuthenticated()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access the chat interface.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isHydrated || !user || !token) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading...</h2>
            <p className="text-gray-600">Preparing chat interface</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          AI Task Assistant
        </h1>
        <p
          className="mt-2"
          style={{ color: theme.colors.text.secondary }}
        >
          Chat with your AI assistant to manage tasks naturally
        </p>
      </div>

      <div className="rounded-xl p-6 border"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          height: 'calc(100vh - 200px)',
          minHeight: '500px'
        }}
      >
        <ChatInterface userId={user.id} token={token} tasks={tasks} />
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;