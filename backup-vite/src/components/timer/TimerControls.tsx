import { motion } from 'framer-motion'
import { Play, Pause, Square, SkipForward, RotateCcw } from 'lucide-react'
import { AppleLiquidButton, AppleLiquidGlass } from '@/components/ui/AppleLiquidGlass'
import { useTimer } from '@/hooks/useTimer'
import { useFlowStore } from '@/stores/flowStore'
import { cn } from '@/utils/helpers'

interface TimerControlsProps {
  className?: string
}

export function TimerControls({ className }: TimerControlsProps) {
  const {
    isRunning,
    isPaused,
    currentSession,
    toggleTimer,
    pause,
    resume,
    stop,
    skip,
    reset,
    startFocusSession,
    startBreak,
  } = useTimer()

  const { isCurrentlyInFlow } = useFlowStore()
  const inFlow = isCurrentlyInFlow()

  const hasActiveSession = !!currentSession
  const canStart = !hasActiveSession
  const canPause = isRunning && hasActiveSession
  const canResume = isPaused && hasActiveSession
  const canStop = hasActiveSession

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
      className={cn('flex flex-col items-center space-y-8', className)}
    >
      {/* Primary Apple Liquid Glass Controls */}
      <div className="flex flex-col items-center gap-6">
        {canStart && (
          <AppleLiquidButton
            onClick={() => startFocusSession()}
            variant="primary"
            size="lg"
            className="px-12 py-6 text-xl font-light"
            icon={<Play className="w-8 h-8" />}
          >
            Start Focus
          </AppleLiquidButton>
        )}

        <div className="flex items-center gap-4">
          {canPause && (
            <AppleLiquidButton
              onClick={pause}
              variant={inFlow ? "primary" : "secondary"}
              size="lg"
              className={cn(
                'px-8 py-4 text-lg font-light',
                inFlow && 'bg-yellow-500/20 border-yellow-400/50'
              )}
              icon={<Pause className="w-6 h-6" />}
            >
              {inFlow ? 'Pause (Flow)' : 'Pause'}
            </AppleLiquidButton>
          )}

          {canResume && (
            <AppleLiquidButton
              onClick={resume}
              variant="primary"
              size="lg"
              className="px-8 py-4 text-lg font-light"
              icon={<Play className="w-6 h-6" />}
            >
              Resume
            </AppleLiquidButton>
          )}

          {canStop && (
            <AppleLiquidButton
              onClick={stop}
              variant="ghost"
              size="lg"
              className="px-8 py-4 text-lg font-light text-red-300 hover:text-red-200"
              icon={<Square className="w-6 h-6" />}
            >
              Stop
            </AppleLiquidButton>
          )}
        </div>
      </div>

      {/* Secondary Apple Liquid Glass Controls */}
      {hasActiveSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center gap-4"
        >
          <AppleLiquidButton
            onClick={skip}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white/80 font-light"
            icon={<SkipForward className="w-5 h-5" />}
          >
            Skip
          </AppleLiquidButton>

          <AppleLiquidButton
            onClick={reset}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white/80 font-light"
            icon={<RotateCcw className="w-5 h-5" />}
          >
            Reset
          </AppleLiquidButton>
        </motion.div>
      )}

      {/* Quick Start Apple Liquid Glass Options */}
      {!hasActiveSession && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          className="flex items-center gap-4"
        >
          <AppleLiquidButton
            onClick={() => startBreak(false)}
            variant="ghost"
            size="sm"
            className="text-emerald-300 hover:text-emerald-200 font-light tracking-wide"
          >
            Short Break (5m)
          </AppleLiquidButton>

          <AppleLiquidButton
            onClick={() => startBreak(true)}
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-purple-200 font-light tracking-wide"
          >
            Long Break (15m)
          </AppleLiquidButton>
        </motion.div>
      )}

      {/* Flow State Apple Liquid Glass Warning */}
      {inFlow && canPause && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <AppleLiquidGlass
            material="thick"
            blur="heavy"
            rounded="xl"
            specularHighlight={true}
            className="p-6 text-center max-w-sm border border-yellow-400/30"
          >
            <div className="text-sm text-yellow-300">
              <div className="font-medium text-lg mb-2 tracking-tight">⚡ Flow State Detected</div>
              <div className="text-xs text-yellow-300/80 font-light leading-relaxed">
                You're in deep focus. Consider continuing to maintain momentum.
              </div>
            </div>
          </AppleLiquidGlass>
        </motion.div>
      )}

      {/* Session Info Apple Glass */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AppleLiquidGlass
            material="thin"
            blur="light"
            rounded="lg"
            className="p-4 text-center text-sm"
          >
            <div className="text-white/60 font-light space-y-1">
              <div className="tracking-wide">
                Session started at {new Date(currentSession.startTime).toLocaleTimeString()}
              </div>
              {currentSession.interruptions > 0 && (
                <div className="text-yellow-300/80 text-xs">
                  {currentSession.interruptions} interruption{currentSession.interruptions !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </AppleLiquidGlass>
        </motion.div>
      )}
    </motion.div>
  )
}