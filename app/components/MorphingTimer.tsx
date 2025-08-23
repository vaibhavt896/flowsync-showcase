import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useNavigationStore } from '@/stores/navigationStore'
import { useTimer } from '@/hooks/useTimer'
import { createTimerToAnalyticsTransition, organicSpring } from '@/utils/flipAnimations'
import { formatTime } from '@/utils/helpers'
import { Play, Pause, Square } from 'lucide-react'

export default function MorphingTimer() {
  const { currentState, transitionProgress, isTransitioning } = useNavigationStore()
  const { 
    currentSession, 
    isRunning, 
    isPaused, 
    timeRemaining,
    toggleTimer,
    stop
  } = useTimer()

  const containerRef = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(transitionProgress)
  const springProgress = useSpring(progress, { damping: 25, stiffness: 120 })

  useEffect(() => {
    progress.set(transitionProgress)
  }, [transitionProgress, progress])

  // Timer ring transformations
  const { scale, rotate, opacity, borderRadius } = createTimerToAnalyticsTransition(springProgress)

  // Calculate timer progress
  const sessionDuration = currentSession?.duration || 25 * 60
  const progressPercent = ((sessionDuration - timeRemaining) / sessionDuration) * 100
  const circumference = 2 * Math.PI * 120 // radius of 120
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  // Transform timer ring into analytics charts
  const isTransformingToAnalytics = isTransitioning && currentState === 'analytics'

  const handleTimerAction = () => {
    toggleTimer()
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-8 bg-gray-900">
      {/* Main Timer Container */}
      <motion.div
        ref={containerRef}
        className="relative"
        style={{
          scale: isTransformingToAnalytics ? scale : 1,
          rotate: isTransformingToAnalytics ? rotate : 0,
          opacity: isTransformingToAnalytics ? opacity : 1,
        }}
        transition={organicSpring}
      >
        {/* Timer Ring */}
        <motion.svg
          width="280"
          height="280"
          className="transform -rotate-90"
          style={{
            borderRadius: isTransformingToAnalytics ? borderRadius : "50%",
          }}
        >
          {/* Background Circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isTransformingToAnalytics ? 0 : strokeDashoffset,
            }}
            animate={{
              strokeDashoffset: isTransformingToAnalytics ? 0 : strokeDashoffset,
            }}
            transition={organicSpring}
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          
          {/* Morphing segments for analytics transition */}
          {isTransformingToAnalytics && (
            <>
              {/* Segment 1 - Focus Time */}
              <motion.path
                d="M 140,20 A 120,120 0 0,1 260,140"
                stroke="#10b981"
                strokeWidth="12"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
              
              {/* Segment 2 - Break Time */}
              <motion.path
                d="M 260,140 A 120,120 0 0,1 140,260"
                stroke="#3b82f6"
                strokeWidth="12"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
              
              {/* Segment 3 - Flow Time */}
              <motion.path
                d="M 140,260 A 120,120 0 0,1 20,140"
                stroke="#8b5cf6"
                strokeWidth="12"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
              
              {/* Segment 4 - Idle Time */}
              <motion.path
                d="M 20,140 A 120,120 0 0,1 140,20"
                stroke="#f59e0b"
                strokeWidth="12"
                fill="transparent"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </>
          )}
        </motion.svg>

        {/* Center Content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          animate={isTransformingToAnalytics ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={organicSpring}
        >
          {/* Time Display */}
          <motion.div
            className="text-6xl font-bold text-gray-900 dark:text-white mb-4 font-mono"
            animate={isRunning ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          >
            {formatTime(timeRemaining)}
          </motion.div>

          {/* Session Type */}
          <motion.div
            className="text-lg text-gray-600 dark:text-gray-400 mb-6 capitalize"
            layout
          >
            {currentSession?.type?.replace('-', ' ') || 'Ready'}
          </motion.div>

          {/* Control Button */}
          <motion.button
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-focus-500 flex items-center justify-center text-white shadow-lg"
            onClick={handleTimerAction}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={organicSpring}
          >
            {!currentSession ? (
              <Play className="w-6 h-6 ml-1" />
            ) : isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </motion.button>

          {/* Stop Button */}
          {currentSession && (
            <motion.button
              className="mt-4 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400"
              onClick={stop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={organicSpring}
            >
              <Square className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* Subtle breathing pulse effect */}
        {!isTransformingToAnalytics && (
          <motion.div
            className="absolute inset-0 rounded-full border border-primary-400/20"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.1, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

    </div>
  )
}