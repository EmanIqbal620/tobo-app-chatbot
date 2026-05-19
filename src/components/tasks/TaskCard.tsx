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
      case 'high': return theme.mode === 'dark' ? '#ef4444' : '#dc2626';
      case 'medium': return theme.mode === 'dark' ? '#f59e0b' : '#d97706';
      case 'low': return theme.mode === 'dark' ? '#10b981' : '#059669';
      default: return theme.colors.border;
    }
  };

  const cardBackground = theme.mode === 'dark'
    ? task.isCompleted ? `${theme.colors.background}95` : `${theme.colors.surface}95`
    : task.isCompleted ? '#f1f5f9' : '#ffffff';

  const textColor = task.isCompleted
    ? theme.colors.text.muted
    : theme.colors.text.primary;

  const borderColor = task.isCompleted
    ? '#94a3b8'
    : task.priority === 'high'
      ? '#ef4444'
      : task.priority === 'medium'
        ? '#f59e0b'
        : theme.colors.accent;

  return (
    <motion.article
      className="card rounded-xl p-4 sm:p-5 flex flex-col gap-3 w-full"
      style={{
        background: cardBackground,
        borderLeft: `5px solid ${borderColor}`,
        boxShadow: theme.mode === 'dark'
          ? `0 4px 12px rgba(0,0,0,0.3)`
          : `0 4px 12px rgba(0,0,0,0.1)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -3,
        boxShadow: theme.mode === 'dark'
          ? `0 8px 20px rgba(0,0,0,0.4)`
          : `0 8px 20px rgba(0,0,0,0.15)`,
      }}
      role="article"
      aria-roledescription="task item"
      aria-label={`Task: ${task.title}, ${task.isCompleted ? 'completed' : 'not completed'}`}
    >
      {/* Top section: checkbox and title */}
      <div className="flex items-start gap-3 w-full">
        {/* Toggle complete */}
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 mt-0.5"
          style={{
            backgroundColor: task.isCompleted ? theme.colors.accent : 'transparent',
            borderColor: task.isCompleted ? theme.colors.accent : theme.colors.border,
            color: task.isCompleted ? (theme.mode === 'dark' ? '#000000' : '#ffffff') : theme.colors.text.muted,
          }}
          aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          aria-checked={task.isCompleted}
          role="switch"
          title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.isCompleted && <CheckCircleIcon className="h-4 w-4" />}
        </button>

        {/* Title and badges */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <h3
              className={`text-base sm:text-lg font-bold truncate flex-1 min-w-0 ${task.isCompleted ? 'line-through opacity-60' : ''}`}
              style={{ color: textColor }}
              id={`task-title-${task.id}`}
            >
              {task.title}
            </h3>

            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              {/* Priority indicator */}
              {showPriorityIndicator && task.priority && (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                  aria-label={`Priority: ${task.priority}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}

              {/* Status indicator */}
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: task.isCompleted ? '#10b981' : '#3b82f6' }}
                aria-label={`Status: ${task.isCompleted ? 'Complete' : 'Pending'}`}
              >
                {task.isCompleted ? '✓ Done' : '○ Pending'}
              </span>
            </div>
          </div>

        {task.description && (
          <p
            className="text-xs sm:text-sm mt-2 px-1"
            style={{ color: theme.colors.text.secondary }}
            id={`task-description-${task.id}`}
          >
            {task.description}
          </p>
        )}

        {showDueDate && task.dueDate && (
          <div
            className="flex items-center text-xs sm:text-sm gap-1.5 mt-2 px-1"
            style={{ color: theme.colors.text.muted }}
            aria-label={`Due date: ${new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>
        )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: theme.colors.border }}>
          <button
            onClick={() => onEdit(task.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: `${theme.colors.accent}20`,
              color: theme.colors.accent,
            }}
            aria-label="Edit task"
            aria-describedby={`task-title-${task.id}`}
          >
            <PencilIcon className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: '#ef444420',
              color: '#ef4444',
            }}
            aria-label="Delete task"
            aria-describedby={`task-title-${task.id}`}
          >
            <TrashIcon className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const TaskCard = memo(TaskCardComponent);
export default TaskCard;
