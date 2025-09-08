'use client'

import { useState } from 'react'
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
}

const navigationItems: NavItem[] = [
  { state: 'timer', icon: Timer, label: 'Timer' },
  { state: 'analytics', icon: BarChart3, label: 'Analytics' },
  { state: 'insights', icon: Brain, label: 'Insights' },
  { state: 'settings', icon: Settings, label: 'Settings' },
]

export default function CleanNavigation() {
  const { currentState, transitionTo, isTransitioning } = useNavigationStore()
  const { theme, setTheme } = useThemeStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
      {/* CSS Override for Living Interface Effects */}
      <style jsx>{`
        [data-no-living-interface="true"],
        [data-no-living-interface="true"] * {
          transform: none !important;
          transition: none !important;
          animation: none !important;
          filter: none !important;
          scale: none !important;
        }
        
        [data-no-living-interface="true"]:hover,
        [data-no-living-interface="true"] *:hover {
          transform: none !important;
          animation: none !important;
          scale: none !important;
        }
      `}</style>

      {/* Desktop Navigation - Absolutely NO Effects */}
      <nav 
        className={cn(
          "fixed top-6 left-6 z-50 hidden md:block",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md",
          "border border-gray-200/40 dark:border-gray-700/40",
          "rounded-xl shadow-sm",
          "p-1.5 w-48"
        )}
        style={{ 
          transform: 'none !important',
          transition: 'none !important',
          animation: 'none !important',
          filter: 'none !important'
        }}
        data-no-living-interface="true"
      >
        <div className="flex flex-col gap-0">
          {/* Brand - Zero Effects */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                <Timer className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                FlowSync
              </span>
            </div>
          </div>

          {/* Navigation Items - Zero Hover Effects */}
          <div className="space-y-px">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentState === item.state

              return (
                <button
                  key={item.state}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-normal",
                    "rounded-md cursor-pointer",
                    isActive 
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300" 
                      : "text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => !isTransitioning && transitionTo(item.state)}
                  disabled={isTransitioning}
                  style={{ 
                    transition: 'none !important',
                    transform: 'none !important'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  
                  {isTransitioning && isActive && (
                    <div className="ml-auto">
                      <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Theme Toggle - Zero Effects */}
          <div className="mt-1 pt-1 border-t border-gray-200/60 dark:border-gray-700/60">
            <button
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-normal",
                "text-gray-700 dark:text-gray-300 rounded-md cursor-pointer"
              )}
              onClick={cycleTheme}
              style={{ 
                transition: 'none !important',
                transform: 'none !important'
              }}
            >
              <ThemeIcon className="w-4 h-4" />
              <span className="capitalize">{theme}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Zero Effects */}
      <div className="md:hidden" data-no-living-interface="true">
        {/* Mobile Header */}
        <div className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 py-3",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md",
          "border-b border-gray-200/30 dark:border-gray-700/30"
        )}>
          <div className="flex items-center justify-between">
            {/* Mobile Brand */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                <Timer className="w-3 h-3 text-white" />
              </div>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                FlowSync
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="p-2 cursor-pointer"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{ 
                transition: 'none !important',
                transform: 'none !important'
              }}
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Overlay Menu */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-40">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/5"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div className={cn(
              "absolute top-16 left-4 right-4",
              "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md",
              "border border-gray-200/40 dark:border-gray-700/40",
              "rounded-xl shadow-sm p-2"
            )}>
              {/* Mobile Navigation Items */}
              <div className="space-y-px">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentState === item.state

                  return (
                    <button
                      key={item.state}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-normal",
                        "rounded-md cursor-pointer",
                        isActive 
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300" 
                          : "text-gray-700 dark:text-gray-300"
                      )}
                      onClick={() => {
                        if (!isTransitioning) {
                          transitionTo(item.state)
                          setIsMobileOpen(false)
                        }
                      }}
                      disabled={isTransitioning}
                      style={{ 
                        transition: 'none !important',
                        transform: 'none !important'
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Mobile Theme Toggle */}
              <div className="mt-1 pt-1 border-t border-gray-200/60 dark:border-gray-700/60">
                <button
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-normal",
                    "text-gray-700 dark:text-gray-300 rounded-md cursor-pointer"
                  )}
                  onClick={cycleTheme}
                  style={{ 
                    transition: 'none !important',
                    transform: 'none !important'
                  }}
                >
                  <ThemeIcon className="w-4 h-4" />
                  <span className="capitalize">{theme}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}