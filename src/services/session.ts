// frontend/src/services/session.ts
// Session management service for handling JWT tokens and user sessions

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/tokenManager';

interface SessionData {
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
}

class SessionManager {
  private static readonly USER_KEY = 'user_data';

  /**
   * Stores the JWT token and user data in local storage
   * @param token - The JWT token to store
   * @param userId - The user ID
   * @param email - The user's email
   * @param expiresIn - Token expiration time in seconds
   */
  static storeSession(accessToken: string, refreshToken: string, userId: string, email: string, expiresIn: number): void {
    // Store tokens using the unified token manager
    setTokens(accessToken, refreshToken);

    // Store user data in localStorage (could be enhanced to use tokenManager too)
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    const sessionData: SessionData = {
      token: accessToken,
      userId,
      email,
      expiresAt,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(sessionData));
  }

  /**
   * Retrieves the stored session data
   * @returns Session data if valid, null otherwise
   */
  static getSession(): SessionData | null {
    try {
      const sessionDataString = localStorage.getItem(this.USER_KEY);
      if (!sessionDataString) {
        return null;
      }

      const sessionData: SessionData = JSON.parse(sessionDataString);

      // Check if the session has expired
      if (new Date() >= new Date(sessionData.expiresAt)) {
        this.clearSession();
        return null;
      }

      // Verify the token is still in storage and matches
      const storedToken = getAccessToken();
      if (storedToken !== sessionData.token) {
        this.clearSession();
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Error retrieving session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Gets the stored JWT token
   * @returns The JWT token if available and valid, null otherwise
   */
  static getToken(): string | null {
    return getAccessToken();
  }

  /**
   * Checks if there is an active session
   * @returns True if there is an active session, false otherwise
   */
  static isActive(): boolean {
    return getAccessToken() !== null;
  }

  /**
   * Clears the stored session data
   */
  static clearSession(): void {
    clearTokens();
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Checks if the session is about to expire (within 5 minutes)
   * @returns True if the session is expiring soon, false otherwise
   */
  static isExpiringSoon(): boolean {
    const session = this.getSession();
    if (!session) {
      return false;
    }

    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    const timeUntilExpiry = new Date(session.expiresAt).getTime() - new Date().getTime();

    return timeUntilExpiry <= fiveMinutes;
  }

  /**
   * Updates the session expiration time
   * @param newExpiresIn - New expiration time in seconds from now
   */
  static updateSessionExpiry(newExpiresIn: number): void {
    const session = this.getSession();
    if (session) {
      const newExpiresAt = new Date();
      newExpiresAt.setSeconds(newExpiresAt.getSeconds() + newExpiresIn);

      const updatedSession: SessionData = {
        ...session,
        expiresAt: newExpiresAt,
      };

      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedSession));
    }
  }

  /**
   * Refreshes the session by extending the expiration time
   * This would typically be called after a successful API request
   */
  static refreshSession(): void {
    // In a real implementation, this might extend the session
    // by updating the expiration time based on server response
    // For now, we'll just update the expiry if it's expiring soon
    if (this.isExpiringSoon()) {
      // Extend by 1 hour if it's expiring soon
      this.updateSessionExpiry(60 * 60); // 1 hour in seconds
    }
  }

  /**
   * Gets the time remaining until session expiry
   * @returns Remaining time in milliseconds, or null if no active session
   */
  static getTimeUntilExpiry(): number | null {
    const session = this.getSession();
    if (!session) {
      return null;
    }

    return new Date(session.expiresAt).getTime() - new Date().getTime();
  }
}

export default SessionManager;