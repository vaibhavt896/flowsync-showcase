import { forwardRef, useState } from 'react'
import { cn } from '@/utils/helpers'
import { motion } from 'framer-motion'

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  rippleEffect?: boolean
  morphOnHover?: boolean
  ambient?: boolean
}

const LiquidGlassButton = forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  ({ 
    className, 
    variant = 'glass', 
    size = 'md', 
    rippleEffect = true,
    morphOnHover = true,
    ambient = false,
    children, 
    ...props 
  }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (rippleEffect && !props.disabled) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()

        setRipples(prev => [...prev, { id, x, y }])

        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id))
        }, 600)
      }

      props.onClick?.(e)
    }

    const baseClasses = cn(
      'relative inline-flex items-center justify-center font-medium',
      'focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'transition-all duration-500 ease-out transform-gpu will-change-transform',
      'overflow-hidden select-none',
      {
        // Size variants
        'px-3 py-2 text-sm rounded-xl min-h-[36px]': size === 'sm',
        'px-6 py-3 text-base rounded-2xl min-h-[48px]': size === 'md',
        'px-8 py-4 text-lg rounded-3xl min-h-[56px]': size === 'lg',
        
        // Morph animation
        'hover:scale-105 active:scale-95': morphOnHover && !props.disabled,
        
        // Ambient glow
        'glass-ambient': ambient
      }
    )

    const variantClasses = cn({
      // Primary glass
      'glass-button-primary text-white shadow-lg hover:shadow-xl': variant === 'primary',
      
      // Secondary glass
      'glass-surface-enhanced text-white/90 hover:text-white shadow-md hover:shadow-lg': variant === 'secondary',
      
      // Ghost glass
      'glass-interactive text-white/80 hover:text-white': variant === 'ghost',
      
      // Pure glass
      'glass-button text-white/90 hover:text-white': variant === 'glass'
    })

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variantClasses, className)}
        onClick={handleClick}
        whileHover={morphOnHover ? { scale: 1.05 } : {}}
        whileTap={morphOnHover ? { scale: 0.95 } : {}}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 8, opacity: 0 }}
            exit={{ scale: 8, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}

        {/* Shimmer effect */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ width: '200%', left: '-100%' }}
            animate={{
              left: ['−100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-inherit opacity-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    )
  }
)

LiquidGlassButton.displayName = "LiquidGlassButton"

export default LiquidGlassButton