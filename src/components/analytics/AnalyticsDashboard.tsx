/**
 * Analytics Dashboard Component
 * Provides a comprehensive dashboard with visualizations of user's task analytics
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import TaskAnalytics from './TaskAnalytics';
import SmartSuggestions from './SmartSuggestions';
import { Task } from '@/types/task';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [priorityData, setPriorityData] = useState<any[]>([]);
  const [completionData, setCompletionData] = useState<any[]>([]);

  useEffect(() => {
    generateAnalyticsData();
  }, [tasks, timeRange]);

  const generateAnalyticsData = () => {
    // Generate time-based data
    let startDate, endDate;

    switch(timeRange) {
      case 'week':
        startDate = startOfWeek(subDays(new Date(), 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = startOfMonth(subDays(new Date(), 30));
        endDate = new Date();
        break;
      case 'quarter':
        startDate = subDays(new Date(), 90);
        endDate = new Date();
        break;
      default:
        startDate = startOfWeek(subDays(new Date(), 7));
        endDate = new Date();
    }

    let intervals;
    if (timeRange === 'week' || timeRange === 'month') {
      intervals = eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      intervals = eachWeekOfInterval({ start: startDate, end: endDate });
    }

    const formattedData = intervals.map(date => {
      const dateString = format(date, 'yyyy-MM-dd');

      // Count tasks created on this date
      const createdTasks = tasks.filter(task =>
        format(new Date(task.created_at), 'yyyy-MM-dd') === dateString
      ).length;

      // Count tasks completed on this date
      const completedTasks = tasks.filter(task =>
        task.completed_at &&
        task.completed_at &&
        format(new Date(task.completed_at), 'yyyy-MM-dd') === dateString
      ).length;

      return {
        name: timeRange === 'quarter' ? format(date, 'MMM dd') : format(date, 'MMM dd'),
        created: createdTasks,
        completed: completedTasks,
        pending: Math.max(0, createdTasks - completedTasks)
      };
    });

    setChartData(formattedData);

    // Priority distribution
    const priorityCounts = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    setPriorityData([
      { name: 'High Priority', value: priorityCounts.high },
      { name: 'Medium Priority', value: priorityCounts.medium },
      { name: 'Low Priority', value: priorityCounts.low },
    ]);

    // Completion status
    const completedCount = tasks.filter(t => t.is_completed).length;
    const pendingCount = tasks.length - completedCount;

    setCompletionData([
      { name: 'Completed', value: completedCount },
      { name: 'Pending', value: pendingCount },
    ]);
  };

  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgCompletionTime = calculateAvgCompletionTime(tasks);

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="matte-card p-4 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <h3
            className="text-sm font-medium"
            style={{ color: theme.colors.text.secondary }}
          >
            Total Tasks
          </h3>
          <p
            className="text-2xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            {totalTasks}
          </p>
        </div>
        <div
          className="matte-card p-4 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <h3
            className="text-sm font-medium"
            style={{ color: theme.colors.text.secondary }}
          >
            Completed
          </h3>
          <p
            className="text-2xl font-bold"
            style={{ color: theme.colors.accent }}
          >
            {completedTasks}
          </p>
        </div>
        <div
          className="matte-card p-4 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <h3
            className="text-sm font-medium"
            style={{ color: theme.colors.text.secondary }}
          >
            Completion Rate
          </h3>
          <p
            className="text-2xl font-bold"
            style={{ color: theme.colors.accent }}
          >
            {completionRate}%
          </p>
        </div>
        <div
          className="matte-card p-4 rounded-xl"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <h3
            className="text-sm font-medium"
            style={{ color: theme.colors.text.secondary }}
          >
            Avg. Completion Time
          </h3>
          <p
            className="text-2xl font-bold"
            style={{ color: theme.colors.accent }}
          >
            {avgCompletionTime} days
          </p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-lg ${
            timeRange === 'week'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            timeRange === 'month'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => setTimeRange('month')}
        >
          Month
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            timeRange === 'quarter'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => setTimeRange('quarter')}
        >
          Quarter
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Trends Chart */}
        <div className="matte-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Task Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke={theme.colors.text.primary} />
              <YAxis stroke={theme.colors.text.primary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary
                }}
              />
              <Legend
                wrapperStyle={{
                  color: theme.colors.text.primary
                }}
              />
              <Line type="monotone" dataKey="created" stroke={theme.colors.accent} name="Tasks Created" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="completed" stroke="#10b981" name="Tasks Completed" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Status Chart */}
        <div className="matte-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Completion Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? theme.colors.accent : '#10b981'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary
                }}
              />
              <Legend
                wrapperStyle={{
                  color: theme.colors.text.primary
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution Chart */}
        <div className="matte-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke={theme.colors.text.primary} />
              <YAxis stroke={theme.colors.text.primary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary
                }}
              />
              <Legend
                wrapperStyle={{
                  color: theme.colors.text.primary
                }}
              />
              <Bar dataKey="value" fill={theme.colors.accent} name="Task Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Comparison */}
        <div className="matte-card p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Productivity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke={theme.colors.text.primary} />
              <YAxis stroke={theme.colors.text.primary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary
                }}
              />
              <Legend
                wrapperStyle={{
                  color: theme.colors.text.primary
                }}
              />
              <Bar dataKey="created" fill={theme.colors.accent} name="Created" />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Suggestions Section */}
      <div className="matte-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Smart Suggestions</h3>
        <SmartSuggestions tasks={tasks} />
      </div>
    </div>
  );
};

const calculateAvgCompletionTime = (tasks: Task[]): number => {
  const completedTasks = tasks.filter(task => task.is_completed && task.completed_at);
  if (completedTasks.length === 0) return 0;

  const totalDays = completedTasks.reduce((sum, task) => {
    if (!task.completed_at) return sum;
    const created = new Date(task.created_at);
    const completed = new Date(task.completed_at);
    const diffTime = Math.abs(completed.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  return Math.round(totalDays / completedTasks.length);
};

export default AnalyticsDashboard;