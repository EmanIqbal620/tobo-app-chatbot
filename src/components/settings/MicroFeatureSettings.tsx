import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon, CogIcon } from '@heroicons/react/24/outline';

interface MicroFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabledByDefault: boolean;
  keyboardShortcut?: string;
  customSettings?: Record<string, any>;
}

interface UserMicroFeaturePreference {
  featureId: string;
  isEnabled: boolean;
  customSettings?: Record<string, any>;
}

interface MicroFeatureSettingsProps {
  userId: string;
  onSave?: (preferences: UserMicroFeaturePreference[]) => void;
  initialFeatures?: MicroFeature[];
  initialPreferences?: UserMicroFeaturePreference[];
}

const MicroFeatureSettings: React.FC<MicroFeatureSettingsProps> = ({
  userId,
  onSave,
  initialFeatures = [],
  initialPreferences = []
}) => {
  const { theme } = useTheme();
  const [features, setFeatures] = useState<MicroFeature[]>(initialFeatures);
  const [preferences, setPreferences] = useState<UserMicroFeaturePreference[]>(initialPreferences);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, MicroFeature[]>);

  // Initialize preferences if not provided
  useEffect(() => {
    if (initialFeatures.length > 0 && initialPreferences.length === 0) {
      const initialPrefs = initialFeatures.map(feature => ({
        featureId: feature.id,
        isEnabled: feature.isEnabledByDefault,
        customSettings: feature.customSettings || {}
      }));
      setPreferences(initialPrefs);
    }
  }, [initialFeatures, initialPreferences]);

  const toggleFeature = (featureId: string) => {
    setPreferences(prev => prev.map(pref =>
      pref.featureId === featureId
        ? { ...pref, isEnabled: !pref.isEnabled }
        : pref
    ));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const updateCustomSetting = (featureId: string, key: string, value: any) => {
    setPreferences(prev => prev.map(pref =>
      pref.featureId === featureId
        ? {
            ...pref,
            customSettings: {
              ...pref.customSettings,
              [key]: value
            }
          }
        : pref
    ));
  };

  const savePreferences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll just call the onSave prop
      onSave?.(preferences);

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
      console.error('Error saving preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeaturePreference = (featureId: string): UserMicroFeaturePreference => {
    return preferences.find(pref => pref.featureId === featureId) || {
      featureId,
      isEnabled: false,
      customSettings: {}
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Micro-Feature Settings
        </h2>
        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <motion.span
              className="text-green-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Settings saved successfully!
            </motion.span>
          )}
          <motion.button
            className="px-4 py-2 rounded-lg flex items-center space-x-2"
            style={{
              backgroundColor: theme.colors.accent,
              color: 'white',
            }}
            onClick={savePreferences}
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span>Saving...</span>
            ) : (
              <>
                <CogIcon className="h-4 w-4" />
                <span>Save Settings</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {error && (
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: theme.colors.surface + '80',
            border: `1px solid ${theme.colors.text.disabled}`,
          }}
        >
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
          <div
            key={category}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <button
              className="w-full p-4 flex items-center justify-between"
              onClick={() => toggleCategory(category)}
              style={{
                backgroundColor: theme.colors.surface,
              }}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="font-semibold capitalize"
                  style={{ color: theme.colors.text.primary }}
                >
                  {category}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: theme.colors.accent + '20',
                    color: theme.colors.accent,
                  }}
                >
                  {categoryFeatures.length} features
                </span>
              </div>
              {expandedCategories[category] ? (
                <ChevronUpIcon className="h-5 w-5" style={{ color: theme.colors.text.primary }} />
              ) : (
                <ChevronDownIcon className="h-5 w-5" style={{ color: theme.colors.text.primary }} />
              )}
            </button>

            <AnimatePresence>
              {expandedCategories[category] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 space-y-4"
                >
                  {categoryFeatures.map(feature => {
                    const pref = getFeaturePreference(feature.id);

                    return (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{
                          backgroundColor: theme.colors.background + '50',
                          border: `1px solid ${theme.colors.border}`,
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3
                              className="font-medium"
                              style={{ color: theme.colors.text.primary }}
                            >
                              {feature.name}
                            </h3>
                            {feature.keyboardShortcut && (
                              <kbd
                                className="px-2 py-1 text-xs rounded bg-surface-200"
                                style={{
                                  color: theme.colors.text.secondary,
                                  backgroundColor: theme.colors.surface + '40',
                                }}
                              >
                                {feature.keyboardShortcut}
                              </kbd>
                            )}
                          </div>
                          <p
                            className="text-sm mt-1"
                            style={{ color: theme.colors.text.secondary }}
                          >
                            {feature.description}
                          </p>

                          {/* Custom settings for the feature */}
                          {feature.customSettings && Object.keys(feature.customSettings).length > 0 && (
                            <div className="mt-3 space-y-2">
                              {Object.entries(feature.customSettings).map(([key, defaultValue]) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <label
                                    className="text-xs"
                                    style={{ color: theme.colors.text.secondary }}
                                  >
                                    {key}:
                                  </label>
                                  <input
                                    type="text"
                                    value={pref.customSettings?.[key] ?? defaultValue}
                                    onChange={(e) => updateCustomSetting(feature.id, key, e.target.value)}
                                    className="px-2 py-1 rounded text-xs"
                                    style={{
                                      backgroundColor: theme.colors.background,
                                      color: theme.colors.text.primary,
                                      border: `1px solid ${theme.colors.border}`,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <Switch
                          checked={pref.isEnabled}
                          onChange={() => toggleFeature(feature.id)}
                          className={`${
                            pref.isEnabled ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span
                            className={`${
                              pref.isEnabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <motion.button
          className="px-4 py-2 rounded-lg flex items-center space-x-2"
          style={{
            backgroundColor: theme.colors.accent,
            color: 'white',
          }}
          onClick={savePreferences}
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <span>Saving...</span>
          ) : (
            <>
              <CogIcon className="h-4 w-4" />
              <span>Save All Settings</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default MicroFeatureSettings;