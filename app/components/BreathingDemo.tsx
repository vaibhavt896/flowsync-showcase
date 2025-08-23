import { useState } from 'react'
import { useBreathing } from '../contexts/BreathingContext'
import BreathingCard from './ui/BreathingCard'
import BreathingText from './ui/BreathingText'
import { Play, Pause, Coffee, RotateCcw } from 'lucide-react'

export function BreathingDemo() {
  const { 
    breathingState, 
    breathingRate, 
    isSessionActive,
    setBreathingState,
    setSessionActive,
    setSessionTimeRemaining 
  } = useBreathing()
  
  const [demoTimer, setDemoTimer] = useState(25 * 60) // 25 minutes

  const startFocusSession = () => {
    setSessionActive(true)
    setSessionTimeRemaining(demoTimer)
    setBreathingState('focus')
    
    // Simulate countdown
    const interval = setInterval(() => {
      setDemoTimer(prev => {
        const newTime = prev - 1
        setSessionTimeRemaining(newTime)
        
        if (newTime <= 0) {
          clearInterval(interval)
          setBreathingState('break')
          return 0
        }
        return newTime
      })
    }, 1000)
    
    // Store interval for cleanup
    ;(window as any).demoInterval = interval
  }

  const stopSession = () => {
    setSessionActive(false)
    setBreathingState('idle')
    if ((window as any).demoInterval) {
      clearInterval((window as any).demoInterval)
    }
    setDemoTimer(25 * 60)
  }

  const startBreak = () => {
    setBreathingState('break')
    setSessionActive(true)
  }

  const getStateDescription = () => {
    switch (breathingState) {
      case 'focus':
        return `Focus mode - Breathing at ${(breathingRate * 60).toFixed(1)} breaths/minute`
      case 'transition':
        return `Transition mode - Preparing for break at ${(breathingRate * 60).toFixed(1)} breaths/minute`
      case 'break':
        return `Break mode - Organic breathing at ${(breathingRate * 60).toFixed(1)} breaths/minute`
      case 'idle':
      default:
        return `Idle mode - Neutral breathing at ${(breathingRate * 60).toFixed(1)} breaths/minute`
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <BreathingText 
          as="h1" 
          className="text-4xl font-bold text-center mb-2"
          intensity={1}
        >
          Breathing UI Demo
        </BreathingText>
        
        <BreathingText 
          as="p" 
          className="text-center text-gray-600 dark:text-gray-400 mb-8"
          intensity={0.5}
        >
          Experience how the interface breathes with your productivity rhythm
        </BreathingText>

        {/* Status Display */}
        <BreathingCard className="p-6 mb-8" intensity={0.8}>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2 capitalize">
              {breathingState} State
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              {getStateDescription()}
            </div>
            {isSessionActive && (
              <div className="text-3xl font-mono">
                {formatTime(demoTimer)}
              </div>
            )}
          </div>
        </BreathingCard>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={startFocusSession}
            disabled={isSessionActive}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Start Focus Session
          </button>
          
          <button
            onClick={startBreak}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Coffee className="w-4 h-4" />
            Break Mode
          </button>
          
          <button
            onClick={stopSession}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Breathing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BreathingCard className="p-6" intensity={1.5}>
            <BreathingText className="text-xl font-bold mb-3" intensity={0.7}>
              High Intensity
            </BreathingText>
            <p className="text-gray-600 dark:text-gray-400">
              This card breathes with high intensity, perfect for central focus elements.
            </p>
          </BreathingCard>

          <BreathingCard className="p-6" intensity={1.0}>
            <BreathingText className="text-xl font-bold mb-3" intensity={0.5}>
              Medium Intensity
            </BreathingText>
            <p className="text-gray-600 dark:text-gray-400">
              Balanced breathing for main interface elements and content areas.
            </p>
          </BreathingCard>

          <BreathingCard className="p-6" intensity={0.5}>
            <BreathingText className="text-xl font-bold mb-3" intensity={0.3}>
              Low Intensity
            </BreathingText>
            <p className="text-gray-600 dark:text-gray-400">
              Subtle breathing for secondary elements and background components.
            </p>
          </BreathingCard>

          <BreathingCard className="p-6" intensity={0.8}>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Focus Efficiency</div>
            </div>
          </BreathingCard>

          <BreathingCard className="p-6" intensity={0.6}>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Flow States Today</div>
            </div>
          </BreathingCard>

          <BreathingCard className="p-6" intensity={0.4}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.5h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Deep Work Time</div>
            </div>
          </BreathingCard>
        </div>

        {/* Breathing Instructions */}
        <BreathingCard className="p-6 mt-8" intensity={0.6}>
          <BreathingText as="h3" className="text-xl font-bold mb-4" intensity={0.5}>
            How It Works
          </BreathingText>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p><strong>Focus State:</strong> Elements pulse at 0.1Hz (6 breaths/minute) to induce calm and maintain focus.</p>
            <p><strong>Transition State:</strong> Breathing gradually increases to 0.15Hz as break time approaches, subconsciously preparing you.</p>
            <p><strong>Break State:</strong> Free-flowing organic animations mirror rest states and encourage relaxation.</p>
            <p><strong>Physics-based Movement:</strong> All elements have subtle micro-movements - nothing is ever completely still.</p>
          </div>
        </BreathingCard>
      </div>
    </div>
  )
}

export default BreathingDemo