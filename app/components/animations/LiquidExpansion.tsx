'use client'

import { motion, animate } from 'framer-motion'
import { ReactNode } from 'react'

interface LiquidExpansionProps {
  children: ReactNode
  className?: string
}

// Apple's exact liquid expansion animation
export const liquidExpansionVariants = {
  initial: { 
    scale: 1, 
    y: 0, 
    backdropFilter: "blur(0px)", 
    opacity: 0.8 
  },
  hover: { 
    scale: 1.02, 
    y: -2, 
    backdropFilter: "blur(20px)", 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.5, 1.25, 0.3, 1] // Apple's bounce easing
    }
  },
  tap: { 
    scale: 0.98, 
    y: 0, 
    backdropFilter: "blur(15px)", 
    opacity: 0.9,
    transition: {
      duration: 0.15,
      ease: [0.42, 0, 0.58, 1.0] // Apple's primary easing
    }
  }
}

// Apple's liquid expansion animation function
export const liquidExpansion = async (elementId: string) => {
  // Phase 1: Initial growth (simultaneous)
  await Promise.all([
    animate(`#${elementId}-base`, { r: 40.5, opacity: 1 }, 
           { duration: 0.5, ease: "easeOut" }),
    animate(`#${elementId}-inner`, { r: 22.5, opacity: 1 }, 
           { duration: 0.5, ease: "easeOut" })
  ]);
  
  // Phase 3: Liquid expansion with Apple's bounce easing
  await animate(`#${elementId}-expanded`, { width: 244, opacity: 1 }, {
    duration: 0.5,
    ease: [0.5, 1.25, 0.3, 1]
  });
};

export function LiquidExpansion({ children, className }: LiquidExpansionProps) {
  return (
    <motion.div
      variants={liquidExpansionVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default LiquidExpansion