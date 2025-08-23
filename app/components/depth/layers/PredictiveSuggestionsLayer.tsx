import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimer } from '../../../hooks/useTimer'
import { useBreathing } from '../../../contexts/BreathingContext'
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Coffee, 
  Brain, 
  Target,
  Lightbulb,
  ArrowRight,
  Star,
  Activity
} from 'lucide-react'

interface PredictiveSuggestion {
  id: string
  type: 'energy' | 'break' | 'optimization' | 'warning' | 'achievement'
  title: string
  description: string
  confidence: number
  timeRelevant: number // minutes from now
  action?: {
    label: string
    callback: () => void
  }
  icon: any
  color: string
  priority: number
}

interface FuturePossibility {
  id: string
  scenario: string
  probability: number
  outcome: string
  suggestedAction: string
  timeframe: string
  impact: 'low' | 'medium' | 'high'
}

export function PredictiveSuggestionsLayer() {
  const { timeRemaining, isRunning, currentSession, sessionsCompleted } = useTimer()
  const { breathingState } = useBreathing()
  const [suggestions, setSuggestions] = useState<PredictiveSuggestion[]>([])
  const [futurePossibilities, setFuturePossibilities] = useState<FuturePossibility[]>([])

  // Generate predictive suggestions based on current state
  useEffect(() => {
    const generateSuggestions = () => {
      const newSuggestions: PredictiveSuggestion[] = []
      const currentTime = Date.now()
      const hour = new Date().getHours()

      // Energy level predictions
      if (isRunning && timeRemaining < 300) { // Less than 5 minutes
        newSuggestions.push({
          id: 'session-ending',
          type: 'break',
          title: 'Session Ending Soon',
          description: 'Consider your break activity. Walking recommended for optimal recovery.',
          confidence: 0.95,
          timeRelevant: Math.floor(timeRemaining / 60),
          icon: Clock,
          color: 'rgba(59, 130, 246, 0.8)',
          priority: 8
        })
      }

      // Circadian rhythm predictions
      if (hour >= 14 && hour <= 16) {
        newSuggestions.push({
          id: 'afternoon-dip',
          type: 'energy',
          title: 'Afternoon Energy Dip Predicted',
          description: 'Your energy typically drops 15% around this time. Consider a power nap or light exercise.',
          confidence: 0.78,
          timeRelevant: 30,
          icon: TrendingUp,
          color: 'rgba(245, 158, 11, 0.8)',
          priority: 6
        })
      }

      // Flow state predictions
      if (isRunning && sessionsCompleted >= 2) {
        newSuggestions.push({
          id: 'flow-opportunity',
          type: 'optimization',
          title: 'Flow State Window Opening',
          description: 'Based on your pattern, peak focus arrives in 8-12 minutes. Minimize distractions now.',
          confidence: 0.72,
          timeRelevant: 10,
          icon: Zap,
          color: 'rgba(16, 185, 129, 0.8)',
          priority: 9
        })
      }

      // Break timing optimization
      if (!isRunning && breathingState === 'idle') {
        newSuggestions.push({
          id: 'optimal-break-end',
          type: 'optimization',
          title: 'Optimal Break Duration',
          description: 'Your breaks are most effective at 7-12 minutes. Consider resuming focus work soon.',
          confidence: 0.82,
          timeRelevant: 5,
          icon: Coffee,
          color: 'rgba(139, 92, 246, 0.8)',
          priority: 5
        })
      }

      // Achievement predictions
      if (sessionsCompleted >= 3) {
        newSuggestions.push({
          id: 'productivity-milestone',
          type: 'achievement',
          title: 'Productivity Milestone Ahead',
          description: 'Complete 2 more sessions to achieve your best daily score this week!',
          confidence: 0.91,
          timeRelevant: 60,
          icon: Star,
          color: 'rgba(236, 72, 153, 0.8)',
          priority: 7
        })
      }

      // Cognitive load warnings
      if (sessionsCompleted >= 4 && timeRemaining > 900) {
        newSuggestions.push({
          id: 'cognitive-overload-warning',
          type: 'warning',
          title: 'Cognitive Overload Risk',
          description: 'Extended focus detected. Consider shorter sessions to maintain quality.',
          confidence: 0.69,
          timeRelevant: 15,
          icon: Brain,
          color: 'rgba(239, 68, 68, 0.8)',
          priority: 8
        })
      }

      // Sort by priority and confidence
      newSuggestions.sort((a, b) => b.priority - a.priority)
      setSuggestions(newSuggestions.slice(0, 4)) // Keep top 4 suggestions
    }

    generateSuggestions()
    
    // Update suggestions every 30 seconds
    const interval = setInterval(generateSuggestions, 30000)
    
    return () => clearInterval(interval)
  }, [timeRemaining, isRunning, currentSession, sessionsCompleted, breathingState])

  // Generate future possibilities
  useEffect(() => {
    const generateFuturePossibilities = () => {
      const possibilities: FuturePossibility[] = [
        {
          id: 'energy-peak',
          scenario: 'If you maintain current pace',
          probability: 0.78,
          outcome: 'Peak cognitive performance in 45 minutes',
          suggestedAction: 'Reserve complex tasks for this window',
          timeframe: '45 min',
          impact: 'high'
        },
        {
          id: 'fatigue-onset',
          scenario: 'Without adequate breaks',
          probability: 0.65,
          outcome: 'Mental fatigue will increase by 40%',
          suggestedAction: 'Schedule micro-breaks every 20 minutes',
          timeframe: '2 hours',
          impact: 'medium'
        },
        {
          id: 'flow-achievement',
          scenario: 'With focused practice',
          probability: 0.83,
          outcome: 'Achieve 3+ flow states today',
          suggestedAction: 'Eliminate notifications during sessions',
          timeframe: 'Today',
          impact: 'high'
        },
        {
          id: 'weekly-goal',
          scenario: 'Continuing current trajectory',
          probability: 0.71,
          outcome: 'Exceed weekly productivity goal by 15%',
          suggestedAction: 'Maintain consistent session timing',
          timeframe: 'This week',
          impact: 'medium'
        }
      ]

      setFuturePossibilities(possibilities)
    }

    generateFuturePossibilities()
  }, [sessionsCompleted, timeRemaining])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'rgba(16, 185, 129, 0.8)'
      case 'medium': return 'rgba(245, 158, 11, 0.8)'
      case 'low': return 'rgba(107, 114, 128, 0.8)'
      default: return 'rgba(107, 114, 128, 0.8)'
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Predictive Suggestions */}
      <div className="absolute top-20 left-8 max-w-sm space-y-4">
        <div className="text-sm font-medium text-white/70 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Predictive Suggestions
        </div>
        
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -50, z: -100 }}
              animate={{ opacity: 1, x: 0, z: 0 }}
              exit={{ opacity: 0, x: -50, z: -100 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl backdrop-blur-sm border border-white/20"
              style={{
                backgroundColor: suggestion.color,
                transform: `translateZ(${20 + index * 10}px)`
              }}
            >
              <div className="flex items-start gap-3">
                <suggestion.icon className="w-5 h-5 text-white mt-0.5" />
                <div className="flex-1">
                  <div className="text-white font-medium text-sm mb-1">
                    {suggestion.title}
                  </div>
                  <div className="text-white/80 text-xs mb-2">
                    {suggestion.description}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-white/60 text-xs">
                      {suggestion.timeRelevant}min • {Math.round(suggestion.confidence * 100)}% confidence
                    </div>
                    {suggestion.action && (
                      <button
                        onClick={suggestion.action.callback}
                        className="text-white text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                      >
                        {suggestion.action.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Future Possibilities */}
      <div className="absolute top-20 right-8 max-w-sm space-y-4">
        <div className="text-sm font-medium text-white/70 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Future Possibilities
        </div>
        
        <AnimatePresence>
          {futurePossibilities.map((possibility, index) => (
            <motion.div
              key={possibility.id}
              initial={{ opacity: 0, x: 50, z: -100 }}
              animate={{ opacity: 1, x: 0, z: 0 }}
              exit={{ opacity: 0, x: 50, z: -100 }}
              transition={{ delay: index * 0.15 }}
              className="p-4 rounded-xl backdrop-blur-sm border border-white/20"
              style={{
                backgroundColor: getImpactColor(possibility.impact),
                transform: `translateZ(${30 + index * 15}px)`
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium text-sm">
                    {possibility.scenario}
                  </div>
                  <div className="text-white/80 text-xs">
                    {Math.round(possibility.probability * 100)}%
                  </div>
                </div>
                
                <div className="text-white/80 text-xs">
                  <strong>Outcome:</strong> {possibility.outcome}
                </div>
                
                <div className="text-white/70 text-xs">
                  <strong>Action:</strong> {possibility.suggestedAction}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-xs">
                    {possibility.timeframe}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded capitalize ${
                    possibility.impact === 'high' ? 'bg-green-500/20' :
                    possibility.impact === 'medium' ? 'bg-yellow-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    {possibility.impact} impact
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Prediction Indicators */}
      <div className="absolute inset-0 pointer-events-none">
        {suggestions.slice(0, 2).map((suggestion, index) => (
          <motion.div
            key={`float-${suggestion.id}`}
            className="absolute"
            style={{
              left: `${20 + index * 40}%`,
              top: `${60 + index * 10}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              delay: index * 1
            }}
          >
            <div 
              className="p-3 rounded-full backdrop-blur-sm"
              style={{ backgroundColor: suggestion.color }}
            >
              <suggestion.icon className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Layer Information */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="p-3 bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-xs text-white/70 font-mono text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <ArrowRight className="w-3 h-3" />
              Layer 3: Predictive Suggestions
            </div>
            <div>Future possibilities floating forward</div>
          </div>
        </div>
      </div>

      {/* Prediction Confidence Meter */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <div className="p-2 bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-xs text-white/70 font-mono mb-2 text-center">
            Confidence
          </div>
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <div key={suggestion.id} className="flex items-center gap-2 mb-1">
              <div className="w-16 bg-white/20 rounded-full h-1">
                <div
                  className="h-1 bg-white rounded-full"
                  style={{ width: `${suggestion.confidence * 100}%` }}
                />
              </div>
              <div className="text-xs text-white/60">
                {Math.round(suggestion.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PredictiveSuggestionsLayer