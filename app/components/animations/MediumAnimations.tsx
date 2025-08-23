'use client'

import React, { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useAdvancedMemoryManager } from '@/hooks/useAdvancedMemoryManager'

/**
 * Medium Animations - Moderate complexity with scroll effects
 * Balanced performance with enhanced visual appeal
 */

interface MediumAnimationProps {
  children: React.ReactNode
  className?: string
}

export function ScrollReveal({ children, className = '' }: MediumAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { registerWebAnimation } = useAdvancedMemoryManager()

  return (
    <motion.div
      ref={ref}
      className={`animate-performance-medium ${className}`}
      initial={{ y: 50, opacity: 0, rotateX: 10 }}
      animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : { y: 50, opacity: 0, rotateX: 10 }}
      transition={{ duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }}
      onAnimationStart={(animation) => {
        if (animation instanceof Animation) {
          registerWebAnimation(animation, 'scroll-reveal')
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxContainer({ children, className = '', offset = 50 }: MediumAnimationProps & { offset?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`layout-contained ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function FloatingCard({ children, className = '' }: MediumAnimationProps) {
  return (
    <motion.div
      className={`card-optimized ${className}`}
      whileHover={{ 
        y: -8, 
        rotateX: 5,
        rotateY: 5,
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredList({ 
  children, 
  className = '',
  staggerDelay = 0.1 
}: MediumAnimationProps & { 
  staggerDelay?: number 
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0, scale: 0.9 },
    visible: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <motion.div
      className={`batch-animate ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="contain-layout"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export function RotatingIcon({ 
  children, 
  className = '',
  duration = 2 
}: MediumAnimationProps & { 
  duration?: number 
}) {
  return (
    <motion.div
      className={`gpu-accelerated ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        ease: 'linear',
        repeat: Infinity
      }}
    >
      {children}
    </motion.div>
  )
}

export function MorphingButton({ 
  children, 
  onClick, 
  className = '',
  isActive = false 
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
  isActive?: boolean
}) {
  return (
    <motion.button
      className={`complex-animation ${className}`}
      onClick={onClick}
      animate={{
        backgroundColor: isActive ? '#3b82f6' : '#6b7280',
        scale: isActive ? 1.05 : 1,
        borderRadius: isActive ? 16 : 8
      }}
      whileHover={{
        scale: 1.1,
        rotateY: 5,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
    >
      {children}
    </motion.button>
  )
}

export function PulsingOrb({ className = '', size = 60 }: { className?: string, size?: number }) {
  return (
    <motion.div
      className={`gpu-accelerated ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)'
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity
      }}
    />
  )
}

const MediumAnimations = {
  ScrollReveal,
  ParallaxContainer,
  FloatingCard,
  StaggeredList,
  RotatingIcon,
  MorphingButton,
  PulsingOrb
}

export default MediumAnimations