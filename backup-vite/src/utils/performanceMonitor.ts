/**
 * Performance monitoring utilities for Apple Liquid Glass components
 * Tracks FPS, implements adaptive quality, and monitors Core Web Vitals
 */
import { useState, useEffect } from 'react'

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  deviceCapabilities: DeviceCapabilities
  glassQuality: GlassQuality
}

export interface DeviceCapabilities {
  hardwareConcurrency: number
  memory?: number // GB
  connection?: {
    effectiveType: string
    downlink: number
  }
  webglSupport: boolean
  backdropFilterSupport: boolean
  reducedMotion: boolean
  reducedTransparency: boolean
}

export type GlassQuality = 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high'

class PerformanceMonitor {
  private fpsHistory: number[] = []
  private lastFrameTime: number = 0
  private frameCount: number = 0
  private isMonitoring: boolean = false
  private rafId: number | null = null
  private onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  private deviceCapabilities: DeviceCapabilities
  private currentQuality: GlassQuality = 'medium'

  constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities()
    this.currentQuality = this.calculateOptimalQuality()
  }

  /**
   * Start FPS monitoring using requestAnimationFrame
   */
  startFPSMonitoring(callback?: (metrics: PerformanceMetrics) => void): void {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.onMetricsUpdate = callback
    this.lastFrameTime = performance.now()
    this.frameCount = 0
    this.fpsHistory = []

    const measureFrame = (currentTime: number) => {
      if (!this.isMonitoring) return

      const deltaTime = currentTime - this.lastFrameTime
      this.lastFrameTime = currentTime
      this.frameCount++

      // Calculate FPS (frames per second)
      const fps = Math.round(1000 / deltaTime)
      this.fpsHistory.push(fps)

      // Keep only last 60 frames for rolling average
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift()
      }

      // Update metrics every 30 frames
      if (this.frameCount % 30 === 0) {
        const averageFPS = this.getAverageFPS()
        const metrics: PerformanceMetrics = {
          fps: averageFPS,
          frameTime: deltaTime,
          deviceCapabilities: this.deviceCapabilities,
          glassQuality: this.currentQuality
        }

        // Adaptive quality adjustment
        this.adjustQualityBasedOnPerformance(averageFPS)
        
        this.onMetricsUpdate?.(metrics)
      }

      this.rafId = requestAnimationFrame(measureFrame)
    }

    this.rafId = requestAnimationFrame(measureFrame)
  }

  /**
   * Stop FPS monitoring
   */
  stopFPSMonitoring(): void {
    this.isMonitoring = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /**
   * Get current average FPS
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60

    const sum = this.fpsHistory.reduce((acc, fps) => acc + fps, 0)
    return Math.round(sum / this.fpsHistory.length)
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    return {
      fps: this.getAverageFPS(),
      frameTime: 16.67, // Default to 60fps frame time
      deviceCapabilities: this.deviceCapabilities,
      glassQuality: this.currentQuality
    }
  }

  /**
   * Detect device capabilities for adaptive quality
   */
  private detectDeviceCapabilities(): DeviceCapabilities {
    const capabilities: DeviceCapabilities = {
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      webglSupport: this.checkWebGLSupport(),
      backdropFilterSupport: this.checkBackdropFilterSupport(),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      reducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    }

    // Memory info (Chrome only)
    if ('memory' in performance) {
      const memory = (performance as any).memory
      capabilities.memory = Math.round(memory.usedJSHeapSize / 1024 / 1024 / 1024 * 10) / 10
    }

    // Network info
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      capabilities.connection = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink
      }
    }

    return capabilities
  }

  /**
   * Check WebGL support
   */
  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    } catch {
      return false
    }
  }

  /**
   * Check backdrop-filter support
   */
  private checkBackdropFilterSupport(): boolean {
    const div = document.createElement('div')
    div.style.backdropFilter = 'blur(1px)'
    return div.style.backdropFilter !== ''
  }

  /**
   * Calculate optimal glass quality based on device capabilities
   */
  private calculateOptimalQuality(): GlassQuality {
    const caps = this.deviceCapabilities

    // High-end devices
    if (caps.hardwareConcurrency >= 8 && caps.memory && caps.memory >= 8) {
      return caps.webglSupport ? 'ultra-high' : 'high'
    }

    // Mid-range devices
    if (caps.hardwareConcurrency >= 4 && caps.webglSupport) {
      return 'high'
    }

    // Lower-end devices
    if (caps.hardwareConcurrency >= 2) {
      return 'medium'
    }

    // Very low-end devices or accessibility preferences
    if (caps.reducedMotion || caps.reducedTransparency) {
      return 'ultra-low'
    }

    return 'low'
  }

  /**
   * Adjust quality based on performance metrics
   */
  private adjustQualityBasedOnPerformance(averageFPS: number): void {
    const previousQuality = this.currentQuality

    // Downgrade if FPS is too low
    if (averageFPS < 30) {
      this.currentQuality = this.downgradeQuality(this.currentQuality)
    }
    // Upgrade if FPS is consistently high
    else if (averageFPS >= 55 && this.fpsHistory.length >= 30) {
      const consistentlyHighFPS = this.fpsHistory.slice(-30).every(fps => fps >= 50)
      if (consistentlyHighFPS) {
        this.currentQuality = this.upgradeQuality(this.currentQuality)
      }
    }

    // Apply quality changes to DOM
    if (previousQuality !== this.currentQuality) {
      this.applyQualitySettings(this.currentQuality)
    }
  }

  /**
   * Downgrade glass quality
   */
  private downgradeQuality(current: GlassQuality): GlassQuality {
    const levels: GlassQuality[] = ['ultra-low', 'low', 'medium', 'high', 'ultra-high']
    const currentIndex = levels.indexOf(current)
    return levels[Math.max(0, currentIndex - 1)]
  }

  /**
   * Upgrade glass quality
   */
  private upgradeQuality(current: GlassQuality): GlassQuality {
    const levels: GlassQuality[] = ['ultra-low', 'low', 'medium', 'high', 'ultra-high']
    const currentIndex = levels.indexOf(current)
    return levels[Math.min(levels.length - 1, currentIndex + 1)]
  }

  /**
   * Apply quality settings to DOM
   */
  private applyQualitySettings(quality: GlassQuality): void {
    const root = document.documentElement

    // Remove existing quality classes
    root.classList.remove(
      'glass-quality-ultra-low',
      'glass-quality-low', 
      'glass-quality-medium',
      'glass-quality-high',
      'glass-quality-ultra-high'
    )

    // Add new quality class
    root.classList.add(`glass-quality-${quality}`)

    // Set CSS custom properties based on quality
    switch (quality) {
      case 'ultra-low':
        root.style.setProperty('--glass-blur-multiplier', '0.2')
        root.style.setProperty('--glass-opacity-multiplier', '0.5')
        root.style.setProperty('--glass-animation-duration', '0ms')
        break
      case 'low':
        root.style.setProperty('--glass-blur-multiplier', '0.4')
        root.style.setProperty('--glass-opacity-multiplier', '0.7')
        root.style.setProperty('--glass-animation-duration', '150ms')
        break
      case 'medium':
        root.style.setProperty('--glass-blur-multiplier', '1')
        root.style.setProperty('--glass-opacity-multiplier', '1')
        root.style.setProperty('--glass-animation-duration', '250ms')
        break
      case 'high':
        root.style.setProperty('--glass-blur-multiplier', '1.5')
        root.style.setProperty('--glass-opacity-multiplier', '1.2')
        root.style.setProperty('--glass-animation-duration', '350ms')
        break
      case 'ultra-high':
        root.style.setProperty('--glass-blur-multiplier', '2')
        root.style.setProperty('--glass-opacity-multiplier', '1.5')
        root.style.setProperty('--glass-animation-duration', '500ms')
        break
    }

    console.log(`🎨 Glass quality adjusted to: ${quality}`)
  }
}

// Core Web Vitals monitoring
export class CoreWebVitalsMonitor {
  private observer?: PerformanceObserver
  private metrics: Map<string, number> = new Map()

  /**
   * Start monitoring Core Web Vitals
   */
  startMonitoring(callback?: (metric: string, value: number) => void): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported')
      return
    }

    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          this.metrics.set('LCP', entry.startTime)
          callback?.('LCP', entry.startTime)
        }
        
        if (entry.entryType === 'first-input') {
          const fid = (entry as any).processingStart - entry.startTime
          this.metrics.set('FID', fid)
          callback?.('FID', fid)
        }

        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          const cls = (entry as any).value
          this.metrics.set('CLS', cls)
          callback?.('CLS', cls)
        }
      }
    })

    // Observe Core Web Vitals
    try {
      this.observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (error) {
      console.warn('Failed to observe Core Web Vitals:', error)
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): Map<string, number> {
    return new Map(this.metrics)
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.observer?.disconnect()
  }
}

// Singleton instances
export const performanceMonitor = new PerformanceMonitor()
export const coreWebVitalsMonitor = new CoreWebVitalsMonitor()

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    performanceMonitor.startFPSMonitoring(setMetrics)
    
    return () => {
      performanceMonitor.stopFPSMonitoring()
    }
  }, [])

  return metrics
}

// React hook for Core Web Vitals
export function useCoreWebVitals() {
  const [vitals, setVitals] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    const callback = (metric: string, value: number) => {
      setVitals(prev => new Map(prev).set(metric, value))
    }

    coreWebVitalsMonitor.startMonitoring(callback)
    
    return () => {
      coreWebVitalsMonitor.stopMonitoring()
    }
  }, [])

  return vitals
}