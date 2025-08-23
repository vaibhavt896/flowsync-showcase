import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Sparkles, 
  Zap, 
  Brain, 
  Heart, 
  Activity,
  Palette,
  Waves,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Info
} from 'lucide-react'
import ProductivityMirror from '@/services/productivityMirror'

interface MentalStateDisplay {
  focusLevel: number
  flowState: number
  distractionLevel: number
  creativityLevel: number
  fatigueLevel: number
  emotionalState: string
}

interface VisualizationMetrics {
  particleCount: number
  harmonyLevel: number
  chaosLevel: number
  currentColorScheme: string
  averageParticleHarmony: number
  averageParticleEnergy: number
}

export function ProductivityMirrorComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mirrorRef = useRef<ProductivityMirror | null>(null)
  const [mentalState, setMentalState] = useState<MentalStateDisplay | null>(null)
  const [visualMetrics, setVisualMetrics] = useState<VisualizationMetrics | null>(null)
  const [isRunning, setIsRunning] = useState(true)
  const [selectedDemo, setSelectedDemo] = useState<string>('auto')

  useEffect(() => {
    if (canvasRef.current && !mirrorRef.current) {
      // Initialize the Productivity Mirror
      mirrorRef.current = new ProductivityMirror()
      mirrorRef.current.initializeCanvas(canvasRef.current)
      
      console.log('🎨 Productivity Mirror™ initialized')
    }

    // Update state periodically
    const updateInterval = setInterval(() => {
      if (mirrorRef.current) {
        const state = mirrorRef.current.getCurrentMentalState()
        const metrics = mirrorRef.current.getVisualizationMetrics()
        
        if (state) {
          setMentalState({
            focusLevel: state.focusLevel,
            flowState: state.flowState,
            distractionLevel: state.distractionLevel,
            creativityLevel: state.creativityLevel,
            fatigueLevel: state.fatigueLevel,
            emotionalState: state.emotionalState
          })
        }
        
        setVisualMetrics(metrics)
      }
    }, 1000)

    return () => {
      clearInterval(updateInterval)
      if (mirrorRef.current) {
        mirrorRef.current.destroy()
      }
    }
  }, [])

  const handleDemoState = (demoType: string) => {
    if (!mirrorRef.current) return
    
    setSelectedDemo(demoType)
    
    switch (demoType) {
      case 'flow':
        mirrorRef.current.setMentalState({
          focusLevel: 0.9,
          flowState: 0.95,
          distractionLevel: 0.1,
          creativityLevel: 0.8,
          fatigueLevel: 0.2,
          emotionalState: 'energized'
        })
        break
      case 'focus':
        mirrorRef.current.setMentalState({
          focusLevel: 0.95,
          flowState: 0.7,
          distractionLevel: 0.1,
          creativityLevel: 0.5,
          fatigueLevel: 0.3,
          emotionalState: 'calm'
        })
        break
      case 'creative':
        mirrorRef.current.setMentalState({
          focusLevel: 0.7,
          flowState: 0.8,
          distractionLevel: 0.2,
          creativityLevel: 0.95,
          fatigueLevel: 0.2,
          emotionalState: 'excited'
        })
        break
      case 'distracted':
        mirrorRef.current.setMentalState({
          focusLevel: 0.3,
          flowState: 0.2,
          distractionLevel: 0.9,
          creativityLevel: 0.4,
          fatigueLevel: 0.6,
          emotionalState: 'stressed'
        })
        break
      case 'fatigued':
        mirrorRef.current.setMentalState({
          focusLevel: 0.2,
          flowState: 0.1,
          distractionLevel: 0.5,
          creativityLevel: 0.2,
          fatigueLevel: 0.9,
          emotionalState: 'tired'
        })
        break
      default:
        // Auto mode - let natural simulation continue
        break
    }
  }

  const toggleVisualization = () => {
    if (mirrorRef.current) {
      if (isRunning) {
        mirrorRef.current.stopVisualization()
      } else {
        // Restart would need to be implemented in the service
        window.location.reload() // Simple restart for demo
      }
      setIsRunning(!isRunning)
    }
  }

  const resetVisualization = () => {
    if (mirrorRef.current) {
      mirrorRef.current.destroy()
      mirrorRef.current = new ProductivityMirror()
      if (canvasRef.current) {
        mirrorRef.current.initializeCanvas(canvasRef.current)
      }
      setSelectedDemo('auto')
    }
  }

  const getStateColor = (value: number) => {
    if (value >= 0.8) return 'text-green-500'
    if (value >= 0.6) return 'text-yellow-500'
    if (value >= 0.4) return 'text-orange-500'
    return 'text-red-500'
  }

  const getStateIcon = (type: string) => {
    switch (type) {
      case 'focus': return Eye
      case 'flow': return Waves
      case 'creative': return Sparkles
      case 'distracted': return Zap
      case 'fatigued': return Heart
      default: return Brain
    }
  }

  const getEmotionalStateEmoji = (emotion: string) => {
    switch (emotion) {
      case 'calm': return '😌'
      case 'excited': return '🤩'
      case 'stressed': return '😰'
      case 'energized': return '⚡'
      case 'tired': return '😴'
      default: return '🧠'
    }
  }

  const getVisualizationDescription = () => {
    if (!mentalState) return 'Initializing mind mirror...'
    
    if (mentalState.flowState > 0.8) {
      return 'Deep Flow State: Particles move in perfect harmony, creating beautiful flowing patterns. Your mind is in optimal creative-analytical balance.'
    } else if (mentalState.focusLevel > 0.8) {
      return 'High Focus: Particles form structured, organized patterns. Your attention is laser-focused and stable.'
    } else if (mentalState.creativityLevel > 0.8) {
      return 'Creative Flow: Particles dance with vibrant, dynamic movement. Your imaginative processes are highly active.'
    } else if (mentalState.distractionLevel > 0.6) {
      return 'Distracted Mind: Particles scatter chaotically, reflecting mental fragmentation. Time to regain focus.'
    } else if (mentalState.fatigueLevel > 0.6) {
      return 'Mental Fatigue: Particles move slowly with muted colors. Your cognitive resources need restoration.'
    } else {
      return 'Balanced State: Particles show moderate harmony and energy. A good baseline mental state.'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Circle className="w-6 h-6 text-primary-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              The Productivity Mirror™
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVisualization}
              className="button-ghost p-2"
              title={isRunning ? 'Pause' : 'Play'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={resetVisualization}
              className="button-ghost p-2"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Real-time visualization of your mental state through abstract particle systems. 
          Watch as your focus, creativity, and cognitive state manifest as beautiful, living art.
        </p>
      </div>

      {/* Main Visualization */}
      <div className="card p-6">
        <div className="space-y-4">
          {/* Canvas Container */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-slate-900"
              style={{ maxHeight: '400px' }}
            />
            
            {/* Overlay Controls */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {['auto', 'flow', 'focus', 'creative', 'distracted', 'fatigued'].map((demo) => (
                <button
                  key={demo}
                  onClick={() => handleDemoState(demo)}
                  className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
                    selectedDemo === demo
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                >
                  {demo === 'auto' ? '🤖 Auto' : 
                   demo === 'flow' ? '🌊 Flow' :
                   demo === 'focus' ? '🎯 Focus' :
                   demo === 'creative' ? '✨ Creative' :
                   demo === 'distracted' ? '⚡ Chaotic' : '😴 Tired'}
                </button>
              ))}
            </div>
          </div>

          {/* Visualization Description */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary-500 mt-0.5" />
              <div>
                <div className="font-medium text-primary-700 dark:text-primary-300 mb-1">
                  What You're Seeing
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-400">
                  {getVisualizationDescription()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mental State Metrics */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Real-Time Mental State Analysis
        </h4>
        
        {mentalState && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Focus Level */}
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getStateColor(mentalState.focusLevel)}`}>
                {Math.round(mentalState.focusLevel * 100)}%
              </div>
              <div className="text-xs text-gray-500">Focus</div>
            </div>

            {/* Flow State */}
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Waves className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getStateColor(mentalState.flowState)}`}>
                {Math.round(mentalState.flowState * 100)}%
              </div>
              <div className="text-xs text-gray-500">Flow</div>
            </div>

            {/* Creativity */}
            <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getStateColor(mentalState.creativityLevel)}`}>
                {Math.round(mentalState.creativityLevel * 100)}%
              </div>
              <div className="text-xs text-gray-500">Creativity</div>
            </div>

            {/* Distraction */}
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getStateColor(1 - mentalState.distractionLevel)}`}>
                {Math.round(mentalState.distractionLevel * 100)}%
              </div>
              <div className="text-xs text-gray-500">Distraction</div>
            </div>

            {/* Fatigue */}
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getStateColor(1 - mentalState.fatigueLevel)}`}>
                {Math.round(mentalState.fatigueLevel * 100)}%
              </div>
              <div className="text-xs text-gray-500">Fatigue</div>
            </div>

            {/* Emotional State */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl mb-2">
                {getEmotionalStateEmoji(mentalState.emotionalState)}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {mentalState.emotionalState}
              </div>
              <div className="text-xs text-gray-500">Emotional</div>
            </div>
          </div>
        )}
      </div>

      {/* Visualization Technical Metrics */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Particle System Metrics
        </h4>
        
        {visualMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Particles</div>
              <div className="text-xl font-bold text-indigo-600">
                {visualMetrics.particleCount}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Harmony Level</div>
              <div className="text-xl font-bold text-purple-600">
                {Math.round(visualMetrics.harmonyLevel * 100)}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Chaos Level</div>
              <div className="text-xl font-bold text-orange-600">
                {Math.round(visualMetrics.chaosLevel * 100)}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Color Scheme</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {visualMetrics.currentColorScheme}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Avg Harmony</div>
              <div className="text-xl font-bold text-blue-600">
                {Math.round(visualMetrics.averageParticleHarmony * 100)}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Avg Energy</div>
              <div className="text-xl font-bold text-green-600">
                {Math.round(visualMetrics.averageParticleEnergy * 100)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-500" />
          How The Mirror Works
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                🌊 Flow State
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Particles move in perfect harmony with smooth, synchronized patterns. 
                Connections form between nearby particles creating a web of coherence.
              </div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                🎯 High Focus
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Particles follow structured, organized movement patterns with consistent 
                velocities and clear directional flow.
              </div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                ✨ Creative State
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Particles exhibit dynamic, flowing movement with vibrant colors and 
                organic, unpredictable but beautiful patterns.
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                ⚡ Distracted Mind
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Chaotic particle movement with rapid directional changes, no harmony 
                connections, and erratic, jittery motion patterns.
              </div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                😴 Mental Fatigue
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Particles move slowly with reduced opacity and muted colors. 
                Lower energy and minimal interaction between particles.
              </div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                🤖 Real-Time Adaptation
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                The visualization continuously adapts based on your typing patterns, 
                mouse movement, and biological rhythm data.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}