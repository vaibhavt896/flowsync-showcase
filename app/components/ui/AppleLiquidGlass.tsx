import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { useSpring, animated, config } from '@react-spring/web'
import { cn } from '@/utils/helpers'
import { SafeGlassWrapper, useGlassErrorHandler } from './GlassErrorBoundary'

export type AppleGlassMaterial = 'ultra-thin' | 'thin' | 'regular' | 'thick' | 'ultra-thick'
export type AppleGlassBlur = 'light' | 'medium' | 'heavy' | 'ultra'

interface AppleLiquidGlassProps {
  children: ReactNode
  material?: AppleGlassMaterial
  blur?: AppleGlassBlur
  interactive?: boolean
  className?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  adaptToContent?: boolean
  motionResponse?: boolean
  specularHighlight?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

export function AppleLiquidGlass({
  children,
  material = 'regular',
  blur = 'medium',
  interactive = false,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  adaptToContent = true,
  motionResponse = true,
  specularHighlight = true,
  rounded = 'lg'
}: AppleLiquidGlassProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const glassRef = useRef<HTMLDivElement>(null)
  const { hasError } = useGlassErrorHandler()

  // Optimized Apple spring animation
  const glassSpring = useSpring({
    transform: interactive && isHovered 
      ? 'translateY(-1px) scale(1.01)' 
      : interactive && isPressed 
      ? 'translateY(0px) scale(0.99)' 
      : 'translateY(0px) scale(1)',
    opacity: 1,
    config: {
      tension: 180,
      friction: 20,
      mass: 1
    }
  })

  // Minimal highlight for performance
  const highlightSpring = useSpring({
    opacity: specularHighlight && isHovered ? 0.4 : 0.2,
    config: { tension: 120, friction: 14 }
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    // Simplified for performance - no action needed
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onMouseLeave?.()
  }

  const handleMouseDown = () => {
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleClick = () => {
    onClick?.()
  }

  const baseClasses = cn(
    'apple-glass-optimized relative overflow-hidden',
    `apple-glass-${material}`,
    `apple-glass-dynamic-${blur}`,
    {
      'apple-glass-interactive': interactive,
      'cursor-pointer': interactive,
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md', 
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
      'rounded-2xl': rounded === '2xl',
      'rounded-3xl': rounded === '3xl'
    },
    className
  )

  // Wrap in error boundary for production safety
  const glassContent = (
    <animated.div
      ref={glassRef}
      className={cn(baseClasses, 'flex flex-col')}
      style={glassSpring}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {/* Apple's Specular Highlight */}
      {specularHighlight && !hasError && (
        <animated.div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            opacity: highlightSpring.opacity
          }}
        />
      )}

      {/* Apple's Internal Glass Layer */}
      {!hasError && (
        <animated.div
          className="absolute inset-px rounded-inherit pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.02) 100%)',
            opacity: isHovered ? 0.8 : 0.5
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </animated.div>
  )

  return (
    <SafeGlassWrapper
      fallback={
        <div className={cn(baseClasses.replace('apple-glass', 'accessible-glass'), 'flex flex-col')}>
          <div className="relative z-10 flex-1 min-w-0 overflow-hidden">
            {children}
          </div>
        </div>
      }
    >
      {glassContent}
    </SafeGlassWrapper>
  )
}

// Enhanced Apple Glass Button Component
interface AppleLiquidButtonProps {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: ReactNode
}

export function AppleLiquidButton({
  children,
  variant = 'secondary',
  size = 'md',
  onClick,
  disabled,
  className,
  icon
}: AppleLiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Enhanced spring animations with multiple states
  const buttonSpring = useSpring({
    transform: isPressed 
      ? 'scale(0.97) translateY(1px)' 
      : isHovered 
      ? 'scale(1.02) translateY(-1px)' 
      : 'scale(1) translateY(0px)',
    config: { tension: 300, friction: 20 }
  })

  // Enhanced glow effect
  const glowSpring = useSpring({
    boxShadow: isHovered && !disabled
      ? variant === 'primary'
        ? '0 0 25px rgba(239, 111, 56, 0.5), 0 8px 32px rgba(239, 111, 56, 0.3)'
        : variant === 'secondary'
        ? '0 0 20px rgba(243, 163, 64, 0.4), 0 8px 24px rgba(243, 163, 64, 0.2)'
        : '0 0 15px rgba(239, 111, 56, 0.2), 0 4px 16px rgba(239, 111, 56, 0.1)'
      : '0 0 0px rgba(0, 0, 0, 0), 0 2px 8px rgba(0, 0, 0, 0.1)',
    config: { tension: 200, friction: 25 }
  })

  // Border glow effect
  const borderSpring = useSpring({
    borderColor: isHovered && !disabled
      ? variant === 'primary'
        ? '#EF6F38'
        : variant === 'secondary'
        ? '#F3A340'
        : 'rgba(239, 111, 56, 0.6)'
      : variant === 'primary'
      ? '#EF6F38'
      : variant === 'secondary'
      ? '#F3A340'
      : 'rgba(239, 111, 56, 0.3)',
    config: { tension: 250, friction: 30 }
  })

  // Icon animation
  const iconSpring = useSpring({
    transform: isPressed 
      ? 'scale(0.95)' 
      : isHovered 
      ? 'scale(1.1)' 
      : 'scale(1)',
    config: { tension: 400, friction: 25 }
  })

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
  }

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true)
  }

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false)
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const handleClick = () => {
    if (!disabled) {
      // Haptic feedback simulation
      if (buttonRef.current && 'vibrate' in navigator) {
        navigator.vibrate(50)
      }
      onClick?.()
    }
  }

  const sizeClasses = {
    sm: 'px-4 py-3 text-sm min-h-[44px] max-w-fit min-w-[44px]', // Touch standard 44px
    md: 'px-5 py-3 text-sm min-h-[48px] max-w-fit min-w-[48px]', // Enhanced touch target
    lg: 'px-6 py-4 text-base min-h-[52px] max-w-fit min-w-[52px]' // Large touch target
  }

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #EF6F38 0%, #d14818 100%)',
      backdropFilter: 'blur(20px)',
      border: '2px solid',
      color: '#ffffff',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
      fontWeight: '700'
    },
    secondary: {
      background: 'linear-gradient(135deg, #F3A340 0%, #d18315 100%)',
      backdropFilter: 'blur(20px)',
      border: '2px solid',
      color: '#ffffff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      fontWeight: '700'
    },
    ghost: {
      background: 'linear-gradient(135deg, rgba(239, 111, 56, 0.1) 0%, rgba(243, 163, 64, 0.05) 100%)',
      backdropFilter: 'blur(12px)',
      border: '1px solid',
      color: '#1a1a1a',
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
      fontWeight: '600'
    }
  }

  return (
    <animated.button
      ref={buttonRef}
      className={cn(
        'relative inline-flex items-center justify-center gap-3',
        'font-medium tracking-wide',
        'focus:outline-none transition-all duration-300 ease-out',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
        'overflow-hidden group cursor-pointer',
        'shadow-lg active:shadow-sm',
        sizeClasses[size],
        className
      )}
      style={{
        ...buttonSpring,
        ...glowSpring,
        ...variantStyles[variant],
        borderColor: borderSpring.borderColor,
        borderRadius: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Enhanced gradient overlay */}
      <animated.div
        className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: variant === 'primary' 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)'
        }}
      />

      {/* Enhanced border highlight */}
      <animated.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, 0.1) 100%)',
          opacity: isHovered ? 0.6 : 0.2,
          transition: 'opacity 0.3s ease-out'
        }}
      />

      {/* Focus ring */}
      {isFocused && (
        <div className="absolute inset-0 rounded-inherit ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent" />
      )}

      {/* Icon with enhanced animation */}
      {icon && (
        <animated.span 
          className="shrink-0 relative z-10" 
          style={iconSpring}
        >
          {icon}
        </animated.span>
      )}

      {/* Text content */}
      {children && (
        <span className="relative z-10 whitespace-nowrap">
          {children}
        </span>
      )}

      {/* Ripple effect on click */}
      {isPressed && (
        <div className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 bg-white/20 rounded-inherit animate-ping"
            style={{ animationDuration: '0.6s' }}
          />
        </div>
      )}
    </animated.button>
  )
}

// Apple Glass Card Component
interface AppleLiquidCardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
}

export function AppleLiquidCard({
  children,
  className,
  padding = 'md',
  hover = true
}: AppleLiquidCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  return (
    <AppleLiquidGlass
      material="thick"
      blur="heavy"
      interactive={hover}
      className={cn('apple-glass-card flex flex-col min-h-0', paddingClasses[padding], className)}
      rounded="xl"
      specularHighlight={false}
      motionResponse={false}
    >
      <div className="flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </AppleLiquidGlass>
  )
}

// Utility functions for Apple's material system
function getMaterialValue(material: AppleGlassMaterial): string {
  const materials = {
    'ultra-thin': 'rgba(255, 255, 255, 0.02)',
    'thin': 'rgba(255, 255, 255, 0.05)',
    'regular': 'rgba(255, 255, 255, 0.08)',
    'thick': 'rgba(255, 255, 255, 0.12)',
    'ultra-thick': 'rgba(255, 255, 255, 0.18)'
  }
  return materials[material]
}

function getEnhancedMaterial(material: AppleGlassMaterial): string {
  const enhanced = {
    'ultra-thin': 'rgba(255, 255, 255, 0.05)',
    'thin': 'rgba(255, 255, 255, 0.08)',
    'regular': 'rgba(255, 255, 255, 0.12)',
    'thick': 'rgba(255, 255, 255, 0.18)',
    'ultra-thick': 'rgba(255, 255, 255, 0.25)'
  }
  return enhanced[material]
}

function getBorderValue(material: AppleGlassMaterial): string {
  const borders = {
    'ultra-thin': 'rgba(255, 255, 255, 0.05)',
    'thin': 'rgba(255, 255, 255, 0.08)',
    'regular': 'rgba(255, 255, 255, 0.12)',
    'thick': 'rgba(255, 255, 255, 0.18)',
    'ultra-thick': 'rgba(255, 255, 255, 0.25)'
  }
  return borders[material]
}

function getEnhancedBorder(material: AppleGlassMaterial): string {
  const enhanced = {
    'ultra-thin': 'rgba(255, 255, 255, 0.12)',
    'thin': 'rgba(255, 255, 255, 0.18)',
    'regular': 'rgba(255, 255, 255, 0.25)',
    'thick': 'rgba(255, 255, 255, 0.35)',
    'ultra-thick': 'rgba(255, 255, 255, 0.45)'
  }
  return enhanced[material]
}

function getBlurValue(blur: AppleGlassBlur): string {
  const blurs = {
    light: '10px',
    medium: '25px', 
    heavy: '40px',
    ultra: '60px'
  }
  return blurs[blur]
}

function getEnhancedBlur(blur: AppleGlassBlur): AppleGlassBlur {
  const enhanced: Record<AppleGlassBlur, AppleGlassBlur> = {
    light: 'medium',
    medium: 'heavy',
    heavy: 'ultra',
    ultra: 'ultra'
  }
  return enhanced[blur]
}

function getShadowValue(material: AppleGlassMaterial): string {
  const shadows = {
    'ultra-thin': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    'thin': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    'regular': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    'thick': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    'ultra-thick': '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.12)'
  }
  return shadows[material]
}

function getEnhancedShadow(material: AppleGlassMaterial): string {
  const enhanced = {
    'ultra-thin': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    'thin': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    'regular': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    'thick': '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.12)',
    'ultra-thick': '0 35px 60px rgba(0, 0, 0, 0.2), 0 16px 32px rgba(0, 0, 0, 0.15)'
  }
  return enhanced[material]
}

export default AppleLiquidGlass