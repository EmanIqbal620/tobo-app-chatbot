'use client';

import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HowItWorksSection from '@/components/home/HowItWorksSection';

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: easeInOut,
    },
  }),
};

const HowItWorksPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* HOW IT WORKS SECTION */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0.3}
          aria-label="How It Works Section"
          className="py-12"
        >
          <HowItWorksSection />
        </motion.section>
      </motion.div>
    </DashboardLayout>
  );
};

export default HowItWorksPage;