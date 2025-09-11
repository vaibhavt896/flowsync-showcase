'use client'

import React from 'react'
import { 
  Timer, 
  Brain, 
  Settings,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { useNavigationStore, AppState } from '@/stores/navigationStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/utils/helpers'

interface NavItem {
  state: AppState
  icon: typeof Timer
  label: string
  subtitle: string
  badge?: string
}

const navigationItems: NavItem[] = [
  { 
    state: 'timer', 
    icon: Timer, 
    label: 'Timer',
    subtitle: 'FOCUS NOW'
  },
  { 
    state: 'insights', 
    icon: Brain, 
    label: 'Insights',
    subtitle: 'AI ANALYSIS',
    badge: 'NEW'
  },
  { 
    state: 'settings', 
    icon: Settings, 
    label: 'Settings',
    subtitle: ''
  },
]

export default function CleanPillNavigation() {
  const { currentState, transitionTo, isTransitioning } = useNavigationStore()
  const { theme, setTheme } = useThemeStore()

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
      {/* Desktop Navigation - Clean & Minimal */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div className="flex items-center gap-1 px-2 py-2 rounded-2xl backdrop-blur-lg bg-white/80 border border-white/60 shadow-lg">
          {navigationItems.map((item) => {
            const isActive = currentState === item.state
            const Icon = item.icon
            
            return (
              <button
                key={item.state}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-orange-500 text-white shadow-md" 
                    : "text-neutral-700 hover:bg-white/70 hover:text-neutral-900"
                )}
                onClick={() => !isTransitioning && transitionTo(item.state)}
                disabled={isTransitioning}
              >
                {/* Badge */}
                {item.badge && (
                  <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </div>
                )}
                
                <Icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            )
          })}
          
          {/* Theme Toggle */}
          <button
            className="p-2 rounded-xl text-neutral-700 hover:bg-white/70 hover:text-neutral-900 transition-all duration-200 ml-1"
            onClick={cycleTheme}
            title={`Current theme: ${theme}`}
          >
            <ThemeIcon className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - Clean & Minimal */}
      <div className="md:hidden">
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 px-2 py-2 rounded-2xl backdrop-blur-lg bg-white/80 border border-white/60 shadow-lg">
            {navigationItems.map((item) => {
              const isActive = currentState === item.state
              const Icon = item.icon
              
              return (
                <button
                  key={item.state}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-orange-500 text-white shadow-md" 
                      : "text-neutral-700 hover:bg-white/70 hover:text-neutral-900"
                  )}
                  onClick={() => !isTransitioning && transitionTo(item.state)}
                  disabled={isTransitioning}
                >
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </div>
                  )}
                  
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              )
            })}
            
            {/* Theme Toggle */}
            <button
              className="p-2 rounded-xl text-neutral-700 hover:bg-white/70 hover:text-neutral-900 transition-all duration-200 ml-1"
              onClick={cycleTheme}
              title={`Current theme: ${theme}`}
            >
              <ThemeIcon className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}