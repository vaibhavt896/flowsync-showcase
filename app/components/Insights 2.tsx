import { motion } from 'framer-motion'
import { Brain, TrendingUp, Calendar, Lightbulb } from 'lucide-react'

export default function Insights() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          AI Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover your productivity DNA and get personalized recommendations
        </p>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-8 text-center"
      >
        <Brain className="w-16 h-16 mx-auto mb-4 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          AI-Powered Insights Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We're training our AI to analyze your productivity patterns and provide 
          personalized insights about your optimal work rhythms, flow triggers, 
          and performance optimization strategies.
        </p>
      </motion.div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: TrendingUp,
            title: 'Productivity DNA',
            description: 'Discover your unique productivity patterns and peak performance times',
            color: 'text-primary-500',
            bgColor: 'bg-primary-50 dark:bg-primary-900/20',
          },
          {
            icon: Calendar,
            title: 'Weekly Insights',
            description: 'Get detailed analysis of your weekly focus patterns and improvement areas',
            color: 'text-success-500',
            bgColor: 'bg-success-50 dark:bg-success-900/20',
          },
          {
            icon: Lightbulb,
            title: 'Smart Recommendations',
            description: 'Receive AI-generated suggestions to optimize your focus sessions',
            color: 'text-focus-500',
            bgColor: 'bg-focus-50 dark:bg-focus-900/20',
          },
        ].map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card p-6"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Development Progress
        </h3>
        
        <div className="space-y-4">
          {[
            { name: 'Flow Detection Algorithm', progress: 100, status: 'Complete' },
            { name: 'Activity Pattern Analysis', progress: 85, status: 'In Progress' },
            { name: 'Productivity DNA Profiling', progress: 60, status: 'In Progress' },
            { name: 'Weekly Insights Generation', progress: 30, status: 'Planning' },
            { name: 'Smart Recommendations Engine', progress: 15, status: 'Research' },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </span>
                <span className="text-xs text-gray-500">
                  {item.status}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-focus-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                />
              </div>
              <div className="text-xs text-gray-500 text-right">
                {item.progress}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}