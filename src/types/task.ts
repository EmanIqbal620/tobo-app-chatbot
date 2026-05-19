export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  is_completed?: boolean;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}