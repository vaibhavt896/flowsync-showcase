/**
 * Typography That Thinks
 * Adaptive type system that morphs based on cognitive load and user state
 */

export interface TypographyMetrics {
  cognitiveLoad: number     // 0-1 (affects font weight)
  sessionDuration: number   // Minutes (affects size for eye fatigue)
  importance: number        // 0-1 (affects weight variation)
  flowState: number        // 0-1 (affects spacing and rhythm)
  breakState: boolean      // Affects line height
  urgency: number          // 0-1 (affects pulse and emphasis)
}

export interface TypographyState {
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  wordSpacing: number
  pulse: boolean
  emphasis: number
}

export class TypographyEngine {
  private baseStyles = {
    headers: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: 0
    },
    body: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0
    },
    data: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: 0.5
    }
  }
  
  private currentMetrics: TypographyMetrics = {
    cognitiveLoad: 0,
    sessionDuration: 0,
    importance: 0.5,
    flowState: 0,
    breakState: false,
    urgency: 0
  }
  
  private animationFrame: number | null = null
  private observers: Map<HTMLElement, { type: string; observer: MutationObserver }> = new Map()
  
  constructor() {
    this.startTypographyEngine()
    this.initializeFontVariables()
  }
  
  /**
   * Update typography metrics
   */
  updateMetrics(newMetrics: Partial<TypographyMetrics>) {
    this.currentMetrics = { ...this.currentMetrics, ...newMetrics }
    this.applyTypographyChanges()
  }
  
  /**
   * Calculate adaptive typography for a given type and element
   */
  calculateTypography(type: 'headers' | 'body' | 'data', importance = 0.5): TypographyState {
    const base = this.baseStyles[type]
    const metrics = this.currentMetrics
    
    // Font size increases to combat eye fatigue (0.5px per hour)
    const fatigueFactor = Math.min(8, metrics.sessionDuration * 0.5)
    let fontSize = base.fontSize + fatigueFactor
    
    // Font weight increases with cognitive load
    let fontWeight = base.fontWeight
    if (type === 'headers') {
      // Variable font morphing based on importance
      fontWeight = this.interpolate(400, 800, importance)
    } else if (type === 'body') {
      // Cognitive load affects body text weight
      fontWeight = base.fontWeight + (metrics.cognitiveLoad * 200)
    } else if (type === 'data') {
      // Monospace expansion during focus
      fontSize = base.fontSize + (metrics.flowState * 2)
    }
    
    // Line height expands during breaks
    let lineHeight = base.lineHeight
    if (metrics.breakState) {
      lineHeight = lineHeight * 1.2
    }
    
    // Letter spacing tightens during flow (increases reading speed)
    let letterSpacing = base.letterSpacing
    if (metrics.flowState > 0.5) {
      letterSpacing = letterSpacing - (metrics.flowState * 0.5)
    }
    
    // Word spacing for better rhythm
    const wordSpacing = metrics.flowState > 0.7 ? 0.1 : 0
    
    // Critical text pulses
    const pulse = metrics.urgency > 0.7 || importance > 0.8
    const emphasis = Math.max(metrics.urgency, importance)
    
    return {
      fontSize,
      fontWeight: Math.round(fontWeight),
      lineHeight,
      letterSpacing,
      wordSpacing,
      pulse,
      emphasis
    }
  }
  
  /**
   * Apply typography changes to document
   */
  private applyTypographyChanges() {
    const root = document.documentElement
    
    // Calculate styles for each type
    const headerStyle = this.calculateTypography('headers', 0.8)
    const bodyStyle = this.calculateTypography('body', 0.5)
    const dataStyle = this.calculateTypography('data', 0.6)
    
    // Apply CSS custom properties
    root.style.setProperty('--font-size-header', `${headerStyle.fontSize}px`)
    root.style.setProperty('--font-weight-header', `${headerStyle.fontWeight}`)
    root.style.setProperty('--line-height-header', `${headerStyle.lineHeight}`)
    root.style.setProperty('--letter-spacing-header', `${headerStyle.letterSpacing}px`)
    
    root.style.setProperty('--font-size-body', `${bodyStyle.fontSize}px`)
    root.style.setProperty('--font-weight-body', `${bodyStyle.fontWeight}`)
    root.style.setProperty('--line-height-body', `${bodyStyle.lineHeight}`)
    root.style.setProperty('--letter-spacing-body', `${bodyStyle.letterSpacing}px`)
    
    root.style.setProperty('--font-size-data', `${dataStyle.fontSize}px`)
    root.style.setProperty('--font-weight-data', `${dataStyle.fontWeight}`)
    root.style.setProperty('--line-height-data', `${dataStyle.lineHeight}`)
    root.style.setProperty('--letter-spacing-data', `${dataStyle.letterSpacing}px`)
    
    // Pulse animation for urgent text
    if (headerStyle.pulse || bodyStyle.pulse || dataStyle.pulse) {
      this.enablePulseAnimation()
    } else {
      this.disablePulseAnimation()
    }
  }
  
  /**
   * Enable subtle pulse animation for critical text
   */
  private enablePulseAnimation() {
    const root = document.documentElement
    root.style.setProperty('--pulse-scale', '1.005') // 0.5% size variation
    root.style.setProperty('--pulse-duration', '2s')
    root.classList.add('typography-pulse')
  }
  
  private disablePulseAnimation() {
    document.documentElement.classList.remove('typography-pulse')
  }
  
  /**
   * Register an element for automatic typography adaptation
   */
  registerElement(element: HTMLElement, type: 'headers' | 'body' | 'data', importance = 0.5) {
    // Apply initial styles
    this.applyElementStyles(element, type, importance)
    
    // Watch for changes
    const observer = new MutationObserver(() => {
      this.applyElementStyles(element, type, importance)
    })
    
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true
    })
    
    this.observers.set(element, { type, observer })
  }
  
  /**
   * Unregister an element
   */
  unregisterElement(element: HTMLElement) {
    const entry = this.observers.get(element)
    if (entry) {
      entry.observer.disconnect()
      this.observers.delete(element)
    }
  }
  
  /**
   * Apply styles to specific element
   */
  private applyElementStyles(element: HTMLElement, type: 'headers' | 'body' | 'data', importance: number) {
    const typography = this.calculateTypography(type, importance)
    
    element.style.fontSize = `${typography.fontSize}px`
    element.style.fontWeight = `${typography.fontWeight}`
    element.style.lineHeight = `${typography.lineHeight}`
    element.style.letterSpacing = `${typography.letterSpacing}px`
    element.style.wordSpacing = `${typography.wordSpacing}em`
    
    // Add transition for smooth changes
    element.style.transition = 'font-size 0.3s ease, font-weight 0.3s ease, line-height 0.3s ease, letter-spacing 0.3s ease'
    
    // Apply pulse class if needed
    if (typography.pulse) {
      element.classList.add('typography-pulse')
    } else {
      element.classList.remove('typography-pulse')
    }
    
    // Set importance as data attribute for CSS targeting
    element.setAttribute('data-typography-importance', importance.toString())
  }
  
  /**
   * Initialize CSS variables and keyframes
   */
  private initializeFontVariables() {
    // Create CSS for typography system
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --font-size-header: 24px;
        --font-weight-header: 600;
        --line-height-header: 1.2;
        --letter-spacing-header: 0px;
        
        --font-size-body: 16px;
        --font-weight-body: 400;
        --line-height-body: 1.5;
        --letter-spacing-body: 0px;
        
        --font-size-data: 14px;
        --font-weight-data: 500;
        --line-height-data: 1.4;
        --letter-spacing-data: 0.5px;
        
        --pulse-scale: 1;
        --pulse-duration: 2s;
      }
      
      .typography-header {
        font-size: var(--font-size-header);
        font-weight: var(--font-weight-header);
        line-height: var(--line-height-header);
        letter-spacing: var(--letter-spacing-header);
      }
      
      .typography-body {
        font-size: var(--font-size-body);
        font-weight: var(--font-weight-body);
        line-height: var(--line-height-body);
        letter-spacing: var(--letter-spacing-body);
      }
      
      .typography-data {
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        font-size: var(--font-size-data);
        font-weight: var(--font-weight-data);
        line-height: var(--line-height-data);
        letter-spacing: var(--letter-spacing-data);
      }
      
      .typography-pulse {
        animation: typography-pulse var(--pulse-duration) ease-in-out infinite alternate;
      }
      
      @keyframes typography-pulse {
        from { transform: scale(1); }
        to { transform: scale(var(--pulse-scale)); }
      }
      
      /* Variable font support */
      @supports (font-variation-settings: normal) {
        .typography-header {
          font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
          font-variation-settings: 'wght' var(--font-weight-header);
        }
      }
      
      /* Adaptive typography classes */
      .adaptive-header { @apply typography-header; }
      .adaptive-body { @apply typography-body; }
      .adaptive-data { @apply typography-data; }
      
      /* Importance-based variations */
      [data-typography-importance="1"] {
        font-weight: 700;
        text-shadow: 0 0 1px currentColor;
      }
      
      [data-typography-importance="0"] {
        opacity: 0.8;
        font-weight: 300;
      }
      
      /* Flow state optimizations */
      .flow-optimized {
        letter-spacing: -0.02em;
        word-spacing: 0.05em;
        line-height: 1.4;
      }
      
      /* Break state relaxation */
      .break-relaxed {
        line-height: 1.8;
        letter-spacing: 0.02em;
      }
    `
    
    document.head.appendChild(style)
  }
  
  /**
   * Start the typography engine
   */
  private startTypographyEngine() {
    const updateTypography = () => {
      // Auto-detect cognitive load based on activity
      this.autoDetectCognitiveLoad()
      
      // Update typography every frame for smooth transitions
      this.applyTypographyChanges()
      
      this.animationFrame = requestAnimationFrame(updateTypography)
    }
    
    updateTypography()
  }
  
  /**
   * Auto-detect cognitive load from user interaction patterns
   */
  private autoDetectCognitiveLoad() {
    // Measure typing speed, mouse movement, etc.
    // This is a simplified implementation
    const now = Date.now()
    
    // Check for rapid interactions (high cognitive load)
    const recentInteractions = this.getRecentInteractionCount()
    const cognitiveLoad = Math.min(1, recentInteractions / 10)
    
    this.currentMetrics.cognitiveLoad = cognitiveLoad
  }
  
  private interactionTimes: number[] = []
  
  private getRecentInteractionCount(): number {
    const now = Date.now()
    const fiveSecondsAgo = now - 5000
    
    // Clean old interactions
    this.interactionTimes = this.interactionTimes.filter(time => time > fiveSecondsAgo)
    
    return this.interactionTimes.length
  }
  
  /**
   * Track user interactions for cognitive load detection
   */
  trackInteraction() {
    this.interactionTimes.push(Date.now())
  }
  
  /**
   * Get reading speed optimization for current flow state
   */
  getReadingOptimization(): string {
    if (this.currentMetrics.flowState > 0.7) {
      return 'flow-optimized'
    } else if (this.currentMetrics.breakState) {
      return 'break-relaxed'
    }
    return ''
  }
  
  /**
   * Interpolate between two values
   */
  private interpolate(start: number, end: number, factor: number): number {
    return start + (end - start) * Math.max(0, Math.min(1, factor))
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    
    this.observers.forEach(({ observer }) => observer.disconnect())
    this.observers.clear()
  }
}

import { useRef, useEffect } from 'react'

/**
 * React hook for adaptive typography
 */
export function useAdaptiveTypography(
  type: 'headers' | 'body' | 'data',
  importance = 0.5,
  dependencies: any[] = []
) {
  const elementRef = useRef<HTMLElement>(null)
  const engineRef = useRef<TypographyEngine | null>(null)
  
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new TypographyEngine()
    }
    
    const element = elementRef.current
    if (element && engineRef.current) {
      engineRef.current.registerElement(element, type, importance)
      
      return () => {
        if (engineRef.current) {
          engineRef.current.unregisterElement(element)
        }
      }
    }
  }, [type, importance, ...dependencies])
  
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy()
      }
    }
  }, [])
  
  const updateMetrics = (metrics: Partial<TypographyMetrics>) => {
    if (engineRef.current) {
      engineRef.current.updateMetrics(metrics)
    }
  }
  
  const trackInteraction = () => {
    if (engineRef.current) {
      engineRef.current.trackInteraction()
    }
  }
  
  return {
    ref: elementRef,
    updateMetrics,
    trackInteraction,
    className: `adaptive-${type}`
  }
}