import { useEffect } from 'react'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { SessionProgress } from './SessionProgress'
import { AnalyticsDashboard } from '@/components/ui/PremiumCharts'
import { useTimer } from '@/hooks/useTimer'
import { useUserStore } from '@/stores/userStore'
import { useTimerStore } from '@/stores/timerStore'
import { useFlowStore } from '@/stores/flowStore'
import { useSounds } from '@/hooks/useSounds'
import { AppleLiquidCard } from '@/components/ui/AppleLiquidGlass'
import GradientLoader from '@/components/ui/GradientLoader'
import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

export default function Timer() {
  const {
    currentSession,
    timeRemaining,
    isRunning,
    isPaused,
    sessionsCompleted,
    suggestedBreakType,
    suggestedBreakDuration,
    requestNotificationPermission,
  } = useTimer()

  const { preferences, initializeUser } = useUserStore()
  const { initializeTimer } = useTimerStore()
  const { currentFlowState } = useFlowStore()

  // Initialize sound system
  const timerState = {
    isRunning,
    isPaused,
    currentSession,
    timeRemaining
  }
  const sounds = useSounds(timerState)

  // Initialize user preferences and timer with page refresh detection
  useEffect(() => {
    // Clear the init flag on page unload so it resets on refresh
    const clearFlagOnUnload = () => {
      sessionStorage.removeItem('app-initialized')
    }
    window.addEventListener('beforeunload', clearFlagOnUnload)
    
    // Check if this is first load since page refresh
    const hasInitialized = sessionStorage.getItem('app-initialized')
    
    if (!hasInitialized) {
      console.log('🚀 Page load/refresh - resetting to 25min defaults')
      // Reset user preferences to defaults
      initializeUser()
      // Initialize timer with reset preferences  
      initializeTimer()
      // Mark as initialized for this session
      sessionStorage.setItem('app-initialized', 'true')
    } else {
      console.log('📱 Component navigation - keeping current preferences')
      // Just update timer display with current preferences
      initializeTimer()
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', clearFlagOnUnload)
    }
  }, [initializeUser, initializeTimer])

  // Request notification permission on mount
  useEffect(() => {
    if (preferences.notifications) {
      requestNotificationPermission()
    }
  }, [preferences.notifications, requestNotificationPermission])

  const sessionType = currentSession?.type || (suggestedBreakType || 'focus')
  
  // Fix totalTime calculation to prevent negative progress
  const totalTime = (() => {
    if (currentSession) return currentSession.duration
    if (suggestedBreakDuration > 0) return suggestedBreakDuration
    // When no active session, totalTime should match timeRemaining to show 0% progress
    return timeRemaining
  })()

  // Calculate realistic focus scores
  const getRealisticScores = () => {
    const baseConfidence = 100
    const baseInProgressScore = Math.min(30 + (sessionsCompleted * 8), 85) // Gradually builds with sessions
    const baseFinalScore = Math.min(45 + (sessionsCompleted * 12), 95) // Higher final scores
    
    // Initial state: Fresh user
    if (sessionsCompleted === 0 && !currentSession) {
      return {
        focusScore: 0,
        confidence: baseConfidence,
        label: "Ready to Focus"
      }
    }
    
    // During focus session
    if (sessionType === 'focus' && isRunning) {
      return {
        focusScore: baseInProgressScore,
        confidence: Math.max(baseConfidence - 5, 85), // Slight confidence dip during performance
        label: "Focus Score"
      }
    }
    
    // After completing sessions
    if (sessionsCompleted > 0) {
      return {
        focusScore: baseFinalScore,
        confidence: Math.min(baseConfidence + (sessionsCompleted * 2), 100),
        label: currentSession && !isRunning ? "Final Score" : "Current Level"
      }
    }
    
    // Default
    return {
      focusScore: 0,
      confidence: baseConfidence,
      label: "Ready to Start"
    }
  }

  const realisticScores = getRealisticScores()

  return (
    <div className="min-h-screen relative">
      {/* Ambient Gradient Loader - Subtle background animation during focus */}
      {isRunning && sessionsCompleted >= 1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 opacity-5">
            <GradientLoader 
              size="xl" 
              colorScheme="golden"
              speed={0.2}
              className="w-96 h-96 blur-3xl"
            />
          </div>
          <div className="absolute bottom-1/4 right-1/4 opacity-5">
            <GradientLoader 
              size="lg" 
              colorScheme="pink"
              speed={0.15}
              className="w-64 h-64 blur-2xl"
            />
          </div>
        </div>
      )}
      
      {/* Premium Timer Layout Reorganized */}
      <div className="grid grid-cols-12 gap-3 lg:gap-4 min-h-screen p-2 lg:p-4">
        {/* Left Panel: Recent Sessions + Analytics */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 order-2 lg:order-1 h-full">
          <div className="h-full space-y-4 overflow-y-auto">
            {/* Recent Sessions - Top Priority */}
            <div className="h-auto">
              <AppleLiquidCard hover={false} padding="md" className="bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-700/60 shadow-xl backdrop-blur-xl">
                <SessionProgress />
              </AppleLiquidCard>
            </div>
            
            {/* Analytics Charts Below */}
            <div className="flex-1 min-h-[300px]">
              <AnalyticsDashboard className="h-full" showStats={false} />
            </div>
          </div>
        </div>

        {/* Center Timer Section */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-6 order-1 lg:order-2 h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-start space-y-3 pt-4 pb-2">
            {/* Main Timer Display - Perfect Circle */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Beautiful Poppy Circular Timer */}
                <div className="w-[280px] h-[280px] md:w-[310px] md:h-[310px] lg:w-[340px] lg:h-[340px] rounded-full relative">
                  {/* Outer Glow Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 via-golden-500/20 to-pink-500/30 blur-lg animate-pulse"></div>
                  
                  {/* Main Circle - Warm Glass Style */}
                  <div className="absolute inset-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-orange-500/20 hover:shadow-3xl hover:shadow-golden-500/30 transition-all duration-700 hover:scale-[1.02] flex items-center justify-center">
                    
                    {/* Subtle Background Gradient Loader - Only when running */}
                    {isRunning && (
                      <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
                        <GradientLoader 
                          size="xl" 
                          colorScheme={sessionType === 'focus' ? 'primary' : sessionType.includes('break') ? 'pink' : 'golden'}
                          speed={0.3}
                          className="w-full h-full"
                        />
                      </div>
                    )}
                    
                    {/* Inner Highlight Ring */}
                    <div className="absolute inset-4 rounded-full border border-gradient-to-r border-orange-400/30 shadow-inner"></div>
                    <TimerDisplay
                      timeRemaining={timeRemaining}
                      totalTime={totalTime}
                      sessionType={sessionType}
                      isRunning={isRunning}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Score Badge - Between Timer and Controls */}
            <div className="h-12 flex items-center justify-center -mt-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center"
              >
                {(
                  <div className={cn(
                    "backdrop-blur-md rounded-xl px-6 py-3 border shadow-lg transition-all duration-300",
                    realisticScores.focusScore === 0
                      ? "bg-white/60 border-neutral-300/40 shadow-neutral-400/20"
                      : isRunning 
                      ? "bg-orange-500/15 border-orange-400/50 shadow-orange-500/30" 
                      : "bg-golden-500/15 border-golden-400/50 shadow-golden-500/30"
                  )}>
                    <div className="text-neutral-900 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tracking-wide">
                          {realisticScores.label}
                        </span>
                        <span className={cn(
                          "text-xl font-black font-mono tracking-tight",
                          realisticScores.focusScore === 0 
                            ? "text-neutral-700" 
                            : "text-orange-600"
                        )}>
                          {currentFlowState?.flowScore ? Math.round(currentFlowState.flowScore * 100) : realisticScores.focusScore}%
                        </span>
                      </div>
                      <div className="h-4 w-px bg-neutral-400/40"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Confidence</span>
                        <span className="text-sm font-black font-mono text-neutral-900">
                          {currentFlowState?.confidence ? Math.round(currentFlowState.confidence * 100) : realisticScores.confidence}%
                        </span>
                      </div>
                      {realisticScores.focusScore === 0 && (
                        <div className="flex items-center ml-2">
                          <div className="w-2 h-2 rounded-full bg-neutral-400 opacity-50"></div>
                        </div>
                      )}
                      {isRunning && (
                        <div className="flex items-center ml-2">
                          <GradientLoader 
                            size="sm" 
                            colorScheme="primary"
                            speed={0.8}
                            className="w-5 h-5 opacity-60"
                          />
                        </div>
                      )}
                      {!isRunning && sessionsCompleted > 0 && (
                        <div className="flex items-center ml-2">
                          <div className="w-2 h-2 rounded-full bg-golden-400 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Controls Section - Compact */}
            <div className="w-full max-w-2xl mt-8">
              <AppleLiquidCard 
                hover={true} 
                padding="sm"
                className="bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-700/60 ring-1 ring-white/10 dark:ring-gray-700/40 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
              >
                <TimerControls />
              </AppleLiquidCard>
            </div>
          </div>
        </div>

        {/* Right Premium Insights Panel */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 order-3 h-full">
          <div className="h-full space-y-4 overflow-y-auto">
            {/* Today's Performance */}
            <AppleLiquidCard hover={false} padding="md" className="bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-700/60 shadow-xl backdrop-blur-xl">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                  {isRunning ? (
                    <GradientLoader 
                      size="sm" 
                      colorScheme="primary"
                      className="w-3 h-3"
                    />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg"></div>
                  )}
                  Today's Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-2 p-3 bg-orange-50/80 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                    <div className="text-3xl font-black text-orange-600">
                      {Math.round((preferences.focusDuration / 60) * sessionsCompleted)}m
                    </div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">Focus Time</div>
                  </div>
                  <div className="text-center space-y-2 p-3 bg-golden-50/80 dark:bg-golden-900/20 rounded-xl border border-golden-200/50 dark:border-golden-700/50">
                    <div className="text-3xl font-black text-golden-600">{sessionsCompleted}</div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">Sessions</div>
                  </div>
                </div>
              </div>
            </AppleLiquidCard>

            {/* Daily Goals */}
            <AppleLiquidCard hover={false} padding="md" className="bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-700/60 shadow-xl backdrop-blur-xl">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-golden-500 shadow-lg"></div>
                  Daily Goals
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Sessions Goal</span>
                      <span className="text-sm font-black text-neutral-900 dark:text-neutral-100 bg-golden-100 dark:bg-golden-900/30 px-2 py-1 rounded-lg">{sessionsCompleted}/8</span>
                    </div>
                    <div className="w-full bg-neutral-200/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-golden-400 to-golden-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${Math.min((sessionsCompleted / 8) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Focus Time</span>
                      <span className="text-sm font-black text-neutral-900 dark:text-neutral-100 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                        {Math.round((preferences.focusDuration / 60) * sessionsCompleted)}/240m
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${Math.min(((preferences.focusDuration / 60) * sessionsCompleted / 240) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </AppleLiquidCard>

            {/* Focus Tips */}
            <AppleLiquidCard hover={false} padding="md" className="bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-700/60 shadow-xl backdrop-blur-xl">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-pink-500 shadow-lg"></div>
                  Focus Tips
                </h3>
                <div className="bg-gradient-to-r from-pink-50/80 to-orange-50/80 dark:from-pink-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-pink-200/50 dark:border-pink-700/50">
                  {sessionsCompleted === 0 && (
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                      Ready to start? Begin with a 25-minute focus session and take breaks when needed.
                    </p>
                  )}
                  {sessionsCompleted >= 1 && sessionsCompleted < 4 && (
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                      Great progress! Remember to stay hydrated and keep your workspace organized.
                    </p>
                  )}
                  {sessionsCompleted >= 4 && (
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                      Excellent focus today! Consider taking a longer break to recharge your energy.
                    </p>
                  )}
                </div>
              </div>
            </AppleLiquidCard>
          </div>
        </div>
      </div>

    </div>
  )
}