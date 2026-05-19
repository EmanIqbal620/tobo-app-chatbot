import { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/tokenManager'


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is missing. Please set it in your environment.");
}

export const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // ❌ Do NOT retry refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    // ❌ Already retried once
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        const response = await axios.post(`${apiUrl}/auth/refresh`, {
          refresh_token: refreshToken
        })

        const newAccessToken = response.data.access_token
        setTokens(newAccessToken, refreshToken) // Use the unified token manager

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } else {
        // No refresh token, redirect to login
        clearTokens() // Use the unified token manager
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    } catch (refreshError) {
      // Refresh failed, redirect to login
      clearTokens() // Use the unified token manager
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    }

    return Promise.reject(error)
  }
)