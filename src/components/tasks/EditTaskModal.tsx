'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';
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

interface EditTaskModalProps {
  isOpen: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, task, onClose, onSave }) => {
  const { theme } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Partial<Task> = { title, description, priority, dueDate: dueDate || undefined };
    onSave(taskData);
  };

  if (!isOpen) return null;

  const inputBg = theme.mode === 'dark' ? '#1F1F2A' : '#FFFFFF';
  const inputText = theme.mode === 'dark' ? '#E0E0E0' : '#111827';
  const borderColor = theme.colors.accent;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative rounded-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 shadow-xl"
            style={{ background: theme.mode === 'dark' ? '#111' : '#fff' }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Floating Icon */}
            <div
              className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{
                background: theme.mode === 'dark' ? '#A855F7' : '#7C3AED',
                boxShadow: `0 0 16px ${theme.colors.accent}66`,
              }}
            >
              <User size={20} className="sm:size-7" color="#fff" />
            </div>

            {/* Header */}
            <div className="text-center mt-10 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.accent }}>
                {task ? 'Edit Task' : 'Create Task'}
              </h3>
              <p className="mt-1 text-sm" style={{ color: theme.colors.text.secondary }}>
                Add details to your task
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-md py-3 px-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                  style={{
                    background: inputBg,
                    color: inputText,
                    border: `2px solid ${borderColor}`,
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md py-3 px-3 text-base sm:text-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                  style={{
                    background: inputBg,
                    color: inputText,
                    border: `2px solid ${borderColor}`,
                  }}
                />
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full rounded-md py-3 px-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                    style={{
                      background: inputBg,
                      color: inputText,
                      border: `2px solid ${borderColor}`,
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-md py-3 px-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                    style={{
                      background: inputBg,
                      color: inputText,
                      border: `2px solid ${borderColor}`,
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white transition-all"
                  style={{
                    background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accent}cc)`,
                    boxShadow: `0 4px 12px ${theme.colors.accent}66`,
                  }}
                >
                  {task ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditTaskModal;
