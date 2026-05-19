'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { useTheme } from '@/contexts/ThemeContext';
import {
  CheckCircle2,
  Clock,
  BarChart2,
  Moon,
  Smartphone,
  Lock
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  /* 🔑 SAME PURPLE FAMILY AS HERO */
  const purpleAccent = isDark ? '#a855f7' : '#7c3aed';

  const features = [
    {
      title: 'Task Management',
      description: 'Easily create, edit, and complete tasks with our intuitive interface.',
      icon: <CheckCircle2 size={28} color={purpleAccent} />,
    },
    {
      title: 'Priority & Deadlines',
      description: 'Set priorities and due dates to stay on top of your most important tasks.',
      icon: <Clock size={28} color={purpleAccent} />,
    },
    {
      title: 'Progress Tracking',
      description: 'Visualize your productivity with insightful analytics and progress tracking.',
      icon: <BarChart2 size={28} color={purpleAccent} />,
    },
    {
      title: 'Dark/Light Mode',
      description: 'Switch between themes based on your preference and lighting conditions.',
      icon: <Moon size={28} color={purpleAccent} />,
    },
    {
      title: 'Mobile Friendly',
      description: 'Access your tasks anywhere with our responsive design that works on all devices.',
      icon: <Smartphone size={28} color={purpleAccent} />,
    },
    {
      title: 'Secure & Private',
      description: 'Your tasks and data are encrypted and securely stored with industry-leading security.',
      icon: <Lock size={28} color={purpleAccent} />,
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
            Everything You Need to Stay{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Organized
            </span>
          </h2>

          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
          >
            Our platform provides all the tools you need to manage your tasks efficiently and effectively.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
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

export default FeaturesSection;
