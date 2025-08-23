'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

const AURORA_COLORS = [
  '#13FFAA', '#1E67C6', '#CE84CF', '#DD335C',
  '#00D4FF', '#FF006E', '#8338EC', '#3A86FF'
]

export function AuroraBackground() {
  const colorIndex = useMotionValue(0)
  
  useEffect(() => {
    const animation = animate(colorIndex, AURORA_COLORS.length - 1, {
      duration: 20,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'linear'
    })
    
    return () => animation.stop()
  }, [colorIndex])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora Gradient Layer 1 */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(125% 125% at 50% 0%, transparent 40%, ${AURORA_COLORS[0]} 70%, transparent 100%)`
        }}
        animate={{
          background: [
            `radial-gradient(125% 125% at 50% 0%, transparent 40%, ${AURORA_COLORS[0]} 70%, transparent 100%)`,
            `radial-gradient(125% 125% at 70% 20%, transparent 40%, ${AURORA_COLORS[1]} 70%, transparent 100%)`,
            `radial-gradient(125% 125% at 30% 40%, transparent 40%, ${AURORA_COLORS[2]} 70%, transparent 100%)`,
            `radial-gradient(125% 125% at 80% 60%, transparent 40%, ${AURORA_COLORS[3]} 70%, transparent 100%)`,
          ]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
      />
      
      {/* Aurora Gradient Layer 2 */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(100% 100% at 80% 100%, transparent 40%, ${AURORA_COLORS[4]} 70%, transparent 100%)`
        }}
        animate={{
          background: [
            `radial-gradient(100% 100% at 80% 100%, transparent 40%, ${AURORA_COLORS[4]} 70%, transparent 100%)`,
            `radial-gradient(100% 100% at 20% 80%, transparent 40%, ${AURORA_COLORS[5]} 70%, transparent 100%)`,
            `radial-gradient(100% 100% at 60% 20%, transparent 40%, ${AURORA_COLORS[6]} 70%, transparent 100%)`,
            `radial-gradient(100% 100% at 40% 60%, transparent 40%, ${AURORA_COLORS[7]} 70%, transparent 100%)`,
          ]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: 5
        }}
      />
      
      {/* Subtle Animation Layer */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

// AuroraOrb component for 3D-like orb effects
export function AuroraOrb({
  size = 200,
  color = '#13FFAA',
  className = '',
  intensity = 0.6,
}: {
  size?: number
  color?: string
  className?: string
  intensity?: number
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        filter: `blur(${size / 10}px)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [intensity * 0.5, intensity, intensity * 0.5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut'
      }}
    />
  )
}

export default AuroraBackground