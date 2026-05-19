'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskAnalytics from '@/components/analytics/TaskAnalytics';
import SmartSuggestions from '@/components/analytics/SmartSuggestions';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useToast } from '@/contexts/ToastContext';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationTypeEnum } from '@/types/ui';
import { Task } from '@/types/task';
import { motion } from 'framer-motion';

const AnalyticsPage: React.FC = () => {
  const { theme } = useTheme();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
  const { tasks, loading, error, fetchTasks } = useTask();
  const { isAuthenticated, user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchTasks();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Authentication Required</h2>
            <p className="text-gray-600">Please log in to view analytics.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.h1
          className="text-3xl font-bold"
          style={{ color: theme.colors.text.primary }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analytics Dashboard
        </motion.h1>
        <motion.p
          className="mt-2 text-gray-600 dark:text-gray-300"
          style={{ color: theme.colors.text.secondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Track your productivity and get insights about your task management
        </motion.p>
      </div>

      {error && !loading && (
        <div className="matte-card p-4 rounded-xl mb-6" style={{ backgroundColor: theme.colors.surface }}>
          <div className="text-red-500">Error: {error}</div>
          <button
            onClick={() => fetchTasks()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <motion.div
          className="matte-card p-8 rounded-xl text-center"
          style={{ backgroundColor: theme.colors.surface }}
          animate={{
            opacity: [0.5, 1, 0.5],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="h-8 bg-surface-600 rounded w-1/3 mx-auto mb-4" style={{ backgroundColor: theme.colors.surface }}></div>
          <div className="h-4 bg-surface-600 rounded w-1/2 mx-auto" style={{ backgroundColor: theme.colors.surface }}></div>
        </motion.div>
      ) : (
        <AnalyticsDashboard tasks={tasks} />
      )}

      {/* Time Range Selector */}
      <div className="flex space-x-2 mb-6">
        {(['day', 'week', 'month', 'quarter'] as const).map((range) => (
          <button
            key={range}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setSelectedTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Task Analytics Section */}
      <div
        className="rounded-xl p-6 border mb-8"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }}
      >
        <h2
          className="text-xl font-semibold mb-6"
          style={{ color: theme.colors.text.primary }}
        >
          Task Analytics
        </h2>
        <TaskAnalytics tasks={tasks} />
      </div>

      {/* Smart Suggestions Section */}
      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }}
      >
        <h2
          className="text-xl font-semibold mb-6"
          style={{ color: theme.colors.text.primary }}
        >
          Smart Suggestions
        </h2>
        <SmartSuggestions tasks={tasks} />
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;