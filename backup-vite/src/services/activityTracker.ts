import { ActivityMetrics } from '@/types'
import { useFlowStore } from '@/stores/flowStore'
import { throttle } from '@/utils/helpers'

export class ActivityTracker {
  private isTracking = false
  private currentMetrics: Partial<ActivityMetrics> = {}
  private startTime = Date.now()
  private trackingInterval: NodeJS.Timeout | null = null
  
  // Event listeners
  private keyboardListener: ((e: KeyboardEvent) => void) | null = null
  private mouseListener: ((e: MouseEvent) => void) | null = null
  private focusListener: ((e: Event) => void) | null = null
  private blurListener: ((e: Event) => void) | null = null
  private visibilityListener: (() => void) | null = null

  constructor() {
    this.setupEventListeners()
  }

  start(): void {
    if (this.isTracking) return
    
    this.isTracking = true
    this.startTime = Date.now()
    this.resetMetrics()
    
    // Collect metrics every 30 seconds
    this.trackingInterval = setInterval(() => {
      this.saveMetrics()
    }, 30000)
    
    console.log('Activity tracking started')
  }

  stop(): void {
    if (!this.isTracking) return
    
    this.isTracking = false
    
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval)
      this.trackingInterval = null
    }
    
    this.saveMetrics()
    console.log('Activity tracking stopped')
  }

  private setupEventListeners(): void {
    // Throttled keyboard tracking
    this.keyboardListener = throttle((e: KeyboardEvent) => {
      if (!this.isTracking) return
      this.currentMetrics.keystrokes = (this.currentMetrics.keystrokes || 0) + 1
    }, 100)

    // Throttled mouse tracking
    this.mouseListener = throttle((e: MouseEvent) => {
      if (!this.isTracking) return
      this.currentMetrics.mouseMovements = (this.currentMetrics.mouseMovements || 0) + 1
    }, 100)

    // Window focus/blur tracking
    this.focusListener = (e: Event) => {
      if (!this.isTracking) return
      this.currentMetrics.windowSwitches = (this.currentMetrics.windowSwitches || 0) + 1
    }

    this.blurListener = (e: Event) => {
      if (!this.isTracking) return
      // Start tracking idle time when window loses focus
      this.startIdleTracking()
    }

    // Page visibility tracking
    this.visibilityListener = () => {
      if (!this.isTracking) return
      
      if (document.hidden) {
        this.startIdleTracking()
      } else {
        this.stopIdleTracking()
        this.currentMetrics.windowSwitches = (this.currentMetrics.windowSwitches || 0) + 1
      }
    }

    // Add event listeners
    document.addEventListener('keydown', this.keyboardListener)
    document.addEventListener('mousemove', this.mouseListener)
    window.addEventListener('focus', this.focusListener)
    window.addEventListener('blur', this.blurListener)
    document.addEventListener('visibilitychange', this.visibilityListener)
  }

  private idleStartTime: number | null = null

  private startIdleTracking(): void {
    if (!this.idleStartTime) {
      this.idleStartTime = Date.now()
    }
  }

  private stopIdleTracking(): void {
    if (this.idleStartTime) {
      const idleTime = (Date.now() - this.idleStartTime) / 1000
      this.currentMetrics.idleTime = (this.currentMetrics.idleTime || 0) + idleTime
      this.idleStartTime = null
    }
  }

  private resetMetrics(): void {
    this.currentMetrics = {
      timestamp: new Date(),
      keystrokes: 0,
      mouseMovements: 0,
      windowSwitches: 0,
      idleTime: 0,
      activeApplication: this.getActiveApplication(),
    }
  }

  private saveMetrics(): void {
    // If still idle, calculate current idle time
    if (this.idleStartTime) {
      const currentIdleTime = (Date.now() - this.idleStartTime) / 1000
      this.currentMetrics.idleTime = (this.currentMetrics.idleTime || 0) + currentIdleTime
      this.idleStartTime = Date.now() // Reset for next period
    }

    const metrics: ActivityMetrics = {
      timestamp: new Date(),
      keystrokes: this.currentMetrics.keystrokes || 0,
      mouseMovements: this.currentMetrics.mouseMovements || 0,
      windowSwitches: this.currentMetrics.windowSwitches || 0,
      idleTime: this.currentMetrics.idleTime || 0,
      activeApplication: this.getActiveApplication(),
    }

    // Add to flow store
    useFlowStore.getState().addActivityMetric(metrics)
    
    // Reset for next collection period
    this.resetMetrics()
  }

  private getActiveApplication(): string {
    // In a web environment, we can't detect the actual active application
    // But we can detect if the current tab is active
    if (document.hidden) {
      return 'unknown'
    }
    
    // Try to get some context from the document title or URL
    return document.title || 'FlowSync'
  }

  getRealtimeMetrics(): Partial<ActivityMetrics> {
    return { ...this.currentMetrics }
  }

  cleanup(): void {
    this.stop()
    
    // Remove event listeners
    if (this.keyboardListener) {
      document.removeEventListener('keydown', this.keyboardListener)
    }
    if (this.mouseListener) {
      document.removeEventListener('mousemove', this.mouseListener)
    }
    if (this.focusListener) {
      window.removeEventListener('focus', this.focusListener)
    }
    if (this.blurListener) {
      window.removeEventListener('blur', this.blurListener)
    }
    if (this.visibilityListener) {
      document.removeEventListener('visibilitychange', this.visibilityListener)
    }
  }
}