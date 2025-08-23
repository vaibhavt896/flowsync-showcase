import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import Timer from '@/components/timer/Timer'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'
import Insights from '@/components/Insights'
import { useThemeStore } from '@/stores/themeStore'
import { useTimerStore } from '@/stores/timerStore'
import { ActivityTracker } from '@/services/activityTracker'
import { FlowDetector } from '@/services/flowDetector'

function App() {
  const { theme, initializeTheme } = useThemeStore()
  const { initializeTimer } = useTimerStore()

  useEffect(() => {
    initializeTheme()
    initializeTimer()
    
    // Initialize activity tracking and flow detection
    const activityTracker = new ActivityTracker()
    const flowDetector = new FlowDetector()
    
    activityTracker.start()
    flowDetector.start()
    
    return () => {
      activityTracker.stop()
      flowDetector.stop()
    }
  }, [initializeTheme, initializeTimer])

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : ''
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark-transition">
      <Layout>
        <Routes>
          <Route path="/" element={<Timer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App