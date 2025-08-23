'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  Brain,
  Timer,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

// Import all our premium components
import { AuroraBackground, AuroraOrb } from '@/components/ui/AuroraBackground'
import { MagneticButton, MagneticElement } from '@/components/ui/MagneticCursor'
import { Spatial3DContainer, Spatial3DCard, Spatial3DIcon } from '@/components/ui/Spatial3D'
import { AnalyticsDashboard } from '@/components/ui/PremiumCharts'
import { triggerCompletionEffect } from '@/components/ui/ParticleSystem'
import { useSoundDesign } from '@/services/soundDesign'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'
import { useLivingInterface } from '@/systems/LivingInterface'
import { AdaptiveContainer, BiometricCard } from '@/components/ui/AdaptiveContainer'

export default function ShowcasePage() {
  const [demoState, setDemoState] = useState({
    timerRunning: false,
    soundEnabled: true,
    currentFocus: 85,
    productivity: 92
  })

  const soundSystem = useSoundDesign()
  const performanceMonitor = usePerformanceMonitor()
  const livingInterface = useLivingInterface()

  const handleStartTimer = () => {
    setDemoState(prev => ({ ...prev, timerRunning: !prev.timerRunning }))
    
    if (!demoState.timerRunning) {
      soundSystem?.playEffect('focus-start')
      livingInterface?.recordInteraction('click', 3, 'timer-start')
    } else {
      soundSystem?.playEffect('click')
    }
    
    // Trigger particle effect
    triggerCompletionEffect()
  }

  const handleCompleteTask = () => {
    soundSystem?.playEffect('success', 2)
    livingInterface?.markTaskCompletion(5)
    triggerCompletionEffect(window.innerWidth / 2, window.innerHeight / 2)
    
    // Update demo stats
    setDemoState(prev => ({
      ...prev,
      productivity: Math.min(100, prev.productivity + 3),
      currentFocus: Math.min(100, prev.currentFocus + 2)
    }))
  }

  const toggleSound = () => {
    const newState = !demoState.soundEnabled
    setDemoState(prev => ({ ...prev, soundEnabled: newState }))
    soundSystem?.setEnabled(newState)
    
    if (newState) {
      soundSystem?.playEffect('click')
    }
  }

  const performanceScore = performanceMonitor ? Math.min(100, Math.round(performanceMonitor.fps * 1.67)) : 95

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Background Orbs */}
      <AuroraOrb size={600} className="absolute top-10 -right-20" />
      <AuroraOrb size={400} className="absolute bottom-20 -left-10" color="#10b981" />
      <AuroraOrb size={300} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" color="#8b5cf6" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-center mb-16"
      >
        <motion.h1 
          className="text-6xl md:text-7xl font-black mb-6"
          style={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 8s ease infinite'
          }}
        >
          Premium FlowSync
        </motion.h1>
        
        <motion.p 
          className="text-xl text-white/80 max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Experience the future of productivity with aurora backgrounds, living interfaces, 
          magnetic interactions, spatial 3D elements, and premium sound design.
        </motion.p>

        {/* Interactive Demo Controls */}
        <div className="flex flex-wrap justify-center gap-6">
          <MagneticButton
            onClick={handleStartTimer}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl"
          >
            {demoState.timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {demoState.timerRunning ? 'Pause Focus' : 'Start Focus Session'}
          </MagneticButton>

          <MagneticButton
            onClick={handleCompleteTask}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-2xl"
          >
            <Target className="w-5 h-5" />
            Complete Task
          </MagneticButton>

          <MagneticButton
            onClick={toggleSound}
            className="flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl shadow-2xl"
          >
            {demoState.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </MagneticButton>
        </div>
      </motion.div>

      {/* Performance Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <Spatial3DCard depth={10} className="p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Real-time Stats */}
            <MagneticElement magneticStrength={0.2} className="text-center">
              <div className="flex flex-col items-center">
                <Spatial3DIcon icon={Brain} color="#3b82f6" size={32} className="mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{demoState.currentFocus}%</div>
                <div className="text-white/60 text-sm">Current Focus</div>
              </div>
            </MagneticElement>

            <MagneticElement magneticStrength={0.2} className="text-center">
              <div className="flex flex-col items-center">
                <Spatial3DIcon icon={TrendingUp} color="#10b981" size={32} className="mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{demoState.productivity}%</div>
                <div className="text-white/60 text-sm">Productivity</div>
              </div>
            </MagneticElement>

            <MagneticElement magneticStrength={0.2} className="text-center">
              <div className="flex flex-col items-center">
                <Spatial3DIcon icon={Zap} color="#f59e0b" size={32} className="mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{performanceScore}</div>
                <div className="text-white/60 text-sm">Performance Score</div>
              </div>
            </MagneticElement>

            <MagneticElement magneticStrength={0.2} className="text-center">
              <div className="flex flex-col items-center">
                <Spatial3DIcon icon={Timer} color="#8b5cf6" size={32} className="mb-3" />
                <div className="text-3xl font-bold text-white mb-1">25:00</div>
                <div className="text-white/60 text-sm">Focus Time</div>
              </div>
            </MagneticElement>
          </div>
        </Spatial3DCard>
      </motion.div>

      {/* 3D Visualization Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Spatial3DCard depth={8}>
            <Spatial3DContainer
              height="400px"
              productivity={demoState.productivity}
              focus={demoState.currentFocus}
              data={[65, 78, 92, 85, 76, 88, 94, 82]}
              enableControls={true}
              className="rounded-2xl overflow-hidden"
            />
          </Spatial3DCard>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Spatial3DCard depth={6} className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Premium Features
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">Aurora Gradients</div>
                    <div className="text-white/60 text-sm">Living background that adapts to your workflow</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">Magnetic Interactions</div>
                    <div className="text-white/60 text-sm">Elements that respond to cursor proximity</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">3D Spatial Elements</div>
                    <div className="text-white/60 text-sm">WebGL-powered visualizations and depth effects</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">Living Interface</div>
                    <div className="text-white/60 text-sm">AI-powered interface that learns and adapts</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">Premium Sound Design</div>
                    <div className="text-white/60 text-sm">Spatial audio feedback for enhanced focus</div>
                  </div>
                </div>
              </div>
            </Spatial3DCard>

            <Spatial3DCard depth={6} className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Performance Metrics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Frame Rate</span>
                  <span className="text-green-400 font-semibold">60 FPS</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Memory Usage</span>
                  <span className="text-blue-400 font-semibold">42 MB</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Load Time</span>
                  <span className="text-purple-400 font-semibold">1.2s</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Bundle Size</span>
                  <span className="text-yellow-400 font-semibold">180 KB</span>
                </div>
              </div>
            </Spatial3DCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Analytics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Premium Analytics Dashboard
        </h2>
        <AnalyticsDashboard />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="text-center py-16"
      >
        <div className="text-white/60 text-lg">
          Powered by cutting-edge web technologies
        </div>
        <div className="flex justify-center gap-8 mt-6 flex-wrap">
          {['Next.js 14', 'React 18', 'Framer Motion', 'Three.js', 'GSAP', 'WebGL'].map((tech, index) => (
            <MagneticElement key={tech} magneticStrength={0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white/80 text-sm font-medium"
              >
                {tech}
              </motion.div>
            </MagneticElement>
          ))}
        </div>
      </motion.div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}