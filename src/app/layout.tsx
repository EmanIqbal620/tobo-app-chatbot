import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { TaskProvider } from '@/contexts/TaskContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { LoadingProvider } from '@/contexts/LoadingContext'
import FloatingChat from '@/components/FloatingChat'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A modern todo application with authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        {/* ThemeProvider should wrap everything for dark/light mode */}
        <ThemeProvider>
          <ToastProvider>
            <LoadingProvider>
              <AuthProvider>
                <TaskProvider>
                  {children}
                  <FloatingChat />
                </TaskProvider>
              </AuthProvider>
            </LoadingProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
