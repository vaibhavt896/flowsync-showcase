'use client'

import { useState, useEffect } from 'react'

// Feature detection for backdrop-filter support
export function useBackdropSupport() {
  const [supportsBackdrop, setSupportsBackdrop] = useState(false)
  const [supportsAdvanced, setSupportsAdvanced] = useState(false)

  useEffect(() => {
    // Basic backdrop-filter support (Chrome 76+, Safari 14+, Firefox 103+)
    const basicSupport = 
      CSS.supports('backdrop-filter', 'blur(10px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
    
    // Advanced backdrop-filter with saturation (modern browsers)
    const advancedSupport = 
      CSS.supports('backdrop-filter', 'blur(20px) saturate(180%)') &&
      CSS.supports('backdrop-filter', 'brightness(110%)')
    
    setSupportsBackdrop(basicSupport)
    setSupportsAdvanced(advancedSupport)
  }, [])

  return {
    supportsBackdrop,
    supportsAdvanced,
    // Browser-specific optimizations
    isWebKit: typeof window !== 'undefined' && /WebKit/.test(navigator.userAgent),
    isSafari: typeof window !== 'undefined' && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
    isMobile: typeof window !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
  }
}