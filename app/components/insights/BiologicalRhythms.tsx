import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Brain, 
  Activity, 
  Sunrise, 
  Moon, 
  Zap, 
  Coffee, 
  Heart,
  TrendingUp,
  Calendar,
  Target,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import BiologicalRhythmOptimizer from '@/services/biologicalRhythms'

interface BiologicalInsight {
  currentPhase: string
  nextPeakIn: number
  energyForecast: { hour: number; energy: number }[]
  weeklyOptimal: string[]
}

interface TaskRecommendation {
  complexity: 'low' | 'medium' | 'high'
  type: 'creative' | 'analytical' | 'routine' | 'communication'
  duration: number
  reasoning: string
  alternativeOptions: string[]
  timingConfidence: number
}

interface RecoveryPrescription {
  type: 'micro' | 'short' | 'medium' | 'long'
  duration: number
  activities: {
    primary: string
    alternatives: string[]
    scientificRationale: string
  }
  expectedBenefit: string
  personalizedFor: string
}

export function BiologicalRhythms() {
  const [optimizer] = useState(() => new BiologicalRhythmOptimizer())
  const [insights, setInsights] = useState<BiologicalInsight | null>(null)
  const [taskRecommendation, setTaskRecommendation] = useState<TaskRecommendation | null>(null)
  const [recoveryPrescription, setRecoveryPrescription] = useState<RecoveryPrescription | null>(null)
  const [currentState, setCurrentState] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    const updateBiologicalData = () => {
      try {
        setIsAnalyzing(true)
        
        // Get comprehensive biological insights
        const rhythmInsights = optimizer.getRhythmInsights()
        setInsights(rhythmInsights)
        
        // Get current cognitive state
        const cognitiveState = optimizer.getCurrentCognitiveState()
        setCurrentState(cognitiveState)
        
        // Get task recommendation
        const taskRec = optimizer.recommendOptimalTask()
        setTaskRecommendation(taskRec)
        
        // Get recovery prescription
        const recovery = optimizer.prescribeRecovery()
        setRecoveryPrescription(recovery)
        
        console.log('🌊 Updated biological rhythm data')
      } catch (error) {
        console.error('Biological rhythm analysis error:', error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    updateBiologicalData()
    const interval = setInterval(updateBiologicalData, 5 * 60 * 1000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [optimizer])

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return 'text-green-500'
    if (energy >= 60) return 'text-yellow-500'
    if (energy >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getEnergyBgColor = (energy: number) => {
    if (energy >= 80) return 'bg-green-500'
    if (energy >= 60) return 'bg-yellow-500'
    if (energy >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'high': return Brain
      case 'medium': return Zap
      case 'low': return Coffee
      default: return Activity
    }
  }

  const getRecoveryIcon = (type: string) => {
    switch (type) {
      case 'micro': return RefreshCw
      case 'short': return Coffee
      case 'medium': return Heart
      case 'long': return Moon
      default: return RefreshCw
    }
  }

  const formatTimeToNext = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Current Biological State */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary-500" />
          Biological Rhythm Analysis
        </h3>

        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing circadian patterns...</span>
          </div>
        ) : insights && currentState && (
          <div className="space-y-6">
            {/* Current Phase */}
            <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Sunrise className="w-6 h-6 text-primary-500" />
                <div>
                  <div className="font-medium text-primary-700 dark:text-primary-300">
                    Current Phase
                  </div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">
                    {insights.currentPhase}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Next Peak In</div>
                <div className="font-bold text-lg text-primary-600 dark:text-primary-400">
                  {formatTimeToNext(insights.nextPeakIn)}
                </div>
              </div>
            </div>

            {/* Cognitive Capacity Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getEnergyColor(currentState.currentCapacity)}`}>
                  {Math.round(currentState.currentCapacity)}%
                </div>
                <div className="text-xs text-gray-500">Cognitive Capacity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {currentState.recoveryTime}m
                </div>
                <div className="text-xs text-gray-500">Recovery Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">
                  {currentState.energyTrend === 'rising' ? '↗️' : 
                   currentState.energyTrend === 'peak' ? '🔝' :
                   currentState.energyTrend === 'declining' ? '↘️' : '🔄'}
                </div>
                <div className="text-xs text-gray-500 capitalize">{currentState.energyTrend}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">
                  {currentState.fatigueType === 'none' ? '✨' : 
                   currentState.fatigueType === 'attention' ? '👁️' :
                   currentState.fatigueType === 'decision' ? '🤔' :
                   currentState.fatigueType === 'creative' ? '🎨' : '🧠'}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {currentState.fatigueType === 'none' ? 'No Fatigue' : `${currentState.fatigueType} Fatigue`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Energy Forecast */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success-500" />
          6-Hour Energy Forecast
        </h3>
        
        {insights && (
          <div className="space-y-3">
            {insights.energyForecast.map((forecast, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-mono text-gray-500 w-16">
                    {forecast.hour}:00
                  </div>
                  <div className="flex-1 w-48">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getEnergyBgColor(forecast.energy)}`}
                        style={{ width: `${forecast.energy}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${getEnergyColor(forecast.energy)}`}>
                  {Math.round(forecast.energy)}%
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Task Recommendation */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-focus-500" />
          Cognitive Load Balancing
        </h3>
        
        {taskRecommendation && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-focus-50 dark:bg-focus-900/20 rounded-lg">
              {(() => {
                const Icon = getComplexityIcon(taskRecommendation.complexity)
                return <Icon className="w-6 h-6 text-focus-500 mt-1" />
              })()}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-focus-700 dark:text-focus-300 capitalize">
                    {taskRecommendation.complexity} Complexity {taskRecommendation.type}
                  </span>
                  <span className="text-xs bg-focus-200 dark:bg-focus-800 text-focus-700 dark:text-focus-300 px-2 py-1 rounded">
                    {taskRecommendation.duration}min
                  </span>
                  <span className="text-xs bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    {taskRecommendation.timingConfidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-focus-600 dark:text-focus-400 mb-3">
                  {taskRecommendation.reasoning}
                </p>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Alternative Options:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {taskRecommendation.alternativeOptions.map((option, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recovery Prescription */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Recovery Prescription
        </h3>
        
        {recoveryPrescription && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              {(() => {
                const Icon = getRecoveryIcon(recoveryPrescription.type)
                return <Icon className="w-6 h-6 text-pink-500 mt-1" />
              })()}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-pink-700 dark:text-pink-300 capitalize">
                    {recoveryPrescription.type} Break
                  </span>
                  <span className="text-xs bg-pink-200 dark:bg-pink-800 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">
                    {recoveryPrescription.duration} minutes
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-pink-700 dark:text-pink-300 mb-1">
                      Recommended Activity:
                    </div>
                    <div className="text-sm text-pink-600 dark:text-pink-400">
                      {recoveryPrescription.activities.primary}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Why This Works:
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {recoveryPrescription.activities.scientificRationale}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expected Benefit:
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {recoveryPrescription.expectedBenefit}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alternatives:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recoveryPrescription.activities.alternatives.map((alt, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Optimal Times */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Weekly Productivity Windows
        </h3>
        
        {insights && (
          <div className="space-y-3">
            {insights.weeklyOptimal.map((window, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                <span className="text-sm text-indigo-700 dark:text-indigo-300">
                  {window}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ultradian Rhythm Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          90-Minute Ultradian Cycles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Current Cycle Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cycle Type</span>
                <span className="text-sm font-medium">High-Energy Analytical</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Peak Duration</span>
                <span className="text-sm font-medium">20 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Consistency</span>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Optimization Tips</h4>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                • Schedule complex tasks during 20-minute peaks
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                • Use 15-minute troughs for recovery
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                • Align breaks with natural dips
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}