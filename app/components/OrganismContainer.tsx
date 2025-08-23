import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useNavigationStore, AppState } from '@/stores/navigationStore'
import { 
  createTimerToAnalyticsTransition,
  createSettingsLiquifyTransition,
  createOrganismicNavigation,
  organicSpring,
  liquidMorph
} from '@/utils/flipAnimations'
import MorphingTimer from './MorphingTimer'
import Dashboard from './Dashboard'
import Insights from './Insights'
import MorphingSettings from './MorphingSettings'
import OrganismNavigation from './OrganismNavigation'
import ProductivityAurora from './ProductivityAurora'
import QuantumSettings from './QuantumSettings'
import FocusVortex from './FocusVortex'

export default function OrganismContainer() {
  const { 
    currentState, 
    previousState, 
    isTransitioning, 
    transitionProgress 
  } = useNavigationStore()
  
  const containerRef = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(transitionProgress)

  // Create transforms at component level
  const defaultScale = useTransform(progress, [0, 0.5, 1], [1, 0.95, 1])
  const defaultOpacity = useTransform(progress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 1])

  // Update motion value when store changes
  useEffect(() => {
    progress.set(transitionProgress)
  }, [transitionProgress, progress])

  // Get transform configurations based on transition type
  const getTransitionConfig = () => {
    const transitionKey = `${previousState}-${currentState}`
    
    switch (transitionKey) {
      case 'timer-analytics':
        return createTimerToAnalyticsTransition(progress)
      case 'settings-timer':
        return createSettingsLiquifyTransition(progress)
      default:
        return {
          scale: defaultScale,
          opacity: defaultOpacity
        }
    }
  }

  const transitionConfig = getTransitionConfig()

  // Render the current component with morphing capabilities
  const renderCurrentComponent = () => {
    switch (currentState) {
      case 'timer':
        // Always use MorphingTimer for consistency
        return <MorphingTimer />
      case 'analytics':
        return <Dashboard />
      case 'insights':
        return <Insights />
      case 'settings':
        return <MorphingSettings />
      default:
        return <MorphingTimer />
    }
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-gray-50 dark:bg-gray-900"
    >
      {/* Productivity Aurora - Top layer */}
      <ProductivityAurora />
      
      {/* Focus Vortex - Dimensional transitions */}
      <FocusVortex />
      
      {/* Organism Navigation */}
      <OrganismNavigation />
      
      {/* Quantum Settings - Global overlay */}
      <QuantumSettings />
      
      {/* Main Content Area */}
      <motion.div 
        className="relative w-full h-full"
        style={transitionConfig}
        transition={isTransitioning ? liquidMorph : organicSpring}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentState}
            className="absolute inset-0"
            initial={{ 
              opacity: 0,
              scale: 0.9,
              filter: "blur(8px)"
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              filter: "blur(0px)"
            }}
            exit={{ 
              opacity: 0,
              scale: 1.1,
              filter: "blur(8px)"
            }}
            transition={liquidMorph}
          >
            {renderCurrentComponent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Transition Overlay Effects */}
      {isTransitioning && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Organic particle effects during transition */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-focus-500/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Morphing ripples */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-4 h-4 border border-primary-400/30 rounded-full"
              style={{
                transform: "translate(-50%, -50%)"
              }}
              animate={{
                scale: [0, 3, 0],
                opacity: [0.8, 0.2, 0]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono">
          <div>State: {currentState}</div>
          <div>Previous: {previousState || 'none'}</div>
          <div>Transitioning: {isTransitioning ? 'yes' : 'no'}</div>
          <div>Progress: {Math.round(transitionProgress * 100)}%</div>
        </div>
      )}
    </div>
  )
}