import React from 'react';
import { motion } from 'framer-motion';

interface GlassAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const GlassAuthLayout: React.FC<GlassAuthLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary bg-cover bg-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card backdrop-blur-xl border border-white/18 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-300">
                {subtitle}
              </p>
            )}
          </div>

          {children}

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Todo App. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GlassAuthLayout;