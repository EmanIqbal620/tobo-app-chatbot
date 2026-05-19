'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task'
import { taskService } from '@/services/taskService'
import { useAuth } from './AuthContext' // Import the AuthContext

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (taskData: CreateTaskRequest) => Promise<void>
  updateTask: (id: string, taskData: UpdateTaskRequest) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  clearError: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

interface TaskProviderProps {
  children: ReactNode
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false) // Start with false since we'll conditionally fetch
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, loading: authLoading } = useAuth() // Get authentication status and loading state

  // Fetch tasks only when user is authenticated and auth state is loaded
  useEffect(() => {
    if (!authLoading) { // Only proceed when auth state is loaded
      if (isAuthenticated()) {
        fetchTasks()
      } else {
        // Reset tasks when user is not authenticated
        setTasks([])
        setError(null)
      }
    }
  }, [isAuthenticated, authLoading]) // Only re-run when auth state changes

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const tasksData = await taskService.getAll()
      setTasks(tasksData)
    } catch (err: any) {
      // Check if it's an authentication error and handle accordingly
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication required. Please log in.')
        // Only clear tasks on auth errors to avoid flickering on other network errors
        setTasks([])
      } else {
        setError(err.message || 'Failed to fetch tasks')
        // For network errors, we might want to keep the existing tasks displayed
        // rather than clearing them, to avoid flickering
        console.error('Error fetching tasks:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateTaskRequest) => {
    try {
      setError(null)
      // Create a temporary task with a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`
      const tempTask: Task = {
        id: tempId,
        title: taskData.title,
        description: taskData.description,
        is_completed: false,
        user_id: 'current_user_id', // This would be replaced with actual user ID from auth context
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Optimistically add the task
      setTasks(prev => [...prev, tempTask])

      // Now actually create the task on the server
      const newTask = await taskService.create(taskData)

      // Replace the temporary task with the actual one
      setTasks(prev => prev.map(t => t.id === tempId ? newTask : t))
    } catch (err: any) {
      setError(err.message || 'Failed to create task')
      console.error('Error creating task:', err)
      // If the server call failed, remove the optimistic task
      // But only if it's not an auth error - for auth errors, we might want to refetch
      if (err.response?.status === 401 || err.response?.status === 403) {
        // If it's an auth error, refetch to ensure we have accurate state
        setTasks(prev => prev.filter(t => !t.id.startsWith('temp-')))
        fetchTasks()
      } else {
        // For other errors, just remove the optimistic task
        setTasks(prev => prev.filter(t => !t.id.startsWith('temp-')))
      }
    }
  }

  const updateTask = async (id: string, taskData: UpdateTaskRequest) => {
    try {
      setError(null)

      // Optimistically update the task in the UI
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, ...taskData, updated_at: new Date().toISOString() } : task
      ))

      // Now actually update the task on the server
      const updatedTask = await taskService.update(id, taskData)

      // Update with the server response to ensure consistency
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
    } catch (err: any) {
      setError(err.message || 'Failed to update task')
      console.error('Error updating task:', err)
      // If the server call failed, revert the optimistic update by fetching tasks again
      // But only if it's an authentication error, otherwise keep the optimistic update
      if (err.response?.status === 401 || err.response?.status === 403) {
        fetchTasks() // Only refetch if it's an auth error
      } else {
        // For other errors, revert the optimistic update
        setTasks(prev => prev.map(task =>
          task.id === id ? { ...task, ...taskData, updated_at: new Date().toISOString() } : task
        ))
      }
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    try {
      setError(null)

      // Optimistically toggle the completion status in the UI
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, is_completed: !task.is_completed, updated_at: new Date().toISOString() } : task
      ))

      // Now actually toggle the completion status on the server
      const updatedTask = await taskService.toggleCompletion(id)

      // Update with the server response to ensure consistency
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
    } catch (err: any) {
      setError(err.message || 'Failed to update task completion')
      console.error('Error toggling task completion:', err)
      // If the server call failed, revert the optimistic update by fetching tasks again
      // But only if it's an authentication error, otherwise keep the optimistic update
      if (err.response?.status === 401 || err.response?.status === 403) {
        fetchTasks() // Only refetch if it's an auth error
      } else {
        // For other errors, revert the optimistic update
        setTasks(prev => prev.map(task =>
          task.id === id ? { ...task, is_completed: !task.is_completed, updated_at: new Date().toISOString() } : task
        ))
      }
    }
  }

  const deleteTask = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await taskService.delete(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err: any) {
      setError(err.message || 'Failed to delete task')
      console.error('Error deleting task:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    clearError,
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}