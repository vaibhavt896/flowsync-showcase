import { motion, MotionValue, useMotionValue, useTransform } from 'framer-motion'

export interface FlipElementData {
  element: HTMLElement
  bounds: DOMRect
  computedStyle: CSSStyleDeclaration
}

export interface FlipTransformation {
  x: number
  y: number
  scaleX: number
  scaleY: number
  opacity: number
}

/**
 * Captures the current state of an element for FLIP animations
 */
export function captureElementState(element: HTMLElement): FlipElementData {
  return {
    element,
    bounds: element.getBoundingClientRect(),
    computedStyle: window.getComputedStyle(element)
  }
}

/**
 * Calculates the transformation needed to morph from one element state to another
 */
export function calculateFlipTransformation(
  from: FlipElementData,
  to: FlipElementData
): FlipTransformation {
  const deltaX = from.bounds.left - to.bounds.left
  const deltaY = from.bounds.top - to.bounds.top
  const scaleX = from.bounds.width / to.bounds.width
  const scaleY = from.bounds.height / to.bounds.height

  return {
    x: deltaX,
    y: deltaY,
    scaleX,
    scaleY,
    opacity: 1
  }
}

/**
 * Creates a morph transition between two geometric shapes
 */
export function createMorphTransition(
  progress: MotionValue<number>,
  fromShape: { width: number; height: number; borderRadius: number },
  toShape: { width: number; height: number; borderRadius: number }
) {
  const width = useTransform(progress, [0, 1], [fromShape.width, toShape.width])
  const height = useTransform(progress, [0, 1], [fromShape.height, toShape.height])
  const borderRadius = useTransform(progress, [0, 1], [fromShape.borderRadius, toShape.borderRadius])

  return { width, height, borderRadius }
}

/**
 * Physics-based spring configuration for organic feeling transitions
 */
export const organicSpring = {
  type: "spring" as const,
  damping: 25,
  stiffness: 120,
  mass: 1.2
}

/**
 * Liquid-like morphing animation with multiple keyframes
 */
export const liquidMorph = {
  type: "keyframes" as const,
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94],
  times: [0, 0.3, 0.7, 1]
}

/**
 * Creates a breathing-like pulsing effect
 */
export function createBreathingScale(baseScale = 1, intensity = 0.1, duration = 4) {
  return {
    scale: [baseScale, baseScale + intensity, baseScale],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

/**
 * Timer ring expansion to circular chart transformation
 */
export function createTimerToAnalyticsTransition(progress: MotionValue<number>) {
  // Transform from timer ring to analytics charts
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.5, 3])
  const rotate = useTransform(progress, [0, 1], [0, 180])
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [1, 0.8, 0.9, 1])
  const blur = useTransform(progress, [0, 0.5, 1], [0, 4, 0])

  return {
    scale,
    rotate,
    opacity,
    filter: useTransform(blur, (v) => `blur(${v}px)`),
    borderRadius: useTransform(progress, [0, 1], ["50%", "16px"])
  }
}

/**
 * Settings panel liquification effect
 */
export function createSettingsLiquifyTransition(progress: MotionValue<number>) {
  // Liquify settings panel back into timer
  const scaleX = useTransform(progress, [0, 0.4, 0.8, 1], [1, 1.2, 0.8, 1])
  const scaleY = useTransform(progress, [0, 0.3, 0.7, 1], [1, 0.9, 1.1, 1])
  const skewX = useTransform(progress, [0, 0.5, 1], [0, -5, 0])
  const borderRadius = useTransform(progress, [0, 0.6, 1], ["12px", "50%", "50%"])

  return {
    scaleX,
    scaleY,
    skewX,
    borderRadius,
    transformOrigin: "center center"
  }
}

/**
 * Organic morphing path for SVG elements
 */
export function createOrganicPath(
  progress: MotionValue<number>,
  fromPath: string,
  toPath: string,
  intensity = 1
) {
  // For now, we'll use opacity and scale as SVG path morphing is complex
  // In a real implementation, you'd use libraries like flubber for path interpolation
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1 + (0.2 * intensity), 1])
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [1, 0.8, 0.8, 1])

  return {
    scale,
    opacity,
    transition: liquidMorph
  }
}

/**
 * Responsive organism-like navigation behavior
 */
export function createOrganismicNavigation(activeProgress: MotionValue<number>) {
  const pulse = useTransform(activeProgress, [0, 1], [1, 1.1])
  const glow = useTransform(activeProgress, [0, 1], [0, 20])
  const warmth = useTransform(activeProgress, [0, 1], [1, 1.2])

  return {
    scale: pulse,
    filter: useTransform(glow, (v) => `drop-shadow(0 0 ${v}px rgba(59, 130, 246, 0.6))`),
    saturate: warmth
  }
}

/**
 * Utility to create smooth easing curves for organic motion
 */
export const organicEasing = {
  gentle: [0.25, 0.46, 0.45, 0.94],
  energetic: [0.68, -0.55, 0.265, 1.55],
  liquid: [0.19, 1, 0.22, 1],
  bounce: [0.68, -0.6, 0.32, 1.6]
}

/**
 * Creates a staggered animation for multiple elements
 */
export function createStaggeredMorph(
  elements: HTMLElement[],
  delay = 0.1,
  duration = 0.6
) {
  return elements.map((_, index) => ({
    transition: {
      ...organicSpring,
      delay: index * delay,
      duration
    }
  }))
}