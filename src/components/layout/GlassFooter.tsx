import React from 'react';
import Link from 'next/link';

const GlassFooter: React.FC = () => {
  return (
    <footer className="glass-card backdrop-blur-md border border-white/18 rounded-t-2xl shadow-lg w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <div className="flex items-center">
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Todo App
              </span>
            </div>
          </div>

          <div className="mt-8 md:mt-0 flex justify-center space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300 dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-300 dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-300 dark:hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Todo App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlassFooter;