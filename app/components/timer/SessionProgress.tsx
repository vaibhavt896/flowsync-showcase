import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, Zap } from 'lucide-react'
import { useTimerStore } from '@/stores/timerStore'
import { useFlowStore } from '@/stores/flowStore'
import { formatDuration } from '@/utils/helpers'
import { cn } from '@/utils/helpers'
import { AppleLiquidGlass } from '@/components/ui/AppleLiquidGlass'

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
    <div className="space-y-4">
      {/* Current Cycle Progress */}
      <AppleLiquidGlass
        material="regular"
        blur="heavy"
        rounded="xl"
        className="p-4"
      >
        <h3 className="font-black text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <Circle className="w-4 h-4 text-orange-500" />
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
                  isCurrent && 'bg-orange-500/20 dark:bg-orange-500/30',
                  isCompleted && 'bg-golden-500/20 dark:bg-golden-500/30'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-golden-500" />
                ) : (
                  <Circle className={cn(
                    'w-5 h-5',
                    isCurrent ? 'text-orange-500' : 'text-neutral-600 dark:text-neutral-400'
                  )} />
                )}
                
                <span className={cn(
                  'text-sm font-bold',
                  isCompleted && 'text-golden-600',
                  isCurrent && 'text-orange-600 font-black',
                  !isCompleted && !isCurrent && 'text-neutral-800 dark:text-neutral-300'
                )}>
                  {sessionNum === 4 ? 'Long Break' : `Focus ${sessionNum}`}
                </span>
                
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-auto"
                  >
                    <Clock className="w-4 h-4 text-orange-500" />
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
            className="mt-4 p-3 bg-golden-500/20 dark:bg-golden-500/30 rounded-lg border border-golden-400/30 dark:border-golden-400/50"
          >
            <div className="text-sm text-golden-600 font-bold text-center">
              🎉 Cycle complete! Time for a long break.
            </div>
          </motion.div>
        )}
      </AppleLiquidGlass>

      {/* Today's Stats */}
      <AppleLiquidGlass
        material="regular"
        blur="heavy"
        rounded="xl"
        className="p-4"
      >
        <h3 className="font-black text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          Today's Activity
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-800 dark:text-neutral-200 font-bold">Sessions</span>
            <span className="font-black text-neutral-900 dark:text-neutral-100">{sessionsCompleted}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-800 dark:text-neutral-200 font-bold">Cycles</span>
            <span className="font-black text-neutral-900 dark:text-neutral-100">{Math.floor(sessionsCompleted / 4)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-800 dark:text-neutral-200 font-bold">Flow Time</span>
            <span className="font-black text-golden-600">
              {formatDuration(totalFlowTime)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-800 dark:text-neutral-200 font-bold">Completion Rate</span>
            <span className="font-black text-neutral-900 dark:text-neutral-100">
              {todaySessions.length > 0 
                ? Math.round((todaySessions.filter(s => s.isCompleted).length / todaySessions.length) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </AppleLiquidGlass>

      {/* Recent Sessions */}
      <AppleLiquidGlass
        material="regular"
        blur="heavy"
        rounded="xl"
        className="p-4"
      >
        <h3 className="font-black text-neutral-900 dark:text-neutral-100 mb-4">
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
                session.isCompleted && session.type === 'focus' && 'bg-orange-500',
                session.isCompleted && session.type === 'short-break' && 'bg-golden-500',
                session.isCompleted && session.type === 'long-break' && 'bg-pink-500',
                !session.isCompleted && 'bg-neutral-400 dark:bg-neutral-600'
              )} />
              
              <div className="flex-1 min-w-0">
                <div className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold">
                  {new Date(session.startTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm capitalize text-neutral-800 dark:text-neutral-200 font-bold">
                  {session.type.replace('-', ' ')}
                </div>
              </div>
              
              <div className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
                {session.actualDuration 
                  ? formatDuration(session.actualDuration * 1000)
                  : formatDuration(session.duration * 1000)}
              </div>
            </motion.div>
          ))}
          
          {todaySessions.length === 0 && (
            <div className="text-center py-4 text-neutral-700 dark:text-neutral-300 text-sm font-bold">
              No sessions yet today
            </div>
          )}
        </div>
      </AppleLiquidGlass>
    </div>
  )
}