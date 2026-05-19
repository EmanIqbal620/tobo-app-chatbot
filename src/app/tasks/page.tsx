'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskList from '@/components/tasks/TaskList';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useToast } from '@/contexts/ToastContext';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationTypeEnum } from '@/types/ui';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';

const TasksPage: React.FC = () => {
  const { theme } = useTheme();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
  const { tasks, loading, error, createTask, updateTask, toggleTaskCompletion, deleteTask, fetchTasks } = useTask();
  const { isAuthenticated } = useAuth();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dateCreated' | 'dueDate' | 'priority' | 'title'>('dateCreated');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];

    // Apply filter
    if (filter === 'active') {
      result = result.filter(task => !task.is_completed);
    } else if (filter === 'completed') {
      result = result.filter(task => task.is_completed);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dateCreated':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'dueDate':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime();
        case 'priority':
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority || 'low'] - priorityOrder[a.priority || 'low'];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, filter, sortBy, searchTerm]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchTasks();
    }

  }, [isAuthenticated]); // Removed fetchTasks from dependency array to prevent infinite loop

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
      showToast('Task updated successfully', NotificationTypeEnum.SUCCESS);
    } catch (err: any) {
      showToast(err.message || 'Failed to update task', NotificationTypeEnum.ERROR);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setCurrentTask(task || null);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      showLoading('deleteTask', 'apiCall', 'Deleting task...');
      await deleteTask(taskId);
      hideLoading('deleteTask');
      showToast('Task deleted successfully', NotificationTypeEnum.SUCCESS);
    } catch (err: any) {
      hideLoading('deleteTask');
      showToast(err.message || 'Failed to delete task', NotificationTypeEnum.ERROR);
    }
  };

  const handleSaveTask = async (taskData: CreateTaskRequest | UpdateTaskRequest) => {
    try {
      showLoading('saveTask', 'apiCall', currentTask ? 'Updating task...' : 'Creating task...');

      if (currentTask) {
        // Update existing task
        await updateTask(currentTask.id, taskData as UpdateTaskRequest);
        showToast('Task updated successfully', NotificationTypeEnum.SUCCESS);
      } else {
        // Create new task
        await createTask(taskData as CreateTaskRequest);
        showToast('Task created successfully', NotificationTypeEnum.SUCCESS);
      }

      hideLoading('saveTask');
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (err: any) {
      hideLoading('saveTask');
      showToast(err.message || 'Failed to save task', NotificationTypeEnum.ERROR);
    }
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  // Show error if there's an error
  if (error && !loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-500">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => fetchTasks()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            My Tasks
          </h1>
          <p
            className="mt-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Manage your tasks efficiently
          </p>
        </div>

        {/* Task Management Section */}
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: theme.colors.text.primary }}
              >
                Task List
              </h2>
              <p className="text-sm mt-1" style={{ color: theme.colors.text.muted }}>
                Filter tasks and click checkboxes to mark as complete
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="matte-input"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border
                }}
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="matte-input"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border
                }}
              >
                <option value="dateCreated">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>

              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="matte-input flex-grow min-w-[150px]"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border
                }}
              />
            </div>
          </div>

          {/* Task List - Loading animation */}
          {loading ? (
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="matte-card p-4 rounded-lg mb-3"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-surface-600 mr-3" style={{ backgroundColor: theme.colors.surface }}></div>
                    <div className="flex-1">
                      <div className="h-4 bg-surface-600 rounded w-3/4 mb-2" style={{ backgroundColor: theme.colors.surface }}></div>
                      <div className="h-3 bg-surface-600 rounded w-1/2" style={{ backgroundColor: theme.colors.surface }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <TaskList
              tasks={filteredTasks.map(task => ({
                ...task,
                isCompleted: task.is_completed,
                createdAt: task.created_at,
                updatedAt: task.updated_at,
                completedAt: task.completed_at,
                dueDate: task.due_date,
              }))}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              showPriorityIndicator={true}
              showDueDate={true}
            />
          )}
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          onClick={handleAddTask}
          tooltip="Add new task"
        />

        {/* Task Modal */}
        <EditTaskModal
          isOpen={isModalOpen}
          task={currentTask ? {
            ...currentTask,
            isCompleted: currentTask.is_completed,
            createdAt: currentTask.created_at,
            updatedAt: currentTask.updated_at,
            completedAt: currentTask.completed_at,
            dueDate: currentTask.due_date,
          } : undefined}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default TasksPage;