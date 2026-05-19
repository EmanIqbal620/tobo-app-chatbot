import React from 'react';
import { motion } from 'framer-motion';
import GlassTaskCard from './GlassTaskCard';

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

interface GlassTaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  loading?: boolean;
  filter?: 'all' | 'active' | 'completed';
  searchTerm?: string;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
}

const GlassTaskList: React.FC<GlassTaskListProps> = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  loading = false,
  filter = 'all',
  searchTerm = '',
  showPriorityIndicator,
  showDueDate
}) => {
  // Filter tasks based on filter and search term
  const filteredTasks = tasks.filter(task => {
    // Apply filter
    if (filter === 'active' && task.isCompleted) return false;
    if (filter === 'completed' && !task.isCompleted) return false;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/18">
          <svg className="h-8 w-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-white">No tasks found</h3>
        <p className="mt-1 text-sm text-white/70">
          {searchTerm ? 'Try adjusting your search' :
           filter === 'active' ? 'All tasks are completed!' :
           filter === 'completed' ? 'No tasks completed yet' :
           'Get started by creating a new task.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <GlassTaskCard
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            showPriorityIndicator={showPriorityIndicator}
            showDueDate={showDueDate}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default GlassTaskList;