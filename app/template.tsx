'use client'

import { motion } from 'framer-motion'

// Apple's page transition template (Next.js 14+ approach)
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ 
        y: 20, 
        opacity: 0, 
        backdropFilter: "blur(0px)" 
      }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        backdropFilter: "blur(20px)" 
      }}
      transition={{ 
        ease: [0.42, 0, 0.58, 1.0], // Apple's primary easing
        duration: 0.5 
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}