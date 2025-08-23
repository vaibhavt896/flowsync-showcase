import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, Zap } from 'lucide-react'
import { useTimerStore } from '@/stores/timerStore'
import { useFlowStore } from '@/stores/flowStore'
import { formatDuration } from '@/utils/helpers'
import { cn } from '@/utils/helpers'

export function SessionProgress() {
  const { 
    sessionsCompleted, 
    currentCycle, 
    getTodaySessions,
    currentSession 
  } = useTimerStore()
  
  const { getFlowHistory } = useFlowStore()
  
  const todaySessions = getTodaySessions()
  const recentFlowSessions = getFlowHistory(24)
  const totalFlowTime = recentFlowSessions.reduce(
    (sum, session) => sum + (session.duration || 0), 0
  )

  // Calculate current cycle progress (4 sessions = 1 cycle)
  const cycleProgress = sessionsCompleted % 4
  const isBreakTime = cycleProgress === 0 && sessionsCompleted > 0

  return (
    <div className="space-y-6">
      {/* Current Cycle Progress */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Circle className="w-4 h-4" />
          Cycle Progress
        </h3>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((sessionNum) => {
            const isCompleted = sessionNum <= cycleProgress
            const isCurrent = sessionNum === cycleProgress + 1 && currentSession?.type === 'focus'
            const isBreak = sessionNum === 4 && isCompleted
            
            return (
              <motion.div
                key={sessionNum}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sessionNum * 0.1 }}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg transition-colors',
                  isCurrent && 'bg-primary-50 dark:bg-primary-900/20',
                  isCompleted && 'bg-success-50 dark:bg-success-900/20'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-success-500" />
                ) : (
                  <Circle className={cn(
                    'w-5 h-5',
                    isCurrent ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'
                  )} />
                )}
                
                <span className={cn(
                  'text-sm',
                  isCompleted && 'text-success-700 dark:text-success-300',
                  isCurrent && 'text-primary-700 dark:text-primary-300 font-medium',
                  !isCompleted && !isCurrent && 'text-gray-500'
                )}>
                  {sessionNum === 4 ? 'Long Break' : `Focus ${sessionNum}`}
                </span>
                
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-auto"
                  >
                    <Clock className="w-4 h-4 text-primary-500" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {isBreakTime && !currentSession && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-focus-50 dark:bg-focus-900/20 rounded-lg border border-focus-200 dark:border-focus-800"
          >
            <div className="text-sm text-focus-700 dark:text-focus-300 text-center">
              🎉 Cycle complete! Time for a long break.
            </div>
          </motion.div>
        )}
      </div>

      {/* Today's Stats */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Today's Activity
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
            <span className="font-medium">{sessionsCompleted}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cycles</span>
            <span className="font-medium">{Math.floor(sessionsCompleted / 4)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Flow Time</span>
            <span className="font-medium text-success-600 dark:text-success-400">
              {formatDuration(totalFlowTime)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
            <span className="font-medium">
              {todaySessions.length > 0 
                ? Math.round((todaySessions.filter(s => s.isCompleted).length / todaySessions.length) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Recent Sessions
        </h3>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {todaySessions.slice(0, 8).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 py-2"
            >
              <div className={cn(
                'w-2 h-2 rounded-full',
                session.isCompleted && session.type === 'focus' && 'bg-primary-500',
                session.isCompleted && session.type === 'short-break' && 'bg-success-500',
                session.isCompleted && session.type === 'long-break' && 'bg-focus-500',
                !session.isCompleted && 'bg-gray-300 dark:bg-gray-600'
              )} />
              
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(session.startTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm capitalize">
                  {session.type.replace('-', ' ')}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {session.actualDuration 
                  ? formatDuration(session.actualDuration * 1000)
                  : formatDuration(session.duration * 1000)}
              </div>
            </motion.div>
          ))}
          
          {todaySessions.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No sessions yet today
            </div>
          )}
        </div>
      </div>
    </div>
  )
}