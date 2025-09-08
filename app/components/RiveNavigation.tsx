'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRive, UseRiveParameters } from '@rive-app/react-canvas'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Timer, 
  BarChart3, 
  Brain, 
  Settings, 
  Sun,
  Moon,
  Monitor,
  Menu,
  X
} from 'lucide-react'
import { useNavigationStore, AppState } from '@/stores/navigationStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/utils/helpers'

interface NavItem {
  state: AppState
  icon: typeof Timer
  label: string
  riveFile?: string
  color: string
}

const navigationItems: NavItem[] = [
  { 
    state: 'timer', 
    icon: Timer, 
    label: 'Timer',
    riveFile: 'timer-nav.riv',
    color: '#3B82F6'
  },
  { 
    state: 'analytics', 
    icon: BarChart3, 
    label: 'Analytics',
    riveFile: 'analytics-nav.riv', 
    color: '#8B5CF6'
  },
  { 
    state: 'insights', 
    icon: Brain, 
    label: 'Insights',
    riveFile: 'brain-nav.riv',
    color: '#EC4899'
  },
  { 
    state: 'settings', 
    icon: Settings, 
    label: 'Settings',
    riveFile: 'settings-nav.riv',
    color: '#F59E0B'
  },
]

interface RiveNavItemProps {
  item: NavItem
  isActive: boolean
  isTransitioning: boolean
  onClick: () => void
}

function RiveNavItem({ item, isActive, isTransitioning, onClick }: RiveNavItemProps) {
  const riveRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const riveOptions: UseRiveParameters = {
    src: item.riveFile || 'default-nav.riv',
    canvas: riveRef.current,
    autoplay: false,
    stateMachines: ['NavStateMachine'],
    onLoad: () => {
      console.log(`Rive ${item.label} nav loaded`)
    },
    onLoadError: () => {
      console.log(`Rive ${item.label} fallback to CSS`)
    }
  }

  const { rive } = useRive(riveOptions)

  // Update Rive state based on navigation state
  useEffect(() => {
    if (rive && rive.stateMachineInputs?.('NavStateMachine')) {
      const activeInput = rive.stateMachineInputs('NavStateMachine').find(
        input => input.name === 'isActive'
      )
      const hoverInput = rive.stateMachineInputs('NavStateMachine').find(
        input => input.name === 'isHovered'
      )
      
      if (activeInput) activeInput.value = isActive
      if (hoverInput) hoverInput.value = isHovered
    }
  }, [rive, isActive, isHovered])

  const Icon = item.icon

  return (
    <motion.button
      className={cn(
        "group relative w-full flex items-center gap-4 px-4 py-3 rounded-2xl",
        "transition-all duration-300 overflow-hidden",
        isActive 
          ? "bg-white/20 shadow-lg border border-white/30" 
          : "hover:bg-white/10 border border-transparent hover:border-white/20"
      )}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isTransitioning}
    >
      {/* Background Glow */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{ 
              background: `radial-gradient(circle at center, ${item.color}40, transparent 70%)`
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Rive Animation Container */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Rive Canvas */}
        <canvas
          ref={riveRef}
          className="absolute inset-0 w-full h-full z-10"
          style={{ 
            mixBlendMode: 'multiply',
            opacity: 0.8
          }}
        />

        {/* Fallback Icon */}
        <Icon 
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isActive 
              ? "text-white drop-shadow-sm" 
              : "text-gray-300 group-hover:text-white"
          )} 
          style={{
            filter: isActive 
              ? `drop-shadow(0 0 8px ${item.color}80)` 
              : undefined
          }}
        />

        {/* Active State Ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 opacity-60"
            style={{ borderColor: item.color }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.3, 0.6]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Hover Particle Effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full"
                style={{ 
                  backgroundColor: item.color,
                  left: `${30 + i * 20}%`,
                  top: `${25 + i * 25}%`
                }}
                animate={{
                  y: [-2, -10, -2],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Label */}
      <span className={cn(
        "text-sm font-medium transition-all duration-300",
        isActive 
          ? "text-white font-semibold" 
          : "text-gray-300 group-hover:text-white"
      )}>
        {item.label}
      </span>

      {/* Loading Indicator */}
      {isTransitioning && isActive && (
        <div className="ml-auto">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ opacity: 0.7 }}
          />
        </div>
      )}

      {/* Subtle Shine Effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.div
          className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12"
          animate={{
            x: isHovered ? ['0%', '200%'] : '0%',
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.button>
  )
}

export default function RiveNavigation() {
  const { currentState, transitionTo, isTransitioning } = useNavigationStore()
  const { theme, setTheme } = useThemeStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const logoRiveRef = useRef<HTMLCanvasElement>(null)

  // Logo Rive Animation
  const logoRiveOptions: UseRiveParameters = {
    src: 'logo-nav.riv',
    canvas: logoRiveRef.current,
    autoplay: true,
    stateMachines: ['LogoStateMachine'],
    onLoad: () => {
      console.log('Logo Rive loaded')
    },
    onLoadError: () => {
      console.log('Logo Rive fallback')
    }
  }

  const { rive: logoRive } = useRive(logoRiveOptions)

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }

  const ThemeIcon = themeIcons[theme]

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <>
      {/* Desktop Navigation - Rive Powered */}
      <nav className={cn(
        "fixed top-6 left-6 z-50 hidden md:block",
        "w-64 bg-black/40 backdrop-blur-2xl",
        "border border-white/20 rounded-3xl shadow-2xl",
        "p-6"
      )}>
        {/* Logo Section with Rive */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative w-10 h-10">
            {/* Logo Rive Canvas */}
            <canvas
              ref={logoRiveRef}
              className="absolute inset-0 w-full h-full z-10"
              style={{ 
                mixBlendMode: 'screen',
                opacity: 0.9
              }}
            />
            
            {/* Fallback Logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-white" />
            </div>

            {/* Logo Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-60 blur-lg animate-pulse" />
          </div>
          
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">FlowSync</h1>
            <p className="text-gray-400 text-xs">AI-Powered Focus</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2 mb-8">
          {navigationItems.map((item) => (
            <RiveNavItem
              key={item.state}
              item={item}
              isActive={currentState === item.state}
              isTransitioning={isTransitioning}
              onClick={() => !isTransitioning && transitionTo(item.state)}
            />
          ))}
        </div>

        {/* Theme Toggle with Rive */}
        <div className="pt-6 border-t border-white/20">
          <motion.button
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-2xl",
              "hover:bg-white/10 border border-transparent hover:border-white/20",
              "transition-all duration-300 group"
            )}
            onClick={cycleTheme}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <ThemeIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300 capitalize">
              {theme} Theme
            </span>

            {/* Theme Toggle Shine */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <motion.div
                className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12"
                animate={{
                  x: [-100, 200]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </motion.button>
        </div>

        {/* Ambient Background Animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {/* Floating Orbs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 rounded-full opacity-10"
              style={{
                background: `radial-gradient(circle, ${navigationItems[i]?.color || '#3B82F6'}, transparent)`,
                left: `${10 + i * 30}%`,
                top: `${20 + i * 25}%`
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2
              }}
            />
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 py-4",
          "bg-black/40 backdrop-blur-2xl border-b border-white/20"
        )}>
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">FlowSync</span>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-300"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Overlay Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                onClick={() => setIsMobileOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                className={cn(
                  "absolute top-20 left-4 right-4",
                  "bg-black/40 backdrop-blur-2xl border border-white/20",
                  "rounded-3xl shadow-2xl p-6"
                )}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentState === item.state

                    return (
                      <motion.button
                        key={item.state}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-2xl",
                          "transition-all duration-300",
                          isActive 
                            ? "bg-white/20 border border-white/30" 
                            : "hover:bg-white/10 border border-transparent"
                        )}
                        onClick={() => {
                          if (!isTransitioning) {
                            transitionTo(item.state)
                            setIsMobileOpen(false)
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isTransitioning}
                      >
                        <Icon 
                          className={cn(
                            "w-6 h-6 transition-colors duration-300",
                            isActive ? "text-white" : "text-gray-300"
                          )}
                          style={{
                            filter: isActive 
                              ? `drop-shadow(0 0 8px ${item.color}80)` 
                              : undefined
                          }}
                        />
                        <span className={cn(
                          "text-base font-medium transition-colors duration-300",
                          isActive ? "text-white" : "text-gray-300"
                        )}>
                          {item.label}
                        </span>

                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-white/60" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}