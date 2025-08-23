/**
 * Living Interface System - Behavioral Interface Memory
 * Tracks user interaction patterns and adjusts visual states accordingly
 * Implements adaptive UI with emotional state management and biometric integration
 */

'use client'

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'

type InteractionType = 'click' | 'hover' | 'scroll' | 'focus' | 'blur' | 'keypress' | 'gesture' | 'voice'
type EmotionalState = 'neutral' | 'excited' | 'calm' | 'focused' | 'frustrated' | 'energetic' | 'tired'
type BiometricData = {
  heartRate?: number
  skinConductance?: number
  eyeTracking?: { x: number, y: number }
  voiceStress?: number
}

interface Interaction {
  type: InteractionType
  intensity: number
  timestamp: number
  element?: string
  biometrics?: BiometricData
}

interface LivingInterfaceState {
  emotionalState: EmotionalState
  energy: number
  focus: number
  stress: number
  interactionMemory: Interaction[]
  adaptiveColors: {
    primary: string
    secondary: string
    accent: string
  }
  visualEffects: {
    breathing: boolean
    pulsing: boolean
    glowing: boolean
    morphing: boolean
  }
}

interface LivingInterfaceContext {
  state: LivingInterfaceState
  recordInteraction: (type: InteractionType, intensity?: number, element?: string, biometrics?: BiometricData) => void
  updateEmotionalState: (state: EmotionalState) => void
  setUserPreferences: (prefs: Partial<LivingInterfaceState>) => void
  getAdaptiveStyle: (baseStyle: any) => any
  markTaskCompletion: (intensity: number) => void
  requestBiometricAccess: () => Promise<boolean>
  startAdaptiveTracking: () => void
  stopAdaptiveTracking: () => void
}

const LivingInterfaceContext = createContext<LivingInterfaceContext | undefined>(undefined)

// Progressive Web App sensor APIs
class SensorManager {
  private deviceMotionSupported = false
  private ambientLightSupported = false
  private vibrationSupported = false
  private biometricsSupported = false

  constructor() {
    this.initializeSensors()
  }

  private initializeSensors() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return

    // Device Motion API
    if ('DeviceMotionEvent' in window) {
      this.deviceMotionSupported = true
    }

    // Ambient Light API
    if ('AmbientLightSensor' in window) {
      this.ambientLightSupported = true
    }

    // Vibration API
    if ('vibrate' in navigator) {
      this.vibrationSupported = true
    }

    // Web Authentication API (WebAuthn) for biometrics
    if ('credentials' in navigator && 'create' in navigator.credentials) {
      this.biometricsSupported = true
    }
  }

  async requestBiometricAccess(): Promise<boolean> {
    if (!this.biometricsSupported) return false

    try {
      // Request biometric authentication (GDPR compliant)
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: "FlowSync", id: "flowsync.app" },
          user: {
            id: new Uint8Array(16),
            name: "user@flowsync.app",
            displayName: "FlowSync User"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      })
      
      return !!credential
    } catch (error) {
      console.log('Biometric access not available:', error)
      return false
    }
  }

  getDeviceMotion(): Promise<DeviceMotionEvent> {
    return new Promise((resolve, reject) => {
      if (!this.deviceMotionSupported) {
        reject(new Error('Device motion not supported'))
        return
      }

      const handler = (event: DeviceMotionEvent) => {
        window.removeEventListener('devicemotion', handler)
        resolve(event)
      }

      window.addEventListener('devicemotion', handler)
      
      // Timeout after 1 second
      setTimeout(() => {
        window.removeEventListener('devicemotion', handler)
        reject(new Error('Device motion timeout'))
      }, 1000)
    })
  }

  vibrate(pattern: number | number[]): boolean {
    if (!this.vibrationSupported) return false
    return navigator.vibrate(pattern)
  }

  async getAmbientLight(): Promise<number> {
    if (!this.ambientLightSupported) {
      throw new Error('Ambient light sensor not supported')
    }

    // @ts-ignore - AmbientLightSensor is experimental
    const sensor = new AmbientLightSensor()
    return new Promise((resolve, reject) => {
      sensor.addEventListener('reading', () => {
        resolve(sensor.illuminance)
        sensor.stop()
      })
      sensor.addEventListener('error', reject)
      sensor.start()
    })
  }
}

class LivingInterface {
  private element: HTMLElement | null = null
  private state: LivingInterfaceState
  private sensorManager: SensorManager
  private updateCallbacks: Set<(state: LivingInterfaceState) => void> = new Set()
  private animationFrame: number | null = null

  constructor() {
    this.sensorManager = new SensorManager()
    this.state = {
      emotionalState: 'neutral',
      energy: 50,
      focus: 50,
      stress: 20,
      interactionMemory: [],
      adaptiveColors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6', 
        accent: '#06b6d4'
      },
      visualEffects: {
        breathing: false,
        pulsing: false,
        glowing: false,
        morphing: false
      }
    }

    this.startLifecycle()
  }

  getState(): LivingInterfaceState {
    return { ...this.state }
  }

  setEmotionalState(emotionalState: EmotionalState) {
    this.state.emotionalState = emotionalState
    this.updateVisualState()
  }

  setUserPreferences(prefs: Partial<LivingInterfaceState>) {
    Object.assign(this.state, prefs)
    this.updateVisualState()
  }

  setElement(element: HTMLElement) {
    this.element = element
    this.updateVisualState()
  }

  recordInteraction(type: InteractionType, intensity: number = 1, element?: string, biometrics?: BiometricData) {
    const interaction: Interaction = {
      type,
      intensity,
      timestamp: Date.now(),
      element,
      biometrics
    }

    this.state.interactionMemory.push(interaction)

    // Keep only last 20 interactions for performance
    if (this.state.interactionMemory.length > 20) {
      this.state.interactionMemory.shift()
    }

    this.updateEmotionalState()
    this.updateVisualState()
    this.notifyCallbacks()

    // Adaptive feedback based on interaction
    this.provideAdaptiveFeedback(type, intensity)
  }

  private updateEmotionalState() {
    const recentInteractions = this.state.interactionMemory.slice(-10)
    const totalIntensity = recentInteractions.reduce((sum, i) => sum + i.intensity, 0)
    const avgIntensity = totalIntensity / Math.max(recentInteractions.length, 1)

    // Update energy based on interaction patterns
    this.state.energy = Math.max(0, Math.min(100, this.state.energy + avgIntensity - 1))

    // Update focus based on interaction consistency
    const timeBetweenInteractions = recentInteractions.length > 1 
      ? recentInteractions[recentInteractions.length - 1].timestamp - recentInteractions[0].timestamp
      : 0
    
    const focusBoost = timeBetweenInteractions > 0 && timeBetweenInteractions < 5000 ? 2 : -1
    this.state.focus = Math.max(0, Math.min(100, this.state.focus + focusBoost))

    // Determine emotional state
    if (this.state.energy > 80 && avgIntensity > 3) {
      this.state.emotionalState = 'excited'
    } else if (this.state.focus > 70 && avgIntensity < 2) {
      this.state.emotionalState = 'focused'
    } else if (this.state.energy < 30) {
      this.state.emotionalState = 'tired'
    } else if (avgIntensity > 4) {
      this.state.emotionalState = 'frustrated'
    } else if (this.state.focus > 60) {
      this.state.emotionalState = 'calm'
    } else {
      this.state.emotionalState = 'neutral'
    }

    this.updateAdaptiveColors()
    this.updateVisualEffects()
  }

  private updateAdaptiveColors() {
    const baseHue = 200 // Blue base
    const hueShift = this.state.energy * 0.8
    const saturation = 50 + (this.state.energy * 0.3)
    const lightness = 50 + (this.state.energy * 0.2)

    // Research-backed productivity colors
    const colors = {
      excited: { primary: '#0000FF', secondary: '#3b82f6', accent: '#06b6d4' },
      focused: { primary: '#2E8B57', secondary: '#10b981', accent: '#059669' },
      calm: { primary: '#5B7C99', secondary: '#64748b', accent: '#475569' },
      frustrated: { primary: '#ef4444', secondary: '#f87171', accent: '#fca5a5' },
      energetic: { primary: '#f59e0b', secondary: '#f97316', accent: '#fbbf24' },
      tired: { primary: '#B6D0E2', secondary: '#94a3b8', accent: '#cbd5e1' },
      neutral: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' }
    }

    this.state.adaptiveColors = colors[this.state.emotionalState] || colors.neutral
  }

  private updateVisualEffects() {
    switch (this.state.emotionalState) {
      case 'excited':
        this.state.visualEffects = {
          breathing: true,
          pulsing: true,
          glowing: true,
          morphing: false
        }
        break
      case 'focused':
        this.state.visualEffects = {
          breathing: true,
          pulsing: false,
          glowing: false,
          morphing: false
        }
        break
      case 'calm':
        this.state.visualEffects = {
          breathing: true,
          pulsing: false,
          glowing: false,
          morphing: false
        }
        break
      case 'frustrated':
        this.state.visualEffects = {
          breathing: false,
          pulsing: true,
          glowing: false,
          morphing: true
        }
        break
      default:
        this.state.visualEffects = {
          breathing: false,
          pulsing: false,
          glowing: false,
          morphing: false
        }
    }
  }

  private updateVisualState() {
    if (!this.element) return

    const { primary, secondary, accent } = this.state.adaptiveColors
    const { breathing, pulsing, glowing } = this.state.visualEffects

    // Apply adaptive colors
    this.element.style.setProperty('--adaptive-primary', primary)
    this.element.style.setProperty('--adaptive-secondary', secondary)
    this.element.style.setProperty('--adaptive-accent', accent)

    // Apply animations based on emotional state
    let animations = []
    
    if (breathing) {
      const duration = this.state.emotionalState === 'excited' ? '2s' : '6s'
      animations.push(`breathing ${duration} ease-in-out infinite`)
    }
    
    if (pulsing) {
      animations.push('pulsing 1s ease-in-out infinite')
    }
    
    if (glowing) {
      animations.push('glowing 3s ease-in-out infinite alternate')
    }

    this.element.style.animation = animations.join(', ')

    // Update background with energy-based HSL
    const hue = 200 + (this.state.energy * 0.8)
    const saturation = 50 + (this.state.energy * 0.3)
    const lightness = 50 + (this.state.energy * 0.2)
    
    this.element.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  private provideAdaptiveFeedback(type: InteractionType, intensity: number) {
    // Haptic feedback for mobile devices
    if (this.sensorManager.vibrate && intensity > 2) {
      this.sensorManager.vibrate([intensity * 10])
    }

    // Visual feedback through subtle color shifts
    if (this.element && intensity > 3) {
      const originalFilter = this.element.style.filter
      this.element.style.filter = 'brightness(1.1) saturate(1.2)'
      
      setTimeout(() => {
        this.element!.style.filter = originalFilter
      }, 150)
    }
  }

  markTaskCompletion(intensity: number) {
    this.recordInteraction('click', intensity, 'task-completion')
    this.state.energy = Math.min(100, this.state.energy + intensity * 2)
    this.state.focus = Math.min(100, this.state.focus + intensity)
    
    // Celebration effects for high-intensity completions
    if (intensity > 4) {
      this.state.visualEffects.glowing = true
      setTimeout(() => {
        this.state.visualEffects.glowing = false
        this.updateVisualState()
      }, 3000)
    }
    
    this.updateVisualState()
    this.notifyCallbacks()
  }

  async requestBiometricAccess(): Promise<boolean> {
    return await this.sensorManager.requestBiometricAccess()
  }

  private startLifecycle() {
    const lifecycle = () => {
      // Gradual energy decay to simulate natural fatigue
      this.state.energy = Math.max(0, this.state.energy - 0.1)
      
      // Focus decay without interaction
      if (Date.now() - (this.state.interactionMemory[this.state.interactionMemory.length - 1]?.timestamp || 0) > 30000) {
        this.state.focus = Math.max(0, this.state.focus - 0.2)
      }

      this.updateEmotionalState()
      this.notifyCallbacks()
      
      if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrame = requestAnimationFrame(lifecycle)
    }
    }
    
    if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrame = requestAnimationFrame(lifecycle)
    }
  }

  subscribe(callback: (state: LivingInterfaceState) => void) {
    this.updateCallbacks.add(callback)
    return () => {
      this.updateCallbacks.delete(callback)
    }
  }

  private notifyCallbacks() {
    this.updateCallbacks.forEach(callback => callback(this.state))
  }

  getAdaptiveStyle(baseStyle: any) {
    return {
      ...baseStyle,
      '--adaptive-primary': this.state.adaptiveColors.primary,
      '--adaptive-secondary': this.state.adaptiveColors.secondary,
      '--adaptive-accent': this.state.adaptiveColors.accent,
      '--energy-level': `${this.state.energy}%`,
      '--focus-level': `${this.state.focus}%`
    }
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    this.updateCallbacks.clear()
  }
}

// Global living interface instance
let livingInterfaceInstance: LivingInterface | null = null

function getLivingInterface(): LivingInterface {
  if (!livingInterfaceInstance) {
    livingInterfaceInstance = new LivingInterface()
  }
  return livingInterfaceInstance
}

export function LivingInterfaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LivingInterfaceState>(getLivingInterface().getState())
  const livingInterface = useRef(getLivingInterface())

  useEffect(() => {
    const unsubscribe = livingInterface.current.subscribe(setState)
    return unsubscribe
  }, [])

  const contextValue: LivingInterfaceContext = {
    state,
    recordInteraction: (type, intensity, element, biometrics) => {
      livingInterface.current.recordInteraction(type, intensity, element, biometrics)
    },
    updateEmotionalState: (emotionalState) => {
      livingInterface.current.setEmotionalState(emotionalState)
    },
    setUserPreferences: (prefs) => {
      livingInterface.current.setUserPreferences(prefs)
    },
    getAdaptiveStyle: (baseStyle) => {
      return livingInterface.current.getAdaptiveStyle(baseStyle)
    },
    markTaskCompletion: (intensity) => {
      livingInterface.current.markTaskCompletion(intensity)
    },
    requestBiometricAccess: () => {
      return livingInterface.current.requestBiometricAccess()
    },
    startAdaptiveTracking: () => {
      // Start sensor monitoring if available
    },
    stopAdaptiveTracking: () => {
      // Stop sensor monitoring
    }
  }

  return (
    <LivingInterfaceContext.Provider value={contextValue}>
      {children}
    </LivingInterfaceContext.Provider>
  )
}

export function useLivingInterface() {
  const context = useContext(LivingInterfaceContext)
  if (!context) {
    throw new Error('useLivingInterface must be used within a LivingInterfaceProvider')
  }
  return context
}

// CSS animations for the living interface
export const LivingInterfaceStyles = `
  @keyframes breathing {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes pulsing {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes glowing {
    0% { box-shadow: 0 0 5px var(--adaptive-accent); }
    100% { box-shadow: 0 0 20px var(--adaptive-accent), 0 0 30px var(--adaptive-accent); }
  }
  
  @keyframes morphing {
    0% { border-radius: 8px; }
    25% { border-radius: 16px; }
    50% { border-radius: 24px; }
    75% { border-radius: 16px; }
    100% { border-radius: 8px; }
  }
  
  .living-interface {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--adaptive-primary);
    border-color: var(--adaptive-secondary);
  }
  
  .living-interface:hover {
    background: var(--adaptive-secondary);
    transform: translateY(-2px);
  }
`

export default LivingInterface