// frontend/src/utils/tokenManager.ts
// Unified token management utility to ensure consistency between API clients

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export interface TokenManager {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken?: string): void;
  clearTokens(): void;
  isAuthenticated(): boolean;
}

class TokenManagerImpl implements TokenManager {
  getAccessToken(): string | null {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
      }
    } catch (error) {
      console.error('Error setting tokens:', error);
    }
  }

  clearTokens(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  isAuthenticated(): boolean {
    try {
      const token = this.getAccessToken();
      return !!token && !this.isTokenExpired(token);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeTokenPayload(token);
      if (!payload || !payload.exp) {
        return true; // If there's no expiration, consider it expired
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  private decodeTokenPayload(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = parts[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  }
}

export const tokenManager = new TokenManagerImpl();

// Export individual functions for convenience
export const getAccessToken = (): string | null => tokenManager.getAccessToken();
export const getRefreshToken = (): string | null => tokenManager.getRefreshToken();
export const setTokens = (accessToken: string, refreshToken?: string): void =>
  tokenManager.setTokens(accessToken, refreshToken);
export const clearTokens = (): void => tokenManager.clearTokens();
export const isAuthenticated = (): boolean => tokenManager.isAuthenticated();