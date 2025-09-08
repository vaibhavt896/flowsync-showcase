import { motion } from 'framer-motion'
import { formatTime } from '@/utils/helpers'
import { useFlowStore } from '@/stores/flowStore'
import { cn } from '@/utils/helpers'
import { useRef, useState } from 'react'

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
  const [isHovered, setIsHovered] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  
  const sessionColors = {
    focus: {
      primary: '#EF6F38',
      secondary: '#d14818', 
      aurora: ['#EF6F38', '#F3A340', '#F088A3'],
      glow: 'rgba(239, 111, 56, 0.4)',
      theme: 'intense'
    },
    'short-break': {
      primary: '#F3A340',
      secondary: '#d18315',
      aurora: ['#F3A340', '#FFE5B4', '#FFF8DC'],
      glow: 'rgba(243, 163, 64, 0.6)',
      theme: 'calm'
    },
    'long-break': {
      primary: '#F088A3',
      secondary: '#cc485f',
      aurora: ['#F088A3', '#FFB6C1', '#E6E6FA'],
      glow: 'rgba(240, 136, 163, 0.6)',
      theme: 'serene'
    },
  }

  const sessionLabels = {
    focus: 'Focus Time',
    'short-break': 'Short Break',
    'long-break': 'Long Break',
  }
  
  const currentColors = sessionColors[sessionType]

  return (
    <div className="flex flex-col items-center space-y-4">


      {/* Clean Professional Timer Container */}
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 1,
          y: 0
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        {/* Enhanced Premium Background Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: isHovered ? 0.25 : (currentColors.theme === 'intense' ? 0.08 : 0.15),
            scale: currentColors.theme === 'intense' ? [1, 1.02, 1] : [1, 1.05, 1]
          }}
          transition={{
            duration: currentColors.theme === 'intense' ? 0.4 : 2,
            ease: currentColors.theme === 'intense' ? 'easeInOut' : 'easeInOut',
            repeat: currentColors.theme === 'intense' ? 0 : Infinity
          }}
          style={{
            background: currentColors.theme === 'intense' 
              ? `radial-gradient(circle at 50% 50%, ${currentColors.primary}20, transparent 70%)`
              : `radial-gradient(circle at 30% 30%, ${currentColors.aurora[1]}15, ${currentColors.aurora[2]}10, transparent 80%)`,
            filter: currentColors.theme === 'intense' ? 'blur(20px)' : 'blur(30px)'
          }}
        />

        {/* Additional relaxing glow for break timers */}
        {currentColors.theme !== 'intense' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              ease: 'easeInOut',
              repeat: Infinity
            }}
            style={{
              background: `radial-gradient(circle at 70% 70%, ${currentColors.primary}08, transparent 90%)`,
              filter: 'blur(40px)'
            }}
          />
        )}

        {/* Minimal Professional Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: currentColors.primary,
            borderWidth: '1px',
            opacity: isHovered ? 0.3 : 0.1
          }}
          transition={{
            opacity: { duration: 0.3, ease: 'easeInOut' }
          }}
        />

        {/* Clean Circular Progress */}
        <div className="relative">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 480 480" 
            className="transform -rotate-90 w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] md:w-[260px] md:h-[260px] lg:w-[280px] lg:h-[280px] xl:w-[300px] xl:h-[300px]"
          >
            {/* Background Circle */}
            <circle
              cx="240"
              cy="240"
              r="210"
              stroke={currentColors.theme === 'intense' ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}
              strokeWidth={currentColors.theme === 'intense' ? "3" : "2"}
              fill="transparent"
              strokeDasharray={currentColors.theme === 'intense' ? "none" : "4 8"}
            />
            
            {/* Progress Circle with Dynamic Gradient */}
            <defs>
              <linearGradient id={`gradient-${sessionType}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentColors.aurora[0]} />
                <stop offset="50%" stopColor={currentColors.aurora[1]} />
                <stop offset="100%" stopColor={currentColors.aurora[2]} />
              </linearGradient>
              <filter id={`glow-${sessionType}`}>
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <circle
              cx="240"
              cy="240"
              r="210"
              stroke={`url(#gradient-${sessionType})`}
              strokeWidth={currentColors.theme === 'intense' ? "4" : "6"}
              fill="transparent"
              strokeLinecap="round"
              filter={`url(#glow-${sessionType})`}
              opacity={currentColors.theme === 'intense' ? "1" : "0.8"}
              style={{
                strokeDasharray: currentColors.theme === 'intense' 
                  ? 2 * Math.PI * 210 
                  : `${2 * Math.PI * 210} ${2 * Math.PI * 210 * 0.1}`,
                strokeDashoffset: (2 * Math.PI * 210) * (1 - progress / 100)
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Enhanced Time Display */}
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.05, opacity: 0.8 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                filter: `brightness(1)`
              }}
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 leading-none text-neutral-900",
                currentColors.theme === 'intense' 
                  ? "font-mono font-black tracking-tighter" 
                  : "font-mono font-bold tracking-normal"
              )}
              style={{
                textShadow: currentColors.theme === 'intense'
                  ? `0 4px 12px rgba(0, 0, 0, 0.4), 0 0 40px ${currentColors.glow}, 0 0 80px ${currentColors.glow}20`
                  : `0 2px 20px ${currentColors.glow}, 0 0 60px ${currentColors.glow}40, 0 0 100px ${currentColors.glow}10`,
                fontFamily: currentColors.theme === 'intense' 
                  ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                  : 'ui-rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                fontWeight: currentColors.theme === 'intense' ? '900' : '600',
                letterSpacing: currentColors.theme === 'intense' ? '-0.05em' : '0.02em'
              }}
            >
              {formatTime(timeRemaining)}
            </motion.div>
            
            {/* Minimal Progress Indicator */}
            <motion.div 
              className="text-neutral-800 space-y-1 text-center mt-2"
              animate={{
                opacity: 0.9
              }}
            >
              <div className="text-sm font-bold">
                {Math.round(progress)}% complete
              </div>
              <div className="text-xs font-mono font-semibold text-neutral-700">
                {formatTime(totalTime - timeRemaining)} elapsed
              </div>
            </motion.div>

            {/* Clean Flow Indicator */}
            {isRunning && (
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: currentColors.primary,
                    opacity: 0.6
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Enhanced Visual Indicators */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: currentColors.theme === 'intense' ? 6 : 10,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {currentColors.theme === 'intense' ? (
              // Focused particles for focus sessions
              [...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px h-px rounded-full"
                  style={{
                    backgroundColor: currentColors.primary,
                    left: `${40 + i * 20}%`,
                    top: `${30 + i * 20}%`,
                    opacity: 0.4
                  }}
                  animate={{
                    scale: [0.5, 1, 0.5],
                    y: [0, -8, -12],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: i * 2,
                    ease: 'easeOut'
                  }}
                />
              ))
            ) : (
              // Floating relaxing particles for break sessions
              [...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: currentColors.aurora[i % 3],
                    width: `${2 + (i % 3)}px`,
                    height: `${2 + (i % 3)}px`,
                    left: `${20 + (i % 4) * 20}%`,
                    top: `${25 + (i % 3) * 25}%`,
                    opacity: 0.2
                  }}
                  animate={{
                    scale: [0.3, 1, 0.3],
                    x: [0, Math.cos(i) * 15, 0],
                    y: [0, Math.sin(i) * 15, 0],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: 'easeInOut'
                  }}
                />
              ))
            )}
          </motion.div>
        )}
      </motion.div>

    </div>
  )
}