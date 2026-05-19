import React from 'react'
import { Task } from '@/types/task'
import Button from './Button'
import { useTheme } from '@/contexts/ThemeContext'

interface TaskItemProps {
  task: Task
  onToggleCompletion: (id: string) => void
  onDelete: (id: string) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleCompletion, onDelete }) => {
  const { theme } = useTheme();

  return (
    <div
      className="p-4 rounded-lg transition-colors duration-200"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: '0 0 1px 0'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => onToggleCompletion(task.id)}
            className="h-4 w-4 rounded focus:ring-0"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              accentColor: theme.colors.accent
            }}
          />
          <span
            className={`ml-3 text-sm font-medium ${task.is_completed ? 'line-through' : ''}`}
            style={{
              color: task.is_completed ? theme.colors.text.muted : theme.colors.text.primary
            }}
          >
            {task.title}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
            style={{
              backgroundColor: '#EF4444', // Red for danger
              color: '#FFFFFF'
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      {task.description && (
        <div className="ml-7 mt-1 text-sm" style={{ color: theme.colors.text.secondary }}>
          {task.description}
        </div>
      )}
      <div className="ml-7 mt-1 text-xs" style={{ color: theme.colors.text.muted }}>
        Created: {new Date(task.created_at).toLocaleString()}
      </div>
    </div>
  )
}

export default TaskItem