'use client'

import React, { useEffect, useState } from 'react'
import AnimatedCursor from 'react-animated-cursor'

/**
 * Enhanced Cursor with react-animated-cursor integration
 * Provides premium cursor effects for better user experience
 */

interface EnhancedCursorProps {
  enabled?: boolean
  color?: string
  innerSize?: number
  outerSize?: number
  outerAlpha?: number
  innerScale?: number
  outerScale?: number
}

export function EnhancedCursor({
  enabled = true,
  color = '59, 130, 246', // blue-500 rgb values
  innerSize = 8,
  outerSize = 35,
  outerAlpha = 0.3,
  innerScale = 0.6,
  outerScale = 1.4
}: EnhancedCursorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [hasMouseSupport, setHasMouseSupport] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if device has mouse support (not mobile/touch device)
    const mediaQuery = window.matchMedia('(pointer: fine)')
    setHasMouseSupport(mediaQuery.matches)
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setHasMouseSupport(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleMediaChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }, [])

  // Don't render on server or on touch devices
  if (!isMounted || !hasMouseSupport || !enabled) {
    return null
  }

  return (
    <AnimatedCursor
      innerSize={innerSize}
      outerSize={outerSize}
      color={color}
      outerAlpha={outerAlpha}
      innerScale={innerScale}
      outerScale={outerScale}
      trailingSpeed={8}
      showSystemCursor={false}
      clickables={[
        'a',
        'input[type="text"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        'label[for]',
        'select',
        'textarea',
        'button',
        '.button',
        '.btn',
        '.magnetic-button',
        '.card-optimized',
        '.button-optimized',
        '.interactive',
        '[role="button"]',
        '[role="link"]',
        '[tabindex]'
      ]}
    />
  )
}

export default EnhancedCursor