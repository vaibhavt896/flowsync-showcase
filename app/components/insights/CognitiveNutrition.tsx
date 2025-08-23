import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Battery, 
  Apple, 
  Zap, 
  TrendingUp, 
  Award, 
  Target,
  Clock,
  Brain,
  Heart,
  Coffee,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Pill,
  BarChart3,
  Calendar
} from 'lucide-react'
import CognitiveNutritionTracker from '@/services/cognitiveNutrition'

interface NutritionOverview {
  today: {
    caloriesBurned: number
    caloriesBudget: number
    energyRecovered: number
    netEnergyBalance: number
    sessionsCompleted: number
    recoveryBreaksTaken: number
    fitnessScore: number
    mood: string
  }
  currentEnergyLevel: number
  suggestedNextBreak: any
  fitnessMetrics: {
    currentScore: number
    trend: string
    weeklyProgress: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    nextLevelRequirements: {
      points: number
      activities: string[]
    }
  }
  weeklyProgress: any[]
  activeSession: any
  isTracking: boolean
}

export function CognitiveNutritionComponent() {
  const [tracker] = useState(() => new CognitiveNutritionTracker())
  const [overview, setOverview] = useState<NutritionOverview | null>(null)
  const [selectedTaskType, setSelectedTaskType] = useState<'deep-work' | 'creative' | 'analytical' | 'communication' | 'routine' | 'learning'>('deep-work')
  const [selectedComplexity, setSelectedComplexity] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium')
  const [sessionName, setSessionName] = useState('')
  const [showNutrientDetails, setShowNutrientDetails] = useState(false)

  useEffect(() => {
    const updateOverview = () => {
      const data = tracker.getNutritionOverview()
      setOverview(data)
    }

    updateOverview()
    const interval = setInterval(updateOverview, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [tracker])

  const handleStartSession = () => {
    if (overview?.isTracking) return
    
    const taskName = sessionName || `${selectedTaskType} session`
    tracker.startSession(selectedTaskType, selectedComplexity, taskName)
    setSessionName('')
    
    // Update overview immediately
    const data = tracker.getNutritionOverview()
    setOverview(data)
  }

  const handleEndSession = () => {
    if (!overview?.isTracking) return
    
    const rating = Math.floor(Math.random() * 4) + 7 // Simulate 7-10 rating
    tracker.endSession(rating)
    
    // Update overview
    const data = tracker.getNutritionOverview()
    setOverview(data)
  }

  const handleTakeBreak = () => {
    if (!overview?.suggestedNextBreak) return
    
    tracker.applyRecoveryNutrient(overview.suggestedNextBreak, 0.8 + Math.random() * 0.2)
    
    // Update overview
    const data = tracker.getNutritionOverview()
    setOverview(data)
  }

  const getEnergyColor = (level: number) => {
    if (level >= 80) return 'text-green-500'
    if (level >= 60) return 'text-yellow-500'
    if (level >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getEnergyBarColor = (level: number) => {
    if (level >= 80) return 'bg-green-500'
    if (level >= 60) return 'bg-yellow-500'
    if (level >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'energized': return '⚡'
      case 'balanced': return '😌'
      case 'tired': return '😴'
      case 'exhausted': return '🥱'
      default: return '🧠'
    }
  }

  const getFitnessGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600' }
    if (score >= 80) return { grade: 'A', color: 'text-green-500' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-500' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-500' }
    if (score >= 50) return { grade: 'D', color: 'text-orange-500' }
    return { grade: 'F', color: 'text-red-500' }
  }

  const getCalorieEstimate = () => {
    return tracker.getCalorieEstimate(selectedTaskType, selectedComplexity, 25)
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading cognitive nutrition data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Apple className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Cognitive Nutrition System
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Track mental energy like physical calories. Monitor cognitive costs, 
          get prescribed recovery nutrients, and build your Cognitive Fitness Score.
        </p>
      </div>

      {/* Today's Energy Overview */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Battery className="w-5 h-5 text-blue-500" />
          Today's Cognitive Energy
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Energy Level */}
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex justify-center mb-2">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                <div 
                  className={`absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent ${getEnergyBarColor(overview.currentEnergyLevel)} transition-all duration-500`}
                  style={{
                    background: `conic-gradient(currentColor ${overview.currentEnergyLevel * 3.6}deg, transparent 0deg)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${getEnergyColor(overview.currentEnergyLevel)}`}>
                    {overview.currentEnergyLevel}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Energy</div>
            <div className="text-xs text-gray-500 capitalize">{getMoodEmoji(overview.today.mood)} {overview.today.mood}</div>
          </div>

          {/* Calories Burned */}
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {overview.today.caloriesBurned}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Calories Burned</div>
            <div className="text-xs text-gray-500">of {overview.today.caloriesBudget} budget</div>
          </div>

          {/* Energy Recovered */}
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {overview.today.energyRecovered}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Recovered</div>
            <div className="text-xs text-gray-500">{overview.today.recoveryBreaksTaken} breaks taken</div>
          </div>

          {/* Net Balance */}
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${overview.today.netEnergyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overview.today.netEnergyBalance >= 0 ? '+' : ''}{overview.today.netEnergyBalance}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Balance</div>
            <div className="text-xs text-gray-500">{overview.today.sessionsCompleted} sessions</div>
          </div>
        </div>
      </div>

      {/* Session Tracking */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Session Tracking
        </h4>
        
        {overview.isTracking ? (
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-indigo-700 dark:text-indigo-300">
                    Session Active: {overview.activeSession?.name}
                  </span>
                </div>
                <button
                  onClick={handleEndSession}
                  className="button-primary px-4 py-2 text-sm"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  End Session
                </button>
              </div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400">
                Type: {overview.activeSession?.type} • Complexity: {overview.activeSession?.complexity}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Type
                </label>
                <select
                  value={selectedTaskType}
                  onChange={(e) => setSelectedTaskType(e.target.value as any)}
                  className="input-field"
                >
                  <option value="deep-work">Deep Work</option>
                  <option value="creative">Creative Work</option>
                  <option value="analytical">Analytical</option>
                  <option value="learning">Learning</option>
                  <option value="communication">Communication</option>
                  <option value="routine">Routine Tasks</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Complexity
                </label>
                <select
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value as any)}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Name (Optional)
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g., Code review, Design mockups..."
                className="input-field"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Estimated calories for 25min: <span className="font-medium">{getCalorieEstimate()}</span>
              </div>
              <button
                onClick={handleStartSession}
                className="button-primary px-6 py-2"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recovery Nutrients */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Pill className="w-5 h-5 text-pink-500" />
            Recovery Nutrients
          </h4>
          <button
            onClick={() => setShowNutrientDetails(!showNutrientDetails)}
            className="button-ghost text-sm"
          >
            {showNutrientDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {overview.suggestedNextBreak && (
          <div className="space-y-4">
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-pink-700 dark:text-pink-300 mb-1">
                    Recommended: {overview.suggestedNextBreak.name}
                  </div>
                  <div className="text-sm text-pink-600 dark:text-pink-400">
                    {overview.suggestedNextBreak.duration} minutes • +{overview.suggestedNextBreak.cognitiveValue} energy
                  </div>
                </div>
                <button
                  onClick={handleTakeBreak}
                  className="button-primary px-4 py-2 text-sm"
                >
                  Take Break
                </button>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Activity:</strong> {overview.suggestedNextBreak.activities.primary}
              </div>
              
              {showNutrientDetails && (
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">
                    <strong>Why this works:</strong> {overview.suggestedNextBreak.scientificBasis}
                  </div>
                  
                  {overview.suggestedNextBreak.activities.alternatives && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <strong>Alternatives:</strong> {overview.suggestedNextBreak.activities.alternatives.join(', ')}
                    </div>
                  )}
                  
                  {overview.suggestedNextBreak.activities.music && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <strong>Recommended music:</strong> {overview.suggestedNextBreak.activities.music.join(', ')}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">Effectiveness:</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 bg-pink-500 rounded-full"
                        style={{ width: `${overview.suggestedNextBreak.effectivenessScore * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(overview.suggestedNextBreak.effectivenessScore * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cognitive Fitness Score */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Cognitive Fitness Score
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Current Score */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${overview.fitnessMetrics.currentScore * 2.51} 251`}
                      className={getFitnessGrade(overview.fitnessMetrics.currentScore).color}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${getFitnessGrade(overview.fitnessMetrics.currentScore).color}`}>
                      {getFitnessGrade(overview.fitnessMetrics.currentScore).grade}
                    </span>
                    <span className="text-xs text-gray-500">{overview.fitnessMetrics.currentScore}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                {overview.fitnessMetrics.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {overview.fitnessMetrics.trend === 'declining' && <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />}
                <span className={`text-sm font-medium ${
                  overview.fitnessMetrics.trend === 'improving' ? 'text-green-600' : 
                  overview.fitnessMetrics.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {overview.fitnessMetrics.weeklyProgress >= 0 ? '+' : ''}{overview.fitnessMetrics.weeklyProgress} this week
                </span>
              </div>
            </div>

            {/* Next Level */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-yellow-700 dark:text-yellow-300">
                  Next Level: {overview.fitnessMetrics.nextLevelRequirements.points} points needed
                </span>
              </div>
              <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                {overview.fitnessMetrics.nextLevelRequirements.activities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {/* Strengths */}
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Strengths
              </h5>
              <div className="space-y-1">
                {overview.fitnessMetrics.strengths.map((strength, index) => (
                  <div key={index} className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Areas for Improvement
              </h5>
              <div className="space-y-1">
                {overview.fitnessMetrics.weaknesses.map((weakness, index) => (
                  <div key={index} className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Target className="w-3 h-3" />
                    {weakness}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                Recommendations
              </h5>
              <div className="space-y-1">
                {overview.fitnessMetrics.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="text-sm text-blue-600 dark:text-blue-400">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Coffee className="w-5 h-5 text-amber-500" />
          How Cognitive Nutrition Works
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Cognitive Calories
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Different tasks burn different amounts of mental energy. Deep work and creative tasks are 
              more expensive than routine activities. Flow states reduce cognitive cost.
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Pill className="w-4 h-4 text-pink-500" />
              Recovery Nutrients
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Specific break activities target different types of mental fatigue. Micro-breaks for attention, 
              power breaks for creativity, deep breaks for executive function.
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              Fitness Score
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your cognitive fitness improves with high-quality sessions, flow states, and good recovery habits. 
              Multitasking and stress reduce your score.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}