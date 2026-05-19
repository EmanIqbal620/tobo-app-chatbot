'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import FeatureCard from './FeatureCard'; // reuse same FeatureCard for consistency
import { useTheme } from '@/contexts/ThemeContext';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorksSection: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  /* 🔑 SAME PURPLE FAMILY AS HERO */
  const purpleAccent = isDark ? '#a855f7' : '#7c3aed';

  const steps: Step[] = [
    {
      id: 1,
      title: 'Sign Up',
      description: 'Create your account in just a few seconds with your email address.',
      icon: <UserIcon className="h-8 w-8" color={purpleAccent} />,
    },
    {
      id: 2,
      title: 'Add Tasks',
      description: 'Create tasks, set priorities, and add due dates to stay organized.',
      icon: <ClipboardDocumentListIcon className="h-8 w-8" color={purpleAccent} />,
    },
    {
      id: 3,
      title: 'Track Progress',
      description: 'Monitor your productivity and celebrate your achievements.',
      icon: <CheckCircleIcon className="h-8 w-8" color={purpleAccent} />,
    },
  ];

  return (
    <section
      className="py-20"
      style={{ backgroundColor: isDark ? '#020617' : '#f5f5f8' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            How It{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
          >
            Get started in three simple steps with our intuitive process.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <FeatureCard
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              delay={index * 0.1}
              glassStyle={{
                background: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.35)',
                boxShadow: isDark
                  ? '0 8px 24px rgba(168,85,247,0.18), inset 0 1px 2px rgba(255,255,255,0.15)'
                  : '0 8px 24px rgba(124,58,237,0.16), inset 0 1px 3px rgba(255,255,255,0.6)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
