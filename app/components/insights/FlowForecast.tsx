import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Clock, TrendingUp, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import NeuralStatePredictor from '@/services/neuralPredictor'

interface FlowForecast {
  time: Date
  flowProbability: number
  recommendation: string
  confidence: number
}

interface CurrentPrediction extends FlowForecast {
  neuralSignals: {
    typingRhythm: number
    cursorSmoothness: number
    cognitiveStability: number
  }
}

export function FlowForecast() {
  const [currentPrediction, setCurrentPrediction] = useState<CurrentPrediction | null>(null)
  const [hourlyForecast, setHourlyForecast] = useState<FlowForecast[]>([])
  const [predictor] = useState(() => new NeuralStatePredictor())
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    const updatePredictions = async () => {
      try {
        setIsAnalyzing(true)
        
        // Get current neural state prediction
        const current = await predictor.predictFlowState()
        const metrics = predictor.getCurrentMetrics()
        
        setCurrentPrediction({
          time: new Date(),
          flowProbability: current.probabilityScore,
          recommendation: current.recommendedAction,
          confidence: current.confidenceLevel,
          neuralSignals: {
            typingRhythm: metrics.typingRhythm,
            cursorSmoothness: metrics.cursorSmoothness,
            cognitiveStability: metrics.cognitiveStability
          }
        })

        // Get 4-hour forecast
        const forecast = predictor.generateFlowForecast(4)
        setHourlyForecast(forecast)
        
      } catch (error) {
        console.error('Prediction error:', error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    updatePredictions()
    const interval = setInterval(updatePredictions, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [predictor])

  const getFlowColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-500'
    if (probability >= 0.6) return 'text-yellow-500'
    if (probability >= 0.4) return 'text-orange-500'
    return 'text-red-500'
  }

  const getFlowIcon = (probability: number) => {
    if (probability >= 0.8) return CheckCircle
    if (probability >= 0.6) return Zap
    if (probability >= 0.4) return Clock
    return AlertTriangle
  }

  const getRecommendationText = (action: string) => {
    switch (action) {
      case 'start_session':
        return 'Perfect time to start a focus session!'
      case 'wait':
        return 'Wait for better neural conditions'
      case 'prepare_environment':
        return 'Prepare your environment for upcoming flow'
      case 'take_break':
        return 'Take a break to reset your cognitive state'
      default:
        return 'Continue monitoring neural patterns'
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Neural State */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary-500" />
          Neural State Analysis
        </h3>

        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing neural patterns...</span>
          </div>
        ) : currentPrediction && (
          <div className="space-y-4">
            {/* Flow Probability */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Flow Probability</span>
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getFlowIcon(currentPrediction.flowProbability)
                  return <Icon className={`w-5 h-5 ${getFlowColor(currentPrediction.flowProbability)}`} />
                })()}
                <span className={`font-bold text-lg ${getFlowColor(currentPrediction.flowProbability)}`}>
                  {Math.round(currentPrediction.flowProbability * 100)}%
                </span>
              </div>
            </div>

            {/* Neural Signals - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-3 sm:p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg sm:bg-transparent sm:dark:bg-transparent">
                <div className="text-3xl sm:text-2xl font-black sm:font-bold text-blue-500 mb-1">
                  {Math.round(currentPrediction.neuralSignals.typingRhythm)}%
                </div>
                <div className="text-sm sm:text-xs font-bold sm:font-normal text-gray-700 dark:text-gray-300 sm:text-gray-500 sm:dark:text-gray-400">Typing Rhythm</div>
              </div>
              <div className="text-center p-3 sm:p-2 bg-green-50 dark:bg-green-900/10 rounded-lg sm:bg-transparent sm:dark:bg-transparent">
                <div className="text-3xl sm:text-2xl font-black sm:font-bold text-green-500 mb-1">
                  {Math.round(currentPrediction.neuralSignals.cursorSmoothness)}%
                </div>
                <div className="text-sm sm:text-xs font-bold sm:font-normal text-gray-700 dark:text-gray-300 sm:text-gray-500 sm:dark:text-gray-400">Cursor Flow</div>
              </div>
              <div className="text-center p-3 sm:p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg sm:bg-transparent sm:dark:bg-transparent">
                <div className="text-3xl sm:text-2xl font-black sm:font-bold text-purple-500 mb-1">
                  {Math.round(currentPrediction.neuralSignals.cognitiveStability)}%
                </div>
                <div className="text-sm sm:text-xs font-bold sm:font-normal text-gray-700 dark:text-gray-300 sm:text-gray-500 sm:dark:text-gray-400">Mental Stability</div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <div className="font-medium text-primary-700 dark:text-primary-300">
                    Recommendation
                  </div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">
                    {getRecommendationText(currentPrediction.recommendation)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flow Forecast Chart */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          4-Hour Flow Forecast
        </h3>
        
        <div className="space-y-2">
          {hourlyForecast.slice(0, 8).map((forecast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  {forecast.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        forecast.flowProbability >= 0.8 ? 'bg-green-500' :
                        forecast.flowProbability >= 0.6 ? 'bg-yellow-500' :
                        forecast.flowProbability >= 0.4 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${forecast.flowProbability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${getFlowColor(forecast.flowProbability)}`}>
                  {Math.round(forecast.flowProbability * 100)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(forecast.confidence * 100)}% confidence
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Neural Pattern Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
          Pattern Recognition Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Typing Patterns</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              • Keystroke rhythm stability: Improving
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              • Burst length consistency: High
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              • Error correction rate: Decreasing
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Cursor Behavior</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              • Movement smoothness: Optimal
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              • Micro-corrections: Minimal
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              • Intention clarity: High
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Neural Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
          Live Neural Activity
        </h3>
        
        <div className="space-y-4">
          {currentPrediction && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cognitive Load</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="h-2 bg-blue-500 rounded-full"
                      animate={{ width: `${100 - currentPrediction.neuralSignals.cognitiveStability}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(100 - currentPrediction.neuralSignals.cognitiveStability)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Attention Stability</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="h-2 bg-green-500 rounded-full"
                      animate={{ width: `${currentPrediction.neuralSignals.cognitiveStability}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(currentPrediction.neuralSignals.cognitiveStability)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Flow Readiness</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="h-2 bg-purple-500 rounded-full"
                      animate={{ width: `${currentPrediction.flowProbability * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(currentPrediction.flowProbability * 100)}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}