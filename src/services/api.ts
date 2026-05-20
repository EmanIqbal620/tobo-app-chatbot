import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/tokenManager'

// Direct backend URL - avoids Vercel rewrite auth header issue
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://emaniqbal-phase-3-chatbot.hf.space';

// Create the base axios instance
const api: AxiosInstance = axios.create({
  baseURL: (() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is missing. Please set it in your environment.");
    }

    // If the URL is a relative path (e.g. "/api"), it's Vercel rewrite mode.
    // Vercel external rewrites use HTTP redirect which strips Authorization headers.
    // Use the direct backend URL instead with CORS.
    let processedBaseUrl = baseUrl;
    if (baseUrl.startsWith('/')) {
      processedBaseUrl = BACKEND_API_URL;
    } else if (baseUrl.includes('hf.space')) {
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        processedBaseUrl = `https://${baseUrl}`;
      }
    } else if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://')) {
      processedBaseUrl = `https://${baseUrl}`;
    }

    // Remove trailing slash if present to prevent double slashes
    const cleanBaseUrl = processedBaseUrl.endsWith('/') ? processedBaseUrl.slice(0, -1) : processedBaseUrl;
    // For Docker setup, if the base URL is just "/api", use it as-is
    // Otherwise, append /api to the base URL for normal deployments
    if (cleanBaseUrl.endsWith('/api')) {
      return cleanBaseUrl;
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
          const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL;

          if (!rawBaseUrl) {
            throw new Error("NEXT_PUBLIC_API_URL environment variable is missing. Please set it in your environment.");
          }

          // If the URL is a relative path, use the hardcoded backend URL directly
          let processedBaseUrl = rawBaseUrl.startsWith('/') ? BACKEND_API_URL : rawBaseUrl;
          if (processedBaseUrl.includes('hf.space')) {
            if (!processedBaseUrl.startsWith('http://') && !processedBaseUrl.startsWith('https://')) {
              processedBaseUrl = `https://${processedBaseUrl}`;
            }
          } else if (!processedBaseUrl.startsWith('https://') && !processedBaseUrl.startsWith('http://')) {
            processedBaseUrl = `https://${processedBaseUrl}`;
          }

          const cleanBaseUrl = processedBaseUrl.endsWith('/') ? processedBaseUrl.slice(0, -1) : processedBaseUrl;
          // Append /api if not already present (refresh endpoint is at /api/auth/refresh)
          const refreshUrl = cleanBaseUrl.endsWith('/api') ? `${cleanBaseUrl}/auth/refresh` : `${cleanBaseUrl}/api/auth/refresh`;
          const response = await axios.post(refreshUrl, {
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