import api from './api'
import { User } from '@/types/user'
import { setTokens, clearTokens, getAccessToken } from '@/utils/tokenManager'

interface LoginResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  user: User
}

interface RegisterResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  user: User
}

interface RefreshResponse {
  access_token: string
  token_type: string
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  }

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Even if logout fails on the server, clear local tokens
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  async refresh(): Promise<RefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token')

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  }

  isAuthenticated(): boolean {
    return getAccessToken() !== null
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    setTokens(accessToken, refreshToken)
  }

  clearTokens(): void {
    clearTokens()
  }

  getToken(): string | null {
    return getAccessToken()
  }
}

export const authService = new AuthService()