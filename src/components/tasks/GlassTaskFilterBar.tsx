import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon, MagnifyingGlassIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

interface GlassTaskFilterBarProps {
  currentFilter: 'all' | 'active' | 'completed';
  currentSort: 'dateCreated' | 'dueDate' | 'priority' | 'title';
  searchTerm: string;
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onSortChange: (sort: 'dateCreated' | 'dueDate' | 'priority' | 'title') => void;
  onSearchChange: (searchTerm: string) => void;
}

const GlassTaskFilterBar: React.FC<GlassTaskFilterBarProps> = ({
  currentFilter,
  currentSort,
  searchTerm,
  onFilterChange,
  onSortChange,
  onSearchChange
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    { id: 'all', name: 'All Tasks' },
    { id: 'active', name: 'Active' },
    { id: 'completed', name: 'Completed' },
  ];

  const sortOptions = [
    { id: 'dateCreated', name: 'Date Created' },
    { id: 'dueDate', name: 'Due Date' },
    { id: 'priority', name: 'Priority' },
    { id: 'title', name: 'Title' },
  ];

  return (
    <div className="glass-card p-4 rounded-2xl mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="glass-input w-full pl-10 pr-4 py-2 rounded-lg border border-white/18 focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={currentFilter}
              onChange={(e) => onFilterChange(e.target.value as 'all' | 'active' | 'completed')}
              className="glass-input appearance-none pr-8 py-2 pl-4 pr-10 rounded-lg border border-white/18 focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
            >
              {filters.map(filter => (
                <option key={filter.id} value={filter.id}>{filter.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value as 'dateCreated' | 'dueDate' | 'priority' | 'title')}
              className="glass-input appearance-none pr-8 py-2 pl-4 pr-10 rounded-lg border border-white/18 focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Mobile Filters Toggle */}
          <button
            className="md:hidden glass-button p-2 rounded-lg border border-white/18"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`glass-button px-3 py-1.5 text-sm rounded-full ${
                  currentFilter === filter.id
                    ? 'bg-gradient-primary text-white'
                    : 'bg-white/10 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => onFilterChange(filter.id as 'all' | 'active' | 'completed')}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GlassTaskFilterBar;