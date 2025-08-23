import { useEffect } from 'react'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { SessionProgress } from './SessionProgress'
import { useTimer } from '@/hooks/useTimer'
import { useUserStore } from '@/stores/userStore'
import { AppleLiquidGlass, AppleLiquidCard } from '@/components/ui/AppleLiquidGlass'

export default function Timer() {
  const {
    currentSession,
    timeRemaining,
    isRunning,
    sessionsCompleted,
    requestNotificationPermission,
  } = useTimer()

  const { preferences } = useUserStore()

  // Request notification permission on mount
  useEffect(() => {
    if (preferences.notifications) {
      requestNotificationPermission()
    }
  }, [preferences.notifications, requestNotificationPermission])

  const sessionType = currentSession?.type || 'focus'
  const totalTime = currentSession?.duration || preferences.focusDuration

  return (
    <div className="min-h-full">
      {/* Liquid Glass Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl lg:text-7xl font-light bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6 tracking-tight">
          FlowSync
        </h1>
        <p className="text-white/60 text-xl font-light tracking-wide">
          Cognitive Adaptive Interface
        </p>
      </div>

      {/* Apple Liquid Glass Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        {/* Session Progress Apple Glass */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <AppleLiquidCard hover={true} padding="md">
            <SessionProgress />
          </AppleLiquidCard>
        </div>

        {/* Central Timer Display - Apple Liquid Glass */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <AppleLiquidGlass
            material="ultra-thick"
            blur="ultra"
            interactive={true}
            rounded="3xl"
            specularHighlight={true}
            motionResponse={true}
            className="p-12 mx-auto max-w-lg"
          >
            <TimerDisplay
              timeRemaining={timeRemaining}
              totalTime={totalTime}
              sessionType={sessionType}
              isRunning={isRunning}
            />
          </AppleLiquidGlass>
        </div>

        {/* Controls Apple Glass */}
        <div className="lg:col-span-3 order-3">
          <AppleLiquidCard hover={true} padding="md">
            <TimerControls />
          </AppleLiquidCard>
        </div>
      </div>

      {/* Clean Apple Glass Stats Row */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <AppleLiquidCard hover={false} padding="md" className="text-center">
          <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
            <div className="text-3xl font-light text-blue-300 mb-2 tracking-tight">
              {sessionsCompleted}
            </div>
            <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Sessions Today
            </div>
          </div>
        </AppleLiquidCard>

        <AppleLiquidCard hover={false} padding="md" className="text-center">
          <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
            <div className="text-3xl font-light text-emerald-300 mb-2 tracking-tight">
              {Math.round((preferences.focusDuration / 60) * sessionsCompleted)}m
            </div>
            <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Focus Time Today
            </div>
          </div>
        </AppleLiquidCard>

        <AppleLiquidCard hover={false} padding="md" className="text-center">
          <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
            <div className="text-3xl font-light text-purple-300 mb-2 tracking-tight">
              {Math.floor(sessionsCompleted / 4)}
            </div>
            <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Cycles Completed
            </div>
          </div>
        </AppleLiquidCard>
      </div>

      {/* Clean Glass Footer */}
      <footer className="text-center py-8 mt-12">
        <AppleLiquidGlass 
          material="thin" 
          blur="light" 
          rounded="xl" 
          className="inline-block px-8 py-4"
        >
          <p className="text-white/50 text-sm font-light">
            Apple Liquid Glass Technology
          </p>
        </AppleLiquidGlass>
      </footer>
    </div>
  )
}