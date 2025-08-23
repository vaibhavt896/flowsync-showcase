'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Adaptive UI Service
 * Provides intelligent UI adaptations based on user behavior and context
 */

interface UserBehavior {
  clickFrequency: number
  scrollSpeed: number
  timeSpentOnPage: number
  preferredTheme: 'light' | 'dark' | 'system'
  deviceType: 'mobile' | 'tablet' | 'desktop'
  sessionLength: number
}

interface UIAdaptation {
  animationSpeed: 'slow' | 'normal' | 'fast'
  density: 'compact' | 'normal' | 'spacious'
  contrast: 'low' | 'normal' | 'high'
  fontSize: 'small' | 'medium' | 'large'
  reduceMotion: boolean
}

class AdaptiveUIService {
  private behavior: Partial<UserBehavior> = {}
  private adaptation: UIAdaptation = {
    animationSpeed: 'normal',
    density: 'normal',
    contrast: 'normal',
    fontSize: 'medium',
    reduceMotion: false
  }
  private listeners: Array<(adaptation: UIAdaptation) => void> = []

  constructor() {
    this.loadUserPreferences()
    this.detectDeviceType()
    this.startBehaviorTracking()
  }

  // Track user behavior
  trackClick(): void {
    this.behavior.clickFrequency = (this.behavior.clickFrequency || 0) + 1
    this.updateAdaptation()
  }

  trackScroll(speed: number): void {
    this.behavior.scrollSpeed = speed
    this.updateAdaptation()
  }

  trackTimeOnPage(duration: number): void {
    this.behavior.timeSpentOnPage = duration
    this.updateAdaptation()
  }

  // Get current adaptation
  getAdaptation(): UIAdaptation {
    return { ...this.adaptation }
  }

  // Subscribe to adaptation changes
  subscribe(callback: (adaptation: UIAdaptation) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  // Update UI adaptation based on behavior
  private updateAdaptation(): void {
    const newAdaptation = { ...this.adaptation }

    // Adapt animation speed based on click frequency
    if (this.behavior.clickFrequency && this.behavior.clickFrequency > 10) {
      newAdaptation.animationSpeed = 'fast'
    } else if (this.behavior.clickFrequency && this.behavior.clickFrequency < 3) {
      newAdaptation.animationSpeed = 'slow'
    }

    // Adapt density based on device type
    if (this.behavior.deviceType === 'mobile') {
      newAdaptation.density = 'compact'
    } else if (this.behavior.deviceType === 'desktop') {
      newAdaptation.density = 'spacious'
    }

    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      newAdaptation.reduceMotion = prefersReducedMotion
      if (prefersReducedMotion) {
        newAdaptation.animationSpeed = 'slow'
      }
    }

    // Notify listeners if adaptation changed
    if (JSON.stringify(newAdaptation) !== JSON.stringify(this.adaptation)) {
      this.adaptation = newAdaptation
      this.listeners.forEach(callback => callback(newAdaptation))
      this.saveUserPreferences()
    }
  }

  private detectDeviceType(): void {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    if (width < 768) {
      this.behavior.deviceType = 'mobile'
    } else if (width < 1024) {
      this.behavior.deviceType = 'tablet'
    } else {
      this.behavior.deviceType = 'desktop'
    }
  }

  private startBehaviorTracking(): void {
    if (typeof window === 'undefined') return

    // Track clicks
    let clickCount = 0
    document.addEventListener('click', () => {
      clickCount++
      this.trackClick()
    })

    // Track scroll speed
    let lastScrollTime = Date.now()
    let lastScrollY = window.scrollY
    
    document.addEventListener('scroll', () => {
      const now = Date.now()
      const currentScrollY = window.scrollY
      const timeDiff = now - lastScrollTime
      const scrollDiff = Math.abs(currentScrollY - lastScrollY)
      
      if (timeDiff > 0) {
        const scrollSpeed = scrollDiff / timeDiff
        this.trackScroll(scrollSpeed)
      }
      
      lastScrollTime = now
      lastScrollY = currentScrollY
    })

    // Track time on page
    const startTime = Date.now()
    const updateTimeOnPage = () => {
      this.trackTimeOnPage(Date.now() - startTime)
    }
    
    setInterval(updateTimeOnPage, 5000) // Update every 5 seconds
    
    // Track when page becomes hidden/visible
    document.addEventListener('visibilitychange', updateTimeOnPage)
  }

  private loadUserPreferences(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('flowsync_adaptive_ui')
      if (stored) {
        const preferences = JSON.parse(stored)
        this.adaptation = { ...this.adaptation, ...preferences }
      }
    } catch (error) {
      console.error('Failed to load adaptive UI preferences:', error)
    }
  }

  private saveUserPreferences(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('flowsync_adaptive_ui', JSON.stringify(this.adaptation))
    } catch (error) {
      console.error('Failed to save adaptive UI preferences:', error)
    }
  }

  // Get CSS variables for current adaptation
  getCSSVariables(): Record<string, string> {
    const adaptation = this.getAdaptation()
    
    return {
      '--animation-duration': adaptation.animationSpeed === 'fast' ? '0.15s' : 
                             adaptation.animationSpeed === 'slow' ? '0.5s' : '0.3s',
      '--spacing-scale': adaptation.density === 'compact' ? '0.8' : 
                        adaptation.density === 'spacious' ? '1.2' : '1',
      '--font-size-scale': adaptation.fontSize === 'small' ? '0.9' : 
                          adaptation.fontSize === 'large' ? '1.1' : '1',
    }
  }
}

// Create singleton instance
export const adaptiveUI = new AdaptiveUIService()

// Hook for React components
export function useAdaptiveUI() {
  const [adaptation, setAdaptation] = useState<UIAdaptation>(adaptiveUI.getAdaptation())

  useEffect(() => {
    const unsubscribe = adaptiveUI.subscribe(setAdaptation)
    return unsubscribe
  }, [])

  const trackClick = useCallback(() => adaptiveUI.trackClick(), [])
  const trackScroll = useCallback((speed: number) => adaptiveUI.trackScroll(speed), [])

  return {
    adaptation,
    trackClick,
    trackScroll,
    getCSSVariables: adaptiveUI.getCSSVariables.bind(adaptiveUI)
  }
}

export default adaptiveUI