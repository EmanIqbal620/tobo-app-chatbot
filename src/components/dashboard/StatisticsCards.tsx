'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-6"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: '1px',
        boxShadow: theme.mode === 'dark'
          ? '0 12px 40px rgba(168,85,247,0.18)'
          : '0 4px 6px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm"
            style={{ color: theme.colors.text.muted }}
          >
            {title}
          </p>
          <p
            className="mt-1 text-3xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            {value}
          </p>
        </div>

        {icon && (
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${theme.colors.accent}20`, // 20% opacity accent color
              color: theme.colors.accent,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {change && (
        <p
          className="mt-3 text-sm font-medium"
          style={{
            color: changeType === 'positive'
              ? theme.mode === 'dark' ? '#4ade80' : '#16a34a' // green-400 or green-600
              : theme.mode === 'dark' ? '#f87171' : '#dc2626' // red-400 or red-600
          }}
        >
          {change}
        </p>
      )}
    </motion.div>
  );
};

interface StatisticsCardsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks?: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalTasks,
  completedTasks,
  pendingTasks,
  overdueTasks = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatisticCard
        title="Total Tasks"
        value={totalTasks}
        icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
        change="+12% from last week"
        changeType="positive"
      />

      <StatisticCard
        title="Completed"
        value={completedTasks}
        icon={<CheckCircleIcon className="h-6 w-6" />}
        change="+8% from last week"
        changeType="positive"
      />

      <StatisticCard
        title="Pending"
        value={pendingTasks}
        icon={<ClockIcon className="h-6 w-6" />}
        change="-3% from last week"
        changeType="negative"
      />

      <StatisticCard
        title="Overdue"
        value={overdueTasks}
        icon={<ExclamationTriangleIcon className="h-6 w-6" />}
        change="+2 since yesterday"
        changeType="negative"
      />
    </div>
  );
};

export default StatisticsCards;
