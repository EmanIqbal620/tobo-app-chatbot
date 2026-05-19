'use client';

import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
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

const HomePage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* ---------- Solid Base Background Layer (Layer 1) ---------- */}
      <div
        className="fixed inset-0 -z-20"
        style={{ backgroundColor: theme.colors.background }}
      />

      {/* ---------- Background Glow Layer (Layer 2) ---------- */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Top-left glow */}
        <div
          className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full blur-[120px] opacity-30"
          style={{ background: theme.colors.accent }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute bottom-[-140px] right-[-140px] w-[460px] h-[460px] rounded-full blur-[140px] opacity-20"
          style={{ background: theme.colors.accent }}
        />
        {/* Center subtle glow for extra depth */}
        <div
          className="absolute top-[20%] left-[50%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-10"
          style={{ background: theme.colors.accent }}
        />
      </div>

      {/* ---------- Navbar ---------- */}
      <Navbar />

      {/* ---------- Main Content (flex-grow to push footer down) ---------- */}
      <main
        className="relative z-10 flex-grow"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* HERO – most important */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          aria-label="Hero Section"
          className="pt-0 pb-0"
          style={{ backgroundColor: theme.colors.background }}
        >
          <div className="pt-0 pb-0">
            <HeroSection />
          </div>
        </motion.section>

        {/* FEATURES */}
        <motion.section
          id="features-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0.15}
          aria-label="Features Section"
          className="pt-0 pb-0"
          style={{ backgroundColor: theme.colors.background }}
        >
          <div className="pt-0 pb-0">
            <FeaturesSection />
          </div>
        </motion.section>

        {/* HOW IT WORKS */}
        <motion.section
          id="how-it-works-section"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0.3}
          aria-label="How It Works Section"
          className="pt-0 pb-0"
          style={{ backgroundColor: theme.colors.background }}
        >
          <div className="pt-0 pb-0">
            <HowItWorksSection />
          </div>
        </motion.section>
      </main>

      {/* ---------- Footer ---------- */}
      <div
        className="relative z-10 pt-0 pb-0"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
