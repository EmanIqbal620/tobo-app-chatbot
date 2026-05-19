import React from 'react';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

interface GlassShowcaseProps {
  title?: string;
  description?: string;
}

const GlassShowcase: React.FC<GlassShowcaseProps> = ({
  title = "Glassmorphism Showcase",
  description = "Experience the modern floating glass effect with enhanced depth and transparency"
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="w-full max-w-4xl">
        <GlassCard variant="floating" className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {description}
          </p>
          <div className="flex justify-center gap-4">
            <GlassButton variant="primary">Get Started</GlassButton>
            <GlassButton variant="outline">Learn More</GlassButton>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="light" className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Light Glass</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Subtle transparency effect</p>
          </GlassCard>

          <GlassCard variant="default" className="text-center">
            <div className="w-12 h-12 bg-gradient-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Default Glass</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Balanced transparency</p>
          </GlassCard>

          <GlassCard variant="heavy" className="text-center">
            <div className="w-12 h-12 glass-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Heavy Glass</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Strong glass effect</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default GlassShowcase;