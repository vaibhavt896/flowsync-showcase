import { useEffect } from 'react'
import { useTimerBreathingSync } from '../../hooks/useTimerBreathingSync'
import { DepthNavigationProvider } from '../../contexts/DepthNavigationContext'
import DepthLayer from '../depth/DepthLayer'
import DepthNavigator from '../depth/DepthNavigator'
import AmbientDataLayer from '../depth/layers/AmbientDataLayer'
import HistoricalContextLayer from '../depth/layers/HistoricalContextLayer'
import CurrentSessionLayer from '../depth/layers/CurrentSessionLayer'
import PredictiveSuggestionsLayer from '../depth/layers/PredictiveSuggestionsLayer'
import UrgentInterventionsLayer from '../depth/layers/UrgentInterventionsLayer'

export default function DepthTimer() {
  // Sync timer with breathing system
  useTimerBreathingSync()

  // Set up 3D perspective for depth layers
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .depth-container {
        perspective: 1000px;
        perspective-origin: center center;
        transform-style: preserve-3d;
      }
      
      .depth-layer {
        transform-style: preserve-3d;
        backface-visibility: hidden;
        will-change: transform, opacity;
      }
      
      /* Smooth depth transitions */
      .depth-layer-0 { filter: blur(0px) brightness(0.7) saturate(0.8); }
      .depth-layer-1 { filter: blur(0px) brightness(0.8) saturate(0.9); }
      .depth-layer-2 { filter: blur(0px) brightness(1.0) saturate(1.0); }
      .depth-layer-3 { filter: blur(0px) brightness(0.9) saturate(1.1); }
      .depth-layer-4 { filter: blur(0px) brightness(1.1) saturate(1.2); }
      
      /* Disable default scroll behavior for depth navigation */
      .depth-container * {
        scroll-behavior: auto;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <DepthNavigationProvider>
      <div className="min-h-screen relative depth-container overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Layer 0: Ambient Data Visualizations */}
        <DepthLayer layer={0}>
          <AmbientDataLayer />
        </DepthLayer>

        {/* Layer 1: Historical Context */}
        <DepthLayer layer={1}>
          <HistoricalContextLayer />
        </DepthLayer>

        {/* Layer 2: Current Session (Primary Focus) */}
        <DepthLayer layer={2}>
          <CurrentSessionLayer />
        </DepthLayer>

        {/* Layer 3: Predictive Suggestions */}
        <DepthLayer layer={3}>
          <PredictiveSuggestionsLayer />
        </DepthLayer>

        {/* Layer 4: Urgent Interventions */}
        <DepthLayer layer={4}>
          <UrgentInterventionsLayer />
        </DepthLayer>

        {/* Depth Navigation Interface */}
        <DepthNavigator />

        {/* Background gradient that responds to depth */}
        <div 
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background: `
              radial-gradient(ellipse at center, 
                rgba(16, 185, 129, 0.1) 0%, 
                rgba(59, 130, 246, 0.05) 30%, 
                rgba(0, 0, 0, 0.8) 70%,
                rgba(0, 0, 0, 1) 100%
              )
            `
          }}
        />

        {/* Depth Help Overlay */}
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white/60 text-xs max-w-xs">
            <div className="font-medium mb-2">Z-Axis Navigation</div>
            <div className="space-y-1">
              <div>• <span className="text-white/80">Shift + Scroll:</span> Navigate depth</div>
              <div>• <span className="text-white/80">⌘ + 0-4:</span> Jump to layer</div>
              <div>• <span className="text-white/80">Click layers:</span> Auto-navigate</div>
            </div>
          </div>
        </div>

        {/* Performance Monitor */}
        <div className="fixed top-4 left-4 z-40">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 text-white/50 text-xs font-mono">
            <div>Depth Navigation Active</div>
            <div>5 Functional Layers</div>
            <div>3D Perspective Enabled</div>
          </div>
        </div>
      </div>
    </DepthNavigationProvider>
  )
}