'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function OrganicShapes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Curved Orange Flow - Top Right */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 opacity-20"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <path
            d="M 50 200 C 50 100, 150 50, 250 50 C 350 50, 400 100, 350 200 C 350 300, 250 350, 150 350 C 50 350, 50 300, 50 200 Z"
            fill="#EF6F38"
            className="filter blur-sm"
          />
        </svg>
      </motion.div>

      {/* Curved Golden Flow - Bottom Left */}
      <motion.div
        className="absolute -bottom-32 -left-32 w-80 h-80 opacity-15"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <path
            d="M 100 150 C 80 80, 160 40, 240 60 C 320 80, 360 160, 340 240 C 320 320, 240 360, 160 340 C 80 320, 60 240, 100 150 Z"
            fill="#F3A340"
            className="filter blur-sm"
          />
        </svg>
      </motion.div>

      {/* Curved Pink Flow - Middle Right */}
      <motion.div
        className="absolute top-1/2 -right-24 w-72 h-72 opacity-12"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <path
            d="M 120 180 C 100 120, 140 80, 200 90 C 260 100, 300 140, 290 200 C 280 260, 240 300, 180 290 C 120 280, 110 240, 120 180 Z"
            fill="#F088A3"
            className="filter blur-sm"
          />
        </svg>
      </motion.div>

      {/* Small Golden Accent - Top Left */}
      <motion.div
        className="absolute top-24 left-24 w-48 h-48 opacity-10"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <path
            d="M 150 180 C 140 140, 160 120, 200 125 C 240 130, 260 150, 255 190 C 250 230, 230 250, 190 245 C 150 240, 145 220, 150 180 Z"
            fill="#F0BB43"
            className="filter blur-sm"
          />
        </svg>
      </motion.div>

      {/* Cream Accent Flow - Bottom Right */}
      <motion.div
        className="absolute bottom-24 right-24 w-64 h-64 opacity-8"
        animate={{
          x: [-10, 10, -10],
          y: [-10, 10, -10],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <path
            d="M 130 170 C 120 130, 150 110, 190 115 C 230 120, 250 140, 245 180 C 240 220, 220 240, 180 235 C 140 230, 135 210, 130 170 Z"
            fill="#F3ECD2"
            className="filter blur-md"
          />
        </svg>
      </motion.div>
    </div>
  )
}

export default OrganicShapes