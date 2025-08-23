'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  magneticStrength?: number
  magneticRange?: number
  springConfig?: {
    stiffness: number
    damping: number
  }
  style?: React.CSSProperties
  disabled?: boolean
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  magneticStrength = 0.3,
  magneticRange = 100,
  springConfig = { stiffness: 200, damping: 20 },
  style,
  disabled = false
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current || disabled) return
    
    const button = buttonRef.current.getBoundingClientRect()
    const centerX = button.left + button.width / 2
    const centerY = button.top + button.height / 2
    
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    
    if (distance < magneticRange) {
      const strength = 1 - distance / magneticRange
      x.set(deltaX * strength * magneticStrength)
      y.set(deltaY * strength * magneticStrength)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={buttonRef}
      className={`magnetic-button relative overflow-hidden ${className}`}
      style={{
        x: springX,
        y: springY,
        ...style
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      data-magnetic="true"
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {/* Magnetic field visual indicator */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0"
        whileHover={{
          opacity: disabled ? 0 : 0.3,
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
      />
      
      {/* Button content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{
          scale: disabled ? 0 : 2,
          opacity: disabled ? 0 : [0, 0.3, 0],
          transition: { duration: 0.4 }
        }}
      />
    </motion.button>
  )
}

// Preset magnetic button variants
export function MagneticActionButton({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: MagneticButtonProps & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 text-white border border-white/20 backdrop-blur-md',
    ghost: 'text-white hover:bg-white/10'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <MagneticButton
      className={`
        rounded-xl font-medium transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      magneticStrength={0.4}
      magneticRange={120}
      {...props}
    >
      {children}
    </MagneticButton>
  )
}

export default MagneticButton