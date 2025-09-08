'use client'

import React, { useRef, useEffect } from 'react'
import { useRive, UseRiveParameters } from '@rive-app/react-canvas'
import { cn } from '@/utils/helpers'
import { motion } from 'framer-motion'

interface RiveLoaderProps {
  variant?: 'flow' | 'focus' | 'break' | 'pulse' | 'spiral' | 'organic'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  message?: string
  progress?: number // 0-100
  infinite?: boolean
}

export function RiveLoader({
  variant = 'flow',
  size = 'md',
  className,
  message,
  progress,
  infinite = true
}: RiveLoaderProps) {
  const riveRef = useRef<HTMLCanvasElement>(null)

  // Rive animation configuration
  const riveOptions: UseRiveParameters = {
    src: `loader-${variant}.riv`, // Different Rive files for different variants
    canvas: riveRef.current,
    autoplay: true,
    stateMachines: ['LoaderStateMachine'],
    onLoad: () => {
      console.log(`Rive ${variant} loader animation loaded`)
    },
    onLoadError: () => {
      console.log(`Rive ${variant} file not found, using CSS fallback`)
    }
  }

  const { rive } = useRive(riveOptions)

  // Update progress in Rive animation if supported
  useEffect(() => {
    if (rive && progress !== undefined && !infinite) {
      const progressInput = rive.stateMachineInputs?.('LoaderStateMachine')?.find(
        input => input.name === 'progress'
      )
      if (progressInput) {
        progressInput.value = progress / 100
      }
    }
  }, [rive, progress, infinite])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const messageSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  const variantAnimations = {
    flow: {
      spin: { rotate: 360, scale: [1, 1.1, 1] },
      glow: 'shadow-[0_0_30px_rgba(251,146,60,0.6)]',
      gradient: 'from-yellow-400 via-orange-500 to-red-500'
    },
    focus: {
      spin: { rotate: 360, scale: [1, 1.05, 1] },
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.6)]',
      gradient: 'from-blue-400 via-purple-500 to-pink-500'
    },
    break: {
      spin: { rotate: 360, scale: [1, 1.02, 1] },
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
      gradient: 'from-green-400 via-teal-500 to-cyan-500'
    },
    pulse: {
      spin: { scale: [1, 1.2, 1], rotate: [0, 180, 360] },
      glow: 'shadow-[0_0_35px_rgba(168,85,247,0.7)]',
      gradient: 'from-purple-400 via-pink-500 to-red-500'
    },
    spiral: {
      spin: { rotate: [0, 720], scale: [1, 0.8, 1.2, 1] },
      glow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
      gradient: 'from-pink-400 via-purple-500 to-indigo-500'
    },
    organic: {
      spin: { rotate: 360, scale: [1, 1.15, 0.95, 1] },
      glow: 'shadow-[0_0_25px_rgba(34,197,94,0.5)]',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500'
    }
  }

  const currentVariant = variantAnimations[variant]

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Main Loader Container */}
      <div className="relative">
        {/* Rive Canvas */}
        <canvas
          ref={riveRef}
          className={cn(
            'relative z-10 rounded-full',
            sizeClasses[size]
          )}
          style={{ 
            mixBlendMode: 'screen',
            filter: 'brightness(1.1) contrast(1.05)'
          }}
        />

        {/* Fallback CSS Animation */}
        <motion.div
          animate={currentVariant.spin}
          transition={{
            duration: variant === 'spiral' ? 3 : variant === 'pulse' ? 1.5 : 2,
            repeat: Infinity,
            ease: variant === 'organic' ? 'easeInOut' : 'linear'
          }}
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r',
            currentVariant.gradient,
            currentVariant.glow,
            sizeClasses[size]
          )}
        >
          {/* Inner rotating elements */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-white/20 to-transparent" />
          <div className="absolute inset-1 rounded-full border-2 border-white/30 border-dashed" />
          
          {/* Progress ring if not infinite */}
          {!infinite && progress !== undefined && (
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                className="transition-all duration-500 ease-out"
              />
            </svg>
          )}
        </motion.div>

        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(variant === 'organic' ? 8 : 6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              animate={{
                x: [0, Math.sin(i) * 30, 0],
                y: [0, Math.cos(i) * 30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2 + (i * 0.2),
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-2px',
                marginTop: '-2px'
              }}
            />
          ))}
        </div>

        {/* Center glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-full opacity-30',
            'bg-gradient-radial from-white/40 to-transparent',
            sizeClasses[size]
          )}
        />
      </div>

      {/* Loading Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'text-center font-medium text-white/80',
            'backdrop-blur-sm px-4 py-2 rounded-full',
            'bg-gradient-to-r from-white/10 to-white/5',
            'border border-white/20',
            messageSizes[size]
          )}
        >
          {message}
        </motion.div>
      )}

      {/* Progress Text */}
      {!infinite && progress !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'text-center font-mono font-bold text-white/90',
            'text-sm'
          )}
        >
          {Math.round(progress)}%
        </motion.div>
      )}

      {/* Breathing ambient backdrop */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={cn(
          'absolute -inset-16 rounded-full pointer-events-none',
          'bg-gradient-radial',
          currentVariant.gradient.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-'),
          'blur-3xl'
        )}
      />
    </div>
  )
}

// Specialized loader variants
export const FlowStateLoader = (props: Omit<RiveLoaderProps, 'variant'>) => (
  <RiveLoader {...props} variant="flow" />
)

export const FocusLoader = (props: Omit<RiveLoaderProps, 'variant'>) => (
  <RiveLoader {...props} variant="focus" />
)

export const BreakLoader = (props: Omit<RiveLoaderProps, 'variant'>) => (
  <RiveLoader {...props} variant="break" />
)

export const PulseLoader = (props: Omit<RiveLoaderProps, 'variant'>) => (
  <RiveLoader {...props} variant="pulse" />
)

export const SpiralLoader = (props: Omit<RiveLoaderProps, 'variant'>) => (
  <RiveLoader {...props} variant="spiral" />
)

export const OrganicLoader = (props: Omit<RiveLoaderProps, 'variant'>) => (
  <RiveLoader {...props} variant="organic" />
)