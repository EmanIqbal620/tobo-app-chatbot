/**
 * Smart Suggestions Component
 * Provides AI-powered task suggestions based on user patterns and context
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Task } from '@/types/task';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'pattern_based' | 'priority_based' | 'deadline_based' | 'contextual';
  confidence: number;
  reasoning: string;
  action?: () => void;
}

interface SmartSuggestionsProps {
  tasks: Task[];
  onSuggestionAccepted?: (suggestion: Suggestion) => void;
  onSuggestionDismissed?: (suggestion: Suggestion) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  tasks,
  onSuggestionAccepted,
  onSuggestionDismissed
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSuggestions();
  }, [tasks]);

  const generateSuggestions = () => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newSuggestions: Suggestion[] = [];

      // Pattern-based suggestions
      const titleCounts: Record<string, number> = {};
      tasks.forEach(task => {
        const title = task.title.toLowerCase();
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });

      // Find recurring tasks that haven't been done recently
      Object.entries(titleCounts).forEach(([title, count]) => {
        if (count >= 2) { // Appears at least twice
          const recentOccurrences = tasks.filter(t =>
            t.title.toLowerCase() === title &&
            isWithinDays(new Date(t.created_at), 7)
          );

          if (recentOccurrences.length === 0) {
            // Task appears frequently but not recently - suggest it
            newSuggestions.push({
              id: `pattern-${Date.now()}-${Math.random()}`,
              title: `Add: ${title.charAt(0).toUpperCase() + title.slice(1)}`,
              description: `Based on your pattern of adding this task regularly`,
              type: 'pattern_based',
              confidence: Math.min(0.95, 0.5 + (count * 0.1)),
              reasoning: `You usually add '${title}' tasks regularly (appears ${count} times in your history)`
            });
          }
        }
      });

      // Priority-based suggestions
      const incompleteHighPriority = tasks.filter(t =>
        !t.is_completed && t.priority === 'high'
      );

      if (incompleteHighPriority.length > 0) {
        newSuggestions.push({
          id: `priority-${Date.now()}-${Math.random()}`,
          title: `Complete: ${incompleteHighPriority[0].title}`,
          description: `This is a high-priority task that requires your attention`,
          type: 'priority_based',
          confidence: 0.85,
          reasoning: `'${incompleteHighPriority[0].title}' is marked as high priority and should be completed soon`
        });
      }

      // Deadline-based suggestions
      const now = new Date();
      const upcomingDeadlines = tasks.filter(t =>
        !t.is_completed &&
        t.due_date &&
        new Date(t.due_date) <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) && // Within 3 days
        new Date(t.due_date) >= now // Not overdue
      );

      upcomingDeadlines.forEach(task => {
        const daysUntil = Math.ceil(
          (new Date(task.due_date!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        newSuggestions.push({
          id: `deadline-${task.id}`,
          title: `Complete by ${format(new Date(task.due_date!), 'MMM dd')}: ${task.title}`,
          description: `This task is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
          type: 'deadline_based',
          confidence: daysUntil === 0 ? 0.95 : (0.9 - (daysUntil * 0.05)), // Higher confidence if due today
          reasoning: `'${task.title}' is due on ${format(new Date(task.due_date!), 'EEEE, MMMM d')} (${daysUntil} day${daysUntil !== 1 ? 's' : ''} from now)`
        });
      });

      // Contextual suggestions based on time of day/day of week
      const currentHour = new Date().getHours();
      const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday

      if (currentHour < 10 && dayOfWeek === 1) { // Monday morning
        newSuggestions.push({
          id: `contextual-${Date.now()}`,
          title: `Review weekly goals`,
          description: `Start your week with intention by reviewing your goals`,
          type: 'contextual',
          confidence: 0.7,
          reasoning: `It's Monday morning - a good time to review your weekly goals and priorities`
        });
      }

      // Limit to 5 suggestions
      setSuggestions(newSuggestions.slice(0, 5));
      setLoading(false);
    }, 300); // Simulate processing time
  };

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    // Call the provided callback
    onSuggestionAccepted?.(suggestion);

    // Remove the suggestion from the list
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestion: Suggestion) => {
    // Call the provided callback
    onSuggestionDismissed?.(suggestion);

    // Remove the suggestion from the list
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const isWithinDays = (date: Date, days: number): boolean => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="matte-card p-4 rounded-xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-4 bg-surface-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-surface-600 rounded w-1/2"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No suggestions available. Complete more tasks to receive personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Smart Suggestions</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {suggestions.length} available
        </span>
      </div>

      {suggestions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              className="matte-card p-4 rounded-xl border-l-4 h-full"
              style={{
                borderLeftColor:
                  suggestion.type === 'pattern_based' ? '#3b82f6' : // blue
                  suggestion.type === 'priority_based' ? '#ef4444' : // red
                  suggestion.type === 'deadline_based' ? '#f59e0b' : // amber
                  '#8b5cf6' // violet for contextual
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 h-full">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{suggestion.title}</h4>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        suggestion.type === 'pattern_based'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                        suggestion.type === 'priority_based'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                        suggestion.type === 'deadline_based'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' :
                        'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100'
                      }`}
                    >
                      {suggestion.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{suggestion.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {suggestion.reasoning}
                  </p>
                </div>

                <div className="flex space-x-2 flex-shrink-0 self-start sm:self-center">
                  <button
                    onClick={() => handleAcceptSuggestion(suggestion)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDismissSuggestion(suggestion)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No suggestions available. Complete more tasks to receive personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;