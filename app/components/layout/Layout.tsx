import { useState } from 'react'
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
  Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/utils/helpers'
import { AppleLiquidGlass, AppleLiquidButton } from '../ui/AppleLiquidGlass'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Timer', href: '/', icon: Timer },
  { name: 'Insights', href: '/insights', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
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

  // Apple Liquid Glass Sidebar content component
  const SidebarContent = () => (
    <AppleLiquidGlass
      material="ultra-thick"
      blur="ultra"
      rounded="3xl"
      specularHighlight={true}
      className="h-full flex flex-col m-4 overflow-hidden"
    >
      {/* Apple Liquid Glass Header */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <AppleLiquidGlass
            material="thick"
            blur="heavy"
            rounded="xl" 
            interactive={true}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Timer className="w-6 h-6 text-white drop-shadow-sm" />
          </AppleLiquidGlass>
          <span className="font-bold text-xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">FlowSync</span>
        </Link>
        
        <AppleLiquidButton
          variant="ghost"
          size="sm"
          className="lg:hidden absolute top-4 right-4"
          onClick={() => setSidebarOpen(false)}
          icon={<X className="w-5 h-5" />}
        />
      </div>

      {/* Apple Liquid Glass Navigation */}
      <nav className="flex-1 p-6 space-y-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="no-underline block"
              onClick={() => setSidebarOpen(false)}
            >
              <AppleLiquidGlass
                material={isActive ? "thick" : "thin"}
                blur={isActive ? "heavy" : "medium"}
                interactive={true}
                rounded="xl"
                specularHighlight={true}
                motionResponse={true}
                className="flex items-center gap-4 px-6 py-4"
              >
                <Icon className={cn(
                  "w-6 h-6 transition-transform duration-300",
                  isActive ? "text-blue-400 drop-shadow-sm" : "text-white/70"
                )} />
                <span className={cn(
                  "font-medium text-lg tracking-tight transition-colors duration-300",
                  isActive ? "text-white font-semibold" : "text-white/80"
                )}>{item.name}</span>
              </AppleLiquidGlass>
            </Link>
          )
        })}
      </nav>

      {/* Apple Liquid Glass Theme Toggle */}
      <div className="p-6 border-t border-white/10">
        <AppleLiquidButton
          onClick={cycleTheme}
          variant="ghost"
          size="md"
          className="w-full justify-start gap-4 px-6 py-4"
          icon={<ThemeIcon className="w-6 h-6 text-white/70" />}
        >
          <span className="capitalize text-lg text-white/80 font-medium tracking-tight">{theme} theme</span>
        </AppleLiquidButton>
      </div>
    </AppleLiquidGlass>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">{/* Clean Apple Glass Layout */}
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Liquid Glass Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-80 z-50">
        <SidebarContent />
      </div>

      {/* Liquid Glass Mobile Sidebar */}
      <div className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-[100] w-80 transform transition-all duration-700 ease-out',
        sidebarOpen ? 'translate-x-0 scale-100' : '-translate-x-full scale-95'
      )}>
        <SidebarContent />
      </div>

      {/* Main Liquid Glass Container */}
      <div className="lg:ml-80 flex-1 flex flex-col min-h-screen">
        {/* Liquid Glass Mobile Header */}
        <header className="lg:hidden glass-surface-enhanced glass-reflection glass-atmospheric m-4 rounded-3xl">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="glass-button p-3 rounded-2xl group"
            >
              <Menu className="w-6 h-6 text-white/80 group-hover:scale-110 transition-transform duration-300" />
            </button>
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 glass-surface-enhanced rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
                <Timer className="w-5 h-5 text-white drop-shadow-sm" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">FlowSync</span>
            </Link>
            
            <button
              onClick={cycleTheme}
              className="glass-button p-3 rounded-2xl group"
            >
              <ThemeIcon className="w-6 h-6 text-white/80 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
            </button>
          </div>
        </header>

        {/* Clean Apple Glass Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <AppleLiquidGlass
            material="regular"
            blur="medium"
            rounded="3xl"
            className="p-6 min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-4rem)]"
          >
            {children}
          </AppleLiquidGlass>
        </main>
      </div>
    </div>
  )
}