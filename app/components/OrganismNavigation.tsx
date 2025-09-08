import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  Timer, 
  BarChart3, 
  Brain, 
  Settings, 
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react'
import { useNavigationStore, AppState } from '@/stores/navigationStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/utils/helpers'

interface NavItem {
  state: AppState
  icon: typeof Timer
  label: string
  color: string
}

const navigationItems: NavItem[] = [
  { state: 'timer', icon: Timer, label: 'Timer', color: 'text-emerald-400' },
  { state: 'analytics', icon: BarChart3, label: 'Analytics', color: 'text-blue-400' },
  { state: 'insights', icon: Brain, label: 'Insights', color: 'text-purple-400' },
  { state: 'settings', icon: Settings, label: 'Settings', color: 'text-orange-400' },
]

// Add special navigation for Rive demo
const specialItems = [
  { href: '/rive-demo', icon: Zap, label: 'Rive Demo', color: 'text-yellow-400' }
]

// Enhanced spring animations
const poppySpring = { 
  type: "spring" as const, 
  damping: 20, 
  stiffness: 300, 
  mass: 0.8 
}

const magneticSpring = { 
  type: "spring" as const, 
  damping: 15, 
  stiffness: 400, 
  mass: 0.5 
}

export default function OrganismNavigation() {
  const { currentState, transitionTo, isTransitioning } = useNavigationStore()
  const { theme, setTheme } = useThemeStore()
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<AppState | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Enhanced motion values
  const hoverProgress = useMotionValue(0)
  const pulseProgress = useMotionValue(0)
  const magneticX = useSpring(0, magneticSpring)
  const magneticY = useSpring(0, magneticSpring)
  const glowIntensity = useSpring(0, poppySpring)

  // Mouse tracking for magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current && isHovered) {
        const rect = navRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) * 0.1
        const deltaY = (e.clientY - centerY) * 0.1
        
        magneticX.set(deltaX)
        magneticY.set(deltaY)
      } else {
        magneticX.set(0)
        magneticY.set(0)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isHovered, magneticX, magneticY])

  useEffect(() => {
    hoverProgress.set(isHovered ? 1 : 0)
    glowIntensity.set(isHovered ? 1 : 0)
  }, [isHovered, hoverProgress, glowIntensity])

  // Advanced pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      pulseProgress.set(Math.sin(Date.now() / 3000) * 0.3 + 0.7)
    }, 16)
    return () => clearInterval(interval)
  }, [pulseProgress])

  const containerScale = useTransform(hoverProgress, [0, 1], [1, 1.05])
  const containerGlow = useTransform(glowIntensity, [0, 1], [0, 30])
  const pulse = useTransform(pulseProgress, [0, 1], [1, 1.08])

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

  // Responsive behavior
  const shouldMinimizeNav = currentState === 'timer' && !isHovered && !isTransitioning

  return (
    <>
      {/* Desktop Navigation */}
      <motion.div
        ref={navRef}
        className={cn(
          "fixed z-50 transition-all duration-700 ease-out",
          "backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5",
          "dark:from-gray-900/40 dark:via-gray-900/30 dark:to-gray-900/20",
          "border border-white/25 dark:border-white/15 shadow-2xl",
          shouldMinimizeNav 
            ? "top-6 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 opacity-70 hover:opacity-100"
            : "top-6 left-6 rounded-3xl p-5 opacity-95",
          "hidden md:block"
        )}
        style={{
          x: magneticX,
          y: magneticY,
          scale: containerScale,
          boxShadow: useTransform(
            containerGlow,
            [0, 1],
            [
              "0 10px 40px rgba(0, 0, 0, 0.1)",
              "0 20px 60px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)"
            ]
          ),
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => {
          setIsHovered(false)
          setHoveredItem(null)
        }}
        transition={poppySpring}
      >
        {/* Minimized State - Enhanced Brand */}
        <AnimatePresence mode="wait">
          {shouldMinimizeNav && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={poppySpring}
            >
              <motion.div 
                className="relative w-8 h-8 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden"
                style={{ scale: pulse }}
                whileHover={{ scale: 1.2, rotate: 180 }}
                transition={poppySpring}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-400 to-purple-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <Timer className="w-4 h-4 text-white relative z-10" />
                <Sparkles className="w-2 h-2 text-white/60 absolute top-1 right-1" />
              </motion.div>
              <motion.span 
                className="text-sm font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                FlowSync
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded State - Innovative Full Navigation */}
        <AnimatePresence>
          {!shouldMinimizeNav && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, scale: 0.85, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateX: -15 }}
              transition={poppySpring}
            >
              {/* Enhanced Brand with Particles */}
              <div className="relative flex items-center gap-4 pb-4 border-b border-white/20 dark:border-white/10">
                <motion.div 
                  className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center overflow-hidden shadow-lg"
                  style={{ scale: pulse }}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -10, 10, 0],
                    background: "linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6, #f59e0b)"
                  }}
                  transition={poppySpring}
                >
                  {/* Rotating background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-400 via-purple-400 to-orange-400 rounded-xl opacity-80"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                  <Timer className="w-5 h-5 text-white relative z-10 filter drop-shadow-sm" />
                  
                  {/* Floating particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${30 + i * 15}%`,
                      }}
                      animate={{
                        y: [-2, -8, -2],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </motion.div>
                
                <div className="flex flex-col">
                  <motion.span 
                    className="font-bold text-xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    FlowSync
                  </motion.span>
                  <motion.span
                    className="text-xs text-white/60"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    AI-Powered Focus
                  </motion.span>
                </div>
              </div>

              {/* Innovative Navigation Items */}
              <div className="space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = currentState === item.state
                  const isHoveredItem = hoveredItem === item.state

                  return (
                    <motion.button
                      key={item.state}
                      className={cn(
                        "relative w-full flex items-center gap-4 px-4 py-3 rounded-xl",
                        "transition-all duration-300 group overflow-hidden",
                        "backdrop-blur-sm border",
                        isActive 
                          ? "bg-gradient-to-r from-white/20 via-white/15 to-white/10 border-white/30 shadow-lg" 
                          : "bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/25"
                      )}
                      onClick={() => !isTransitioning && transitionTo(item.state)}
                      onHoverStart={() => setHoveredItem(item.state)}
                      onHoverEnd={() => setHoveredItem(null)}
                      whileHover={{ 
                        scale: 1.03, 
                        y: -2,
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={poppySpring}
                      disabled={isTransitioning}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      {/* Dynamic background effects */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/15 to-purple-500/10 rounded-xl"
                            layoutId="activeBackground"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={poppySpring}
                          />
                        )}
                        
                        {isHoveredItem && !isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/8 to-white/5 rounded-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={poppySpring}
                          />
                        )}
                      </AnimatePresence>

                      {/* Enhanced Icon with Glow Effect */}
                      <motion.div
                        className={cn(
                          "relative z-10 p-2 rounded-lg transition-all duration-300",
                          isActive 
                            ? "bg-white/20 shadow-lg" 
                            : isHoveredItem 
                            ? "bg-white/10" 
                            : ""
                        )}
                        animate={
                          isActive 
                            ? { 
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                  "0 0 0px rgba(59, 130, 246, 0)",
                                  "0 0 20px rgba(59, 130, 246, 0.3)",
                                  "0 0 0px rgba(59, 130, 246, 0)"
                                ]
                              } 
                            : { scale: 1 }
                        }
                        transition={
                          isActive 
                            ? { duration: 2, repeat: Infinity, ease: "easeInOut" } 
                            : poppySpring
                        }
                      >
                        <Icon className={cn(
                          "w-5 h-5 transition-colors duration-300",
                          isActive 
                            ? item.color 
                            : isHoveredItem 
                            ? "text-white" 
                            : "text-white/60"
                        )} />
                      </motion.div>
                      
                      {/* Enhanced Label */}
                      <motion.span 
                        className={cn(
                          "relative z-10 font-medium transition-all duration-300",
                          isActive 
                            ? "text-white font-semibold" 
                            : isHoveredItem 
                            ? "text-white/90" 
                            : "text-white/70"
                        )}
                        animate={isActive ? { x: [0, 2, 0] } : { x: 0 }}
                        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      >
                        {item.label}
                      </motion.span>

                      {/* Progress indicator for transitions */}
                      <AnimatePresence>
                        {isTransitioning && isActive && (
                          <motion.div
                            className="absolute right-4 w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ 
                              rotate: 360,
                              opacity: 1, 
                              scale: 1 
                            }}
                            transition={{ 
                              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                              opacity: { duration: 0.2 },
                              scale: { duration: 0.2 }
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Hover particles */}
                      {isHoveredItem && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(2)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              style={{
                                left: `${20 + i * 40}%`,
                                top: `${30 + i * 20}%`,
                              }}
                              animate={{
                                y: [-1, -6, -1],
                                opacity: [0.3, 0.8, 0.3],
                                scale: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  )
                })}

                {/* Special Navigation Items - Rive Demo */}
                {specialItems.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative w-full flex items-center gap-4 px-4 py-3 rounded-xl",
                        "transition-all duration-300 group overflow-hidden",
                        "backdrop-blur-sm border",
                        "bg-gradient-to-r from-yellow-500/20 via-orange-500/15 to-yellow-500/10 border-yellow-400/30 shadow-lg"
                      )}
                      whileHover={{ 
                        scale: 1.03, 
                        y: -2,
                        boxShadow: "0 10px 30px rgba(251, 191, 36, 0.3)"
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={poppySpring}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ transitionDelay: `${(navigationItems.length + index) * 0.1}s` }}
                    >
                      {/* Animated background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/15 to-yellow-400/10 rounded-xl"
                        animate={{ 
                          opacity: [0.5, 0.8, 0.5],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      {/* Enhanced Icon with special glow */}
                      <motion.div
                        className="relative z-10 p-2 rounded-lg bg-yellow-400/20 shadow-md"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 0 0px rgba(251, 191, 36, 0)",
                            "0 0 20px rgba(251, 191, 36, 0.4)",
                            "0 0 0px rgba(251, 191, 36, 0)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Icon className="w-5 h-5 text-yellow-300" />
                      </motion.div>
                      
                      {/* Enhanced Label */}
                      <motion.span 
                        className="relative z-10 font-semibold text-yellow-100"
                        animate={{ x: [0, 2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {item.label}
                      </motion.span>

                      {/* Special sparkle effect */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                            style={{
                              left: `${30 + i * 20}%`,
                              top: `${25 + i * 15}%`,
                            }}
                            animate={{
                              y: [-1, -8, -1],
                              opacity: [0.3, 1, 0.3],
                              scale: [0.5, 1.2, 0.5],
                            }}
                            transition={{
                              duration: 1.5 + i * 0.3,
                              repeat: Infinity,
                              delay: i * 0.4,
                            }}
                          />
                        ))}
                      </div>
                    </motion.a>
                  )
                })}
              </div>

              {/* Enhanced Theme Toggle */}
              <div className="pt-4 border-t border-white/20 dark:border-white/10">
                <motion.button
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl",
                    "transition-all duration-300 group overflow-hidden",
                    "backdrop-blur-sm border bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/25"
                  )}
                  onClick={cycleTheme}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -2,
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={poppySpring}
                >
                  <motion.div
                    className="relative z-10 p-2 rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/15"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <ThemeIcon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  <span className="relative z-10 font-medium text-white/70 group-hover:text-white/90 capitalize transition-colors duration-300">
                    {theme} Theme
                  </span>
                  
                  {/* Theme toggle particles */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(2)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${25 + i * 35}%`,
                          top: `${40 + i * 10}%`,
                        }}
                        animate={{
                          y: [-1, -5, -1],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <motion.div
          className={cn(
            "fixed top-0 left-0 right-0 z-50 px-4 py-3",
            "backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/15 to-white/10",
            "dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-900/30",
            "border-b border-white/20 dark:border-white/10 shadow-lg"
          )}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={poppySpring}
        >
          <div className="flex items-center justify-between">
            {/* Mobile Brand */}
            <motion.div 
              className="flex items-center gap-3"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="relative w-8 h-8 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center overflow-hidden shadow-md"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={poppySpring}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-400 to-purple-400 rounded-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <Timer className="w-4 h-4 text-white relative z-10" />
              </motion.div>
              <span className="font-bold text-lg bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                FlowSync
              </span>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className={cn(
                "relative p-2 rounded-lg",
                "backdrop-blur-sm bg-white/10 border border-white/20",
                "hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              )}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={poppySpring}
            >
              <AnimatePresence mode="wait">
                {isMobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={poppySpring}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={poppySpring}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Overlay Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Backdrop */}
              <motion.div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setIsMobileOpen(false)}
              />

              {/* Mobile Menu Panel */}
              <motion.div
                className={cn(
                  "absolute top-16 left-4 right-4 max-w-sm mx-auto",
                  "backdrop-blur-2xl bg-gradient-to-br from-white/25 via-white/20 to-white/15",
                  "dark:from-gray-900/60 dark:via-gray-900/50 dark:to-gray-900/40",
                  "border border-white/30 dark:border-white/20 shadow-2xl rounded-2xl",
                  "p-6 space-y-4"
                )}
                initial={{ scale: 0.9, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: -20, opacity: 0 }}
                transition={poppySpring}
              >
                {/* Mobile Navigation Items */}
                <div className="space-y-3">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = currentState === item.state

                    return (
                      <motion.button
                        key={item.state}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl",
                          "transition-all duration-300 group",
                          "backdrop-blur-sm border",
                          isActive 
                            ? "bg-gradient-to-r from-white/30 via-white/25 to-white/20 border-white/40 shadow-lg" 
                            : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/35"
                        )}
                        onClick={() => {
                          if (!isTransitioning) {
                            transitionTo(item.state)
                            setIsMobileOpen(false)
                          }
                        }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={poppySpring}
                        disabled={isTransitioning}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ transitionDelay: `${index * 0.1}s` }}
                      >
                        <motion.div
                          className={cn(
                            "p-2 rounded-lg transition-all duration-300",
                            isActive 
                              ? "bg-white/25 shadow-md" 
                              : "bg-white/15 group-hover:bg-white/20"
                          )}
                          animate={isActive ? { 
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              "0 0 0px rgba(59, 130, 246, 0)",
                              "0 0 15px rgba(59, 130, 246, 0.4)",
                              "0 0 0px rgba(59, 130, 246, 0)"
                            ]
                          } : { scale: 1 }}
                          transition={isActive ? { duration: 2, repeat: Infinity } : poppySpring}
                        >
                          <Icon className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isActive ? item.color : "text-white/80 group-hover:text-white"
                          )} />
                        </motion.div>
                        
                        <span className={cn(
                          "font-medium transition-all duration-300",
                          isActive 
                            ? "text-white font-semibold" 
                            : "text-white/80 group-hover:text-white"
                        )}>
                          {item.label}
                        </span>

                        {isActive && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Mobile Theme Toggle */}
                <div className="pt-4 border-t border-white/20">
                  <motion.button
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-xl",
                      "backdrop-blur-sm bg-white/10 border border-white/20",
                      "hover:bg-white/20 hover:border-white/35 transition-all duration-300"
                    )}
                    onClick={cycleTheme}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={poppySpring}
                  >
                    <motion.div
                      className="p-2 rounded-lg bg-white/15 hover:bg-white/20 transition-all duration-300"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <ThemeIcon className="w-5 h-5 text-white/80" />
                    </motion.div>
                    <span className="font-medium text-white/80 capitalize">
                      {theme} Theme
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}