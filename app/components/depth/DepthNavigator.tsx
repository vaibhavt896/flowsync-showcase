import { useDepthNavigation, DepthLayer as DepthLayerType } from '../../contexts/DepthNavigationContext'
import { motion } from 'framer-motion'
import { 
  Layers, 
  Database, 
  History, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const layerInfo = {
  0: { name: 'Ambient Data', icon: Database, description: 'Productivity visualizations' },
  1: { name: 'Historical Context', icon: History, description: 'Ghosted session echoes' },
  2: { name: 'Current Session', icon: Target, description: 'Primary focus plane' },
  3: { name: 'Predictions', icon: TrendingUp, description: 'Future possibilities' },
  4: { name: 'Interventions', icon: AlertTriangle, description: 'Urgent actions only' }
}

export function DepthNavigator() {
  const { 
    depthState, 
    navigateToLayer, 
    isLayerActive,
    getLayerOpacity 
  } = useDepthNavigation()

  const currentLayer = Math.round(depthState.currentDepth) as DepthLayerType

  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50">
      {/* Main Navigation Panel */}
      <motion.div
        className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/10"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-xs font-medium">Depth Navigation</span>
          </div>
          <div className="text-white text-sm font-mono">
            Layer {currentLayer}
          </div>
        </div>

        {/* Layer Navigation */}
        <div className="space-y-2 mb-4">
          {([0, 1, 2, 3, 4] as DepthLayerType[]).map((layerNum) => {
            const info = layerInfo[layerNum]
            const Icon = info.icon
            const active = isLayerActive(layerNum)
            const opacity = getLayerOpacity(layerNum)
            
            return (
              <motion.button
                key={layerNum}
                onClick={() => navigateToLayer(layerNum)}
                className={`w-full p-3 rounded-xl border transition-all relative overflow-hidden ${
                  active 
                    ? 'bg-white/20 border-white/40 text-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ opacity: Math.max(0.3, opacity) }}
              >
                {/* Layer Content */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    active ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{info.name}</div>
                    <div className="text-xs opacity-70">{info.description}</div>
                  </div>
                  <div className="text-xs font-mono">
                    {layerNum}
                  </div>
                </div>

                {/* Active Indicator */}
                {active && (
                  <motion.div
                    className="absolute inset-0 border-2 border-white/30 rounded-xl"
                    animate={{
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                )}

                {/* Depth Indicator */}
                <div 
                  className="absolute right-2 top-2 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: `rgba(255,255,255,${opacity})`,
                    transform: `scale(${0.5 + opacity * 0.5})`
                  }}
                />
              </motion.button>
            )
          })}
        </div>

        {/* Quick Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => navigateToLayer(Math.max(0, currentLayer - 1) as DepthLayerType)}
            disabled={currentLayer === 0}
            className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
            whileHover={currentLayer > 0 ? { scale: 1.1 } : {}}
            whileTap={currentLayer > 0 ? { scale: 0.9 } : {}}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </motion.button>

          <div className="text-white/70 text-xs font-mono">
            {depthState.currentDepth.toFixed(1)}
          </div>

          <motion.button
            onClick={() => navigateToLayer(Math.min(4, currentLayer + 1) as DepthLayerType)}
            disabled={currentLayer === 4}
            className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
            whileHover={currentLayer < 4 ? { scale: 1.1 } : {}}
            whileTap={currentLayer < 4 ? { scale: 0.9 } : {}}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        {/* Depth Status */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-xs text-white/50 text-center space-y-1">
            <div>Focus: {Math.round(depthState.focusIntensity * 100)}%</div>
            <div className={`${depthState.isTransitioning ? 'text-yellow-300' : 'text-green-300'}`}>
              {depthState.isTransitioning ? 'Transitioning' : 'Stable'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Depth Indicator */}
      <motion.div
        className="absolute -left-16 top-1/2 transform -translate-y-1/2"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Eye className="w-6 h-6 text-white/70" />
        </div>
      </motion.div>

      {/* Help Text */}
      <motion.div
        className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-center">
          <div className="text-white/60 text-xs">
            <div className="mb-1">⌘+0-4: Quick layer access</div>
            <div className="mb-1">⌘+←/→: Navigate layers</div>
            <div>Shift+Wheel: Depth scroll</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DepthNavigator