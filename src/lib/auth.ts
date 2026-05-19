// frontend/src/lib/auth.ts
// Simplified auth configuration for local development

import { getAccessToken, isAuthenticated as isTokenAuthenticated } from '@/utils/tokenManager';

// Mock implementations to avoid dependency issues
export const authClient = {
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  getSession: () => null,
};

// Export individual functions for convenience
export const { signIn, signUp, signOut, getSession } = authClient;

// Type definitions for user session
export interface UserSession {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  accessToken: string;
}

/**
 * Get the current user's JWT token from the session
 * @returns Promise<string | null> - The JWT token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // For local development, get token from unified token manager
    return getAccessToken();
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> - True if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    // For local development, check if token exists in unified token manager
    return isTokenAuthenticated();
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
}