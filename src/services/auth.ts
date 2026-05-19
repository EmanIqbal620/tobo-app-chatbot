// frontend/src/services/auth.ts
// Authentication service functions for the frontend

import { apiClient } from './api-client';

interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
}

interface UserRegistrationResponse {
  user_id: string;
  email: string;
  name: string;
  created_at: string;
}

interface UserLoginData {
  email: string;
  password: string;
}

interface UserLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserRegistrationResponse;
}

interface UserValidateResponse {
  user_id: string;
  email: string;
  valid: boolean;
}

/**
 * Registers a new user account
 * @param userData - User registration data (email, password, name)
 * @returns Promise containing the registration response
 */
export async function registerUser(userData: UserRegistrationData): Promise<UserRegistrationResponse> {
  try {
    return await apiClient.post<UserRegistrationResponse>('/api/auth/register', userData);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Logs in a user with their credentials
 * @param loginData - User login data (email, password)
 * @returns Promise containing the login response with JWT token
 */
export async function loginUser(loginData: UserLoginData): Promise<UserLoginResponse> {
  try {
    return await apiClient.post<UserLoginResponse>('/api/auth/login', loginData);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Logs out the current user
 * @returns Promise indicating successful logout
 */
export async function logoutUser(): Promise<{ message: string }> {
  try {
    return await apiClient.post<{ message: string }>('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Gets the current user's profile information
 * @returns Promise containing the user profile
 */
export async function getUserProfile(): Promise<UserRegistrationResponse> {
  try {
    return await apiClient.get<UserRegistrationResponse>('/api/user/profile');
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
}

/**
 * Validates a user's access to a specific resource
 * @param userId - The user ID to validate
 * @returns Promise containing validation result
 */
export async function validateUserAccess(userId: string): Promise<UserValidateResponse> {
  try {
    return await apiClient.get<UserValidateResponse>(`/api/user/${userId}/validate`);
  } catch (error) {
    console.error('User access validation error:', error);
    throw error;
  }
}

/**
 * Updates the current user's profile information
 * @param profileData - The updated profile data
 * @returns Promise containing the updated user profile
 */
export async function updateUserProfile(profileData: Partial<UserRegistrationData>): Promise<UserRegistrationResponse> {
  try {
    return await apiClient.put<UserRegistrationResponse>('/api/user/profile', profileData);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
}