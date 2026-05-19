// frontend/src/services/api-client.ts
// API client with JWT attachment for authenticated requests

import { getAccessToken, clearTokens } from '@/utils/tokenManager';
import SessionManager from './session';

export interface ApiClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    const envBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!envBaseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is missing. Please set it in your environment.");
    }

    let baseUrl = config.baseUrl || envBaseUrl;

    // Ensure HTTPS for production deployments (except for hf.space which handles redirects differently)
    if (baseUrl.includes('hf.space')) {
      // For Hugging Face spaces, we'll use HTTP to avoid redirect issues
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`;
      }
      // If it's already https://, leave as is - let the service handle its own redirects
    } else if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://')) {
      baseUrl = `https://${baseUrl}`;
    }

    // For Docker setup, if the base URL is just "/api", use it as-is
    // Otherwise, append /api to the base URL for normal deployments
    if (baseUrl === '/api') {
      this.baseUrl = '/api';
    } else {
      this.baseUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    }
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
  }

  /**
   * Makes a GET request to the specified endpoint
   * @param endpoint - The API endpoint to call
   * @param options - Additional options for the request
   * @returns Promise containing the response data
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a POST request to the specified endpoint
   * @param endpoint - The API endpoint to call
   * @param data - The data to send in the request body
   * @param options - Additional options for the request
   * @returns Promise containing the response data
   */
  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a PUT request to the specified endpoint
   * @param endpoint - The API endpoint to call
   * @param data - The data to send in the request body
   * @param options - Additional options for the request
   * @returns Promise containing the response data
   */
  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a DELETE request to the specified endpoint
   * @param endpoint - The API endpoint to call
   * @param options - Additional options for the request
   * @returns Promise containing the response data
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Builds the headers for a request, including the JWT token if available
   * @param additionalHeaders - Additional headers to include
   * @returns Promise containing the complete headers object
   */
  private async buildHeaders(additionalHeaders?: HeadersInit): Promise<Record<string, string>> {
    // Convert HeadersInit to Record<string, string>
    let headerRecord: Record<string, string> = {};

    if (additionalHeaders) {
      if (Array.isArray(additionalHeaders)) {
        // Handle array format [[key, value], [key, value]]
        additionalHeaders.forEach(([key, value]) => {
          headerRecord[key] = value;
        });
      } else if (additionalHeaders instanceof Headers) {
        // Handle Headers object
        additionalHeaders.forEach((value, key) => {
          headerRecord[key] = value;
        });
      } else {
        // Handle Record<string, string> format
        headerRecord = { ...additionalHeaders };
      }
    }

    const headers = { ...this.defaultHeaders, ...headerRecord };

    // Get the JWT token and add it to the headers if available
    const token = getAccessToken(); // Using synchronous method now
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handles the response from a fetch request
   * @param response - The fetch response object
   * @returns Promise containing the parsed response data
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Refresh session on successful responses (to extend session lifetime)
    if (response.ok) {
      SessionManager.refreshSession();
    }

    if (!response.ok) {
      // Handle different status codes appropriately
      if (response.status === 401) {
        // Token might be expired, clear session and redirect to login
        SessionManager.clearSession();
        window.location.href = '/login'; // Redirect to login page
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this resource');
      } else if (response.status === 404) {
        throw new Error('Not Found: The requested resource does not exist');
      } else {
        // Try to get error message from response body
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage);
      }
    }

    // Handle different content types appropriately
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    } else {
      // For non-JSON responses, return the text
      const text = await response.text();
      return text as unknown as T;
    }
  }
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();

// Export the class for cases where a custom instance is needed
export default ApiClient;