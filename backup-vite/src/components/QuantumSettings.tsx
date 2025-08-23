/**
 * Quantum Settings™
 * Settings exist in superposition - they come to you, not the other way around
 * Long-press any element to see its orbital controls
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { SpringConstants, calculateSpring } from '@/systems/physicsEngine'
import { AdaptiveChromatics } from '@/systems/adaptiveChromatics'
import { useUserStore } from '@/stores/userStore'
import { useThemeStore } from '@/stores/themeStore'

interface QuantumControl {
  id: string
  label: string
  icon: React.ReactNode
  type: 'toggle' | 'slider' | 'select' | 'action'
  value?: any
  options?: { label: string; value: any }[]
  onChange?: (value: any) => void
  onAction?: () => void
  description?: string
}

interface QuantumSettingsState {
  isOpen: boolean
  targetElement: HTMLElement | null
  controls: QuantumControl[]
  position: { x: number; y: number }
  elementBounds: DOMRect | null
}

// Global state for quantum settings
let quantumSettingsInstance: QuantumSettingsManager | null = null

class QuantumSettingsManager {
  private subscribers: Set<(state: QuantumSettingsState) => void> = new Set()
  private state: QuantumSettingsState = {
    isOpen: false,
    targetElement: null,
    controls: [],
    position: { x: 0, y: 0 },
    elementBounds: null
  }
  
  private longPressTimer: NodeJS.Timeout | null = null
  private chromatics = new AdaptiveChromatics()
  
  subscribe(callback: (state: QuantumSettingsState) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }
  
  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state))
  }
  
  openQuantumSettings(element: HTMLElement, controls: QuantumControl[]) {
    const bounds = element.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    
    this.state = {
      isOpen: true,
      targetElement: element,
      controls,
      position: { x: centerX, y: centerY },
      elementBounds: bounds
    }
    
    this.notifySubscribers()
  }
  
  closeQuantumSettings() {
    this.state = {
      ...this.state,
      isOpen: false,
      targetElement: null,
      controls: [],
      elementBounds: null
    }
    
    this.notifySubscribers()
  }
  
  startLongPress(element: HTMLElement, controls: QuantumControl[]) {
    this.clearLongPress()
    
    // Add visual feedback immediately
    element.style.transform = 'scale(0.98)'
    element.style.filter = 'brightness(1.1)'
    
    this.longPressTimer = setTimeout(() => {
      // Haptic feedback (if supported)
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      this.openQuantumSettings(element, controls)
    }, 500) // 500ms long press
  }
  
  clearLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }
  
  getChromatics() {
    return this.chromatics
  }
}

// Initialize global instance
if (!quantumSettingsInstance) {
  quantumSettingsInstance = new QuantumSettingsManager()
}

/**
 * Hook to make any element quantum-enabled
 */
export function useQuantumSettings(controls: QuantumControl[]) {
  const elementRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element || !quantumSettingsInstance) return
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click only
        quantumSettingsInstance!.startLongPress(element, controls)
      }
    }
    
    const handleMouseUp = () => {
      quantumSettingsInstance!.clearLongPress()
      // Reset visual feedback
      element.style.transform = ''
      element.style.filter = ''
    }
    
    const handleMouseLeave = handleMouseUp
    
    const handleTouchStart = (e: TouchEvent) => {
      quantumSettingsInstance!.startLongPress(element, controls)
    }
    
    const handleTouchEnd = handleMouseUp
    
    // Prevent context menu on long press
    const handleContextMenu = (e: Event) => {
      e.preventDefault()
    }
    
    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mouseup', handleMouseUp)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd)
    element.addEventListener('contextmenu', handleContextMenu)
    
    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mouseup', handleMouseUp)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [controls])
  
  return elementRef
}

/**
 * Main Quantum Settings Overlay Component
 */
export default function QuantumSettings() {
  const [state, setState] = useState<QuantumSettingsState>({
    isOpen: false,
    targetElement: null,
    controls: [],
    position: { x: 0, y: 0 },
    elementBounds: null
  })
  
  useEffect(() => {
    if (!quantumSettingsInstance) return
    
    return quantumSettingsInstance.subscribe(setState)
  }, [])
  
  // Close on escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen) {
        quantumSettingsInstance?.closeQuantumSettings()
      }
    }
    
    const handleClickOutside = (e: MouseEvent) => {
      if (state.isOpen && e.target !== state.targetElement) {
        quantumSettingsInstance?.closeQuantumSettings()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [state.isOpen, state.targetElement])
  
  if (!state.isOpen) return null
  
  return createPortal(
    <QuantumOrbit
      position={state.position}
      controls={state.controls}
      elementBounds={state.elementBounds}
      onClose={() => quantumSettingsInstance?.closeQuantumSettings()}
    />,
    document.body
  )
}

/**
 * The orbital controls interface
 */
function QuantumOrbit({ 
  position, 
  controls, 
  elementBounds, 
  onClose 
}: {
  position: { x: number; y: number }
  controls: QuantumControl[]
  elementBounds: DOMRect | null
  onClose: () => void
}) {
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({})
  const [isCommitted, setIsCommitted] = useState(false)
  
  const centerX = useMotionValue(position.x)
  const centerY = useMotionValue(position.y)
  
  // Create orbital positions for controls
  const orbitRadius = Math.max(100, Math.min(150, controls.length * 20))
  const angleStep = (Math.PI * 2) / Math.max(controls.length, 3)
  
  const handleControlChange = (controlId: string, value: any) => {
    setPreviewValues(prev => ({ ...prev, [controlId]: value }))
  }
  
  const commitChanges = () => {
    Object.entries(previewValues).forEach(([controlId, value]) => {
      const control = controls.find(c => c.id === controlId)
      if (control?.onChange) {
        control.onChange(value)
      }
    })
    setIsCommitted(true)
    setTimeout(onClose, 300) // Brief success animation
  }
  
  const discardChanges = () => {
    setPreviewValues({})
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Quantum field background */}
      <motion.div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={discardChanges}
      />
      
      {/* Target element highlight */}
      {elementBounds && (
        <motion.div
          className="absolute border-2 border-blue-400/50 rounded-lg pointer-events-none"
          style={{
            left: elementBounds.left - 4,
            top: elementBounds.top - 4,
            width: elementBounds.width + 8,
            height: elementBounds.height + 8,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          }}
          transition={calculateSpring(SpringConstants.quantum)}
        />
      )}
      
      {/* Central quantum core */}
      <motion.div
        className="absolute w-8 h-8 pointer-events-auto"
        style={{
          left: position.x - 16,
          top: position.y - 16,
        }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          rotate: 360
        }}
        exit={{ scale: 0 }}
        transition={{
          scale: calculateSpring(SpringConstants.quantum),
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg">
          <div className="absolute inset-1 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full animate-pulse" />
        </div>
      </motion.div>
      
      {/* Orbital controls */}
      <AnimatePresence>
        {controls.map((control, index) => {
          const angle = index * angleStep - Math.PI / 2 // Start from top
          const x = position.x + Math.cos(angle) * orbitRadius
          const y = position.y + Math.sin(angle) * orbitRadius
          
          return (
            <QuantumControl
              key={control.id}
              control={control}
              position={{ x, y }}
              angle={angle}
              index={index}
              previewValue={previewValues[control.id]}
              onChange={(value) => handleControlChange(control.id, value)}
            />
          )
        })}
      </AnimatePresence>
      
      {/* Commit/Discard actions */}
      {Object.keys(previewValues).length > 0 && (
        <motion.div
          className="absolute pointer-events-auto"
          style={{
            left: position.x - 80,
            top: position.y + orbitRadius + 60,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={calculateSpring(SpringConstants.quantum)}
        >
          <div className="flex gap-3 bg-white/10 backdrop-blur-xl rounded-full p-2 border border-white/20">
            <motion.button
              className="px-4 py-2 bg-green-500/80 text-white rounded-full text-sm font-medium"
              onClick={commitChanges}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 0.9)' }}
              whileTap={{ scale: 0.95 }}
            >
              ✓ Apply
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-red-500/80 text-white rounded-full text-sm font-medium"
              onClick={discardChanges}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.9)' }}
              whileTap={{ scale: 0.95 }}
            >
              ✕ Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* Success confirmation */}
      {isCommitted && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: position.x - 50,
            top: position.y - 50,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 360],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
            ✓
          </div>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Individual quantum control in orbit
 */
function QuantumControl({
  control,
  position,
  angle,
  index,
  previewValue,
  onChange
}: {
  control: QuantumControl
  position: { x: number; y: number }
  angle: number
  index: number
  previewValue?: any
  onChange: (value: any) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const currentValue = previewValue !== undefined ? previewValue : control.value
  
  const renderControlInput = () => {
    switch (control.type) {
      case 'toggle':
        return (
          <motion.button
            className={`w-8 h-4 rounded-full transition-colors ${
              currentValue ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            onClick={() => onChange(!currentValue)}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{ x: currentValue ? 18 : 2 }}
              transition={calculateSpring(SpringConstants.quantum)}
            />
          </motion.button>
        )
      
      case 'slider':
        return (
          <input
            type="range"
            min="0"
            max="100"
            value={currentValue || 50}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-16 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
        )
      
      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/10 text-white text-xs rounded px-2 py-1 border border-white/20"
          >
            {control.options?.map(option => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'action':
        return (
          <motion.button
            className="px-3 py-1 bg-blue-500/80 text-white rounded text-xs"
            onClick={control.onAction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {control.label}
          </motion.button>
        )
    }
  }
  
  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        left: position.x - 40,
        top: position.y - 40,
      }}
      initial={{ 
        scale: 0, 
        rotate: -angle * (180 / Math.PI),
        opacity: 0 
      }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        opacity: 1 
      }}
      exit={{ 
        scale: 0, 
        opacity: 0 
      }}
      transition={{
        ...calculateSpring(SpringConstants.quantum),
        delay: index * 0.1
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Control container */}
        <motion.div
          className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center shadow-lg"
          animate={{
            scale: isHovered ? 1.1 : 1,
            boxShadow: isHovered 
              ? '0 0 30px rgba(59, 130, 246, 0.4)' 
              : '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}
          transition={calculateSpring(SpringConstants.quantum)}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="text-white/80 text-xs">{control.icon}</div>
            {renderControlInput()}
          </div>
        </motion.div>
        
        {/* Label */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/60 whitespace-nowrap"
          animate={{ opacity: isHovered ? 1 : 0.6 }}
        >
          {control.label}
        </motion.div>
        
        {/* Description tooltip */}
        {isHovered && control.description && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={calculateSpring(SpringConstants.quantum)}
          >
            {control.description}
          </motion.div>
        )}
        
        {/* Orbit trail */}
        <motion.div
          className="absolute inset-0 border border-blue-400/20 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  )
}