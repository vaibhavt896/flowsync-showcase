import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimer } from '../../../hooks/useTimer'
import { useBreathing } from '../../../contexts/BreathingContext'
import { 
  AlertTriangle, 
  Zap, 
  Eye, 
  Coffee, 
  Activity,
  Clock,
  Shield,
  X,
  CheckCircle
} from 'lucide-react'

interface UrgentIntervention {
  id: string
  type: 'emergency' | 'critical' | 'warning' | 'protection'
  title: string
  description: string
  urgency: number // 1-10
  timeWindow: number // seconds until action needed
  actions: {
    primary: { label: string; callback: () => void }
    secondary?: { label: string; callback: () => void }
    dismiss?: { label: string; callback: () => void }
  }
  icon: any
  color: string
  pulse: boolean
}

export function UrgentInterventionsLayer() {
  const { timeRemaining, isRunning, currentSession, sessionsCompleted } = useTimer()
  const { breathingState, breathingRate } = useBreathing()
  const [interventions, setInterventions] = useState<UrgentIntervention[]>([])
  const [acknowledgedInterventions, setAcknowledgedInterventions] = useState<Set<string>>(new Set())

  // Monitor for urgent situations
  useEffect(() => {
    const checkForUrgentSituations = () => {
      const newInterventions: UrgentIntervention[] = []
      const now = Date.now()

      // Critical: Extreme session length (burnout protection)
      if (isRunning && timeRemaining > 3600) { // More than 1 hour
        newInterventions.push({
          id: 'extreme-session-length',
          type: 'emergency',
          title: 'BURNOUT PROTECTION ACTIVE',
          description: 'Session exceeds safe cognitive load. Immediate break required to prevent mental exhaustion.',
          urgency: 10,
          timeWindow: 60, // 1 minute to act
          actions: {
            primary: {
              label: 'Take Break Now',
              callback: () => {
                // Force break
                acknowledgeIntervention('extreme-session-length')
                console.log('Emergency break initiated')
              }
            },
            secondary: {
              label: 'Continue (5 min max)',
              callback: () => {
                // Allow 5 more minutes
                acknowledgeIntervention('extreme-session-length')
              }
            }
          },
          icon: Shield,
          color: 'rgba(239, 68, 68, 0.95)',
          pulse: true
        })
      }

      // Critical: Breathing irregularity
      if (breathingRate > 0.25 || breathingRate < 0.05) { // Outside normal range
        newInterventions.push({
          id: 'breathing-irregularity',
          type: 'critical',
          title: 'BREATHING PATTERN ALERT',
          description: 'Detected stress indicators in breathing rhythm. Guided breathing exercise recommended.',
          urgency: 8,
          timeWindow: 120,
          actions: {
            primary: {
              label: 'Start Breathing Exercise',
              callback: () => {
                acknowledgeIntervention('breathing-irregularity')
                // Start guided breathing
              }
            },
            dismiss: {
              label: 'Dismiss',
              callback: () => acknowledgeIntervention('breathing-irregularity')
            }
          },
          icon: Activity,
          color: 'rgba(245, 158, 11, 0.9)',
          pulse: true
        })
      }

      // Warning: Missed break window
      if (sessionsCompleted >= 3 && isRunning && breathingState === 'focus') {
        const lastBreakTime = now - (sessionsCompleted * 30 * 60 * 1000) // Estimate
        const timeSinceBreak = now - lastBreakTime
        
        if (timeSinceBreak > 120 * 60 * 1000) { // 2 hours without proper break
          newInterventions.push({
            id: 'missed-break-window',
            type: 'warning',
            title: 'BREAK WINDOW OVERDUE',
            description: 'You\'ve been focused for 2+ hours. Your brain needs recovery to maintain performance.',
            urgency: 7,
            timeWindow: 300, // 5 minutes
            actions: {
              primary: {
                label: 'Take 15-min Break',
                callback: () => {
                  acknowledgeIntervention('missed-break-window')
                  // Initiate break
                }
              },
              secondary: {
                label: 'Quick 5-min Break',
                callback: () => {
                  acknowledgeIntervention('missed-break-window')
                  // Short break
                }
              }
            },
            icon: Coffee,
            color: 'rgba(139, 92, 246, 0.85)',
            pulse: false
          })
        }
      }

      // Protection: Flow state disruption risk
      if (breathingState === 'focus' && isRunning) {
        const hour = new Date().getHours()
        if (hour >= 17 && hour <= 19) { // Evening distraction window
          newInterventions.push({
            id: 'flow-disruption-risk',
            type: 'protection',
            title: 'FLOW STATE PROTECTION',
            description: 'High-distraction time window detected. Enable do-not-disturb mode?',
            urgency: 6,
            timeWindow: 180,
            actions: {
              primary: {
                label: 'Enable Protection',
                callback: () => {
                  acknowledgeIntervention('flow-disruption-risk')
                  // Enable DND mode
                }
              },
              dismiss: {
                label: 'Not Now',
                callback: () => acknowledgeIntervention('flow-disruption-risk')
              }
            },
            icon: Eye,
            color: 'rgba(16, 185, 129, 0.8)',
            pulse: false
          })
        }
      }

      // Critical: Session about to end without proper completion
      if (isRunning && timeRemaining <= 30 && timeRemaining > 0) { // Last 30 seconds
        newInterventions.push({
          id: 'session-completion-critical',
          type: 'critical',
          title: 'SESSION COMPLETION CRITICAL',
          description: 'Session ending in 30 seconds. Ensure proper task closure for maximum benefit.',
          urgency: 9,
          timeWindow: 30,
          actions: {
            primary: {
              label: 'Mark Complete',
              callback: () => {
                acknowledgeIntervention('session-completion-critical')
                // Mark session as complete
              }
            },
            secondary: {
              label: 'Extend 5 min',
              callback: () => {
                acknowledgeIntervention('session-completion-critical')
                // Extend session
              }
            }
          },
          icon: Clock,
          color: 'rgba(59, 130, 246, 0.9)',
          pulse: true
        })
      }

      // Filter out acknowledged interventions
      const filteredInterventions = newInterventions.filter(
        intervention => !acknowledgedInterventions.has(intervention.id)
      )

      // Sort by urgency (highest first)
      filteredInterventions.sort((a, b) => b.urgency - a.urgency)

      setInterventions(filteredInterventions.slice(0, 2)) // Max 2 active interventions
    }

    checkForUrgentSituations()
    
    // Check every 5 seconds for urgent situations
    const interval = setInterval(checkForUrgentSituations, 5000)
    
    return () => clearInterval(interval)
  }, [timeRemaining, isRunning, currentSession, sessionsCompleted, breathingState, breathingRate, acknowledgedInterventions])

  const acknowledgeIntervention = (interventionId: string) => {
    setAcknowledgedInterventions(prev => new Set(prev).add(interventionId))
    
    // Auto-remove from acknowledged after 5 minutes to allow re-triggering
    setTimeout(() => {
      setAcknowledgedInterventions(prev => {
        const newSet = new Set(prev)
        newSet.delete(interventionId)
        return newSet
      })
    }, 5 * 60 * 1000)
  }

  const getUrgencyIndicator = (urgency: number) => {
    if (urgency >= 9) return { label: 'CRITICAL', color: 'text-red-300' }
    if (urgency >= 7) return { label: 'HIGH', color: 'text-orange-300' }
    if (urgency >= 5) return { label: 'MEDIUM', color: 'text-yellow-300' }
    return { label: 'LOW', color: 'text-blue-300' }
  }

  const formatTimeWindow = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${seconds % 60}s`
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Urgent Interventions */}
      <AnimatePresence>
        {interventions.map((intervention, index) => (
          <motion.div
            key={intervention.id}
            initial={{ opacity: 0, scale: 0.8, z: -200 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              z: 100 + index * 50,
              y: intervention.pulse ? [0, -5, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0.8, z: -200 }}
            transition={{ 
              duration: 0.3,
              y: { duration: 1, repeat: Infinity }
            }}
            className="absolute pointer-events-auto"
            style={{
              top: `${20 + index * 120}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000 + intervention.urgency
            }}
          >
            <div
              className="relative max-w-md p-6 rounded-2xl backdrop-blur-lg border-2 shadow-2xl"
              style={{
                backgroundColor: intervention.color,
                borderColor: intervention.type === 'emergency' ? '#ef4444' : 'rgba(255,255,255,0.3)',
                boxShadow: `0 0 ${intervention.urgency * 5}px ${intervention.color}`
              }}
            >
              {/* Urgency Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <intervention.icon className={`w-6 h-6 text-white ${intervention.pulse ? 'animate-pulse' : ''}`} />
                  <span className={`text-xs font-bold ${getUrgencyIndicator(intervention.urgency).color}`}>
                    {getUrgencyIndicator(intervention.urgency).label} PRIORITY
                  </span>
                </div>
                <div className="text-xs text-white/70">
                  {formatTimeWindow(intervention.timeWindow)} left
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  {intervention.title}
                </h3>
                <p className="text-white/90 text-sm">
                  {intervention.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={intervention.actions.primary.callback}
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors border border-white/30"
                >
                  {intervention.actions.primary.label}
                </button>
                
                <div className="flex gap-2">
                  {intervention.actions.secondary && (
                    <button
                      onClick={intervention.actions.secondary.callback}
                      className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                    >
                      {intervention.actions.secondary.label}
                    </button>
                  )}
                  
                  {intervention.actions.dismiss && (
                    <button
                      onClick={intervention.actions.dismiss.callback}
                      className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      {intervention.actions.dismiss.label}
                    </button>
                  )}
                </div>
              </div>

              {/* Urgency Pulse Effect */}
              {intervention.pulse && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/50"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Emergency Overlay */}
      {interventions.some(i => i.type === 'emergency') && (
        <motion.div
          className="absolute inset-0 bg-red-500/10 pointer-events-none"
          animate={{
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
      )}

      {/* Layer Status Indicator */}
      {interventions.length > 0 && (
        <div className="absolute bottom-8 right-8 pointer-events-none">
          <div className="p-3 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30">
            <div className="text-xs text-red-300 font-mono">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3 h-3" />
                Layer 4: Urgent Interventions
              </div>
              <div>Active: {interventions.length}</div>
              <div>Max Urgency: {Math.max(...interventions.map(i => i.urgency))}</div>
            </div>
          </div>
        </div>
      )}

      {/* Intervention History Indicator */}
      {acknowledgedInterventions.size > 0 && (
        <div className="absolute top-8 right-8 pointer-events-none">
          <div className="p-2 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
            <div className="text-xs text-green-300 font-mono flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              {acknowledgedInterventions.size} handled
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <div className="p-2 bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-xs text-white/70 font-mono">
            <div className="mb-1">Protection System:</div>
            <div className={`flex items-center gap-2 ${interventions.length > 0 ? 'text-red-300' : 'text-green-300'}`}>
              <div className={`w-2 h-2 rounded-full ${interventions.length > 0 ? 'bg-red-400' : 'bg-green-400'} animate-pulse`} />
              {interventions.length > 0 ? 'Active' : 'Monitoring'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UrgentInterventionsLayer