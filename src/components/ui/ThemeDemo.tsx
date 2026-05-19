import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { validateThemeContrast } from '../../lib/utils';

const ThemeDemo: React.FC = () => {
  const { theme, mode, toggleTheme } = useTheme();

  // Validate theme contrast
  const contrastValidation = validateThemeContrast(theme);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>
          Theme Demo - {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
        </h1>

        <button
          onClick={toggleTheme}
          className="mb-4 px-4 py-2 rounded-lg border border-border-light"
          style={{
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary
          }}
        >
          Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: theme.colors.text.primary }}>
            Text Colors
          </h2>

          <div className="space-y-2">
            <p style={{ color: theme.colors.text.primary }}>
              Primary text: {theme.colors.text.primary}
            </p>
            <p style={{ color: theme.colors.text.secondary }}>
              Secondary text: {theme.colors.text.secondary}
            </p>
            <p style={{ color: theme.colors.text.muted }}>
              Muted text: {theme.colors.text.muted}
            </p>
            <p style={{ color: theme.colors.text.disabled }}>
              Disabled text: {theme.colors.text.disabled}
            </p>
          </div>
        </div>

        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: theme.colors.text.primary }}>
            Background Colors
          </h2>

          <div className="space-y-2">
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded mr-2 border"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border
                }}
              />
              <span style={{ color: theme.colors.text.primary }}>
                Background: {theme.colors.background}
              </span>
            </div>

            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded mr-2 border"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              />
              <span style={{ color: theme.colors.text.primary }}>
                Surface: {theme.colors.surface}
              </span>
            </div>

            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded mr-2 border"
                style={{
                  backgroundColor: theme.colors.accent,
                  borderColor: theme.colors.border
                }}
              />
              <span style={{ color: theme.colors.text.primary }}>
                Accent: {theme.colors.accent}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-6 p-6 rounded-xl border"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }}
      >
        <h2 className="text-xl font-semibold mb-3" style={{ color: theme.colors.text.primary }}>
          Contrast Validation
        </h2>

        {contrastValidation.isValid ? (
          <p className="text-green-500" style={{ color: '#10B981' }}>
            ✓ All text elements meet WCAG AA contrast standards
          </p>
        ) : (
          <div>
            <p className="text-red-500" style={{ color: '#EF4444' }}>
              ✗ Some text elements do not meet WCAG AA contrast standards:
            </p>
            <ul className="mt-2 space-y-1">
              {contrastValidation.issues.map((issue, index) => (
                <li key={index} style={{ color: theme.colors.text.primary }}>
                  - {issue.element}: {issue.ratio.toFixed(2)}:1 (requires 4.5:1)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        className="mt-6 p-6 rounded-xl border"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }}
      >
        <h2 className="text-xl font-semibold mb-3" style={{ color: theme.colors.text.primary }}>
          UI Components Test
        </h2>

        <div className="space-y-4">
          <button
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: theme.colors.accent,
              color: '#FFFFFF'
            }}
          >
            Primary Button
          </button>

          <button
            className="px-4 py-2 rounded-lg border ml-2"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }}
          >
            Secondary Button
          </button>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Input field"
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border
              }}
            />
          </div>

          <div
            className="p-4 rounded-lg mt-4"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <p style={{ color: theme.colors.text.primary }}>
              This is a card component demonstrating theme consistency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;