import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/tokenManager'

// Create the base axios instance
const api: AxiosInstance = axios.create({
  baseURL: (() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is missing. Please set it in your environment.");
    }

    // Ensure HTTPS for production deployments (except for hf.space which handles redirects differently)
    let processedBaseUrl = baseUrl;
    if (baseUrl.includes('hf.space')) {
      // For Hugging Face spaces, we'll use HTTP to avoid redirect issues
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        processedBaseUrl = `https://${baseUrl}`;
      }
      // If it's already https://, leave as is - let the service handle its own redirects
    } else if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://')) {
      processedBaseUrl = `https://${baseUrl}`;
    }

    // Remove trailing slash if present to prevent double slashes
    const cleanBaseUrl = processedBaseUrl.endsWith('/') ? processedBaseUrl.slice(0, -1) : processedBaseUrl;
    // For Docker setup, if the base URL is just "/api", use it as-is
    // Otherwise, append /api to the base URL for normal deployments
    if (cleanBaseUrl === '/api') {
      return '/api';
    } else {
      return `${cleanBaseUrl}/api`;
    }
  })(),
  timeout: 30000, // 30 seconds timeout (increased for deployed services)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach the JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and not a refresh request, try to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()

        if (refreshToken) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL;

          if (!baseUrl) {
            throw new Error("NEXT_PUBLIC_API_URL environment variable is missing. Please set it in your environment.");
          }

          // Ensure HTTPS for production deployments (except for hf.space which handles redirects differently)
          let processedBaseUrl = baseUrl;
          if (baseUrl.includes('hf.space')) {
            // For Hugging Face spaces, we'll use HTTP to avoid redirect issues
            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
              processedBaseUrl = `https://${baseUrl}`;
            }
            // If it's already https://, leave as is - let the service handle its own redirects
          } else if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://')) {
            processedBaseUrl = `https://${baseUrl}`;
          }

          const cleanBaseUrl = processedBaseUrl.endsWith('/') ? processedBaseUrl.slice(0, -1) : processedBaseUrl;
          const response = await axios.post(`${cleanBaseUrl}/auth/refresh`, {
            refresh_token: refreshToken
          })

          const newAccessToken = response.data.access_token
          setTokens(newAccessToken, refreshToken) // Use the unified token manager

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens but DON'T redirect - let the component handle it
        clearTokens()
        // Don't redirect here - it causes issues when completing tasks
        // Components should handle auth errors themselves
      }
    }

    return Promise.reject(error)
  }
)

export default api