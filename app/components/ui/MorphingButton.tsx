import { useState, useEffect, forwardRef } from 'react'
import { motion, useSpring, useTransform, AnimatePresence, MotionProps } from 'framer-motion'
import { cn } from '@/utils/helpers'

type MorphingButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd'> & 
  MotionProps & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg'
    morphOnHover?: boolean
    liquidEffect?: boolean
    magneticEffect?: boolean
    pulseOnClick?: boolean
    glowIntensity?: number
    children: React.ReactNode
  }

const MorphingButton = forwardRef<HTMLButtonElement, MorphingButtonProps>(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    morphOnHover = true,
    liquidEffect = true,
    magneticEffect = true,
    pulseOnClick = true,
    glowIntensity = 0.5,
    children,
    disabled,
    onMouseMove,
    onMouseLeave,
    onClick,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)

    // Spring animations
    const x = useSpring(0, { stiffness: 300, damping: 30 })
    const y = useSpring(0, { stiffness: 300, damping: 30 })
    const scale = useSpring(1, { stiffness: 400, damping: 25 })
    const rotateX = useSpring(0, { stiffness: 200, damping: 20 })
    const rotateY = useSpring(0, { stiffness: 200, damping: 20 })
    
    // Transform springs to CSS values
    const transform = useTransform(
      [x, y, scale, rotateX, rotateY],
      ([xVal, yVal, scaleVal, rxVal, ryVal]) =>
        `translateX(${xVal}px) translateY(${yVal}px) scale(${scaleVal}) rotateX(${rxVal}deg) rotateY(${ryVal}deg)`
    )

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      const rect = e.currentTarget.getBoundingClientRect()
      setButtonRect(rect)
      
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      setMousePos({ x: mouseX, y: mouseY })

      if (magneticEffect) {
        // Magnetic pull effect
        const strength = 0.3
        x.set(mouseX * strength)
        y.set(mouseY * strength)
      }

      if (liquidEffect) {
        // 3D tilt effect
        const tiltStrength = 0.1
        rotateY.set(mouseX * tiltStrength)
        rotateX.set(-mouseY * tiltStrength)
      }

      onMouseMove?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      setIsHovered(false)
      
      // Reset transformations with spring animation
      x.set(0)
      y.set(0)
      rotateX.set(0)
      rotateY.set(0)
      
      if (morphOnHover) {
        scale.set(1)
      }

      onMouseLeave?.(e)
    }

    const handleMouseEnter = () => {
      if (disabled) return

      setIsHovered(true)
      
      if (morphOnHover) {
        scale.set(1.05)
      }
    }

    const handleMouseDown = () => {
      if (disabled) return

      setIsPressed(true)
      scale.set(0.95)
    }

    const handleMouseUp = () => {
      if (disabled) return

      setIsPressed(false)
      
      if (isHovered && morphOnHover) {
        scale.set(1.05)
      } else {
        scale.set(1)
      }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      if (pulseOnClick) {
        // Quick pulse animation
        scale.set(1.1)
        setTimeout(() => {
          scale.set(isHovered ? 1.05 : 1)
        }, 100)
      }

      onClick?.(e)
    }

    const getVariantStyles = () => {
      const baseStyles = "relative overflow-hidden transform-gpu will-change-transform"
      
      switch (variant) {
        case 'primary':
          return cn(baseStyles, "glass-button-primary shadow-lg hover:shadow-xl")
        case 'secondary':
          return cn(baseStyles, "glass-surface-enhanced text-white/90 hover:text-white shadow-md hover:shadow-lg")
        case 'ghost':
          return cn(baseStyles, "glass-interactive text-white/80 hover:text-white")
        case 'destructive':
          return cn(baseStyles, "glass-surface-enhanced text-red-300 hover:text-red-200 border-red-400/30")
        default:
          return cn(baseStyles, "glass-button")
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return "px-4 py-2 text-sm rounded-xl min-h-[36px]"
        case 'lg':
          return "px-8 py-4 text-lg rounded-3xl min-h-[56px]"
        default:
          return "px-6 py-3 text-base rounded-2xl min-h-[48px]"
      }
    }

    // Calculate glow position based on mouse
    const glowX = buttonRect ? (mousePos.x / buttonRect.width) * 100 + 50 : 50
    const glowY = buttonRect ? (mousePos.y / buttonRect.height) * 100 + 50 : 50

    return (
      <motion.button
        ref={ref}
        className={cn(
          getVariantStyles(),
          getSizeStyles(),
          "font-medium focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "transition-colors duration-500 ease-out",
          className
        )}
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {/* Dynamic glow effect */}
        <motion.div
          className="absolute inset-0 rounded-inherit opacity-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,${glowIntensity}) 0%, transparent 70%)`
          }}
          animate={{
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Liquid ripple effect */}
        {liquidEffect && (
          <LiquidRipple 
            isActive={isPressed}
            mousePos={mousePos}
            buttonRect={buttonRect}
          />
        )}

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ width: '200%' }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.button>
    )
  }
)

// Liquid ripple effect component
function LiquidRipple({
  isActive,
  mousePos,
  buttonRect
}: {
  isActive: boolean
  mousePos: { x: number; y: number }
  buttonRect: DOMRect | null
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (!isActive || !buttonRect) return

    const rippleId = Date.now()
    const newRipple = {
      id: rippleId,
      x: mousePos.x + buttonRect.width / 2,
      y: mousePos.y + buttonRect.height / 2
    }

    setRipples(prev => [...prev, newRipple])

    // Clean up ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId))
    }, 800)
  }, [isActive, mousePos, buttonRect])

  return (
    <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20
            }}
            initial={{
              scale: 0,
              opacity: 0.8
            }}
            animate={{
              scale: 10,
              opacity: 0
            }}
            exit={{
              scale: 12,
              opacity: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

MorphingButton.displayName = "MorphingButton"

export default MorphingButton