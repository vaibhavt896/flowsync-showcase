import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Rewind, 
  FastForward, 
  Calendar, 
  TrendingUp, 
  Search, 
  Star,
  Lightbulb,
  Target,
  BarChart3,
  Brain,
  Archive,
  Camera,
  Play,
  Bookmark,
  MapPin,
  Zap,
  Eye,
  ChevronRight,
  Download,
  RotateCcw,
  Sparkles,
  Timer,
  Activity
} from 'lucide-react'
import CognitiveTimeTravelEngine from '@/services/cognitiveTimeTravel'

interface TimeTravelOverview {
  totalSnapshots: number
  oldestSnapshot: string
  newestSnapshot: string
  topPatterns: any[]
  currentTrajectory: any
  recentFindings: any
}

export function CognitiveTimeTravelComponent() {
  const [engine] = useState(() => new CognitiveTimeTravelEngine())
  const [overview, setOverview] = useState<TimeTravelOverview | null>(null)
  const [activeTab, setActiveTab] = useState<'replay' | 'archaeology' | 'trajectory' | 'snapshots'>('replay')
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null)
  const [replayData, setReplayData] = useState<any>(null)
  const [archaeologyData, setArchaeologyData] = useState<any>(null)
  const [trajectoryData, setTrajectoryData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadOverview = () => {
      const data = engine.getTimeTravelOverview()
      setOverview(data)
    }

    loadOverview()
  }, [engine])

  const handleReplayDay = async (snapshotId: string) => {
    setIsLoading(true)
    try {
      const replay = engine.replayProductiveDay(snapshotId)
      setReplayData(replay)
      setSelectedSnapshot(replay.snapshot)
    } catch (error) {
      console.error('Replay failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchaeology = async (timeframe: 'month' | 'quarter' | 'year') => {
    setIsLoading(true)
    try {
      const findings = engine.performProductivityArchaeology(timeframe)
      setArchaeologyData(findings)
    } catch (error) {
      console.error('Archaeology failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectTrajectory = async (timeframe: 'week' | 'month' | 'quarter' | 'year') => {
    setIsLoading(true)
    try {
      const trajectory = engine.projectCognitiveTrajectory(timeframe)
      setTrajectoryData(trajectory)
    } catch (error) {
      console.error('Trajectory projection failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMostProductiveDays = () => {
    return engine.getMostProductiveDays(5)
  }

  const getRecentSnapshots = () => {
    return engine.getRecentSnapshots(10)
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading time travel data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Cognitive Time Travel
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Replay productive days, uncover hidden patterns, and project your cognitive future.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Archive className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600">{overview.totalSnapshots}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Snapshots</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">{overview.topPatterns.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Patterns</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">
              {overview.currentTrajectory ? 'Active' : 'None'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Trajectory</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Search className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-600">
              {overview.recentFindings ? 'Recent' : 'None'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Findings</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'replay', label: 'Productivity Replay', icon: Play },
            { id: 'archaeology', label: 'Pattern Archaeology', icon: Search },
            { id: 'trajectory', label: 'Future Trajectory', icon: FastForward },
            { id: 'snapshots', label: 'Snapshots', icon: Camera }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'replay' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Rewind className="w-5 h-5 text-purple-500" />
                Replay Productive Days
              </h4>
            </div>
            
            {/* Most Productive Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getMostProductiveDays().map((snapshot, index) => (
                <motion.div
                  key={snapshot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleReplayDay(snapshot.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {snapshot.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{snapshot.date}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Flow States:</span>
                      <span className="font-medium">{snapshot.cognitiveMetrics.flowStateAchievements}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                      <span className="font-medium">{Math.round(snapshot.cognitiveMetrics.cognitiveEfficiency * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Energy:</span>
                      <span className="font-medium">{snapshot.cognitiveMetrics.averageEnergyLevel}%</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {snapshot.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Replay Results */}
            {replayData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
              >
                <h5 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  Replay: {replayData.snapshot.name}
                </h5>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Timeline */}
                  <div>
                    <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Timeline</h6>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {replayData.timeline.map((event: any, index: number) => (
                        <div key={index} className="flex gap-3">
                          <div className="text-sm font-mono text-purple-600 min-w-[60px]">
                            {event.time}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {event.event}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {event.significance}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recreation Guide */}
                  <div>
                    <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Recreation Guide</h6>
                    <div className="space-y-2">
                      {replayData.recreationGuide.map((step: any, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs rounded-full flex items-center justify-center font-medium mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Key Insights */}
                <div className="mt-6">
                  <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Key Insights</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {replayData.insights.map((insight: any, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'archaeology' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Productivity Archaeology
              </h4>
              <div className="flex gap-2">
                {['month', 'quarter', 'year'].map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => handleArchaeology(timeframe as any)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50"
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            {archaeologyData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Overview */}
                <div className="card p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                  <h5 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Archaeological Findings ({archaeologyData.period.start} to {archaeologyData.period.end})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{archaeologyData.totalDaysAnalyzed}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Days Analyzed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{archaeologyData.significantPatterns.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Patterns Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{archaeologyData.hiddenCorrelations.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Hidden Correlations</div>
                    </div>
                  </div>
                </div>

                {/* Significant Patterns */}
                <div className="card p-6">
                  <h6 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Significant Patterns</h6>
                  <div className="space-y-4">
                    {archaeologyData.significantPatterns.map((pattern: any, index: number) => (
                      <div key={pattern.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-medium text-gray-800 dark:text-gray-200">{pattern.name}</h6>
                          <span className="text-sm text-gray-500">{Math.round(pattern.confidence)}% confidence</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{pattern.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {pattern.triggers.slice(0, 3).map((trigger: any) => (
                            <span key={trigger} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded">
                              {trigger}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deep Insights */}
                <div className="card p-6">
                  <h6 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Deep Insights</h6>
                  <div className="space-y-3">
                    {archaeologyData.deepInsights.map((insight: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Brain className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                            {insight.insight}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {insight.practicalApplication}
                          </div>
                          <div className="text-xs text-orange-600 mt-1">
                            Evidence: {insight.evidenceStrength}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'trajectory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FastForward className="w-5 h-5 text-blue-500" />
                Future Cognitive Trajectory
              </h4>
              <div className="flex gap-2">
                {['week', 'month', 'quarter', 'year'].map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => handleProjectTrajectory(timeframe as any)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50"
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            {trajectoryData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Current Baseline */}
                <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <h5 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Current Cognitive Baseline
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(trajectoryData.currentBaseline.averageCognitiveCapacity)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Cognitive Capacity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(trajectoryData.currentBaseline.flowStateFrequency * 100)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Flow Frequency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(trajectoryData.currentBaseline.cognitiveEfficiency * 100)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(trajectoryData.currentBaseline.recoverySpeed * 100)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Recovery Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(trajectoryData.currentBaseline.adaptabilityScore * 100)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Adaptability</div>
                    </div>
                  </div>
                </div>

                {/* Projection Scenarios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(trajectoryData.scenarios).map(([scenarioName, scenario]: [string, any]) => (
                    <div key={scenarioName} className="card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                          {scenarioName} Scenario
                        </h6>
                        <span className="text-sm text-gray-500">{scenario.probability}%</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {scenario.description}
                      </p>
                      <div className="space-y-1">
                        {scenario.outcomes.map((outcome: any, index: number) => (
                          <div key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="card p-6">
                  <h6 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Strategic Recommendations</h6>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h6 className="font-medium text-green-600 mb-2">Short-term Actions</h6>
                      <ul className="space-y-1">
                        {trajectoryData.recommendations.shortTerm.map((rec: any, index: number) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <Target className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium text-blue-600 mb-2">Long-term Strategy</h6>
                      <ul className="space-y-1">
                        {trajectoryData.recommendations.longTerm.map((rec: any, index: number) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <TrendingUp className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium text-orange-600 mb-2">Risk Mitigation</h6>
                      <ul className="space-y-1">
                        {trajectoryData.recommendations.riskMitigation.map((rec: any, index: number) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <Eye className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'snapshots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-500" />
                Productivity Snapshots
              </h4>
              <button
                onClick={() => {
                  const newSnapshot = engine.createProductivitySnapshot(`Snapshot ${Date.now()}`)
                  setOverview(engine.getTimeTravelOverview())
                }}
                className="button-primary px-4 py-2 text-sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture Now
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getRecentSnapshots().map((snapshot, index) => (
                <motion.div
                  key={snapshot.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="font-medium text-gray-800 dark:text-gray-200">
                      {snapshot.name}
                    </h6>
                    <span className="text-xs text-gray-500">{snapshot.date}</span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                      <span className="font-medium">{Math.round(snapshot.cognitiveMetrics.cognitiveEfficiency * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Flow States:</span>
                      <span className="font-medium">{snapshot.cognitiveMetrics.flowStateAchievements}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tasks:</span>
                      <span className="font-medium">{snapshot.outcomes.tasksCompleted}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {snapshot.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReplayDay(snapshot.id)}
                      className="flex-1 px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Play className="w-3 h-3 mr-1 inline" />
                      Replay
                    </button>
                    <button
                      onClick={() => {
                        const returned = engine.returnToSnapshot(snapshot.id)
                        console.log('Returned to snapshot:', returned)
                      }}
                      className="flex-1 px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <RotateCcw className="w-3 h-3 mr-1 inline" />
                      Return
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Processing time travel request...</span>
          </div>
        </div>
      )}
    </div>
  )
}