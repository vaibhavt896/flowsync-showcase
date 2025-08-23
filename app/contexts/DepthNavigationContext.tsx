import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'

export type DepthLayer = 0 | 1 | 2 | 3 | 4

export interface DepthState {
  currentDepth: number // 0-4, allows smooth transitions between layers
  targetLayer: DepthLayer
  isTransitioning: boolean
  layerVisibility: Record<DepthLayer, number> // 0-1 opacity for each layer
  focusIntensity: number // 0-1, how focused the user is on current layer
}

interface DepthNavigationContextType {
  depthState: DepthState
  navigateToLayer: (layer: DepthLayer, smooth?: boolean) => void
  adjustDepth: (delta: number) => void
  getLayerTransform: (layer: DepthLayer) => string
  getLayerOpacity: (layer: DepthLayer) => number
  getLayerZIndex: (layer: DepthLayer) => number
  isLayerActive: (layer: DepthLayer) => boolean
  setFocusIntensity: (intensity: number) => void
}

const DepthNavigationContext = createContext<DepthNavigationContextType | undefined>(undefined)

export function useDepthNavigation() {
  const context = useContext(DepthNavigationContext)
  if (!context) {
    throw new Error('useDepthNavigation must be used within a DepthNavigationProvider')
  }
  return context
}

interface DepthNavigationProviderProps {
  children: ReactNode
}

export function DepthNavigationProvider({ children }: DepthNavigationProviderProps) {
  const [depthState, setDepthState] = useState<DepthState>({
    currentDepth: 2, // Start at current session layer
    targetLayer: 2,
    isTransitioning: false,
    layerVisibility: { 0: 0.3, 1: 0.5, 2: 1, 3: 0.7, 4: 0 },
    focusIntensity: 0.8
  })

  const transitionRef = useRef<number>()
  const wheelTimeoutRef = useRef<number>()

  // Smooth depth calculation based on current depth
  const calculateLayerProperties = (currentDepth: number) => {
    const layerVisibility: Record<DepthLayer, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
    
    // Calculate visibility for each layer based on distance from current depth
    for (let layer = 0; layer <= 4; layer++) {
      const distance = Math.abs(layer - currentDepth)
      
      if (distance === 0) {
        layerVisibility[layer as DepthLayer] = 1 // Current layer fully visible
      } else if (distance === 1) {
        layerVisibility[layer as DepthLayer] = 0.6 // Adjacent layers partially visible
      } else if (distance === 2) {
        layerVisibility[layer as DepthLayer] = 0.3 // Near layers slightly visible
      } else {
        layerVisibility[layer as DepthLayer] = 0.1 // Far layers barely visible
      }
    }

    return layerVisibility
  }

  const navigateToLayer = (layer: DepthLayer, smooth: boolean = true) => {
    if (depthState.isTransitioning) return

    setDepthState(prev => ({
      ...prev,
      targetLayer: layer,
      isTransitioning: smooth
    }))

    if (smooth) {
      const startDepth = depthState.currentDepth
      const targetDepth = layer
      const startTime = Date.now()
      const duration = 800 // ms

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Smooth easing function
        const easeInOutCubic = (t: number) => 
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

        const easedProgress = easeInOutCubic(progress)
        const currentDepth = startDepth + (targetDepth - startDepth) * easedProgress
        
        setDepthState(prev => ({
          ...prev,
          currentDepth,
          layerVisibility: calculateLayerProperties(currentDepth),
          isTransitioning: progress < 1
        }))

        if (progress < 1) {
          transitionRef.current = requestAnimationFrame(animate)
        }
      }

      transitionRef.current = requestAnimationFrame(animate)
    } else {
      setDepthState(prev => ({
        ...prev,
        currentDepth: layer,
        layerVisibility: calculateLayerProperties(layer),
        isTransitioning: false
      }))
    }
  }

  const adjustDepth = (delta: number) => {
    const newDepth = Math.max(0, Math.min(4, depthState.currentDepth + delta))
    const newLayer = Math.round(newDepth) as DepthLayer
    
    setDepthState(prev => ({
      ...prev,
      currentDepth: newDepth,
      targetLayer: newLayer,
      layerVisibility: calculateLayerProperties(newDepth)
    }))
  }

  const getLayerTransform = (layer: DepthLayer): string => {
    const depthOffset = (layer - depthState.currentDepth) * 100
    const scale = 1 - Math.abs(layer - depthState.currentDepth) * 0.1
    const blur = Math.abs(layer - depthState.currentDepth) * 2
    
    return `
      translateZ(${depthOffset}px) 
      scale(${Math.max(0.7, scale)})
      ${blur > 0 ? `blur(${Math.min(blur, 8)}px)` : ''}
    `.trim()
  }

  const getLayerOpacity = (layer: DepthLayer): number => {
    return depthState.layerVisibility[layer] || 0
  }

  const getLayerZIndex = (layer: DepthLayer): number => {
    // Higher layers have higher z-index, but current layer gets boost
    const baseZIndex = layer * 100
    const currentBoost = layer === depthState.targetLayer ? 1000 : 0
    return baseZIndex + currentBoost
  }

  const isLayerActive = (layer: DepthLayer): boolean => {
    return Math.abs(layer - depthState.currentDepth) < 0.5
  }

  const setFocusIntensity = (intensity: number) => {
    setDepthState(prev => ({
      ...prev,
      focusIntensity: Math.max(0, Math.min(1, intensity))
    }))
  }

  // Handle wheel/scroll events for depth navigation
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Check if this is a depth navigation gesture (shift + wheel or precision trackpad)
      if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault()
        
        const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY
        const sensitivity = 0.01
        
        adjustDepth(delta * sensitivity)

        // Clear existing timeout
        if (wheelTimeoutRef.current) {
          clearTimeout(wheelTimeoutRef.current)
        }

        // Snap to nearest layer after wheel stops
        wheelTimeoutRef.current = window.setTimeout(() => {
          const nearestLayer = Math.round(depthState.currentDepth) as DepthLayer
          navigateToLayer(nearestLayer, true)
        }, 150)
      }
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
            event.preventDefault()
            navigateToLayer(parseInt(event.key) as DepthLayer)
            break
          case 'ArrowLeft':
            event.preventDefault()
            navigateToLayer(Math.max(0, depthState.targetLayer - 1) as DepthLayer)
            break
          case 'ArrowRight':
            event.preventDefault()
            navigateToLayer(Math.min(4, depthState.targetLayer + 1) as DepthLayer)
            break
        }
      }
    }

    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeyboard)

    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyboard)
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current)
      }
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current)
      }
    }
  }, [depthState.currentDepth, depthState.targetLayer])

  const value: DepthNavigationContextType = {
    depthState,
    navigateToLayer,
    adjustDepth,
    getLayerTransform,
    getLayerOpacity,
    getLayerZIndex,
    isLayerActive,
    setFocusIntensity
  }

  return (
    <DepthNavigationContext.Provider value={value}>
      {children}
    </DepthNavigationContext.Provider>
  )
}

export default DepthNavigationContext