import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import Timer from '@/components/timer/Timer'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'
import Insights from '@/components/Insights'
import AccessibleGlassDemo from '@/components/demo/AccessibleGlassDemo'
import { useThemeStore } from '@/stores/themeStore'
import { useTimerStore } from '@/stores/timerStore'
import { useUserStore } from '@/stores/userStore'
import { ActivityTracker } from '@/services/activityTracker'
import { FlowDetector } from '@/services/flowDetector'
import { BreathingProvider } from '@/contexts/BreathingContext'
import { DepthNavigationProvider } from '@/contexts/DepthNavigationContext'

function App() {
  const { theme, actualTheme, initializeTheme } = useThemeStore()
  const { initializeTimer } = useTimerStore()
  const { initializeUser } = useUserStore()

  useEffect(() => {
    initializeTheme()
    initializeTimer()
    initializeUser()
    
    // Initialize activity tracking and flow detection
    const activityTracker = new ActivityTracker()
    const flowDetector = new FlowDetector()
    
    activityTracker.start()
    flowDetector.start()
    
    return () => {
      activityTracker.stop()
      flowDetector.stop()
    }
  }, [initializeTheme, initializeTimer, initializeUser])

  useEffect(() => {
    document.documentElement.className = actualTheme === 'dark' ? 'dark' : ''
  }, [actualTheme])

  return (
    <BreathingProvider>
      <DepthNavigationProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Timer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/glass-demo" element={<AccessibleGlassDemo />} />
          </Routes>
        </Layout>
      </DepthNavigationProvider>
    </BreathingProvider>
  )
}

export default App