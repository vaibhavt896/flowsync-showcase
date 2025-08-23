/**
 * Adaptive Chromatics - Intelligent Color Psychology System
 * Colors that think and adapt to user state and environment
 */

export interface HSLColor {
  h: number // hue (0-360)
  s: number // saturation (0-100)
  l: number // lightness (0-100)
  a?: number // alpha (0-1)
}

export interface ColorState {
  base: HSLColor
  current: HSLColor
  target: HSLColor
  animating: boolean
}

// Base color palette for different states
export const BasePalette: Record<string, HSLColor> = {
  focus: { h: 200, s: 70, l: 50 },    // Deep ocean blue - promotes concentration
  flow: { h: 280, s: 60, l: 60 },     // Deep purple - creativity without stimulation
  break: { h: 140, s: 40, l: 50 },    // Sage green - restoration
  alert: { h: 30, s: 70, l: 55 },     // Warm amber - attention without alarm
  success: { h: 120, s: 50, l: 45 },  // Natural green - achievement
  warning: { h: 45, s: 80, l: 60 },   // Attention yellow
  error: { h: 0, s: 65, l: 55 },      // Soft red - non-alarming
}

// Dynamic adjustment factors
export interface ChromaticFactors {
  sessionLength: number      // 0-1 (affects saturation)
  timeOfDay: number         // 0-24 (affects hue shift)
  productivity: number      // -1 to 1 (affects warmth)
  flowState: number        // 0-1 (affects contrast and shimmer)
  ambientLight: number     // 0-1 (affects brightness)
  cognitiveLoad: number    // 0-1 (affects intensity)
  batteryLevel: number     // 0-1 (affects complexity)
  networkSpeed: number     // 0-1 (affects effects)
}

export class AdaptiveChromatics {
  private colorStates: Map<string, ColorState> = new Map()
  private factors: ChromaticFactors
  private animationFrame: number | null = null
  
  constructor(initialFactors: Partial<ChromaticFactors> = {}) {
    this.factors = {
      sessionLength: 0,
      timeOfDay: new Date().getHours(),
      productivity: 0,
      flowState: 0,
      ambientLight: 0.5,
      cognitiveLoad: 0,
      batteryLevel: 1,
      networkSpeed: 1,
      ...initialFactors
    }
    
    this.initializeColorStates()
    this.startColorAnimation()
  }
  
  private initializeColorStates() {
    Object.entries(BasePalette).forEach(([key, baseColor]) => {
      this.colorStates.set(key, {
        base: { ...baseColor },
        current: { ...baseColor },
        target: { ...baseColor },
        animating: false
      })
    })
  }
  
  /**
   * Update environmental factors
   */
  updateFactors(newFactors: Partial<ChromaticFactors>) {
    this.factors = { ...this.factors, ...newFactors }
    this.recalculateAllColors()
  }
  
  /**
   * Get adaptive color for a given state
   */
  getColor(stateName: string): string {
    const colorState = this.colorStates.get(stateName)
    if (!colorState) return this.hslToString(BasePalette.focus)
    
    return this.hslToString(colorState.current)
  }
  
  /**
   * Get color with specific opacity
   */
  getColorWithOpacity(stateName: string, opacity: number): string {
    const colorState = this.colorStates.get(stateName)
    if (!colorState) return this.hslaToString({ ...BasePalette.focus, a: opacity })
    
    return this.hslaToString({ ...colorState.current, a: opacity })
  }
  
  /**
   * Get gradient between two states
   */
  getGradient(fromState: string, toState: string, direction: string = 'to right'): string {
    const fromColor = this.getColor(fromState)
    const toColor = this.getColor(toState)
    return `linear-gradient(${direction}, ${fromColor}, ${toColor})`
  }
  
  /**
   * Get shimmer effect for flow states
   */
  getFlowShimmer(): string {
    if (this.factors.flowState < 0.7) return 'none'
    
    const colors = ['focus', 'flow', 'success'].map(state => this.getColor(state))
    return `linear-gradient(45deg, ${colors.join(', ')})`
  }
  
  /**
   * Recalculate all colors based on current factors
   */
  private recalculateAllColors() {
    this.colorStates.forEach((colorState, stateName) => {
      const newTarget = this.calculateAdaptiveColor(colorState.base, stateName)
      
      if (!this.colorsEqual(colorState.target, newTarget)) {
        colorState.target = newTarget
        colorState.animating = true
      }
    })
  }
  
  /**
   * Calculate adaptive color based on current factors
   */
  private calculateAdaptiveColor(baseColor: HSLColor, stateName: string): HSLColor {
    let { h, s, l } = baseColor
    
    // Time of day hue shift (±15°)
    const timeShift = Math.sin((this.factors.timeOfDay / 24) * Math.PI * 2) * 15
    h = (h + timeShift + 360) % 360
    
    // Productivity affects warmth
    if (this.factors.productivity > 0) {
      h = (h + this.factors.productivity * 10 + 360) % 360 // Warmer
    } else {
      h = (h + this.factors.productivity * 10 + 360) % 360 // Cooler
    }
    
    // Session length affects saturation (prevents fatigue)
    s = Math.max(20, s * (1 - this.factors.sessionLength * 0.3))
    
    // Ambient light affects brightness
    l = Math.max(20, Math.min(80, l + (this.factors.ambientLight - 0.5) * 20))
    
    // Flow state increases contrast
    if (this.factors.flowState > 0.5) {
      s = Math.min(90, s * (1 + this.factors.flowState * 0.2))
    }
    
    // Cognitive load affects intensity
    const intensityMultiplier = 1 + (this.factors.cognitiveLoad * 0.15)
    s = Math.min(100, s * intensityMultiplier)
    
    // Battery level affects complexity (simpler colors on low battery)
    if (this.factors.batteryLevel < 0.3) {
      s = s * 0.7
      l = l * 0.9
    }
    
    return { h: Math.round(h), s: Math.round(s), l: Math.round(l) }
  }
  
  /**
   * Animate color transitions
   */
  private startColorAnimation() {
    const animate = () => {
      let anyAnimating = false
      
      this.colorStates.forEach(colorState => {
        if (colorState.animating) {
          anyAnimating = true
          
          // Smooth interpolation towards target
          const speed = 0.05
          colorState.current.h = this.lerpAngle(colorState.current.h, colorState.target.h, speed)
          colorState.current.s = this.lerp(colorState.current.s, colorState.target.s, speed)
          colorState.current.l = this.lerp(colorState.current.l, colorState.target.l, speed)
          
          // Check if animation is complete
          if (this.colorsEqual(colorState.current, colorState.target, 1)) {
            colorState.animating = false
          }
        }
      })
      
      if (anyAnimating) {
        this.animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animate()
  }
  
  /**
   * Linear interpolation
   */
  private lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }
  
  /**
   * Circular interpolation for hue (handles 0-360 wrap)
   */
  private lerpAngle(start: number, end: number, factor: number): number {
    const diff = ((end - start + 540) % 360) - 180
    return (start + diff * factor + 360) % 360
  }
  
  /**
   * Check if two colors are equal within tolerance
   */
  private colorsEqual(a: HSLColor, b: HSLColor, tolerance: number = 0.5): boolean {
    return Math.abs(a.h - b.h) < tolerance &&
           Math.abs(a.s - b.s) < tolerance &&
           Math.abs(a.l - b.l) < tolerance
  }
  
  /**
   * Convert HSL to CSS string
   */
  private hslToString(color: HSLColor): string {
    return `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`
  }
  
  /**
   * Convert HSLA to CSS string
   */
  private hslaToString(color: HSLColor): string {
    const alpha = color.a !== undefined ? color.a : 1
    return `hsla(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%, ${alpha})`
  }
  
  /**
   * Get CSS custom properties for current color scheme
   */
  getCSSCustomProperties(): Record<string, string> {
    const properties: Record<string, string> = {}
    
    this.colorStates.forEach((colorState, stateName) => {
      properties[`--color-${stateName}`] = this.hslToString(colorState.current)
      properties[`--color-${stateName}-h`] = String(Math.round(colorState.current.h))
      properties[`--color-${stateName}-s`] = String(Math.round(colorState.current.s))
      properties[`--color-${stateName}-l`] = String(Math.round(colorState.current.l))
    })
    
    // Special gradient properties
    properties['--gradient-flow'] = this.getFlowShimmer()
    properties['--gradient-primary'] = this.getGradient('focus', 'flow')
    properties['--gradient-success'] = this.getGradient('success', 'focus')
    
    return properties
  }
  
  /**
   * Apply colors to document root
   */
  applyToDocument() {
    const properties = this.getCSSCustomProperties()
    const root = document.documentElement
    
    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }
  
  /**
   * Detect ambient light (if supported)
   */
  async detectAmbientLight(): Promise<number> {
    try {
      // @ts-ignore - Experimental API
      if ('AmbientLightSensor' in window) {
        // @ts-ignore
        const sensor = new AmbientLightSensor({ frequency: 0.5 })
        
        return new Promise((resolve) => {
          // @ts-ignore
          sensor.addEventListener('reading', () => {
            // @ts-ignore
            const lux = sensor.illuminance
            // Convert lux to 0-1 range (0-1000 lux typical indoor range)
            const normalized = Math.min(1, Math.max(0, lux / 1000))
            resolve(normalized)
          })
          // @ts-ignore
          sensor.start()
          
          // Fallback after 2 seconds
          setTimeout(() => resolve(0.5), 2000)
        })
      }
    } catch (error) {
      console.warn('Ambient light detection not supported')
    }
    
    // Fallback: estimate based on time of day
    const hour = new Date().getHours()
    if (hour >= 6 && hour <= 8) return 0.3  // Dawn
    if (hour >= 9 && hour <= 17) return 0.8 // Day
    if (hour >= 18 && hour <= 20) return 0.4 // Dusk
    return 0.1 // Night
  }
  
  /**
   * Get battery level (if supported)
   */
  async getBatteryLevel(): Promise<number> {
    try {
      // @ts-ignore
      if ('getBattery' in navigator) {
        // @ts-ignore
        const battery = await navigator.getBattery()
        return battery.level
      }
    } catch (error) {
      console.warn('Battery API not supported')
    }
    return 1 // Assume full battery
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  }
}