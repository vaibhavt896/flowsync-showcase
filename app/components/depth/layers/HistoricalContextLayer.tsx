import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimerStore } from '../../../stores/timerStore'
import { Clock, TrendingUp, Zap } from 'lucide-react'

interface HistoricalSession {
  id: string
  type: 'focus' | 'short-break' | 'long-break'
  duration: number
  completedAt: number
  quality: number
  ghostOpacity: number
  position: { x: number; y: number }
}

interface EchoTrail {
  id: string
  path: { x: number; y: number; timestamp: number }[]
  intensity: number
  decayRate: number
}

export function HistoricalContextLayer() {
  const { sessionHistory } = useTimerStore()
  const [ghostSessions, setGhostSessions] = useState<HistoricalSession[]>([])
  const [echoTrails, setEchoTrails] = useState<EchoTrail[]>([])

  // Generate ghost sessions from historical data
  useEffect(() => {
    const generateGhostSessions = () => {
      const now = Date.now()
      const dayInMs = 24 * 60 * 60 * 1000
      const weekInMs = 7 * dayInMs
      
      // Get sessions from the last week
      const recentSessions = (sessionHistory || [])
        .filter(session => {
          const sessionTime = new Date(session.startTime).getTime()
          return now - sessionTime < weekInMs
        })
        .slice(-20) // Last 20 sessions
        .map((session, index) => {
          const age = now - (session.timestamp?.getTime() || session.startTime.getTime())
          const ageInDays = age / dayInMs
          
          // Calculate ghost opacity based on age (newer = more visible)
          const ghostOpacity = Math.max(0.1, 1 - (ageInDays / 7)) * 0.3
          
          // Position ghosts in a timeline-like arrangement
          const x = 50 + (index % 10) * 120 // Spread horizontally
          const y = 100 + Math.floor(index / 10) * 150 // Stack vertically
          
          return {
            id: `ghost-${session.id || index}`,
            type: session.type || 'focus',
            duration: session.duration || 25,
            completedAt: session.timestamp?.getTime() || (now - age),
            quality: session.rating || 7,
            ghostOpacity,
            position: { x, y }
          }
        })

      setGhostSessions(recentSessions)
    }

    generateGhostSessions()
    
    // Update ghost sessions every minute
    const interval = setInterval(generateGhostSessions, 60000)
    
    return () => clearInterval(interval)
  }, [sessionHistory])

  // Generate echo trails showing productivity patterns
  useEffect(() => {
    const generateEchoTrails = () => {
      const now = Date.now()
      const trails: EchoTrail[] = []
      
      // Create trails for different time periods
      const timeRanges = [
        { range: 'today', hours: 24, intensity: 0.8 },
        { range: 'week', hours: 168, intensity: 0.4 },
        { range: 'month', hours: 720, intensity: 0.2 }
      ]
      
      timeRanges.forEach(({ range, hours, intensity }) => {
        const path: { x: number; y: number; timestamp: number }[] = []
        
        // Simulate historical activity path
        for (let i = 0; i < hours; i += 2) { // Every 2 hours
          const timestamp = now - (hours - i) * 60 * 60 * 1000
          const hour = new Date(timestamp).getHours()
          
          // Create a natural daily activity curve
          const dailyActivity = Math.sin(((hour - 6) / 12) * Math.PI) * 0.5 + 0.5
          const weeklyVariation = Math.sin((i / (24 * 7)) * Math.PI * 2) * 0.2
          const activity = Math.max(0, dailyActivity + weeklyVariation)
          
          path.push({
            x: 50 + (i / hours) * (window.innerWidth - 100),
            y: window.innerHeight * 0.7 - activity * 200,
            timestamp
          })
        }
        
        trails.push({
          id: `echo-${range}`,
          path,
          intensity,
          decayRate: 0.95
        })
      })
      
      setEchoTrails(trails)
    }

    generateEchoTrails()
    
    const interval = setInterval(generateEchoTrails, 300000) // Every 5 minutes
    
    return () => clearInterval(interval)
  }, [sessionHistory])

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'focus': return <Zap className="w-4 h-4" />
      case 'short-break': return <Clock className="w-4 h-4" />
      case 'long-break': return <TrendingUp className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'focus': return 'rgba(16, 185, 129, 0.6)'
      case 'short-break': return 'rgba(59, 130, 246, 0.6)'
      case 'long-break': return 'rgba(139, 92, 246, 0.6)'
      default: return 'rgba(107, 114, 128, 0.6)'
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Recent'
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Echo Trails */}
      <svg className="absolute inset-0 w-full h-full">
        {echoTrails.map(trail => (
          <motion.path
            key={trail.id}
            d={`M ${trail.path.map(p => `${p.x},${p.y}`).join(' L ')}`}
            stroke={`rgba(100, 116, 139, ${trail.intensity})`}
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: trail.intensity }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}
      </svg>

      {/* Ghost Sessions */}
      <AnimatePresence>
        {ghostSessions.map((session, index) => (
          <motion.div
            key={session.id}
            className="absolute"
            style={{
              left: session.position.x,
              top: session.position.y,
              opacity: session.ghostOpacity
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: session.ghostOpacity,
              y: [0, -10, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1,
              y: { duration: 3, repeat: Infinity }
            }}
          >
            <div 
              className="relative p-4 rounded-lg border border-gray-300 dark:border-gray-600 backdrop-blur-sm"
              style={{ 
                backgroundColor: getSessionColor(session.type),
                boxShadow: `0 0 20px ${getSessionColor(session.type)}`
              }}
            >
              {/* Session Icon */}
              <div className="flex items-center gap-2 mb-2">
                {getSessionIcon(session.type)}
                <span className="text-xs font-medium capitalize">
                  {session.type.replace('-', ' ')}
                </span>
              </div>
              
              {/* Session Details */}
              <div className="text-xs space-y-1">
                <div>{session.duration}min</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                  <span>Quality: {session.quality}/10</span>
                </div>
                <div className="text-gray-400 dark:text-gray-500">
                  {formatTimeAgo(session.completedAt)}
                </div>
              </div>
              
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-lg blur-md -z-10"
                style={{ backgroundColor: getSessionColor(session.type) }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Historical Pattern Summary */}
      <div className="absolute bottom-8 left-8 p-4 rounded-lg bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="text-xs text-gray-300 font-mono space-y-1">
          <div className="font-medium mb-2">Historical Echoes</div>
          <div>Sessions: {ghostSessions.length}</div>
          <div>Avg Quality: {ghostSessions.length > 0 ? 
            (ghostSessions.reduce((sum, s) => sum + s.quality, 0) / ghostSessions.length).toFixed(1) : '0'}</div>
          <div>Patterns: {echoTrails.length}</div>
        </div>
      </div>

      {/* Time Navigation Hint */}
      <div className="absolute top-8 right-8 p-3 rounded-lg bg-black bg-opacity-10 backdrop-blur-sm">
        <div className="text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Layer 1: Historical Context
          </div>
          <div className="mt-1 text-gray-500">
            Ghosted echoes from past sessions
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoricalContextLayer