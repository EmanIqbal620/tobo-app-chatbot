'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CircleStackIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  showPriorityIndicator = true,
  showDueDate = true
}) => {
  const { theme } = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const cardBg = theme.mode === 'dark'
    ? task.isCompleted ? 'bg-gray-700/50' : 'bg-gray-800/50'
    : task.isCompleted ? 'bg-gray-100' : 'bg-white';

  const borderColor = task.isCompleted
    ? 'border-gray-500'
    : task.priority === 'high'
      ? 'border-red-500'
      : task.priority === 'medium'
        ? 'border-yellow-500'
        : 'border-purple-500';

  return (
    <motion.article
      className="card rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-3"
      style={{
        background: theme.mode === 'dark'
          ? task.isCompleted ? `${theme.colors.background}80` : `${theme.colors.surface}80`
          : task.isCompleted ? '#f1f5f9' : '#ffffff', // Light mode backgrounds
        borderLeft: `4px solid ${
          task.isCompleted
            ? '#94a3b8' // gray-400
            : task.priority === 'high'
              ? '#ef4444' // red-500
              : task.priority === 'medium'
                ? '#f59e0b' // yellow-500
                : theme.colors.accent // purple/default
        }`,
        boxShadow: `0 2px 6px ${theme.colors.accent}33`, // subtle purple shadow
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: `0 8px 20px ${theme.colors.accent}55`, // purple hover shadow
      }}
      role="article"
      aria-roledescription="task item"
      aria-label={`Task: ${task.title}, ${task.isCompleted ? 'completed' : 'not completed'}`}
    >
      {/* Toggle complete */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center"
        style={{
          backgroundColor: task.isCompleted
            ? `${theme.colors.accent}20` // 20% opacity accent when completed
            : 'transparent',
          borderColor: task.isCompleted
            ? theme.colors.accent
            : theme.mode === 'dark'
              ? theme.colors.text.muted
              : '#9ca3af', // light gray border
          color: task.isCompleted
            ? theme.colors.accent
            : theme.mode === 'dark'
              ? theme.colors.text.primary
              : '#374151', // dark gray text
        }}
        aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        aria-checked={task.isCompleted}
        role="switch"
        title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.isCompleted && <CheckCircleIcon className="h-4 w-4" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3
            className={`text-base sm:text-lg font-semibold truncate ${task.isCompleted ? 'line-through' : ''}`}
            style={{
              color: task.isCompleted
                ? theme.colors.text.muted // Use muted text for completed tasks
                : theme.colors.text.primary
            }}
            id={`task-title-${task.id}`}
          >
            {task.title}
          </h3>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            {/* Priority indicator */}
            {showPriorityIndicator && task.priority && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{
                  backgroundColor: task.priority === 'high'
                    ? '#ef4444' // red-500
                    : task.priority === 'medium'
                      ? '#f59e0b' // yellow-500
                      : '#10b981' // green-500 for low
                }}
                aria-label={`Priority: ${task.priority}`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}

            {/* Status indicator - Pending or Complete */}
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{
                backgroundColor: task.isCompleted
                  ? '#10b981' // green for completed
                  : '#3b82f6'  // blue for pending
              }}
              aria-label={`Status: ${task.isCompleted ? 'Complete' : 'Pending'}`}
            >
              {task.isCompleted ? 'Complete' : 'Pending'}
            </span>
          </div>
        </div>

        {task.description && (
          <p
            className="text-xs sm:text-sm mt-1"
            style={{
              color: task.isCompleted
                ? theme.colors.text.muted // Use muted text for completed tasks
                : theme.colors.text.primary
            }}
            id={`task-description-${task.id}`}
          >
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center mt-2 sm:mt-3 gap-2" role="group" aria-label="Task details">
          {showDueDate && task.dueDate && (
            <div
              className="flex items-center text-xs sm:text-sm gap-1"
              style={{
                color: theme.colors.text.muted
              }}
              aria-label={`Due date: ${new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'currentColor' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 ml-3 sm:ml-0" role="group" aria-label="Task actions">
        <button
          onClick={() => onEdit(task.id)}
          style={{
            color: theme.mode === 'dark'
              ? theme.colors.text.muted
              : '#6b7280', // gray-600
          }}
          className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
          aria-label="Edit task"
          aria-describedby={`task-title-${task.id}`}
        >
          <PencilIcon className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" style={{ color: 'currentColor' }} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            color: theme.mode === 'dark'
              ? theme.colors.text.muted
              : '#6b7280', // gray-600
          }}
          className="hover:text-red-500 transition-colors"
          aria-label="Delete task"
          aria-describedby={`task-title-${task.id}`}
        >
          <TrashIcon className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" style={{ color: 'currentColor' }} />
        </button>
      </div>
    </motion.article>
  );
};

const TaskCard = memo(TaskCardComponent);
export default TaskCard;
