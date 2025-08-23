import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Timer, 
  BarChart3, 
  Brain, 
  Settings, 
  Sun,
  Moon,
  Monitor
} from 'lucide-react'
import { useNavigationStore, AppState } from '@/stores/navigationStore'
import { useThemeStore } from '@/stores/themeStore'
import { createOrganismicNavigation, organicSpring } from '@/utils/flipAnimations'
import { cn } from '@/utils/helpers'

interface NavItem {
  state: AppState
  icon: typeof Timer
  label: string
  color: string
}

const navigationItems: NavItem[] = [
  { state: 'timer', icon: Timer, label: 'Timer', color: 'text-emerald-500' },
  { state: 'analytics', icon: BarChart3, label: 'Analytics', color: 'text-blue-500' },
  { state: 'insights', icon: Brain, label: 'Insights', color: 'text-purple-500' },
  { state: 'settings', icon: Settings, label: 'Settings', color: 'text-orange-500' },
]

export default function OrganismNavigation() {
  const { currentState, transitionTo, isTransitioning } = useNavigationStore()
  const { theme, setTheme } = useThemeStore()
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<AppState | null>(null)

  // Motion values for organic responses
  const hoverProgress = useMotionValue(0)
  const pulseProgress = useMotionValue(0)

  useEffect(() => {
    hoverProgress.set(isHovered ? 1 : 0)
  }, [isHovered, hoverProgress])

  // Breathing pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      pulseProgress.set(Math.sin(Date.now() / 2000) * 0.5 + 0.5)
    }, 16)
    return () => clearInterval(interval)
  }, [pulseProgress])

  const containerScale = useTransform(hoverProgress, [0, 1], [1, 1.1])
  const containerGlow = useTransform(hoverProgress, [0, 1], [0, 20])
  const pulse = useTransform(pulseProgress, [0, 1], [1, 1.05])

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

  // Minimize navigation in timer state for immersive experience
  const shouldMinimizeNav = currentState === 'timer' && !isHovered && !isTransitioning

  return (
    <>
      {/* Main Navigation Organism */}
      <motion.div
        className={cn(
          "fixed z-50 transition-all duration-500",
          "backdrop-blur-xl bg-white/10 dark:bg-gray-900/20",
          "border border-gray-200/20 dark:border-gray-700/20",
          shouldMinimizeNav 
            ? "top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 opacity-60"
            : "top-4 left-4 rounded-2xl p-4 opacity-95"
        )}
        style={{
          scale: containerScale,
          filter: useTransform(containerGlow, (v) => `drop-shadow(0 0 ${v}px rgba(59, 130, 246, 0.3))`),
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => {
          setIsHovered(false)
          setHoveredItem(null)
        }}
        transition={organicSpring}
      >
        {/* Minimized State - Just brand */}
        {shouldMinimizeNav && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-5 h-5 bg-gradient-to-br from-primary-500 to-focus-500 rounded-full flex items-center justify-center"
              style={{ scale: pulse }}
            >
              <Timer className="w-2.5 h-2.5 text-white" />
            </motion.div>
            <span className="text-xs font-bold text-white/80">
              FlowSync
            </span>
          </motion.div>
        )}

        {/* Expanded State - Full navigation */}
        {!shouldMinimizeNav && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={organicSpring}
          >
            {/* Brand */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-primary-500 to-focus-500 rounded-lg flex items-center justify-center"
                style={{ scale: pulse }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={organicSpring}
              >
                <Timer className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary-600 to-focus-600 bg-clip-text text-transparent">
                FlowSync
              </span>
            </div>

            {/* Navigation Items */}
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentState === item.state
                const isHoveredItem = hoveredItem === item.state

                return (
                  <motion.button
                    key={item.state}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                      "transition-all duration-200 group relative overflow-hidden",
                      isActive && "bg-primary-50 dark:bg-primary-900/20",
                      !isActive && "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    onClick={() => !isTransitioning && transitionTo(item.state)}
                    onHoverStart={() => setHoveredItem(item.state)}
                    onHoverEnd={() => setHoveredItem(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={organicSpring}
                    disabled={isTransitioning}
                  >
                    {/* Active state morphing background */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-focus-500/10 rounded-lg"
                        layoutId="activeBackground"
                        transition={organicSpring}
                      />
                    )}

                    {/* Hover ripple effect */}
                    {isHoveredItem && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-focus-500/5 rounded-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={organicSpring}
                      />
                    )}

                    <motion.div
                      className={cn(
                        "relative z-10 transition-colors",
                        isActive ? item.color : "text-gray-600 dark:text-gray-400"
                      )}
                      animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={isActive ? { duration: 2, repeat: Infinity } : organicSpring}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    
                    <span className={cn(
                      "relative z-10 font-medium transition-colors",
                      isActive 
                        ? "text-primary-600 dark:text-primary-400" 
                        : "text-gray-700 dark:text-gray-300"
                    )}>
                      {item.label}
                    </span>

                    {/* Loading indicator for transitions */}
                    {isTransitioning && isActive && (
                      <motion.div
                        className="absolute right-3 w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Theme Toggle */}
            <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <motion.button
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                onClick={cycleTheme}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={organicSpring}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <ThemeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
                <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {theme}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

    </>
  )
}