import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTimer } from '../../../hooks/useTimer'
import { useBreathing } from '../../../contexts/BreathingContext'
import { useDepthNavigation } from '../../../contexts/DepthNavigationContext'
import { TimerDisplay } from '../../timer/TimerDisplay'
import { TimerControls } from '../../timer/TimerControls'
import { Play, Pause, Square, Zap, Target, Activity } from 'lucide-react'

export function CurrentSessionLayer() {
  const {
    currentSession,
    timeRemaining,
    isRunning,
    totalTime,
    startTimer,
    pauseTimer,
    stopTimer,
    sessionsCompleted
  } = useTimer()

  const { breathingState, breathingRate } = useBreathing()
  const { depthState, setFocusIntensity } = useDepthNavigation()
  const [flowIntensity, setFlowIntensity] = useState(0.5)

  // Calculate focus intensity based on session progress
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const progress = 1 - (timeRemaining / totalTime)
      const focusIntensity = Math.min(1, 0.3 + progress * 0.7) // Starts at 30%, builds to 100%
      setFocusIntensity(focusIntensity)
      
      // Flow state detection simulation
      if (progress > 0.3 && progress < 0.8) {
        setFlowIntensity(Math.min(1, flowIntensity + 0.01))
      }
    } else {
      setFocusIntensity(0.2)
      setFlowIntensity(0.5)
    }
  }, [timeRemaining, isRunning, totalTime, setFocusIntensity, flowIntensity])

  const sessionType = currentSession?.type || 'focus'
  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0

  const getSessionColor = () => {
    switch (sessionType) {
      case 'focus': return 'rgba(16, 185, 129, 0.8)'
      case 'short-break': return 'rgba(59, 130, 246, 0.8)'
      case 'long-break': return 'rgba(139, 92, 246, 0.8)'
      default: return 'rgba(107, 114, 128, 0.8)'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Central Focus Container */}
      <motion.div
        className="relative"
        animate={{
          scale: depthState.focusIntensity * 0.2 + 0.9,
          filter: `brightness(${1 + depthState.focusIntensity * 0.3})`
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Primary Timer Display */}
        <motion.div
          className="relative z-10 p-8 rounded-3xl backdrop-blur-lg border border-white/20"
          style={{
            backgroundColor: getSessionColor(),
            boxShadow: `0 0 ${60 + flowIntensity * 40}px ${getSessionColor()}`
          }}
          animate={{
            y: Math.sin(Date.now() * 0.001 * breathingRate) * 5,
            rotate: Math.sin(Date.now() * 0.0005) * 2
          }}
        >
          {/* Session Type Header */}
          <div className="text-center mb-6">
            <motion.h1 
              className="text-2xl font-bold text-white capitalize mb-2"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {sessionType.replace('-', ' ')} Session
            </motion.h1>
            <div className="text-white/70 text-sm">
              Session {sessionsCompleted + 1} • {breathingState} state
            </div>
          </div>

          {/* Main Timer */}
          <div className="text-center mb-8">
            <motion.div 
              className="text-6xl md:text-8xl font-mono font-bold text-white mb-4"
              animate={{ 
                textShadow: `0 0 ${20 + flowIntensity * 30}px rgba(255,255,255,0.8)` 
              }}
            >
              {formatTime(timeRemaining)}
            </motion.div>
            
            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - progress) }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              
              {/* Progress percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {Math.round(progress * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Session Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <motion.button
              onClick={isRunning ? pauseTimer : startTimer}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span className="text-white font-medium">
                {isRunning ? 'Pause' : 'Start'}
              </span>
            </motion.button>
            
            <motion.button
              onClick={stopTimer}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Square className="w-5 h-5" />
              <span className="text-white font-medium">Stop</span>
            </motion.button>
          </div>

          {/* Flow State Indicator */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">Flow Intensity</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="h-2 bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${flowIntensity * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-white/70 text-xs mt-1">
              {Math.round(flowIntensity * 100)}% flow state
            </div>
          </div>
        </motion.div>

        {/* Floating Activity Indicators */}
        <motion.div
          className="absolute -top-16 -right-16 p-3 bg-white/10 backdrop-blur-sm rounded-xl"
          animate={{
            y: Math.sin(Date.now() * 0.002) * 10,
            x: Math.cos(Date.now() * 0.0015) * 5
          }}
        >
          <div className="flex items-center gap-2 text-white/80">
            <Activity className="w-4 h-4" />
            <div className="text-xs">
              <div>{Math.round(breathingRate * 60)} BPM</div>
              <div className="text-white/60">Breathing</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-16 -left-16 p-3 bg-white/10 backdrop-blur-sm rounded-xl"
          animate={{
            y: Math.cos(Date.now() * 0.0018) * 8,
            x: Math.sin(Date.now() * 0.0012) * 6
          }}
        >
          <div className="flex items-center gap-2 text-white/80">
            <Target className="w-4 h-4" />
            <div className="text-xs">
              <div>Layer 2</div>
              <div className="text-white/60">Current</div>
            </div>
          </div>
        </motion.div>

        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl blur-3xl -z-10"
          style={{ backgroundColor: getSessionColor() }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>

      {/* Environment Indicators */}
      <div className="absolute top-8 left-8">
        <div className="p-3 bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-xs text-white/70 font-mono">
            <div className="mb-2 font-medium">Current Session</div>
            <div>Focus: {Math.round(depthState.focusIntensity * 100)}%</div>
            <div>State: {breathingState}</div>
            <div>Layer: 2 (Primary)</div>
          </div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="absolute bottom-8 right-8">
        <div className="p-3 bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-xs text-white/70 font-mono">
            <div className="mb-2 font-medium">Today's Progress</div>
            <div>Sessions: {sessionsCompleted}</div>
            <div>Active: {isRunning ? 'Yes' : 'No'}</div>
            <div>Type: {sessionType}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentSessionLayer