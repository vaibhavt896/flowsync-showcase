import React, { Component, ErrorInfo, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  className?: string
  showErrorDetails?: boolean
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

/**
 * Error Boundary component for Apple Liquid Glass components
 * Provides graceful fallbacks when glass effects fail
 */
export class GlassErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Glass component error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call optional error callback
    this.props.onError?.(error, errorInfo)
  }

  private renderFallback() {
    const { fallback, showErrorDetails, className } = this.props
    const { error, errorInfo } = this.state

    if (fallback) {
      return fallback
    }

    return (
      <div className={cn(
        'glass-fallback p-4 border border-red-200 bg-red-50 rounded-lg text-red-800',
        'dark:border-red-800 dark:bg-red-950 dark:text-red-200',
        className
      )}>
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Glass Effect Unavailable</span>
        </div>
        
        <p className="text-sm mb-3">
          The advanced glass effect couldn't be loaded. Using fallback design.
        </p>

        {showErrorDetails && error && (
          <details className="text-xs">
            <summary className="cursor-pointer font-medium mb-2">
              Technical Details
            </summary>
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded border">
              <p className="font-mono mb-1">Error: {error.message}</p>
              {errorInfo && (
                <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}
      </div>
    )
  }

  public render() {
    if (this.state.hasError) {
      return this.renderFallback()
    }

    return this.props.children
  }
}

/**
 * HOC for wrapping components with glass error boundary
 */
export function withGlassErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackComponent?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <GlassErrorBoundary fallback={fallbackComponent}>
        <Component {...props} />
      </GlassErrorBoundary>
    )
  }
}

/**
 * Simple fallback component for glass effects
 */
export function SimpleFallback({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      'rounded-lg shadow-md p-4 transition-all duration-200',
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Enhanced fallback with basic glass-like styling
 */
export function EnhancedFallback({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn(
      'bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/20',
      'rounded-lg shadow-lg backdrop-blur-sm p-4 transition-all duration-200',
      'supports-[backdrop-filter]:backdrop-blur-sm',
      className
    )}>
      {children}
    </div>
  )
}

/**
 * React hook for handling glass component errors
 */
export function useGlassErrorHandler() {
  const [hasError, setHasError] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.warn('Glass component error:', error)
    setHasError(true)
    setError(error)
  }, [])

  const resetError = React.useCallback(() => {
    setHasError(false)
    setError(null)
  }, [])

  return {
    hasError,
    error,
    handleError,
    resetError
  }
}

/**
 * Safe glass component wrapper that handles backdrop-filter support
 */
export function SafeGlassWrapper({ 
  children, 
  fallback,
  className 
}: {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}) {
  const [supportsBackdropFilter, setSupportsBackdropFilter] = React.useState(true)

  React.useEffect(() => {
    // Check for backdrop-filter support
    const div = document.createElement('div')
    div.style.backdropFilter = 'blur(1px)'
    
    if (!div.style.backdropFilter) {
      setSupportsBackdropFilter(false)
    }
  }, [])

  if (!supportsBackdropFilter) {
    return fallback || (
      <EnhancedFallback className={className}>
        {children}
      </EnhancedFallback>
    )
  }

  return (
    <GlassErrorBoundary 
      fallback={fallback || <EnhancedFallback className={className}>{children}</EnhancedFallback>}
    >
      {children}
    </GlassErrorBoundary>
  )
}

export default GlassErrorBoundary