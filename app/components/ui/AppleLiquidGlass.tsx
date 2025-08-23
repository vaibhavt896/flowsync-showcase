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

// Apple Glass Button Component
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
  const [isPressed, setIsPressed] = useState(false)

  const buttonSpring = useSpring({
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    config: { tension: 400, friction: 25 }
  })

  const handleMouseDown = () => !disabled && setIsPressed(true)
  const handleMouseUp = () => !disabled && setIsPressed(false)
  const handleClick = () => !disabled && onClick?.()

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px] rounded-lg',
    md: 'px-4 py-2 text-base min-h-[40px] rounded-xl', 
    lg: 'px-6 py-3 text-lg min-h-[48px] rounded-2xl'
  }

  const variantClasses = {
    primary: 'apple-glass-button-primary font-semibold',
    secondary: 'apple-glass-button font-medium',
    ghost: 'apple-glass-thin apple-glass-interactive font-medium'
  }

  return (
    <animated.button
      className={cn(
        'apple-glass-optimized inline-flex items-center justify-center gap-2',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'transition-all duration-200 ease-out',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={buttonSpring}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
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