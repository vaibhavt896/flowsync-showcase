import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Square, SkipForward, RotateCcw } from 'lucide-react'
import { AppleLiquidButton, AppleLiquidGlass } from '@/components/ui/AppleLiquidGlass'
import { FlowStateLoader, FocusLoader } from '@/components/ui/RiveLoader'
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
    suggestedBreakType,
    suggestedBreakDuration,
    toggleTimer,
    pause,
    resume,
    stop,
    skip,
    reset,
    startFocusSession,
    startBreak,
    clearBreakSuggestion,
    startSuggestedBreak,
  } = useTimer()

  const { isCurrentlyInFlow } = useFlowStore()
  const inFlow = isCurrentlyInFlow()


  const hasActiveSession = !!currentSession
  const hasSuggestedBreak = !!suggestedBreakType && suggestedBreakDuration > 0
  const canStart = !hasActiveSession && !hasSuggestedBreak
  const canStartBreak = !hasActiveSession && hasSuggestedBreak
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
            className="font-bold text-white shadow-2xl shadow-orange-500/30"
            icon={<Play className="w-6 h-6 drop-shadow-sm" />}
          >
            Start Focus
          </AppleLiquidButton>
        )}

        {canStartBreak && (
          <AppleLiquidButton
            onClick={startSuggestedBreak}
            variant="secondary"
            size="lg"
            className={cn(
              "font-bold text-white shadow-2xl transition-all duration-300",
              suggestedBreakType === 'long-break' 
                ? "shadow-pink-500/30 hover:shadow-pink-500/50" 
                : "shadow-golden-500/30 hover:shadow-golden-500/50"
            )}
            icon={
              <span className="text-xl drop-shadow-sm">
                {suggestedBreakType === 'long-break' ? '🧘' : '🌱'}
              </span>
            }
          >
            Start {suggestedBreakType === 'long-break' ? 'Long' : 'Short'} Break
          </AppleLiquidButton>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {canPause && (
            <AppleLiquidButton
              onClick={pause}
              variant={inFlow ? "primary" : "secondary"}
              size="md"
              className={cn(
                'font-medium transition-all duration-300',
                inFlow && 'shadow-lg shadow-yellow-400/20 text-yellow-100'
              )}
              icon={<Pause className={cn("w-5 h-5", inFlow && "text-yellow-200")} />}
            >
              {inFlow ? 'Pause' : 'Pause'}
            </AppleLiquidButton>
          )}

          {canResume && (
            <AppleLiquidButton
              onClick={resume}
              variant="primary"
              size="md"
              className="font-bold text-white shadow-lg shadow-golden-500/20"
              icon={<Play className="w-5 h-5 text-white" />}
            >
              Resume
            </AppleLiquidButton>
          )}

          {canStop && (
            <AppleLiquidButton
              onClick={stop}
              variant="secondary"
              size="md"
              className="font-bold text-white hover:text-white hover:shadow-md hover:shadow-pink-500/20"
              icon={<Square className="w-5 h-5" />}
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
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <AppleLiquidButton
            onClick={skip}
            variant="secondary"
            size="sm"
            className="text-white font-bold hover:text-white hover:shadow-sm hover:shadow-golden-500/20"
            icon={<SkipForward className="w-4 h-4" />}
          >
            Skip
          </AppleLiquidButton>

          <AppleLiquidButton
            onClick={reset}
            variant="secondary"
            size="sm"
            className="text-white font-bold hover:text-white hover:shadow-sm hover:shadow-golden-500/20"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset
          </AppleLiquidButton>
        </motion.div>
      )}

      {/* Break Suggestion Actions */}
      {canStartBreak && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <AppleLiquidButton
            onClick={clearBreakSuggestion}
            variant="secondary"
            size="sm"
            className="text-white font-bold hover:text-white hover:shadow-md hover:shadow-gray-500/20"
            icon={<SkipForward className="w-4 h-4" />}
          >
            Skip Break
          </AppleLiquidButton>

          <AppleLiquidButton
            onClick={() => startFocusSession()}
            variant="secondary"
            size="sm"
            className="text-white font-bold hover:text-white hover:shadow-md hover:shadow-orange-500/20"
            icon={<Play className="w-4 h-4" />}
          >
            Back to Focus
          </AppleLiquidButton>
        </motion.div>
      )}

      {/* Removed break buttons from initial screen for better productivity UX */}
      {/* Break buttons only appear as suggestions after completing focus sessions */}

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
            <div className="text-sm text-contrast-primary">
              <div className="font-black text-lg mb-2 tracking-tight text-orange-600">⚡ Flow State Detected</div>
              <div className="text-xs text-contrast-secondary font-semibold leading-relaxed">
                You're in deep focus. Consider continuing to maintain momentum.
              </div>
            </div>
          </AppleLiquidGlass>
        </motion.div>
      )}


      {/* Enhanced Loading State for Session Start */}
      {isRunning && currentSession && !isPaused && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          {inFlow ? (
            <FlowStateLoader 
              size="md" 
              message="In flow state..." 
              className="my-4"
            />
          ) : (
            <FocusLoader 
              size="md" 
              message="Focusing..." 
              className="my-4"
            />
          )}
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
            <div className="text-contrast-secondary font-semibold space-y-1">
              <div className="tracking-wide">
                Session started at {new Date(currentSession.startTime).toLocaleTimeString()}
              </div>
              {currentSession.interruptions > 0 && (
                <div className="text-orange-600 text-xs font-bold">
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