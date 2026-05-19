'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types/user'
import { authService } from '@/services/authService'
import { tokenManager } from '@/utils/tokenManager'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// Helper function to decode JWT token
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on component mount
    const initializeAuth = async () => {
      if (tokenManager.isAuthenticated()) {
        try {
          // Get the token and decode it to get user info
          const token = tokenManager.getAccessToken();
          if (token) {
            const decodedToken = decodeJWT(token);
            if (decodedToken) {
              // Create user object from decoded token
              setUser({
                id: decodedToken.sub || decodedToken.user_id || 'unknown',
                email: decodedToken.email || 'unknown@example.com',
                name: decodedToken.name || decodedToken.username || null,
                created_at: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          tokenManager.clearTokens()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    tokenManager.setTokens(response.access_token, response.refresh_token)

    // Decode the token to get user info
    const decodedToken = decodeJWT(response.access_token);
    if (decodedToken) {
      setUser({
        id: decodedToken.sub || decodedToken.user_id || 'unknown',
        email: decodedToken.email || email,
        name: decodedToken.name || decodedToken.username || null,
        created_at: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password)
    tokenManager.setTokens(response.access_token, response.refresh_token)

    // Decode the token to get user info
    const decodedToken = decodeJWT(response.access_token);
    if (decodedToken) {
      setUser({
        id: decodedToken.sub || decodedToken.user_id || 'unknown',
        email: decodedToken.email || email,
        name: decodedToken.name || name,
        created_at: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  const logout = () => {
    authService.logout() // This will also clear tokens
    setUser(null)
  }

  const isAuthenticated = () => {
    return tokenManager.isAuthenticated()
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    getToken: () => tokenManager.getAccessToken(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}