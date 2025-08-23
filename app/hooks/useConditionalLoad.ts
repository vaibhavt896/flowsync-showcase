'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Advanced conditional loading hook with interaction-based progressive enhancement
 * Implements code splitting by animation complexity and user engagement patterns
 */

interface ConditionalLoadOptions {
  threshold?: number // Interaction threshold before loading
  delay?: number // Delay before loading (ms)
  priority?: 'high' | 'medium' | 'low'
  onLoad?: () => void
  onError?: (error: Error) => void
}

interface LoadingState {
  Component: React.ComponentType<any> | null
  isLoading: boolean
  isLoaded: boolean
  error: Error | null
  interactionCount: number
}

export function useConditionalLoad<T = React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  shouldLoad: boolean,
  options: ConditionalLoadOptions = {}
) {
  const {
    threshold = 1,
    delay = 0,
    priority = 'medium',
    onLoad,
    onError
  } = options

  const [state, setState] = useState<LoadingState>({
    Component: null,
    isLoading: false,
    isLoaded: false,
    error: null,
    interactionCount: 0
  })

  const loadTimeoutRef = useRef<NodeJS.Timeout>()
  const interactionTimeoutRef = useRef<NodeJS.Timeout>()

  const loadComponent = useCallback(async () => {
    if (state.isLoaded || state.isLoading) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Apply priority-based delay
      const priorityDelay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 300
      const totalDelay = delay + priorityDelay

      if (totalDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, totalDelay))
      }

      const importedModule = await importFn()
      
      setState(prev => ({
        ...prev,
        Component: importedModule.default as React.ComponentType<any>,
        isLoading: false,
        isLoaded: true
      }))

      onLoad?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load component')
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err
      }))
      onError?.(err)
    }
  }, [importFn, delay, priority, onLoad, onError, state.isLoaded, state.isLoading])

  const recordInteraction = useCallback(() => {
    setState(prev => {
      const newCount = prev.interactionCount + 1
      
      // Clear previous timeout
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }

      // Load component if threshold reached
      if (newCount >= threshold && shouldLoad && !prev.isLoaded && !prev.isLoading) {
        // Delay loading slightly to batch interactions
        interactionTimeoutRef.current = setTimeout(() => {
          loadComponent()
        }, 50)
      }

      return { ...prev, interactionCount: newCount }
    })
  }, [threshold, shouldLoad, loadComponent])

  // Effect for immediate loading when shouldLoad changes
  useEffect(() => {
    if (shouldLoad && state.interactionCount >= threshold && !state.isLoaded && !state.isLoading) {
      loadTimeoutRef.current = setTimeout(loadComponent, delay)
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [shouldLoad, loadComponent, delay, threshold, state.interactionCount, state.isLoaded, state.isLoading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }
  }, [])

  return {
    Component: state.Component,
    isLoading: state.isLoading,
    isLoaded: state.isLoaded,
    error: state.error,
    recordInteraction,
    interactionCount: state.interactionCount,
    loadManually: loadComponent
  }
}

/**
 * Hook for progressive enhancement based on user behavior patterns
 * Automatically loads heavy components based on user engagement
 */
export function useProgressiveLoad<T = React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: ConditionalLoadOptions & {
    triggers?: ('hover' | 'scroll' | 'click' | 'focus' | 'visibility')[]
    engagementThreshold?: number
  } = {}
) {
  const {
    triggers = ['hover', 'click'],
    engagementThreshold = 2,
    ...loadOptions
  } = options

  const [engagement, setEngagement] = useState({
    hovers: 0,
    clicks: 0,
    scrolls: 0,
    focuses: 0,
    visibilityChanges: 0
  })

  const shouldLoad = triggers.some(trigger => {
    switch (trigger) {
      case 'hover': return engagement.hovers > 0
      case 'click': return engagement.clicks > 0
      case 'scroll': return engagement.scrolls > 0
      case 'focus': return engagement.focuses > 0
      case 'visibility': return engagement.visibilityChanges > 0
      default: return false
    }
  }) && Object.values(engagement).reduce((sum, count) => sum + count, 0) >= engagementThreshold

  const { Component, isLoading, isLoaded, error, recordInteraction } = useConditionalLoad(
    importFn,
    shouldLoad,
    { ...loadOptions, threshold: 1 }
  )

  const trackEngagement = useCallback((type: keyof typeof engagement) => {
    setEngagement(prev => ({ ...prev, [type]: prev[type] + 1 }))
    recordInteraction()
  }, [recordInteraction])

  const bindProps = {
    onMouseEnter: () => trackEngagement('hovers'),
    onClick: () => trackEngagement('clicks'),
    onFocus: () => trackEngagement('focuses'),
    onScroll: () => trackEngagement('scrolls')
  }

  return {
    Component,
    isLoading,
    isLoaded,
    error,
    engagement,
    bindProps,
    trackEngagement
  }
}

/**
 * Animation complexity-based code splitting
 * Loads animation libraries progressively based on complexity needs
 */
export function useAnimationLoader(complexity: 'simple' | 'medium' | 'complex' | 'ultra') {
  const { Component: SimpleAnimations } = useConditionalLoad(
    () => import('@/components/animations/SimpleAnimations'),
    complexity === 'simple',
    { priority: 'high' }
  )

  const { Component: MediumAnimations, recordInteraction: recordMedium } = useConditionalLoad(
    () => import('@/components/animations/MediumAnimations'),
    complexity === 'medium',
    { priority: 'medium', threshold: 1 }
  )

  const { Component: ComplexAnimations, recordInteraction: recordComplex } = useConditionalLoad(
    () => import('@/components/animations/ComplexAnimations'),
    complexity === 'complex',
    { priority: 'low', threshold: 2 }
  )

  const { Component: UltraAnimations, recordInteraction: recordUltra } = useConditionalLoad(
    () => import('@/components/animations/UltraAnimations'),
    complexity === 'ultra',
    { priority: 'low', threshold: 3, delay: 500 }
  )

  const recordComplexityInteraction = useCallback(() => {
    switch (complexity) {
      case 'medium': recordMedium(); break
      case 'complex': recordComplex(); break
      case 'ultra': recordUltra(); break
    }
  }, [complexity, recordMedium, recordComplex, recordUltra])

  const getAnimationComponent = () => {
    switch (complexity) {
      case 'simple': return SimpleAnimations
      case 'medium': return MediumAnimations
      case 'complex': return ComplexAnimations
      case 'ultra': return UltraAnimations
      default: return SimpleAnimations
    }
  }

  return {
    AnimationComponent: getAnimationComponent(),
    recordComplexityInteraction,
    isLoading: complexity === 'medium' ? false : 
               complexity === 'complex' ? !ComplexAnimations : 
               complexity === 'ultra' ? !UltraAnimations : false
  }
}

export default useConditionalLoad