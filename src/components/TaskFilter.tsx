import React from 'react'

interface TaskFilterProps {
  currentFilter: 'all' | 'active' | 'completed'
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ]

  return (
    <div className="flex border-b border-gray-200">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`px-4 py-2 text-sm font-medium ${
            currentFilter === filter.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onFilterChange(filter.id as 'all' | 'active' | 'completed')}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default TaskFilter