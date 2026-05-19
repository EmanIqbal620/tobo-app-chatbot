import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, EllipsisVerticalIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface GlassTaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
}

const GlassTaskCard: React.FC<GlassTaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  showPriorityIndicator = true,
  showDueDate = true
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/30 border-red-500/50';
      case 'medium': return 'bg-yellow-500/30 border-yellow-500/50';
      case 'low': return 'bg-green-500/30 border-green-500/50';
      default: return 'bg-gray-500/30 border-gray-500/50';
    }
  };

  return (
    <motion.div
      className={`glass-card p-6 rounded-2xl border border-white/18 ${task.isCompleted ? 'opacity-70' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start">
        <motion.button
          className={`mr-4 mt-1 flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center ${
            task.isCompleted
              ? 'bg-gradient-primary border-transparent'
              : 'border-white/30 hover:border-white/50'
          }`}
          onClick={() => onToggle(task.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.isCompleted && (
            <CheckCircleSolidIcon className="h-4 w-4 text-white" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-medium truncate ${
              task.isCompleted
                ? 'text-gray-500 dark:text-gray-400 line-through'
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>

            <div className="flex items-center space-x-2">
              {/* Priority indicator */}
              {showPriorityIndicator && task.priority && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}

              {/* Status indicator - Pending or Complete */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.isCompleted
                  ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                  : 'bg-blue-500/30 text-blue-200 border border-blue-500/50'
              }`}>
                {task.isCompleted ? 'Complete' : 'Pending'}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              {task.description}
            </p>
          )}

          {showDueDate && task.dueDate && (
            <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </div>

            <div className="flex space-x-2">
              <motion.button
                className="text-gray-400 hover:text-gray-300 transition-colors"
                onClick={() => onEdit(task.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Edit task"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </motion.button>
              <motion.button
                className="text-gray-400 hover:text-red-400 transition-colors"
                onClick={() => onDelete(task.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Delete task"
              >
                <TrashIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GlassTaskCard;