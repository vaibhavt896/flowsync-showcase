'use client'

import { useState, useEffect } from 'react'

interface PerformanceMetrics {
  fps: number
  quality: 'high' | 'medium' | 'low'
  adaptiveBlur: number
  isGpuAccelerated: boolean
}

// Apple's 60fps performance monitoring with adaptive quality
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    quality: 'high',
    adaptiveBlur: 20,
    isGpuAccelerated: true
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    // FPS tracking using requestAnimationFrame
    const measureFPS = () => {
      const currentTime = performance.now()
      frameCount++
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        // Apple's performance thresholds
        let quality: 'high' | 'medium' | 'low' = 'high'
        let adaptiveBlur = 20
        
        if (fps >= 60) {
          quality = 'high'
          adaptiveBlur = 20 // Full Apple effect
        } else if (fps >= 30) {
          quality = 'medium'
          adaptiveBlur = 15 // Reduced blur for performance
        } else {
          quality = 'low'
          adaptiveBlur = 10 // Minimal blur for 25fps minimum
        }
        
        // Mobile optimization: 25-50% blur reduction
        if (typeof window !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
          adaptiveBlur = Math.round(adaptiveBlur * 0.75)
        }
        
        setMetrics(prev => ({
          ...prev,
          fps,
          quality,
          adaptiveBlur
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }

    // Start FPS monitoring
    animationId = requestAnimationFrame(measureFPS)
    
    // GPU acceleration detection
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const isGpuAccelerated = !!gl
    
    setMetrics(prev => ({
      ...prev,
      isGpuAccelerated
    }))
    
    // Simplified performance logging
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log('Performance:', {
          fps: metrics.fps,
          quality: metrics.quality,
          gpuAccelerated: isGpuAccelerated
        })
      }, 2000)
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return metrics
}