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
import { Task } from '@/types/task';

// Note: We use the imported Task type from '@/types/task' which has the correct snake_case fields
// The mapping to camelCase happens in the component rendering

const CompletedTasksPage: React.FC = () => {
  const { theme } = useTheme();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
  const { tasks, loading: tasksLoading, error, toggleTaskCompletion, deleteTask, updateTask, createTask, fetchTasks } = useTask();
  const { isAuthenticated } = useAuth();
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'dateCreated' | 'dueDate' | 'priority' | 'title'>('dateCreated');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true); // Loading state for initial dashboard load

  // Load all tasks and filter for completed ones
  useEffect(() => {
    if (isAuthenticated()) {
      const loadTasks = async () => {
        setInitialLoading(true);
        try {
          await fetchTasks();
        } finally {
          setInitialLoading(false);
        }
      };
      loadTasks();
    } else {
      setInitialLoading(false);
    }
  }, [isAuthenticated]); // Removed fetchTasks from dependency array to prevent infinite loop

  // Filter completed tasks and apply filters and sorting
  useEffect(() => {
    // Filter for completed tasks only - use the backend field name
    let completedTasks = tasks.filter(task => task.is_completed);

    // Apply search
    if (searchTerm) {
      completedTasks = completedTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting - need to map field names for sorting
    completedTasks.sort((a, b) => {
      switch (sortBy) {
        case 'dateCreated':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'dueDate':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority || 'low'] - priorityOrder[a.priority || 'low'];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTasks(completedTasks);
  }, [tasks, sortBy, searchTerm]);

  const isLoading = tasksLoading || initialLoading;

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
    if (task) {
      setCurrentTask({
        id: task.id,
        title: task.title,
        description: task.description,
        isCompleted: task.is_completed,
        priority: task.priority || 'medium',
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        completedAt: task.completed_at,
      });
      setIsModalOpen(true);
    }
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

  const handleSaveTask = async (taskData: any) => {
    try {
      showLoading('saveTask', 'apiCall', taskData.id ? 'Updating task...' : 'Creating task...');

      if (taskData.id) {
        // Update existing task
        await updateTask(taskData.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
        });
        showToast('Task updated successfully', NotificationTypeEnum.SUCCESS);
      } else {
        // Create new task
        await createTask({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || 'medium',
        });
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
            Completed Tasks
          </h1>
          <p
            className="mt-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Your completed tasks and achievements
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
            <h2
              className="text-xl font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              Completed Tasks
            </h2>

            <div className="flex flex-wrap gap-3">
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
                placeholder="Search completed tasks..."
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
          {isLoading ? (
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
            id: currentTask.id,
            title: currentTask.title,
            description: currentTask.description,
            isCompleted: currentTask.isCompleted,
            priority: currentTask.priority || 'medium',
            dueDate: currentTask.dueDate,
            createdAt: currentTask.createdAt,
            updatedAt: currentTask.updatedAt,
            completedAt: currentTask.completedAt,
          } : undefined}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default CompletedTasksPage;