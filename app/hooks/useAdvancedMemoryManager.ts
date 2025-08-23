'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

/**
 * Advanced Memory Management Hook
 * Handles animation cleanup, Three.js object disposal, and weak references
 */

interface AnimationCleanup {
  id: string
  kill: () => void
  type: 'gsap' | 'three' | 'web-animation' | 'raf'
}

interface MemoryManagerConfig {
  enableAutoCleanup?: boolean
  cleanupThreshold?: number
  enableWeakReferences?: boolean
  debugMode?: boolean
}

export function useAdvancedMemoryManager(config: MemoryManagerConfig = {}) {
  const {
    enableAutoCleanup = true,
    cleanupThreshold = 50, // Max animations before cleanup
    enableWeakReferences = true,
    debugMode = false
  } = config

  const animationsRef = useRef<Map<string, AnimationCleanup>>(new Map())
  const weakRefsRef = useRef<WeakMap<object, () => void>>(new WeakMap())
  const observersRef = useRef<Set<IntersectionObserver | MutationObserver | ResizeObserver>>(new Set())
  const threeObjectsRef = useRef<Set<any>>(new Set()) // Three.js objects
  const eventListenersRef = useRef<Map<string, { element: EventTarget; event: string; handler: EventListener; options?: AddEventListenerOptions }>>(new Map())

  /**
   * Register GSAP animation for cleanup
   */
  const registerGSAPAnimation = useCallback((tween: gsap.core.Tween | gsap.core.Timeline, id?: string): string => {
    const animationId = id || `gsap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    animationsRef.current.set(animationId, {
      id: animationId,
      kill: () => {
        tween.kill()
        if (debugMode) console.log(`🧹 GSAP animation killed: ${animationId}`)
      },
      type: 'gsap'
    })

    if (debugMode) console.log(`📝 GSAP animation registered: ${animationId}`)
    return animationId
  }, [debugMode])

  /**
   * Register Three.js object for disposal
   */
  const registerThreeObject = useCallback((object: any): void => {
    threeObjectsRef.current.add(object)
    if (debugMode) console.log('📝 Three.js object registered for disposal')
  }, [debugMode])

  /**
   * Register Web Animation API animation
   */
  const registerWebAnimation = useCallback((animation: Animation, id?: string): string => {
    const animationId = id || `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    animationsRef.current.set(animationId, {
      id: animationId,
      kill: () => {
        animation.cancel()
        if (debugMode) console.log(`🧹 Web Animation canceled: ${animationId}`)
      },
      type: 'web-animation'
    })

    if (debugMode) console.log(`📝 Web Animation registered: ${animationId}`)
    return animationId
  }, [debugMode])

  /**
   * Register requestAnimationFrame for cleanup
   */
  const registerRAF = useCallback((rafId: number, id?: string): string => {
    const animationId = id || `raf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    animationsRef.current.set(animationId, {
      id: animationId,
      kill: () => {
        cancelAnimationFrame(rafId)
        if (debugMode) console.log(`🧹 RAF canceled: ${animationId}`)
      },
      type: 'raf'
    })

    if (debugMode) console.log(`📝 RAF registered: ${animationId}`)
    return animationId
  }, [debugMode])

  /**
   * Register event listener with automatic cleanup
   */
  const addEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): string => {
    const listenerId = `${event}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    element.addEventListener(event, handler, options)
    eventListenersRef.current.set(listenerId, { element, event, handler, options })
    
    if (debugMode) console.log(`📝 Event listener registered: ${event} on`, element)
    return listenerId
  }, [debugMode])

  /**
   * Register observer for cleanup
   */
  const registerObserver = useCallback((observer: IntersectionObserver | MutationObserver | ResizeObserver): void => {
    observersRef.current.add(observer)
    if (debugMode) console.log('📝 Observer registered for cleanup')
  }, [debugMode])

  /**
   * Register weak reference cleanup function
   */
  const registerWeakRef = useCallback((target: object, cleanup: () => void): void => {
    if (enableWeakReferences && WeakMap) {
      weakRefsRef.current.set(target, cleanup)
      if (debugMode) console.log('📝 Weak reference cleanup registered')
    }
  }, [enableWeakReferences, debugMode])

  /**
   * Dispose Three.js objects properly
   */
  const disposeThreeObjects = useCallback(() => {
    threeObjectsRef.current.forEach(object => {
      try {
        // Dispose geometry
        if (object.geometry && typeof object.geometry.dispose === 'function') {
          object.geometry.dispose()
        }

        // Dispose material(s)
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material: any) => {
              if (typeof material.dispose === 'function') {
                material.dispose()
              }
              // Dispose textures
              Object.values(material).forEach((value: any) => {
                if (value && typeof value.dispose === 'function') {
                  value.dispose()
                }
              })
            })
          } else if (typeof object.material.dispose === 'function') {
            object.material.dispose()
            // Dispose textures
            Object.values(object.material).forEach((value: any) => {
              if (value && typeof value.dispose === 'function') {
                value.dispose()
              }
            })
          }
        }

        // Dispose texture
        if (object.texture && typeof object.texture.dispose === 'function') {
          object.texture.dispose()
        }

        // Remove from parent
        if (object.parent && typeof object.parent.remove === 'function') {
          object.parent.remove(object)
        }

        if (debugMode) console.log('🧹 Three.js object disposed')
      } catch (error) {
        console.warn('⚠️ Error disposing Three.js object:', error)
      }
    })
    
    threeObjectsRef.current.clear()
  }, [debugMode])

  /**
   * Clean up all registered animations
   */
  const cleanupAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => {
      try {
        animation.kill()
      } catch (error) {
        console.warn(`⚠️ Error cleaning up animation ${animation.id}:`, error)
      }
    })
    animationsRef.current.clear()
  }, [])

  /**
   * Clean up all event listeners
   */
  const cleanupEventListeners = useCallback(() => {
    eventListenersRef.current.forEach(({ element, event, handler, options }, id) => {
      try {
        element.removeEventListener(event, handler, options)
        if (debugMode) console.log(`🧹 Event listener removed: ${event}`)
      } catch (error) {
        console.warn(`⚠️ Error removing event listener ${id}:`, error)
      }
    })
    eventListenersRef.current.clear()
  }, [debugMode])

  /**
   * Clean up all observers
   */
  const cleanupObservers = useCallback(() => {
    observersRef.current.forEach(observer => {
      try {
        observer.disconnect()
        if (debugMode) console.log('🧹 Observer disconnected')
      } catch (error) {
        console.warn('⚠️ Error disconnecting observer:', error)
      }
    })
    observersRef.current.clear()
  }, [debugMode])

  /**
   * Perform automatic cleanup when threshold is reached
   */
  const performAutoCleanup = useCallback(() => {
    if (!enableAutoCleanup) return

    const animationCount = animationsRef.current.size
    if (animationCount >= cleanupThreshold) {
      if (debugMode) console.log(`🚨 Auto cleanup triggered: ${animationCount} animations`)
      cleanupAnimations()
    }
  }, [enableAutoCleanup, cleanupThreshold, cleanupAnimations, debugMode])

  /**
   * Manual cleanup of specific animation
   */
  const cleanupAnimation = useCallback((id: string): boolean => {
    const animation = animationsRef.current.get(id)
    if (animation) {
      try {
        animation.kill()
        animationsRef.current.delete(id)
        return true
      } catch (error) {
        console.warn(`⚠️ Error cleaning up animation ${id}:`, error)
        return false
      }
    }
    return false
  }, [])

  /**
   * Get memory usage statistics
   */
  const getMemoryStats = useCallback(() => {
    return {
      animations: animationsRef.current.size,
      threeObjects: threeObjectsRef.current.size,
      eventListeners: eventListenersRef.current.size,
      observers: observersRef.current.size,
      memoryUsage: (performance as any).memory ? {
        used: Math.round(((performance as any).memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
        total: Math.round(((performance as any).memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
        limit: Math.round(((performance as any).memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100
      } : null
    }
  }, [])

  /**
   * Force garbage collection if available
   */
  const forceGC = useCallback(() => {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc()
      if (debugMode) console.log('🗑️ Forced garbage collection')
    }
  }, [debugMode])

  // Auto cleanup check on animation register
  useEffect(() => {
    performAutoCleanup()
  }, [performAutoCleanup])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debugMode) console.log('🧹 Performing final cleanup on unmount')
      cleanupAnimations()
      disposeThreeObjects()
      cleanupEventListeners()
      cleanupObservers()
    }
  }, [cleanupAnimations, disposeThreeObjects, cleanupEventListeners, cleanupObservers, debugMode])

  return {
    // Registration methods
    registerGSAPAnimation,
    registerThreeObject,
    registerWebAnimation,
    registerRAF,
    addEventListener,
    registerObserver,
    registerWeakRef,

    // Cleanup methods
    cleanupAnimations,
    cleanupAnimation,
    disposeThreeObjects,
    cleanupEventListeners,
    cleanupObservers,

    // Utility methods
    getMemoryStats,
    forceGC,
    performAutoCleanup
  }
}

/**
 * Enhanced GSAP animation hook with automatic cleanup
 */
export function useGSAPWithCleanup() {
  const { registerGSAPAnimation, cleanupAnimations } = useAdvancedMemoryManager()

  const animate = useCallback((target: any, vars: any, id?: string) => {
    const tween = gsap.to(target, vars)
    return registerGSAPAnimation(tween, id)
  }, [registerGSAPAnimation])

  const timeline = useCallback((id?: string) => {
    const tl = gsap.timeline()
    registerGSAPAnimation(tl, id)
    return tl
  }, [registerGSAPAnimation])

  // Cleanup all animations on unmount
  useEffect(() => {
    return cleanupAnimations
  }, [cleanupAnimations])

  return { animate, timeline, gsap }
}

export default useAdvancedMemoryManager