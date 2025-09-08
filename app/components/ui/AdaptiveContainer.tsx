'use client'

import React, { useEffect, useRef, ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { useLivingInterface } from '@/systems/LivingInterface'
import { AppleLiquidGlass } from './AppleLiquidGlass'

interface AdaptiveContainerProps {
  children: ReactNode
  className?: string
  trackInteractions?: boolean
  adaptToEmotions?: boolean
  priority?: 'high' | 'medium' | 'low'
}

export function AdaptiveContainer({ 
  children, 
  className = '',
  trackInteractions = true,
  adaptToEmotions = true,
  priority = 'medium'
}: AdaptiveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { state, recordInteraction, getAdaptiveStyle } = useLivingInterface()

  useEffect(() => {
    if (!trackInteractions || !containerRef.current) return

    const element = containerRef.current

    const handleClick = (e: MouseEvent) => {
      const intensity = priority === 'high' ? 4 : priority === 'medium' ? 2 : 1
      recordInteraction('click', intensity, 'adaptive-container')
    }

    const handleHover = () => {
      recordInteraction('hover', 1, 'adaptive-container')
    }

    const handleFocus = () => {
      recordInteraction('focus', 2, 'adaptive-container')
    }

    element.addEventListener('click', handleClick)
    element.addEventListener('mouseenter', handleHover)
    element.addEventListener('focus', handleFocus)

    return () => {
      element.removeEventListener('click', handleClick)
      element.removeEventListener('mouseenter', handleHover)
      element.removeEventListener('focus', handleFocus)
    }
  }, [trackInteractions, priority, recordInteraction])

  const adaptiveStyles = adaptToEmotions ? getAdaptiveStyle({}) : {}

  const getAnimationVariants = () => {
    switch (state.emotionalState) {
      case 'excited':
        return {
          initial: { scale: 0.95, opacity: 0.8 },
          animate: { 
            scale: [0.95, 1.02, 1],
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" as const }
          }
        }
      case 'focused':
        return {
          initial: { opacity: 0.9 },
          animate: { 
            opacity: 1,
            transition: { duration: 1.2, ease: "easeInOut" as const }
          }
        }
      case 'calm':
        return {
          initial: { y: 10, opacity: 0.8 },
          animate: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" as const }
          }
        }
      case 'frustrated':
        return {
          initial: { x: -5, opacity: 0.9 },
          animate: { 
            x: 0, 
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" as const }
          }
        }
      default:
        return {
          initial: { opacity: 0.95 },
          animate: { opacity: 1 }
        }
    }
  }

  return (
    <motion.div
      ref={containerRef}
      className={`adaptive-container living-interface ${className}`}
      style={adaptiveStyles}
      variants={getAnimationVariants()}
      initial="initial"
      animate="animate"
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.99,
        transition: { duration: 0.1 }
      }}
    >
      {children}
      
      {/* Energy and Focus Indicators */}
      {adaptToEmotions && (
        <div className="absolute top-2 right-2 flex gap-1 pointer-events-none">
          <div 
            className="w-2 h-8 bg-gradient-to-t from-transparent to-blue-400 rounded-full opacity-30"
            style={{ 
              height: `${Math.max(8, state.energy * 0.3)}px`,
              opacity: state.energy / 200 + 0.1
            }}
            title={`Energy: ${Math.round(state.energy)}%`}
          />
          <div 
            className="w-2 h-8 bg-gradient-to-t from-transparent to-purple-400 rounded-full opacity-30"
            style={{ 
              height: `${Math.max(8, state.focus * 0.3)}px`,
              opacity: state.focus / 200 + 0.1
            }}
            title={`Focus: ${Math.round(state.focus)}%`}
          />
        </div>
      )}
    </motion.div>
  )
}

interface BiometricCardProps {
  children: ReactNode
  title?: string
  className?: string
}

export function BiometricCard({ children, title, className = '' }: BiometricCardProps) {
  const { state, recordInteraction, requestBiometricAccess } = useLivingInterface()
  const [biometricEnabled, setBiometricEnabled] = useState(false)

  const handleBiometricSetup = async () => {
    const success = await requestBiometricAccess()
    setBiometricEnabled(success)
    
    if (success) {
      recordInteraction('click', 5, 'biometric-setup')
    }
  }

  return (
    <AdaptiveContainer className={className} adaptToEmotions={true} priority="high">
      <AppleLiquidGlass
        material="thick"
        blur="heavy"
        rounded="xl"
        className="p-4 relative overflow-hidden"
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {!biometricEnabled && (
              <button
                onClick={handleBiometricSetup}
                className="text-xs px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 transition-colors"
              >
                Enable Biometrics
              </button>
            )}
          </div>
        )}
        
        {children}
        
        {/* Emotional State Indicator */}
        <div className="absolute bottom-2 left-2 text-xs text-white/40">
          {state.emotionalState} • {Math.round(state.energy)}% energy
        </div>
        
        {/* Biometric Status */}
        {biometricEnabled && (
          <div className="absolute bottom-2 right-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Biometrics Active" />
          </div>
        )}
      </AppleLiquidGlass>
    </AdaptiveContainer>
  )
}

export default AdaptiveContainer