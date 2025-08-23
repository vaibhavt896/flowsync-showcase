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
import { AppleLiquidGlass, AppleLiquidButton } from '../ui/AppleLiquidGlass'
import { AuroraBackground } from '../ui/AuroraBackground'
import { ParticleSystem } from '../ui/ParticleSystem'
import { MagneticCursor } from '../ui/MagneticCursor'
import { SoundControls } from '../ui/SoundControls'
import { EnhancedCursor } from '../ui/EnhancedCursor'

interface PremiumLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Timer', href: '/', icon: Timer },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Insights', href: '/insights', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function PremiumLayout({ children }: PremiumLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme, actualTheme } = useThemeStore()

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg animate-pulse">Initializing FlowSync...</div>
      </div>
    )
  }

  return (
    <>
      <AuroraBackground />
      <ParticleSystem />
      <MagneticCursor />
      
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Floating Sound Controls */}
        <div className="fixed bottom-6 right-6 z-40">
          <SoundControls compact={true} />
        </div>

        {/* Premium Glass Navigation - Horizontal Top Bar */}
        <nav className="sticky top-0 z-50 m-4">
          <AppleLiquidGlass
            material="ultra-thick"
            blur="ultra"
            rounded="2xl"
            specularHighlight={true}
            className="px-6 py-4"
          >
            <div className="flex items-center justify-between">
              
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <AppleLiquidGlass
                  material="thick"
                  blur="heavy"
                  rounded="xl" 
                  interactive={true}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <Timer className="w-7 h-7 text-white drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                </AppleLiquidGlass>
                <span className="hidden sm:block font-bold text-2xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  FlowSync
                </span>
                <Sparkles className="hidden sm:block w-5 h-5 text-purple-300 animate-pulse" />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <AppleLiquidGlass
                        material={isActive ? "ultra-thick" : "regular"}
                        blur={isActive ? "ultra" : "medium"}
                        interactive={true}
                        rounded="xl"
                        specularHighlight={true}
                        className="flex items-center gap-2 px-4 py-3 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <Icon className={cn(
                          "w-5 h-5 transition-all duration-300",
                          isActive ? "text-blue-300 drop-shadow-lg scale-110" : "text-white/70 hover:text-white"
                        )} />
                        <span className={cn(
                          "font-medium text-sm tracking-tight transition-all duration-300",
                          isActive ? "text-white font-semibold" : "text-white/80 hover:text-white"
                        )}>{item.name}</span>
                      </AppleLiquidGlass>
                    </Link>
                  )
                })}
              </div>

              {/* Theme Toggle & Mobile Menu */}
              <div className="flex items-center gap-3">
                {/* Premium Theme Toggle */}
                <AppleLiquidButton
                  onClick={cycleTheme}
                  variant="ghost"
                  size="sm"
                  className="p-3 hover:scale-110 transition-all duration-300"
                  icon={<ThemeIcon className="w-5 h-5 text-white/80 hover:text-white hover:rotate-180 transition-all duration-500" />}
                />

                {/* Mobile Menu Button */}
                <AppleLiquidButton
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-3"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  icon={
                    <div className={`transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`}>
                      {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </div>
                  }
                />
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={cn(
              "md:hidden overflow-hidden transition-all duration-300 ease-out",
              mobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            )}>
              <div className="pt-4 border-t border-white/10 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <AppleLiquidGlass
                        material={isActive ? "thick" : "thin"}
                        blur={isActive ? "heavy" : "medium"}
                        interactive={true}
                        rounded="lg"
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <Icon className={cn(
                          "w-5 h-5 transition-colors duration-200",
                          isActive ? "text-blue-300" : "text-white/70"
                        )} />
                        <span className={cn(
                          "font-medium",
                          isActive ? "text-white" : "text-white/80"
                        )}>{item.name}</span>
                      </AppleLiquidGlass>
                    </Link>
                  )
                })}
              </div>
            </div>
          </AppleLiquidGlass>
        </nav>

        {/* Premium Content Container */}
        <main className="px-4 pb-8">
          <AppleLiquidGlass
            material="regular"
            blur="heavy"
            rounded="3xl"
            specularHighlight={false}
            className="p-6 lg:p-8 min-h-[calc(100vh-10rem)] backdrop-blur-3xl"
          >
            <div className={cn(
              "transition-all duration-500",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              {children}
            </div>
          </AppleLiquidGlass>
        </main>
      </div>

      {/* Enhanced Cursor - Premium cursor effects */}
      <EnhancedCursor 
        enabled={true}
        color="59, 130, 246" // blue-500
        innerSize={8}
        outerSize={35}
        outerAlpha={0.3}
        innerScale={0.6}
        outerScale={1.4}
      />
    </>
  )
}