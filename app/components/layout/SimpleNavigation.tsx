'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Timer, 
  Brain, 
  Settings, 
  Menu, 
  X,
  Sun,
  Moon,
  Monitor,
  Sparkles
} from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/utils/helpers'

interface SimpleNavigationProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Timer', href: '/', icon: Timer, color: '#EF6F38', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Insights', href: '/insights', icon: Brain, color: '#F088A3', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Settings', href: '/settings', icon: Settings, color: '#F0BB43', gradient: 'from-yellow-500 to-yellow-600' },
]

export default function SimpleNavigation({ children }: SimpleNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-orange-50 to-golden-50">
        <div className="text-neutral-800 text-lg animate-pulse font-bold">Initializing FlowSync...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-neutral-50 via-orange-50 to-golden-50">
      {/* Premium GenZ Navigation */}
      <nav className="sticky top-0 z-50 m-2 sm:m-4">
        <div className="backdrop-blur-2xl bg-white/80 border-2 border-white/50 shadow-2xl rounded-3xl px-4 sm:px-8 py-3 sm:py-5 transition-all duration-500 hover:bg-white/90 hover:shadow-3xl">
          <div className="flex items-center justify-between relative z-10">
            
            {/* Premium Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-4 group relative">
              <div className="relative">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-golden-500 to-pink-500 flex items-center justify-center shadow-2xl border-2 border-white/40 hover:scale-110 transition-transform duration-300">
                  <Timer className="w-5 h-5 sm:w-7 sm:h-7 text-white relative z-10 filter drop-shadow-lg" />
                </div>
              </div>
              
              <div className="hidden sm:flex flex-col relative">
                <span className="font-black text-xl sm:text-3xl text-neutral-800 tracking-tight">
                  FlowSync
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                  AI-Powered Focus
                </span>
              </div>
              
              <div className="hidden sm:block">
                <Sparkles className="w-4 h-4 text-golden-500 animate-pulse" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={cn(
                      "relative flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 rounded-2xl cursor-pointer",
                      "transition-all duration-500 group overflow-hidden border-2 backdrop-blur-xl shadow-lg hover:shadow-2xl",
                      isActive 
                        ? "bg-white/90 border-white/60 shadow-xl hover:scale-105" 
                        : "bg-white/30 border-white/40 hover:bg-white/50 hover:border-white/70 hover:scale-108"
                    )}>
                      
                      {/* Icon */}
                      <div className={cn(
                        "relative z-10 p-2 rounded-xl transition-all duration-300 border border-white/30 shadow-md",
                        isActive ? "bg-white/60 shadow-lg" : "bg-white/20 hover:bg-white/40"
                      )}>
                        <Icon 
                          className="w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 filter drop-shadow-sm" 
                          style={{
                            color: isActive ? item.color : '#6a6a6a'
                          }}
                        />
                        
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-golden-400 rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={cn(
                        "relative z-10 font-bold text-xs lg:text-sm tracking-tight transition-all duration-300",
                        isActive 
                          ? "text-neutral-800 font-black" 
                          : "text-neutral-600 hover:text-neutral-700"
                      )}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="relative p-2 lg:p-3 rounded-2xl cursor-pointer group overflow-hidden backdrop-blur-xl bg-white/70 border-2 border-white/50 shadow-lg hover:bg-white/90 hover:border-white/70 transition-all duration-500 hover:scale-110"
              >
                <div className="relative z-10">
                  <ThemeIcon className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-800 group-hover:text-orange-600 transition-colors duration-500 filter drop-shadow-sm" />
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden relative p-2 lg:p-3 rounded-2xl cursor-pointer backdrop-blur-xl bg-white/70 border-2 border-white/50 shadow-lg hover:bg-white/90 hover:scale-110 transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-neutral-800" />
                ) : (
                  <Menu className="w-5 h-5 text-neutral-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="backdrop-blur-xl bg-white/90 border-2 border-white/50 rounded-2xl p-4 shadow-2xl">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <div 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                          isActive 
                            ? "bg-gradient-to-r from-orange-100 to-golden-100 border-2 border-orange-200" 
                            : "hover:bg-white/50"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: isActive ? item.color : '#6a6a6a' }}
                        />
                        <span className={cn(
                          "font-bold",
                          isActive ? "text-neutral-800" : "text-neutral-600"
                        )}>
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}