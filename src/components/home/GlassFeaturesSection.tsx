import React from 'react';
import GlassFeatureCard from './GlassFeatureCard';
import { CheckCircleIcon, ClockIcon, ChartBarIcon, MoonIcon, DevicePhoneMobileIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const GlassFeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Task Management",
      description: "Easily create, edit, and complete tasks with our intuitive interface.",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />
    },
    {
      title: "Priority & Deadlines",
      description: "Set priorities and due dates to stay on top of your most important tasks.",
      icon: <ClockIcon className="h-6 w-6 text-white" />
    },
    {
      title: "Progress Tracking",
      description: "Visualize your productivity with insightful analytics and progress tracking.",
      icon: <ChartBarIcon className="h-6 w-6 text-white" />
    },
    {
      title: "Dark/Light Mode",
      description: "Switch between themes based on your preference and lighting conditions.",
      icon: <MoonIcon className="h-6 w-6 text-white" />
    },
    {
      title: "Mobile Friendly",
      description: "Access your tasks anywhere with our responsive design that works on all devices.",
      icon: <DevicePhoneMobileIcon className="h-6 w-6 text-white" />
    },
    {
      title: "Secure & Private",
      description: "Your tasks and data are encrypted and securely stored with industry-leading security.",
      icon: <LockClosedIcon className="h-6 w-6 text-white" />
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Stay <span className="bg-gradient-primary bg-clip-text text-transparent">Organized</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our platform provides all the tools you need to manage your tasks efficiently and effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassFeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlassFeaturesSection;