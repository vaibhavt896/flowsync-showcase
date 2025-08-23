import { motion } from 'framer-motion'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { formatTime } from '@/utils/helpers'
import { useFlowStore } from '@/stores/flowStore'
import { cn } from '@/utils/helpers'

interface TimerDisplayProps {
  timeRemaining: number
  totalTime: number
  sessionType: 'focus' | 'short-break' | 'long-break'
  isRunning: boolean
}

export function TimerDisplay({ 
  timeRemaining, 
  totalTime, 
  sessionType, 
  isRunning 
}: TimerDisplayProps) {
  const { currentFlowState } = useFlowStore()
  const progress = ((totalTime - timeRemaining) / totalTime) * 100
  const isInFlow = currentFlowState?.isInFlow || false
  
  const sessionColors = {
    focus: 'primary' as const,
    'short-break': 'success' as const,
    'long-break': 'focus' as const,
  }

  const sessionLabels = {
    focus: 'Focus Time',
    'short-break': 'Short Break',
    'long-break': 'Long Break',
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Flow State Indicator */}
      {sessionType === 'focus' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <div 
            className={cn(
              'w-3 h-3 rounded-full transition-colors duration-300',
              isInFlow ? 'bg-green-500 shadow-glow' : 'bg-gray-300 dark:bg-gray-600'
            )}
          />
          <span className={cn(
            'text-sm font-medium transition-colors duration-300',
            isInFlow ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
          )}>
            {isInFlow ? 'In Flow' : 'Building Focus'}
          </span>
          {isInFlow && currentFlowState?.flowScore && (
            <span className="text-xs text-gray-500">
              ({Math.round(currentFlowState.flowScore * 100)}%)
            </span>
          )}
        </motion.div>
      )}

      {/* Session Type Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
          {sessionLabels[sessionType]}
        </h2>
      </motion.div>

      {/* Circular Timer */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'relative',
          isRunning && 'animate-breathing'
        )}
      >
        <CircularProgress
          value={progress}
          size={280}
          strokeWidth={12}
          color={sessionColors[sessionType]}
          className="drop-shadow-lg"
        >
          <div className="text-center space-y-2">
            {/* Time Display */}
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
              className="font-mono text-5xl font-bold text-gray-800 dark:text-gray-200"
            >
              {formatTime(timeRemaining)}
            </motion.div>
            
            {/* Progress Indicator */}
            <div className="text-sm text-gray-500 space-y-1">
              <div>{Math.round(progress)}% complete</div>
              <div className="text-xs">
                {formatTime(totalTime - timeRemaining)} elapsed
              </div>
            </div>
          </div>
        </CircularProgress>

        {/* Pulsing Ring for Active State */}
        {isRunning && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full border-4 opacity-30',
              sessionType === 'focus' && 'border-primary-400',
              sessionType === 'short-break' && 'border-success-400',
              sessionType === 'long-break' && 'border-focus-400'
            )}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-1"
      >
        {sessionType === 'focus' && currentFlowState && (
          <div className="text-sm text-gray-500">
            <div>Focus Score: {Math.round((currentFlowState.flowScore || 0) * 100)}%</div>
            {currentFlowState.confidence && (
              <div>Confidence: {Math.round(currentFlowState.confidence * 100)}%</div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}