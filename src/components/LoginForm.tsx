'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/authService'
import Button from './Button'
import { useTheme } from '@/contexts/ThemeContext'

interface LoginFormProps {
  onLoginSuccess?: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { theme } = useTheme();
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login(email, password)
      authService.setTokens(response.access_token, response.refresh_token)

      // Call the success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess()
      } else {
        // Default behavior: redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      // Handle error properly - ensure we set a string value
      if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else if (err && typeof err === 'object' && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div
          className="rounded-md p-4"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.accent}`
          }}
        >
          <div className="text-sm" style={{ color: theme.colors.accent }}>{error}</div>
        </div>
      )}

      <input type="hidden" name="remember" defaultValue="true" />
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email-address"
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text.primary }}
          >
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="matte-input w-full"
            placeholder="Email address"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1"
            style={{ color: theme.colors.text.primary }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="matte-input w-full"
            placeholder="Password"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            href="/register"
            className="font-medium"
            style={{ color: theme.colors.accent }}
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading}
          fullWidth
          className="py-3 px-4 text-base font-medium rounded-lg"
          style={{
            backgroundColor: theme.colors.accent,
            color: '#FFFFFF'
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  )
}