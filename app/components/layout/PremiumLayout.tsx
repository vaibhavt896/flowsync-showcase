'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Timer, 
  BarChart3, 
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
import { OrganicShapes } from '../ui/OrganicShapes'
import { ParticleSystem } from '../ui/ParticleSystem'

interface PremiumLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { 
    name: 'Timer', 
    href: '/', 
    icon: Timer, 
  },
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: BarChart3, 
  },
  { 
    name: 'Insights', 
    href: '/insights', 
    icon: Brain, 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings, 
  },
]

export default function PremiumLayout({ children }: PremiumLayoutProps) {
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50 to-golden-50 opacity-0" />
    )
  }

  return (
    <>
      <OrganicShapes />
      <ParticleSystem />
      
      <div className="min-h-screen relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-orange-50 to-golden-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        

        {/* Clean Navigation */}
        <nav className="sticky top-0 z-50 m-4">
          <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border border-white/60 dark:border-gray-700/60 rounded-2xl px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="font-black text-2xl text-neutral-900 dark:text-neutral-100">FlowSync</div>
                  <div className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">AI-Powered Focus</div>
                </div>
                <Sparkles className="hidden sm:block w-4 h-4 text-golden-500" />
              </Link>

              {/* Right Side Navigation */}
              <div className="flex items-center gap-2">
                {/* Navigation Items */}
                <div className="hidden md:flex items-center gap-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    
                    return (
                      <Link key={item.name} href={item.href}>
                        <button
                          className={cn(
                            "relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold overflow-hidden group",
                            "transition-all duration-500 ease-out transform hover:scale-[1.02]",
                            "backdrop-blur-sm border border-transparent",
                            isActive 
                              ? "bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white shadow-xl shadow-orange-500/30 border-orange-400/50" 
                              : "text-neutral-700 dark:text-neutral-300 hover:text-white hover:shadow-xl hover:shadow-orange-500/20 relative z-10"
                          )}
                        >
                          {/* Animated Background Gradient */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            "bg-gradient-to-r from-orange-500 via-pink-500 to-golden-500",
                            "bg-size-200 animate-gradient-x"
                          )} />
                          
                          {/* Glass Morphism Effect */}
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm" />
                          
                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          
                          {/* Content */}
                          <div className="relative z-20 flex items-center gap-1.5">
                            <Icon className={cn(
                              "w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110",
                              isActive ? "drop-shadow-sm" : ""
                            )} />
                            <span className="font-medium tracking-wide drop-shadow-sm">{item.name}</span>
                            {item.name === 'Insights' && (
                              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>
                          
                          {/* Hover Ring Effect */}
                          <div className={cn(
                            "absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100",
                            "border-gradient-to-r from-orange-400 via-pink-400 to-golden-400",
                            "transition-all duration-300 scale-110 group-hover:scale-100"
                          )} />
                        </button>
                      </Link>
                    )
                  })}
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={cycleTheme}
                  className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-white/70 dark:hover:bg-gray-800/70 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-200"
                  title={`Current theme: ${theme}`}
                >
                  <ThemeIcon className="w-4 h-4" />
                </button>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-white/70 dark:hover:bg-gray-800/70 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/20 dark:border-gray-700/40">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    
                    return (
                      <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <div
                          className={cn(
                            "relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden group",
                            "transition-all duration-500 ease-out transform hover:scale-[1.01]",
                            "backdrop-blur-sm border border-transparent",
                            isActive 
                              ? "bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white shadow-xl shadow-orange-500/30 border-orange-400/50" 
                              : "text-neutral-700 dark:text-neutral-300 hover:text-white hover:shadow-lg hover:shadow-orange-500/20"
                          )}
                        >
                          {/* Animated Background Gradient */}
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            "bg-gradient-to-r from-orange-500 via-pink-500 to-golden-500",
                            "bg-size-200 animate-gradient-x"
                          )} />
                          
                          {/* Glass Morphism Effect */}
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm" />
                          
                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          
                          {/* Content */}
                          <div className="relative z-10 flex items-center gap-3 w-full">
                            <Icon className={cn(
                              "w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110",
                              isActive ? "drop-shadow-sm" : ""
                            )} />
                            <span className="font-medium tracking-wide">{item.name}</span>
                            {item.name === 'Insights' && (
                              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg animate-pulse ml-auto">
                                NEW
                              </span>
                            )}
                          </div>
                          
                          {/* Hover Ring Effect */}
                          <div className={cn(
                            "absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100",
                            "border-gradient-to-r from-orange-400 via-pink-400 to-golden-400",
                            "transition-all duration-300 scale-105 group-hover:scale-100"
                          )} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Content Container */}
        <main className="px-4 pb-8">
          <div className="relative p-6 min-h-[calc(100vh-10rem)] rounded-2xl backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border border-white/40 dark:border-gray-700/40 shadow-lg">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}