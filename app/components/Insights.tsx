import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { FlowForecast } from './insights/FlowForecast'
import { BiologicalRhythms } from './insights/BiologicalRhythms'
import { ProductivityMirrorComponent } from './insights/ProductivityMirror'
import { AnalyticsDashboard } from '@/components/ui/PremiumCharts'

export default function Insights() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          AI Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Discover your productivity DNA and get personalized recommendations
        </p>
      </motion.div>

      {/* Neurological State Prediction Engine */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <FlowForecast />
      </motion.div>

      {/* Biological Rhythm Synchronization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <BiologicalRhythms />
      </motion.div>

      {/* The Productivity Mirror™ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ProductivityMirrorComponent />
      </motion.div>

      {/* Productivity Analytics Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="min-h-[400px]"
      >
        <AnalyticsDashboard className="h-full" showStats={true} />
      </motion.div>

    </div>
  )
}