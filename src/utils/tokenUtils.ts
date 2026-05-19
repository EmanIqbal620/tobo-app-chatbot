/**
 * Utility functions for token management
 */

/**
 * Decode a JWT token without verification
 * @param token The JWT token to decode
 * @returns The decoded token payload
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

/**
 * Check if a token is expired
 * @param token The JWT token to check
 * @returns True if the token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token)

  if (!decoded || !decoded.exp) {
    return true // If there's no expiry, consider it expired
  }

  const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
  return decoded.exp < currentTime
}

/**
 * Get the expiration time from a token
 * @param token The JWT token
 * @returns The expiration time as a Date object, or null if invalid
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token)

  if (!decoded || !decoded.exp) {
    return null
  }

  return new Date(decoded.exp * 1000) // Convert seconds to milliseconds
}

/**
 * Check if a token is about to expire (within 5 minutes)
 * @param token The JWT token
 * @returns True if the token is expiring soon, false otherwise
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token)

  if (!decoded || !decoded.exp) {
    return true // If there's no expiry, consider it expiring soon
  }

  const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
  const fiveMinutesInSeconds = 5 * 60
  return decoded.exp - currentTime < fiveMinutesInSeconds
}

/**
 * Store tokens in local storage
 * @param accessToken The access token to store
 * @param refreshToken The refresh token to store (optional)
 */
export const storeTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken)
  }
}

/**
 * Get tokens from local storage
 * @returns An object containing the access token and refresh token
 */
export const getStoredTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  }
}

/**
 * Remove tokens from local storage
 */
export const removeTokens = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}