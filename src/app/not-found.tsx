'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotFound() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary
      }}
    >
      <div className="text-center">
        <h2
          className="text-6xl font-bold mb-4"
          style={{ color: theme.colors.text.primary }}
        >
          404
        </h2>
        <p
          className="text-xl mb-8"
          style={{ color: theme.colors.text.secondary }}
        >
          Page Not Found
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.colors.text.primary
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}