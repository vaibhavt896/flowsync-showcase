'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useRive, UseRiveParameters } from '@rive-app/react-canvas'
import { cn } from '@/utils/helpers'
import { Check, Minus } from 'lucide-react'

interface RiveCheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'flow' | 'success' | 'warning' | 'error'
  label?: string
  description?: string
  required?: boolean
}

export function RiveCheckbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
  label,
  description,
  required = false
}: RiveCheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked)
  const [isAnimating, setIsAnimating] = useState(false)
  const riveRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  // Rive animation configuration for checkbox
  const riveOptions: UseRiveParameters = {
    src: 'checkbox-animation.riv', // We'll create a fallback animation
    canvas: riveRef.current,
    autoplay: false,
    stateMachines: ['CheckboxStateMachine'],
    onLoad: () => {
      console.log('Rive checkbox animation loaded')
    },
    onLoadError: () => {
      console.log('Rive file not found, using CSS fallback')
    }
  }

  const { rive } = useRive(riveOptions)

  const handleToggle = () => {
    if (disabled) return

    setIsAnimating(true)
    const newCheckedState = !isChecked
    setIsChecked(newCheckedState)
    onChange?.(newCheckedState)

    // Trigger Rive animation state
    if (rive && rive.stateMachineInputs?.('CheckboxStateMachine')) {
      const checkInput = rive.stateMachineInputs('CheckboxStateMachine').find(
        input => input.name === 'check'
      )
      if (checkInput) {
        checkInput.value = newCheckedState
      }
    }

    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 400)
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const variantStyles = {
    default: {
      unchecked: 'border-gray-300 hover:border-gray-400',
      checked: 'bg-blue-500 border-blue-500',
      focus: 'ring-blue-500'
    },
    flow: {
      unchecked: 'border-orange-300 hover:border-orange-400',
      checked: 'bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-500',
      focus: 'ring-orange-500'
    },
    success: {
      unchecked: 'border-green-300 hover:border-green-400',
      checked: 'bg-gradient-to-br from-green-400 to-green-600 border-green-500',
      focus: 'ring-green-500'
    },
    warning: {
      unchecked: 'border-amber-300 hover:border-amber-400',
      checked: 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500',
      focus: 'ring-amber-500'
    },
    error: {
      unchecked: 'border-red-300 hover:border-red-400',
      checked: 'bg-gradient-to-br from-red-400 to-red-600 border-red-500',
      focus: 'ring-red-500'
    }
  }

  const currentVariant = variantStyles[variant]

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          disabled={disabled}
          required={required}
          className="sr-only"
          aria-describedby={description ? `${label}-description` : undefined}
        />
        
        {/* Checkbox Container */}
        <div
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : isChecked}
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle()
            }
          }}
          className={cn(
            'relative rounded-md border-2 transition-all duration-300 cursor-pointer',
            'backdrop-blur-sm shadow-lg hover:shadow-xl',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            sizeClasses[size],
            disabled && 'opacity-50 cursor-not-allowed',
            isChecked || indeterminate 
              ? currentVariant.checked 
              : currentVariant.unchecked,
            `focus:${currentVariant.focus}`,
            isAnimating && 'scale-110',
            'hover:scale-105 active:scale-95'
          )}
        >
          {/* Rive Canvas Overlay */}
          <canvas
            ref={riveRef}
            className="absolute inset-0 w-full h-full rounded-md opacity-90"
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* Animated Background Glow */}
          <div
            className={cn(
              'absolute inset-0 rounded-md transition-all duration-500',
              isChecked || indeterminate
                ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'shadow-none',
              variant === 'flow' && (isChecked || indeterminate) && 
                'shadow-[0_0_15px_rgba(251,146,60,0.6)]',
              variant === 'success' && (isChecked || indeterminate) && 
                'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
              variant === 'warning' && (isChecked || indeterminate) && 
                'shadow-[0_0_15px_rgba(251,191,36,0.5)]',
              variant === 'error' && (isChecked || indeterminate) && 
                'shadow-[0_0_15px_rgba(239,68,68,0.5)]'
            )}
          />

          {/* Check/Indeterminate Icon */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-all duration-300',
              (isChecked || indeterminate) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
          >
            {indeterminate ? (
              <Minus 
                className={cn(
                  iconSizes[size], 
                  'text-white drop-shadow-sm transition-transform duration-300',
                  isAnimating && 'rotate-180'
                )}
              />
            ) : (
              <Check 
                className={cn(
                  iconSizes[size], 
                  'text-white drop-shadow-sm transition-all duration-300',
                  isAnimating && 'rotate-12 scale-125'
                )}
              />
            )}
          </div>

          {/* Ripple Effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-md opacity-0 transition-all duration-200',
              'hover:opacity-20 active:opacity-40',
              'bg-current pointer-events-none'
            )}
          />

          {/* Particle Effect on Check */}
          {isAnimating && isChecked && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute w-1 h-1 bg-white rounded-full',
                    'animate-ping opacity-75'
                  )}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: '600ms'
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              className={cn(
                'block text-sm font-medium cursor-pointer select-none',
                'transition-colors duration-300',
                disabled ? 'text-gray-400' : 'text-gray-700 hover:text-gray-900',
                'dark:text-gray-300 dark:hover:text-gray-100',
                required && "after:content-['*'] after:text-red-500 after:ml-1"
              )}
              onClick={handleToggle}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${label}-description`}
              className={cn(
                'mt-1 text-xs leading-relaxed',
                disabled ? 'text-gray-300' : 'text-gray-500',
                'dark:text-gray-400'
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}