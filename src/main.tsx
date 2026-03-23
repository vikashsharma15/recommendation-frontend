import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// ── QueryClient — global defaults ─────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:                2,
      staleTime:            5 * 60 * 1000,   // 5 min
      gcTime:               10 * 60 * 1000,  // 10 min
      refetchOnWindowFocus: false,
      refetchOnReconnect:   true,
    },
    mutations: {
      retry: 1,
    },
  },
})

// ── Error Boundary ─────────────────────────────────────────
// React crash hone par white screen nahi — graceful error UI
interface EBState { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Production mein yahan Sentry.captureException(error) call karo
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: '#06060e' }}>
          <div className="mb-4">
            <img src="/spiderchat.png" alt=""
              style={{ width: 80, height: 80, opacity: 0.4, filter: 'sepia(1) saturate(2)', margin: '0 auto' }} />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
          <p className="text-sm mb-6" style={{ color: '#50508a' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/' }}
            className="px-6 py-3 rounded-xl font-black text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)' }}>
            Go home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Render ─────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background:   '#12101e',
                color:        '#e0e0f0',
                border:       '1px solid rgba(212,168,67,0.3)',
                borderRadius: '12px',
                fontSize:     '14px',
                boxShadow:    '0 8px 32px rgba(0,0,0,0.5)',
              },
              success: {
                iconTheme: { primary: '#d4a843', secondary: '#12101e' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#12101e' },
              },
            }}
          />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)