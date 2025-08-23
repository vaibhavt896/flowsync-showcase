'use client'

import React from 'react'
import { motion } from 'framer-motion'

/**
 * Simple Animations - Basic CSS transforms only
 * Minimal GPU usage, fastest performance
 */

interface SimpleAnimationProps {
  children: React.ReactNode
  className?: string
}

export function FadeIn({ children, className = '' }: SimpleAnimationProps) {
  return (
    <motion.div
      className={`gpu-accelerated ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, className = '' }: SimpleAnimationProps) {
  return (
    <motion.div
      className={`transform-animate ${className}`}
      initial={{ transform: 'translateX(-20px)', opacity: 0 }}
      animate={{ transform: 'translateX(0px)', opacity: 1 }}
      exit={{ transform: 'translateX(-20px)', opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className = '' }: SimpleAnimationProps) {
  return (
    <motion.div
      className={`animate-performance-medium ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function SimpleButton({ 
  children, 
  onClick, 
  className = '' 
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string 
}) {
  return (
    <motion.button
      className={`button-optimized ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      {children}
    </motion.button>
  )
}

const SimpleAnimations = {
  FadeIn,
  SlideIn,
  ScaleIn,
  SimpleButton
}

export default SimpleAnimations