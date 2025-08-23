'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isMagnetic, setIsMagnetic] = useState(false)
  
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const magneticX = useMotionValue(0)
  const magneticY = useMotionValue(0)
  
  // Different spring configs for normal and magnetic states
  const normalSpringConfig = { damping: 25, stiffness: 700 }
  const magneticSpringConfig = { damping: 20, stiffness: 200 }
  
  const cursorXSpring = useSpring(cursorX, normalSpringConfig)
  const cursorYSpring = useSpring(cursorY, normalSpringConfig)
  const magneticXSpring = useSpring(magneticX, magneticSpringConfig)
  const magneticYSpring = useSpring(magneticY, magneticSpringConfig)

  useEffect(() => {
    const magneticDistance = 120
    const attractionStrength = 0.45

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)

      // Check for magnetic attraction to buttons
      const magneticElements = document.querySelectorAll('button, .magnetic-button, .btn, [data-magnetic="true"]')
      let nearestElement: Element | null = null
      let nearestDistance = magneticDistance
      let magneticOffset = { x: 0, y: 0 }

      magneticElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestElement = element
          
          // Calculate magnetic attraction
          const strength = 1 - distance / magneticDistance
          magneticOffset = {
            x: deltaX * strength * attractionStrength,
            y: deltaY * strength * attractionStrength
          }
        }
      })

      if (nearestElement && nearestDistance < magneticDistance) {
        setIsMagnetic(true)
        magneticX.set(-magneticOffset.x)
        magneticY.set(-magneticOffset.y)
      } else {
        setIsMagnetic(false)
        magneticX.set(0)
        magneticY.set(0)
      }
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => {
      setIsVisible(false)
      setIsMagnetic(false)
      magneticX.set(0)
      magneticY.set(0)
    }

    const handleInteractiveEnter = () => setIsHovering(true)
    const handleInteractiveLeave = () => setIsHovering(false)

    // Track mouse movement
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Track interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], .interactive, .magnetic-button')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleInteractiveEnter)
      el.addEventListener('mouseleave', handleInteractiveLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleInteractiveEnter)
        el.removeEventListener('mouseleave', handleInteractiveLeave)
      })
    }
  }, [cursorX, cursorY, magneticX, magneticY])

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isVisible ? (isHovering ? 1.5 : 1) : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        scale: { duration: 0.15, ease: 'easeOut' },
        opacity: { duration: 0.15 }
      }}
    >
      {/* Main cursor with magnetic offset */}
      <motion.div 
        className="w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{
          x: magneticXSpring,
          y: magneticYSpring,
          boxShadow: isMagnetic 
            ? '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' 
            : '0 0 10px rgba(255, 255, 255, 0.5)',
        }}
        animate={{
          scale: isMagnetic ? 1.2 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Outer ring with magnetic effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-8 h-8 border rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{
          x: magneticXSpring,
          y: magneticYSpring,
          borderColor: isMagnetic ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.5)',
          boxShadow: isMagnetic ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none'
        }}
        animate={{
          scale: isHovering ? 1.5 : isMagnetic ? 1.3 : 1,
          opacity: isHovering ? 0.8 : isMagnetic ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />

      {/* Magnetic field indicator */}
      {isMagnetic && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-12 h-12 border border-blue-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            x: magneticXSpring,
            y: magneticYSpring,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  )
}

// Magnetic Button component
export function MagneticButton({
  children,
  className = '',
  onClick,
  ...props
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    buttonRef.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
  }

  const handleMouseLeave = () => {
    if (!buttonRef.current) return
    buttonRef.current.style.transform = 'translate(0, 0)'
    setIsHovered(false)
  }

  return (
    <motion.button
      ref={buttonRef}
      className={`magnetic-button relative overflow-hidden transition-all duration-300 ${className}`}
      data-magnetic="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Magnetic Element wrapper
export function MagneticElement({
  children,
  className = '',
  intensity = 0.3,
  ...props
}: {
  children: React.ReactNode
  className?: string
  intensity?: number
  [key: string]: any
}) {
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return
    
    const rect = elementRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    elementRef.current.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`
  }

  const handleMouseLeave = () => {
    if (!elementRef.current) return
    elementRef.current.style.transform = 'translate(0, 0)'
  }

  return (
    <motion.div
      ref={elementRef}
      className={`magnetic-element transition-all duration-300 ${className}`}
      data-magnetic="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default MagneticCursor