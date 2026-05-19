import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CalendarIcon, ExclamationTriangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface GlassStatisticsCardsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

const GlassStatisticsCards: React.FC<GlassStatisticsCardsProps> = ({
  totalTasks,
  completedTasks,
  pendingTasks,
  overdueTasks
}) => {
  const stats = [
    {
      name: 'Total Tasks',
      value: totalTasks,
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      change: '+12% from last week',
      changeType: 'positive' as const,
    },
    {
      name: 'Completed',
      value: completedTasks,
      icon: <CalendarIcon className="h-6 w-6 text-white" />,
      change: '+8% from last week',
      changeType: 'positive' as const,
    },
    {
      name: 'Pending',
      value: pendingTasks,
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-white" />,
      change: '-3% from last week',
      changeType: 'negative' as const,
    },
    {
      name: 'Overdue',
      value: overdueTasks,
      icon: <UserGroupIcon className="h-6 w-6 text-white" />,
      change: '+2 from yesterday',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          className="glass-card p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            </div>
            <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
          <p className={`text-sm mt-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
            {stat.change}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default GlassStatisticsCards;