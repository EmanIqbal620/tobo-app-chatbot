'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ClipboardList, CalendarDays } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const HeroSection: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  // Soft purple accent same as HowItWorksSection
  const purpleAccent = isDark ? '#a855f7' : '#7c3aed';

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: isDark ? '#020617' : '#f5f5f8' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 lg:pt-24 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 items-start">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            Organize Your Tasks <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <p
            className="mt-4 text-base sm:text-lg max-w-md sm:max-w-xl"
            style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
          >
            A modern Todo app that helps you focus, plan smarter, and complete tasks with clarity and calm.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg sm:px-7 sm:py-3.5 rounded-xl text-white font-semibold
                bg-gradient-to-r from-purple-500 to-pink-500 shadow-md
                hover:from-purple-400 hover:to-pink-400 transition-transform duration-300 ease-out
                hover:scale-105 active:scale-95 text-center"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className={`px-6 py-3 rounded-lg sm:px-7 sm:py-3.5 rounded-xl font-semibold border-2 transition-all duration-300 ease-out text-center
                ${isDark
                  ? 'text-purple-400 border-purple-500 hover:text-white hover:border-pink-500 hover:scale-105 active:scale-95'
                  : 'text-purple-700 border-purple-600 hover:text-white hover:border-pink-500 hover:scale-105 active:scale-95'}`}
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* RIGHT SIDE – FLOATING GLASS ICONS */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative flex justify-center md:justify-end mt-10 sm:mt-6"
        >
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
            {[CheckCircle2, ClipboardList, CalendarDays].map((Icon, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl backdrop-blur-2xl"
                style={{
                  background: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(255,255,255,0.35)',
                  boxShadow: isDark
                    ? '0 8px 24px rgba(168,85,247,0.18), inset 0 1px 2px rgba(255,255,255,0.15)'
                    : '0 8px 24px rgba(124,58,237,0.16), inset 0 1px 3px rgba(255,255,255,0.6)',
                }}
              >
                {/* Glass Highlight */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.6), transparent 60%)',
                    opacity: isDark ? 0.2 : 0.35,
                  }}
                />

                {/* Purple Edge Glow */}
                <div
                  className="absolute -inset-1 rounded-2xl blur-md pointer-events-none"
                  style={{
                    background: 'rgba(124,58,237,0.25)',
                    opacity: isDark ? 0.4 : 0.25,
                  }}
                />

                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <Icon
                    size={40}
                    className="sm:size-12 md:size-[50px] drop-shadow-[0_4px_16px_rgba(124,58,237,0.6)]"
                    style={{ color: purpleAccent }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
