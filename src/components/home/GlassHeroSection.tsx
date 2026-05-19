import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassButton from '@/components/ui/GlassButton';
import GlassCard from '@/components/ui/GlassCard';

const GlassHeroSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Organize Your Life,
              </span>{' '}
              <br />
              <span className="text-gray-900 dark:text-white">One Task at a Time</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Manage tasks effortlessly and boost productivity with our intuitive and beautiful task management system.
              Experience the perfect blend of functionality and aesthetics.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/register">
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg"
                >
                  Get Started
                </GlassButton>
              </Link>
              <Link href="/login">
                <GlassButton
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg"
                >
                  Login
                </GlassButton>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="flex-1 max-w-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GlassCard className="p-0 overflow-hidden">
              <div className="aspect-video bg-gradient-primary flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-6">
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div
                      key={item}
                      className="glass-card p-4 rounded-lg"
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="h-3 bg-white/30 rounded mb-2"></div>
                      <div className="h-2 bg-white/20 rounded w-3/4"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GlassHeroSection;