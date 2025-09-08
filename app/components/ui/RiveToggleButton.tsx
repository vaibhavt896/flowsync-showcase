'use client'

import React, { useRef, useState } from 'react'
import { useRive, UseRiveParameters } from '@rive-app/react-canvas'
import { cn } from '@/utils/helpers'

interface RiveToggleButtonProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'flow' | 'focus'
  label?: string
}

export function RiveToggleButton({
  checked = false,
  onChange,
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
  label
}: RiveToggleButtonProps) {
  const [isToggled, setIsToggled] = useState(checked)
  const riveRef = useRef<HTMLCanvasElement>(null)

  // Rive animation configuration for toggle
  const riveOptions: UseRiveParameters = {
    src: 'toggle-animation.riv', // We'll create a fallback animation
    canvas: riveRef.current,
    autoplay: true,
    stateMachines: ['ToggleStateMachine'],
    onLoad: () => {
      console.log('Rive toggle animation loaded')
    },
    // Fallback to CSS animation if Rive file not found
    onLoadError: () => {
      console.log('Rive file not found, using CSS fallback')
    }
  }

  const { rive } = useRive(riveOptions)

  const handleToggle = () => {
    if (disabled) return

    const newToggleState = !isToggled
    setIsToggled(newToggleState)
    onChange?.(newToggleState)

    // Trigger Rive animation state
    if (rive && rive.stateMachineInputs?.('ToggleStateMachine')) {
      const toggleInput = rive.stateMachineInputs('ToggleStateMachine').find(
        input => input.name === 'toggle'
      )
      if (toggleInput) {
        toggleInput.value = newToggleState
      }
    }
  }

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-16 h-8',
    lg: 'w-20 h-10'
  }

  const variantStyles = {
    default: 'bg-gradient-to-r from-gray-300 to-gray-400',
    flow: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    focus: 'bg-gradient-to-r from-blue-400 to-purple-500'
  }

  const toggledStyles = {
    default: 'bg-gradient-to-r from-green-400 to-blue-500',
    flow: 'bg-gradient-to-r from-orange-500 to-red-500',
    focus: 'bg-gradient-to-r from-purple-500 to-pink-500'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="switch"
        aria-checked={isToggled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={cn(
          'relative rounded-full transition-all duration-500 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
          'shadow-lg backdrop-blur-sm',
          sizeClasses[size],
          disabled && 'opacity-50 cursor-not-allowed',
          isToggled ? toggledStyles[variant] : variantStyles[variant]
        )}
      >
        {/* Rive Canvas Overlay */}
        <canvas
          ref={riveRef}
          className="absolute inset-0 w-full h-full rounded-full opacity-80"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Fallback CSS Animation */}
        <div
          className={cn(
            'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg',
            'transition-all duration-500 ease-out transform',
            'backdrop-blur-sm border border-white/20',
            size === 'sm' && 'w-4 h-4 top-0.5',
            size === 'lg' && 'w-8 h-8 top-1',
            isToggled 
              ? size === 'sm' ? 'translate-x-6' : size === 'lg' ? 'translate-x-10' : 'translate-x-8'
              : 'translate-x-0.5'
          )}
        >
          {/* Inner glow effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-full transition-all duration-500',
              isToggled 
                ? variant === 'flow' 
                  ? 'shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                  : variant === 'focus'
                  ? 'shadow-[0_0_15px_rgba(139,92,246,0.8)]'
                  : 'shadow-[0_0_15px_rgba(34,197,94,0.8)]'
                : 'shadow-[0_0_8px_rgba(156,163,175,0.4)]'
            )}
          />
        </div>

        {/* State indicators */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <div
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-500',
              size === 'sm' && 'w-2 h-2',
              size === 'lg' && 'w-4 h-4',
              !isToggled && 'opacity-60 scale-110',
              isToggled && 'opacity-0 scale-50'
            )}
          />
          <div
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-500',
              size === 'sm' && 'w-2 h-2',
              size === 'lg' && 'w-4 h-4',
              isToggled && 'opacity-60 scale-110 shadow-[0_0_10px_currentColor]',
              !isToggled && 'opacity-0 scale-50'
            )}
          />
        </div>

        {/* Micro-interaction ripple effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-full transition-all duration-300',
            'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]',
            'active:scale-95 active:shadow-[0_0_25px_rgba(255,255,255,0.4)]'
          )}
        />
      </div>

      {label && (
        <label
          className={cn(
            'text-sm font-medium cursor-pointer select-none',
            'transition-colors duration-300',
            disabled ? 'text-gray-400' : 'text-gray-700 hover:text-gray-900',
            'dark:text-gray-300 dark:hover:text-gray-100'
          )}
          onClick={handleToggle}
        >
          {label}
        </label>
      )}
    </div>
  )
}