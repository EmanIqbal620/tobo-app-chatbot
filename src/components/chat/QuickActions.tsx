'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface QuickAction {
  id: string;
  label: string;
  command: string;
  icon: string;
}

interface QuickActionsProps {
  onActionClick: (command: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const { theme } = useTheme();

  const quickActions: QuickAction[] = [
    {
      id: 'add-task',
      label: 'Add Task',
      command: 'Add a task to...',
      icon: '➕'
    },
    {
      id: 'show-tasks',
      label: 'Show Tasks',
      command: 'Show my tasks',
      icon: '📋'
    },
    {
      id: 'complete-task',
      label: 'Complete Task',
      command: 'Mark task ... as complete',
      icon: '✅'
    },
    {
      id: 'delete-task',
      label: 'Delete Task',
      command: 'Delete task ...',
      icon: '🗑️'
    }
  ];

  return (
    <div className="pb-2 px-2">
      <div className="flex overflow-x-auto space-x-2 py-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.command)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap text-xs min-w-max font-medium hover:opacity-80 flex-shrink-0"
            style={{
              backgroundColor: theme.colors.surface, // Use theme surface for both modes
              borderColor: theme.colors.border,
              color: theme.colors.text.primary, // Use theme text for both modes
              fontSize: '0.75rem',
              fontWeight: 500,
              boxShadow: `0 1px 2px ${theme.colors.border}20`,
              minWidth: 'auto'
            }}
          >
            <span className="mr-1">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;