import { motion } from 'framer-motion'
import { BarChart, TrendingUp, Clock, Target } from 'lucide-react'
import { useTimerStore } from '@/stores/timerStore'
import { useFlowStore } from '@/stores/flowStore'
import { formatDuration, calculateProductivityScore } from '@/utils/helpers'

export default function Dashboard() {
  const { getTodaySessions, sessionHistory } = useTimerStore()
  const { getFlowHistory } = useFlowStore()
  
  const todaySessions = getTodaySessions()
  const recentFlowSessions = getFlowHistory(24)
  
  // Calculate stats
  const totalFocusTime = todaySessions
    .filter(s => s.type === 'focus' && s.isCompleted)
    .reduce((sum, s) => sum + s.duration, 0)
  
  const completionRate = todaySessions.length > 0 
    ? (todaySessions.filter(s => s.isCompleted).length / todaySessions.length) * 100
    : 0
  
  const averageFlowScore = recentFlowSessions.length > 0
    ? recentFlowSessions.reduce((sum, s) => sum + (s.flowScore || 0), 0) / recentFlowSessions.length
    : 0
  
  const productivityScore = calculateProductivityScore(
    todaySessions.filter(s => s.isCompleted).length,
    totalFocusTime,
    averageFlowScore
  )

  const stats = [
    {
      name: 'Productivity Score',
      value: Math.round(productivityScore),
      unit: '%',
      icon: Target,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      name: 'Focus Time Today',
      value: Math.round(totalFocusTime / 60),
      unit: 'min',
      icon: Clock,
      color: 'text-focus-600 dark:text-focus-400',
      bgColor: 'bg-focus-50 dark:bg-focus-900/20',
    },
    {
      name: 'Completion Rate',
      value: Math.round(completionRate),
      unit: '%',
      icon: TrendingUp,
      color: 'text-success-600 dark:text-success-400',
      bgColor: 'bg-success-50 dark:bg-success-900/20',
    },
    {
      name: 'Flow Score',
      value: Math.round(averageFlowScore * 100),
      unit: '%',
      icon: BarChart,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your productivity patterns and flow state analytics
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                    <p className="ml-1 text-sm text-gray-500">
                      {stat.unit}
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Activity
        </h2>
        
        <div className="space-y-4">
          {todaySessions.slice(0, 5).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  session.isCompleted ? 'bg-success-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {session.type.replace('-', ' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(session.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDuration((session.actualDuration || session.duration) * 1000)}
                </p>
                <p className="text-xs text-gray-500">
                  {session.isCompleted ? 'Completed' : 'Interrupted'}
                </p>
              </div>
            </motion.div>
          ))}
          
          {todaySessions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No sessions yet today</p>
              <p className="text-sm">Start a focus session to see your activity here</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Productivity Insights
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Peak productivity time</span>
            <span className="font-medium">10:00 AM - 12:00 PM</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Average session length</span>
            <span className="font-medium">
              {todaySessions.length > 0 
                ? formatDuration((todaySessions.reduce((sum, s) => sum + s.duration, 0) / todaySessions.length) * 1000)
                : '25m'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Best flow streak</span>
            <span className="font-medium">{formatDuration(Math.max(...recentFlowSessions.map(s => s.duration || 0), 0))}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}