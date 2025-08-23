'use client'

import React from 'react'

interface DepthCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  depth?: number
}

export function DepthCard({ 
  children, 
  className = '',
  hover = true,
  depth = 20
}: DepthCardProps) {
  return (
    <div
      className={`
        relative transform-gpu transition-all duration-300 ease-out
        ${hover ? 'hover:scale-105 hover:-translate-y-2' : ''}
        ${className}
      `}
      style={{
        transform: `perspective(800px) translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))'
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
      {/* Subtle depth indicator */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg -z-10"
        style={{
          transform: `translateZ(-${depth/2}px)`,
        }}
      />
    </div>
  )
}

export default DepthCard