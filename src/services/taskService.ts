import api from './api'
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task'

class TaskService {
  async getAll(): Promise<Task[]> {
    const response = await api.get('/tasks')
    return response.data.tasks
  }

  async getById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  }

  async create(taskData: CreateTaskRequest): Promise<Task> {
    const response = await api.post('/tasks', taskData)
    return response.data
  }

  async update(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  }

  async toggleCompletion(id: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/toggle`)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  }
}

export const taskService = new TaskService()