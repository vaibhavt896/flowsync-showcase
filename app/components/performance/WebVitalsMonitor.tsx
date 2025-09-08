'use client'

import { useEffect } from 'react'

/**
 * Web Vitals Monitor - tracks performance metrics
 * Currently minimal implementation for development
 */
export function WebVitalsMonitor() {
  useEffect(() => {
    // Web vitals monitoring for production environment
    if (process.env.NODE_ENV === 'development') {
      console.log('WebVitals monitoring initialized')
    }
  }, [])

  return null // This component doesn't render anything
}

// Hook for using web vitals data
export function useWebVitals() {
  // TODO: Implement actual web vitals hook
  return {
    cls: 0,
    fid: 0,
    fcp: 0,
    lcp: 0,
    ttfb: 0,
    loading: false,
    error: null
  }
}