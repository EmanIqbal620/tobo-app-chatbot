import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Task } from '@/types/task'
import Button from './Button'

interface EditTaskModalProps {
  isOpen: boolean
  task: Task | null
  onClose: () => void
  onSave: (id: string, taskData: Partial<Task>) => void
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, task, onClose, onSave }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState('')

  // Update form when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setIsCompleted(task.is_completed)
    } else {
      // Reset form when task is null
      setTitle('')
      setDescription('')
      setIsCompleted(false)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate title
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Title is required')
      return
    }

    if (trimmedTitle.length > 255) {
      setError('Title must be 255 characters or less')
      return
    }

    // Validate description if provided
    const trimmedDescription = description.trim()
    if (trimmedDescription && trimmedDescription.length > 1000) {
      setError('Description must be 1000 characters or less')
      return
    }

    setError('')

    if (task) {
      onSave(task.id, {
        title: trimmedTitle,
        description: trimmedDescription || undefined,
        is_completed: isCompleted
      })
    }
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  if (!task) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Task">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <span className={`text-xs ${title.length > 255 ? 'text-red-500' : 'text-gray-500'}`}>
              {title.length}/255
            </span>
          </div>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={255}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              title.length > 255 ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Task title"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <span className={`text-xs ${description.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
              {description.length}/1000
            </span>
          </div>
          <textarea
            id="edit-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              description.length > 1000 ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Task description (optional)"
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            id="edit-completed"
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="edit-completed" className="ml-2 block text-sm text-gray-700">
            Mark as completed
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditTaskModal