'use client';

import React from 'react';
import { FunnelIcon, MagnifyingGlassIcon, BarsArrowDownIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskFilterBarProps {
  currentFilter: string;
  currentSort: string;
  searchTerm?: string;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (searchTerm: string) => void;
}

const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  currentFilter,
  currentSort,
  searchTerm = '',
  onFilterChange,
  onSortChange,
  onSearchChange,
}) => {
  const { theme } = useTheme();
  const accent = theme.colors.accent;

  const filters = [
    { id: 'all', name: 'All Tasks' },
    { id: 'active', name: 'Active' },
    { id: 'completed', name: 'Completed' },
  ];

  const sorts = [
    { id: 'dateCreated', name: 'Date Created' },
    { id: 'dueDate', name: 'Due Date' },
    { id: 'priority', name: 'Priority' },
    { id: 'title', name: 'Title' },
  ];

  /* 🔥 FIX: high-contrast input/select styles */
  const inputStyle: React.CSSProperties = {
    backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#ffffff',
    color: theme.mode === 'dark' ? '#ffffff' : '#111827',
    border: `1px solid ${theme.mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#e5e7eb'}`,
    boxShadow: `0 0 0 1px ${accent}33`,
  };

  return (
    <motion.div
      className="rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      style={{
        background: theme.mode === 'dark'
          ? 'rgba(255,255,255,0.06)'
          : '#ffffff',
        border: `1px solid ${
          theme.mode === 'dark' ? 'rgba(255,255,255,0.15)' : '#e5e7eb'
        }`,
        boxShadow: `0 10px 25px ${accent}22`,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <MagnifyingGlassIcon
          className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: theme.mode === 'dark' ? '#d1d5db' : '#6b7280' }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg py-2 pl-10 pr-3 text-sm font-medium focus:outline-none"
          style={inputStyle}
        />
      </div>

      {/* Filter + Sort */}
      <div className="flex flex-wrap gap-3">
        {/* Filter */}
        <div className="relative">
          <select
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="appearance-none rounded-lg py-2 pl-3 pr-9 text-sm font-medium focus:outline-none"
            style={inputStyle}
          >
            {filters.map((f) => (
              <option
                key={f.id}
                value={f.id}
                style={{
                  backgroundColor: theme.mode === 'dark' ? '#0f172a' : '#ffffff',
                  color: theme.mode === 'dark' ? '#ffffff' : '#111827',
                }}
              >
                {f.name}
              </option>
            ))}
          </select>
          <FunnelIcon className="h-5 w-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none rounded-lg py-2 pl-3 pr-9 text-sm font-medium focus:outline-none"
            style={inputStyle}
          >
            {sorts.map((s) => (
              <option
                key={s.id}
                value={s.id}
                style={{
                  backgroundColor: theme.mode === 'dark' ? '#0f172a' : '#ffffff',
                  color: theme.mode === 'dark' ? '#ffffff' : '#111827',
                }}
              >
                {s.name}
              </option>
            ))}
          </select>
          <BarsArrowDownIcon className="h-5 w-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskFilterBar;
