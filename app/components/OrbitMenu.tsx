/**
 * The Orbit Menu™
 * Revolutionary navigation that orbits around current focus
 * Swipe up to emerge, items orbit at different speeds with parallax depth
 */

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/stores/navigationStore'
import { SpringConstants, calculateSpring } from '@/systems/physicsEngine'
import { AdaptiveChromatics } from '@/systems/adaptiveChromatics'
import { 
  Timer, 
  BarChart3, 
  Brain, 
  Settings, 
  Calendar,
  Target,
  Zap,
  Users,
  Globe
} from 'lucide-react'

interface OrbitMenuItem {
  id: string
  label: string
  icon: typeof Timer
  state?: string
  action?: () => void
  distance: number // Distance from center (parallax effect)
  speed: number // Orbital speed multiplier
  size: number // Relative size
  color: string
  description?: string
}

const orbitMenuItems: OrbitMenuItem[] = [
  {
    id: 'timer',
    label: 'Focus Timer',
    icon: Timer,
    state: 'timer',
    distance: 120,
    speed: 1,
    size: 1.2,
    color: 'hsl(200, 70%, 50%)',
    description: 'Deep focus sessions'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    state: 'analytics',
    distance: 140,
    speed: 0.8,
    size: 1,
    color: 'hsl(220, 60%, 55%)',
    description: 'Productivity insights'
  },
  {
    id: 'insights',
    label: 'AI Insights',
    icon: Brain,
    state: 'insights',
    distance: 160,
    speed: 1.2,
    size: 1.1,
    color: 'hsl(280, 60%, 60%)',
    description: 'Intelligent recommendations'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    state: 'settings',
    distance: 100,
    speed: 0.6,
    size: 0.9,
    color: 'hsl(30, 70%, 55%)',
    description: 'Customize experience'
  },
  {
    id: 'calendar',
    label: 'Schedule',
    icon: Calendar,
    distance: 180,
    speed: 1.4,
    size: 0.8,
    color: 'hsl(140, 50%, 50%)',
    description: 'Time blocking'
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    distance: 110,
    speed: 0.9,
    size: 1,
    color: 'hsl(0, 65%, 55%)',
    description: 'Achievement tracking'
  },
  {
    id: 'flow',
    label: 'Flow Zone',
    icon: Zap,
    distance: 200,
    speed: 1.6,
    size: 1.3,
    color: 'hsl(60, 80%, 60%)',
    description: 'Deep work mode'
  },
  {
    id: 'team',
    label: 'Team Sync',
    icon: Users,
    distance: 170,
    speed: 0.7,
    size: 0.9,
    color: 'hsl(320, 60%, 55%)',
    description: 'Collaboration'
  }
]

export default function OrbitMenu() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentState, transitionTo } = useNavigationStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const [chromatics] = useState(() => new AdaptiveChromatics())
  const [orbitTime, setOrbitTime] = useState(0)
  const [dragVelocity, setDragVelocity] = useState({ x: 0, y: 0 })
  const [caughtItem, setCaughtItem] = useState<string | null>(null)
  
  // Motion values for gesture control
  const y = useMotionValue(0)
  const scale = useTransform(y, [-100, 0], [1, 0.8])
  const opacity = useTransform(y, [-100, -50, 0], [1, 0.8, 0])
  
  // Orbital animation
  useEffect(() => {
    let animationFrame: number
    
    const updateOrbit = () => {
      setOrbitTime(Date.now() * 0.001) // Convert to seconds
      animationFrame = requestAnimationFrame(updateOrbit)
    }
    
    if (isOpen) {
      updateOrbit()
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isOpen])
  
  // Swipe gesture detection
  const handlePan = (event: any, info: PanInfo) => {
    const { velocity, offset } = info
    setDragVelocity(velocity)
    
    // Open menu on upward swipe
    if (offset.y < -50 && velocity.y < -100 && !isOpen) {
      setIsOpen(true)
    }
    
    // Close menu on downward swipe
    if (offset.y > 50 && velocity.y > 100 && isOpen) {
      setIsOpen(false)
    }
  }
  
  const handleSwipeUp = () => {
    setIsOpen(true)
  }
  
  const handleItemInteraction = (item: OrbitMenuItem, action: 'hover' | 'catch' | 'flick') => {
    switch (action) {
      case 'hover':
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10)
        }
        break
        
      case 'catch':
        setCaughtItem(item.id)
        // Execute item action
        setTimeout(() => {
          if (item.state) {
            transitionTo(item.state as any)
          } else if (item.action) {
            item.action()
          }
          setIsOpen(false)
          setCaughtItem(null)
        }, 300)
        break
        
      case 'flick':
        // Send item into fast orbit motion
        break
    }
  }
  
  const getItemPosition = (item: OrbitMenuItem, index: number) => {
    const baseAngle = (index / orbitMenuItems.length) * Math.PI * 2
    const timeOffset = orbitTime * item.speed
    const angle = baseAngle + timeOffset
    
    // Add velocity influence for dynamic motion
    const velocityInfluence = (dragVelocity.x * 0.01) + (dragVelocity.y * 0.01)
    const adjustedAngle = angle + velocityInfluence
    
    const x = Math.cos(adjustedAngle) * item.distance
    const y = Math.sin(adjustedAngle) * item.distance
    
    return { x, y, angle: adjustedAngle }
  }
  
  return (
    <>
      {/* Swipe detector */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ 
          background: isOpen ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        onPan={handlePan}
        onClick={() => isOpen && setIsOpen(false)}
      />
      
      {/* Swipe up indicator */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={handleSwipeUp}
        >
          <div className="flex flex-col items-center gap-1 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-8 h-1 bg-white/60 rounded-full" />
            <div className="text-xs text-white/60">Swipe up for menu</div>
          </div>
        </motion.div>
      )}
      
      {/* Orbit Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={calculateSpring(SpringConstants.navigation)}
          >
            {/* Central hub */}
            <motion.div
              className="relative w-20 h-20 pointer-events-auto"
              style={{ scale, opacity }}
              animate={{
                rotate: orbitTime * 20, // Slow rotation
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: { duration: 0, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-full shadow-lg border-2 border-white/30">
                <div className="absolute inset-2 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full" />
                <div className="absolute inset-4 bg-white/20 rounded-full backdrop-blur-sm" />
              </div>
              
              {/* Orbital rings */}
              {[120, 140, 160, 180].map((radius, index) => (
                <motion.div
                  key={radius}
                  className="absolute border border-white/10 rounded-full"
                  style={{
                    width: radius * 2,
                    height: radius * 2,
                    left: -radius + 40,
                    top: -radius + 40,
                  }}
                  animate={{
                    rotate: orbitTime * (10 + index * 5),
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    rotate: { duration: 0, ease: "linear" },
                    opacity: { duration: 3 + index, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              ))}
            </motion.div>
            
            {/* Orbiting menu items */}
            {orbitMenuItems.map((item, index) => {
              const position = getItemPosition(item, index)
              const isCaught = caughtItem === item.id
              
              return (
                <OrbitMenuItem
                  key={item.id}
                  item={item}
                  position={position}
                  index={index}
                  isCaught={isCaught}
                  onInteraction={(action) => handleItemInteraction(item, action)}
                />
              )
            })}
            
            {/* Instructions */}
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-white/80 text-sm font-light">
                Catch an item to select • Flick to send into motion
              </div>
              <div className="text-white/60 text-xs mt-1">
                Swipe down to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * Individual orbiting menu item
 */
function OrbitMenuItem({
  item,
  position,
  index,
  isCaught,
  onInteraction
}: {
  item: OrbitMenuItem
  position: { x: number; y: number; angle: number }
  index: number
  isCaught: boolean
  onInteraction: (action: 'hover' | 'catch' | 'flick') => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const Icon = item.icon
  const size = 48 * item.size
  
  const handlePan = (event: any, info: PanInfo) => {
    const { velocity } = info
    
    // Detect flick gesture
    if (Math.abs(velocity.x) > 500 || Math.abs(velocity.y) > 500) {
      onInteraction('flick')
    }
  }
  
  const handleTap = () => {
    onInteraction('catch')
  }
  
  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        left: `calc(50% + ${position.x}px - ${size/2}px)`,
        top: `calc(50% + ${position.y}px - ${size/2}px)`,
        width: size,
        height: size,
      }}
      initial={{ 
        scale: 0, 
        opacity: 0,
        rotate: -position.angle * (180 / Math.PI)
      }}
      animate={{ 
        scale: isCaught ? 1.5 : (isHovered ? 1.2 : 1),
        opacity: 1,
        rotate: 0,
        filter: isCaught ? 'brightness(1.5) saturate(1.5)' : 'brightness(1)'
      }}
      transition={{
        ...calculateSpring(SpringConstants.navigation),
        delay: index * 0.1
      }}
      onHoverStart={() => {
        setIsHovered(true)
        onInteraction('hover')
      }}
      onHoverEnd={() => setIsHovered(false)}
      onPan={handlePan}
      onTap={handleTap}
      onPanStart={() => setIsDragging(true)}
      onPanEnd={() => setIsDragging(false)}
    >
      <div className="relative w-full h-full">
        {/* Item background */}
        <motion.div
          className="w-full h-full rounded-full shadow-lg border border-white/30"
          style={{
            background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
            backdropFilter: 'blur(10px)'
          }}
          animate={{
            scale: isDragging ? 0.9 : 1,
            boxShadow: isHovered 
              ? `0 0 30px ${item.color}80` 
              : `0 10px 25px rgba(0, 0, 0, 0.2)`
          }}
        />
        
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon 
            className="text-white" 
            size={size * 0.4}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}
          />
        </div>
        
        {/* Label */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            scale: isHovered ? 1.1 : 1
          }}
        >
          <div className="text-white text-xs font-medium whitespace-nowrap">
            {item.label}
          </div>
        </motion.div>
        
        {/* Description tooltip */}
        {isHovered && item.description && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={calculateSpring(SpringConstants.quantum)}
          >
            {item.description}
          </motion.div>
        )}
        
        {/* Orbital trail */}
        <motion.div
          className="absolute inset-0 border border-white/20 rounded-full"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.1, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Catch effect */}
        {isCaught && (
          <motion.div
            className="absolute inset-0 border-4 border-white rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.3, 1],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 0.6 }}
          />
        )}
        
        {/* Parallax depth indicator */}
        <div 
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-white/30 rounded-full"
          style={{
            transform: `scale(${item.distance / 200})`,
            opacity: item.distance / 200
          }}
        />
      </div>
    </motion.div>
  )
}