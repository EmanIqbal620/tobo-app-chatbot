import React from 'react'
import { Task } from '@/types/task'
import TaskItem from './TaskItem'
import { useTheme } from '@/contexts/ThemeContext'

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (id: string) => void
  onDelete: (id: string) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleCompletion, onDelete }) => {
  const { theme } = useTheme();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p style={{ color: theme.colors.text.secondary }}>No tasks yet. Create your first task!</p>
      </div>
    )
  }

  return (
    <div
      className="divide-y rounded-lg"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: '1px'
      }}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TaskList