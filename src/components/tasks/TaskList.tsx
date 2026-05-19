'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import SkeletonLoader from '../ui/SkeletonLoader';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  loading?: boolean;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
}

const TaskListComponent: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  loading = false,
  showPriorityIndicator = true,
  showDueDate = true,
}) => {
  const { theme } = useTheme();

  /* Loading state */
  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  /* Empty state */
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="mx-auto h-20 w-20 flex items-center justify-center rounded-full"
          style={{
            background:
              theme.mode === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : '#f3f4f6',
            border:
              theme.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.15)'
                : '1px solid #e5e7eb',
          }}
        >
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: theme.colors.text.secondary }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
            />
          </svg>
        </div>

        <h3
          className="mt-3 text-lg font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          No tasks yet
        </h3>

        <p
          className="mt-1 text-sm"
          style={{ color: theme.colors.text.secondary }}
        >
          Create your first task to get started.
        </p>
      </div>
    );
  }

  /* Task list */
  return (
    <div
      className="space-y-3 sm:space-y-4 rounded-xl p-1"
      style={{
        background:
          theme.mode === 'dark'
            ? 'rgba(255,255,255,0.02)'
            : 'transparent',
      }}
    >
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <TaskCard
              task={{
                ...task,
                isCompleted: task.is_completed,
                createdAt: task.created_at,
                updatedAt: task.updated_at,
                completedAt: task.completed_at,
                dueDate: task.due_date,
              }}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              showPriorityIndicator={showPriorityIndicator}
              showDueDate={showDueDate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const TaskList = memo(TaskListComponent);
export default TaskList;
