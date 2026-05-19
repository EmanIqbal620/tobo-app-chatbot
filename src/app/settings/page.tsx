'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { NotificationTypeEnum } from '@/types/ui';
import ThemeToggle from '@/components/ui/ThemeToggle';

const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC-5');

  const handleSaveSettings = () => {
    showToast('Settings saved successfully', NotificationTypeEnum.SUCCESS);
  };

  const handleResetSettings = () => {
    setNotificationsEnabled(true);
    setEmailUpdates(true);
    setDataSync(true);
    setLanguage('en');
    setTimezone('UTC-5');
    showToast('Settings reset to default', NotificationTypeEnum.INFO);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            Settings
          </h1>
          <p
            className="mt-2"
            style={{ color: theme.colors.text.secondary }}
          >
            Customize your application preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Account Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.primary }}
                >
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="matte-input w-full"
                  style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border
                  }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.primary }}
                >
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="matte-input w-full"
                  style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border
                  }}
                >
                  <option value="UTC-12">GMT-12:00</option>
                  <option value="UTC-5">GMT-05:00</option>
                  <option value="UTC">GMT+00:00</option>
                  <option value="UTC+5">GMT+05:00</option>
                  <option value="UTC+8">GMT+08:00</option>
                  <option value="UTC+9">GMT+09:00</option>
                </select>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Display Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Dark/Light Mode
                  </label>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    Toggle between light and dark themes
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Enable Notifications
                  </label>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    Receive task reminders and updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Email Updates
                  </label>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    Weekly progress reports
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailUpdates}
                    onChange={(e) => setEmailUpdates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Privacy & Sync
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Auto-sync Data
                  </label>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    Automatically sync your tasks across devices
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataSync}
                    onChange={(e) => setDataSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleResetSettings}
                  className="px-4 py-2 border rounded-lg transition-colors duration-200 hover:bg-red-50"
                  style={{
                    borderColor: theme.colors.border,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.surface
                  }}
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.text.primary
            }}
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SettingsPage;