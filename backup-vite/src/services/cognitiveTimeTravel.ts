// Cognitive Time Travel - Revolutionary Feature #10
// "Replay" productive days, analyze patterns, and project future cognitive trajectories

interface ProductivitySnapshot {
  id: string
  date: string
  timestamp: number
  name: string
  cognitiveMetrics: {
    totalCognitiveCalories: number
    peakFlowDuration: number
    averageEnergyLevel: number
    cognitiveEfficiency: number // calories per unit of output
    flowStateAchievements: number
    interruptionFrequency: number
    stressLevel: number
    recoveryQuality: number
  }
  contextualFactors: {
    sleepQuality: number
    weatherCondition: string
    dayOfWeek: string
    biologicalRhythm: string
    workEnvironment: string
    socialInteractions: number
    physicalActivity: number
    nutrition: string[]
  }
  productivityEvents: {
    timestamp: number
    eventType: 'session_start' | 'flow_entered' | 'flow_exited' | 'break_taken' | 'interruption' | 'energy_peak' | 'energy_dip'
    description: string
    impact: number // -100 to 100
    duration: number
  }[]
  outcomes: {
    tasksCompleted: number
    qualityRating: number
    satisfactionLevel: number
    energyAtEndOfDay: number
    nextDayPreparation: number
  }
  tags: string[]
  replay: {
    keyMoments: { time: string; description: string; lesson: string }[]
    successFactors: string[]
    warningSignsIgnored: string[]
    alternativeChoices: string[]
  }
}

interface ProductivityPattern {
  id: string
  name: string
  frequency: number // how often this pattern occurs
  confidence: number // 0-100, how reliable the pattern is
  category: 'biological' | 'environmental' | 'behavioral' | 'cognitive' | 'emotional'
  description: string
  triggers: string[]
  outcomes: {
    positive: string[]
    negative: string[]
  }
  timeSignature: {
    preferredHours: number[]
    optimalDuration: number
    recoveryNeeded: number
  }
  contextualFactors: string[]
  evolution: {
    trend: 'improving' | 'stable' | 'declining'
    changeRate: number
    projectedFuture: string
  }
}

interface CognitiveTrajectory {
  id: string
  projectionDate: string
  timeframe: 'week' | 'month' | 'quarter' | 'year'
  currentBaseline: {
    averageCognitiveCapacity: number
    flowStateFrequency: number
    cognitiveEfficiency: number
    recoverySpeed: number
    adaptabilityScore: number
  }
  projectedMetrics: {
    date: string
    cognitiveCapacity: number
    flowStateProbability: number
    efficiency: number
    confidenceInterval: number
  }[]
  assumptions: string[]
  influencingFactors: {
    biological: { factor: string; impact: number }[]
    behavioral: { factor: string; impact: number }[]
    environmental: { factor: string; impact: number }[]
  }
  scenarios: {
    optimistic: { description: string; probability: number; outcomes: string[] }
    realistic: { description: string; probability: number; outcomes: string[] }
    pessimistic: { description: string; probability: number; outcomes: string[] }
  }
  recommendations: {
    shortTerm: string[]
    longTerm: string[]
    riskMitigation: string[]
  }
}

interface ArchaeologyFindings {
  period: { start: string; end: string }
  totalDaysAnalyzed: number
  significantPatterns: ProductivityPattern[]
  hiddenCorrelations: {
    factor1: string
    factor2: string
    correlationStrength: number
    description: string
    actionableInsight: string
  }[]
  productivityEvolution: {
    phase: string
    duration: number
    characteristics: string[]
    keyEvents: string[]
    lessonsLearned: string[]
  }[]
  deepInsights: {
    category: string
    insight: string
    evidenceStrength: number
    practicalApplication: string
  }[]
  forgottenWisdom: {
    insight: string
    lastObserved: string
    whyForgotten: string
    howToRestore: string
  }[]
}

export class CognitiveTimeTravelEngine {
  private snapshots: ProductivitySnapshot[] = []
  private patterns: ProductivityPattern[] = []
  private trajectories: CognitiveTrajectory[] = []
  private archaeologyCache: ArchaeologyFindings[] = []
  
  constructor() {
    this.initializeWithHistoricalData()
    console.log('⏰ Cognitive Time Travel Engine: Initializing temporal analysis')
  }

  // === PRODUCTIVITY REPLAY SYSTEM ===

  captureProductivitySnapshot(date?: string): ProductivitySnapshot {
    const targetDate = date || new Date().toISOString().split('T')[0]
    const timestamp = new Date(targetDate).getTime()
    
    console.log(`📸 Capturing productivity snapshot for ${targetDate}`)
    
    // Generate realistic snapshot data based on the date
    const snapshot: ProductivitySnapshot = {
      id: `snapshot_${timestamp}`,
      date: targetDate,
      timestamp,
      name: this.generateSnapshotName(targetDate),
      cognitiveMetrics: this.generateCognitiveMetrics(targetDate),
      contextualFactors: this.generateContextualFactors(targetDate),
      productivityEvents: this.generateProductivityEvents(targetDate),
      outcomes: this.generateOutcomes(targetDate),
      tags: this.generateTags(targetDate),
      replay: this.generateReplayData(targetDate)
    }
    
    this.snapshots.push(snapshot)
    this.snapshots.sort((a, b) => b.timestamp - a.timestamp) // Most recent first
    
    // Maintain reasonable size
    if (this.snapshots.length > 365) {
      this.snapshots = this.snapshots.slice(0, 365)
    }
    
    return snapshot
  }

  replayProductiveDay(snapshotId: string): {
    snapshot: ProductivitySnapshot
    timeline: { time: string; event: string; significance: string }[]
    insights: string[]
    recreationGuide: string[]
  } {
    const snapshot = this.snapshots.find(s => s.id === snapshotId)
    if (!snapshot) {
      throw new Error('Snapshot not found')
    }
    
    console.log(`🎬 Replaying productive day: ${snapshot.name}`)
    
    const timeline = this.generateDetailedTimeline(snapshot)
    const insights = this.extractReplayInsights(snapshot)
    const recreationGuide = this.generateRecreationGuide(snapshot)
    
    return {
      snapshot,
      timeline,
      insights,
      recreationGuide
    }
  }

  private generateDetailedTimeline(snapshot: ProductivitySnapshot): { time: string; event: string; significance: string }[] {
    const timeline = []
    const events = snapshot.productivityEvents.sort((a, b) => a.timestamp - b.timestamp)
    
    for (const event of events) {
      const time = new Date(event.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      timeline.push({
        time,
        event: event.description,
        significance: this.interpretEventSignificance(event, snapshot)
      })
    }
    
    return timeline
  }

  private extractReplayInsights(snapshot: ProductivitySnapshot): string[] {
    const insights = []
    
    if (snapshot.cognitiveMetrics.flowStateAchievements > 2) {
      insights.push(`Achieved ${snapshot.cognitiveMetrics.flowStateAchievements} flow states - exceptional focus day`)
    }
    
    if (snapshot.cognitiveMetrics.interruptionFrequency < 0.5) {
      insights.push('Maintained exceptional focus with minimal interruptions')
    }
    
    if (snapshot.contextualFactors.sleepQuality > 8) {
      insights.push('High sleep quality was a key enabler of cognitive performance')
    }
    
    if (snapshot.cognitiveMetrics.cognitiveEfficiency > 0.8) {
      insights.push('Demonstrated high cognitive efficiency - optimal energy utilization')
    }
    
    return insights
  }

  // === PRODUCTIVITY ARCHAEOLOGY ===

  performProductivityArchaeology(timeframe: 'month' | 'quarter' | 'year'): ArchaeologyFindings {
    const months = timeframe === 'month' ? 1 : timeframe === 'quarter' ? 3 : 12
    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - months)
    
    console.log(`🏺 Performing productivity archaeology for ${timeframe}`)
    
    const relevantSnapshots = this.snapshots.filter(s => 
      new Date(s.date) >= cutoffDate
    )
    
    const findings: ArchaeologyFindings = {
      period: {
        start: cutoffDate.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      totalDaysAnalyzed: relevantSnapshots.length,
      significantPatterns: this.excavateSignificantPatterns(relevantSnapshots),
      hiddenCorrelations: this.discoverHiddenCorrelations(relevantSnapshots),
      productivityEvolution: this.traceProductivityEvolution(relevantSnapshots),
      deepInsights: this.generateDeepInsights(relevantSnapshots),
      forgottenWisdom: this.identifyForgottenWisdom(relevantSnapshots)
    }
    
    this.archaeologyCache.push(findings)
    return findings
  }

  private excavateSignificantPatterns(snapshots: ProductivitySnapshot[]): ProductivityPattern[] {
    const patterns: ProductivityPattern[] = []
    
    // Pattern 1: Flow State Triggers
    const flowDays = snapshots.filter(s => s.cognitiveMetrics.flowStateAchievements > 1)
    if (flowDays.length > 3) {
      patterns.push({
        id: 'flow_triggers',
        name: 'Flow State Activation Pattern',
        frequency: flowDays.length / snapshots.length,
        confidence: 85,
        category: 'cognitive',
        description: 'Conditions that consistently trigger flow states',
        triggers: this.identifyCommonFactors(flowDays, 'flow'),
        outcomes: {
          positive: ['Enhanced focus', 'Increased productivity', 'Higher satisfaction'],
          negative: ['Energy depletion if overused']
        },
        timeSignature: {
          preferredHours: this.findOptimalHours(flowDays),
          optimalDuration: 45,
          recoveryNeeded: 15
        },
        contextualFactors: this.extractContextualFactors(flowDays),
        evolution: {
          trend: 'improving',
          changeRate: 0.05,
          projectedFuture: 'Flow states becoming more accessible and sustainable'
        }
      })
    }
    
    // Pattern 2: Energy Crash Predictors
    const crashDays = snapshots.filter(s => s.outcomes.energyAtEndOfDay < 30)
    if (crashDays.length > 2) {
      patterns.push({
        id: 'energy_crash_predictors',
        name: 'Energy Depletion Pattern',
        frequency: crashDays.length / snapshots.length,
        confidence: 78,
        category: 'biological',
        description: 'Warning signs that predict energy crashes',
        triggers: this.identifyCommonFactors(crashDays, 'crash'),
        outcomes: {
          positive: [],
          negative: ['Poor end-of-day energy', 'Reduced next-day performance', 'Stress accumulation']
        },
        timeSignature: {
          preferredHours: [14, 15, 16],
          optimalDuration: 0,
          recoveryNeeded: 60
        },
        contextualFactors: this.extractContextualFactors(crashDays),
        evolution: {
          trend: 'stable',
          changeRate: 0,
          projectedFuture: 'Pattern recognition improving prevention strategies'
        }
      })
    }
    
    return patterns
  }

  private discoverHiddenCorrelations(snapshots: ProductivitySnapshot[]): ArchaeologyFindings['hiddenCorrelations'] {
    const correlations = []
    
    // Sleep Quality vs Cognitive Efficiency
    const sleepCognitiveCorr = this.calculateCorrelation(
      snapshots.map(s => s.contextualFactors.sleepQuality),
      snapshots.map(s => s.cognitiveMetrics.cognitiveEfficiency)
    )
    
    if (Math.abs(sleepCognitiveCorr) > 0.6) {
      correlations.push({
        factor1: 'Sleep Quality',
        factor2: 'Cognitive Efficiency',
        correlationStrength: sleepCognitiveCorr,
        description: `Strong ${sleepCognitiveCorr > 0 ? 'positive' : 'negative'} correlation between sleep quality and cognitive efficiency`,
        actionableInsight: 'Prioritize sleep optimization for consistent cognitive performance'
      })
    }
    
    // Weather vs Flow States
    const sunnyDays = snapshots.filter(s => s.contextualFactors.weatherCondition.includes('sunny'))
    const avgFlowSunny = sunnyDays.reduce((sum, s) => sum + s.cognitiveMetrics.flowStateAchievements, 0) / sunnyDays.length
    const avgFlowOther = snapshots.filter(s => !s.contextualFactors.weatherCondition.includes('sunny'))
      .reduce((sum, s) => sum + s.cognitiveMetrics.flowStateAchievements, 0) / 
      snapshots.filter(s => !s.contextualFactors.weatherCondition.includes('sunny')).length
    
    if (Math.abs(avgFlowSunny - avgFlowOther) > 0.5) {
      correlations.push({
        factor1: 'Weather Condition',
        factor2: 'Flow State Achievement',
        correlationStrength: avgFlowSunny > avgFlowOther ? 0.7 : -0.7,
        description: `${avgFlowSunny > avgFlowOther ? 'Sunny' : 'Cloudy'} weather correlates with better flow state achievement`,
        actionableInsight: 'Consider weather conditions when planning high-focus work'
      })
    }
    
    return correlations
  }

  // === FUTURE COGNITIVE TRAJECTORY ===

  projectCognitiveTrajectory(timeframe: 'week' | 'month' | 'quarter' | 'year'): CognitiveTrajectory {
    console.log(`🔮 Projecting cognitive trajectory for ${timeframe}`)
    
    const baseline = this.calculateCurrentBaseline()
    const historicalTrends = this.analyzeHistoricalTrends()
    
    const trajectory: CognitiveTrajectory = {
      id: `trajectory_${Date.now()}`,
      projectionDate: new Date().toISOString().split('T')[0],
      timeframe,
      currentBaseline: baseline,
      projectedMetrics: this.generateProjectedMetrics(timeframe, baseline, historicalTrends),
      assumptions: this.generateAssumptions(timeframe),
      influencingFactors: this.identifyInfluencingFactors(),
      scenarios: this.generateScenarios(timeframe, baseline),
      recommendations: this.generateTrajectoryRecommendations(timeframe, baseline)
    }
    
    this.trajectories.push(trajectory)
    return trajectory
  }

  private calculateCurrentBaseline(): CognitiveTrajectory['currentBaseline'] {
    const recentSnapshots = this.snapshots.slice(0, 30) // Last 30 days
    
    if (recentSnapshots.length === 0) {
      return {
        averageCognitiveCapacity: 70,
        flowStateFrequency: 0.3,
        cognitiveEfficiency: 0.6,
        recoverySpeed: 0.7,
        adaptabilityScore: 0.65
      }
    }
    
    return {
      averageCognitiveCapacity: recentSnapshots.reduce((sum, s) => 
        sum + s.cognitiveMetrics.averageEnergyLevel, 0) / recentSnapshots.length,
      flowStateFrequency: recentSnapshots.reduce((sum, s) => 
        sum + s.cognitiveMetrics.flowStateAchievements, 0) / recentSnapshots.length / 5, // Normalize to 0-1
      cognitiveEfficiency: recentSnapshots.reduce((sum, s) => 
        sum + s.cognitiveMetrics.cognitiveEfficiency, 0) / recentSnapshots.length,
      recoverySpeed: recentSnapshots.reduce((sum, s) => 
        sum + s.cognitiveMetrics.recoveryQuality, 0) / recentSnapshots.length / 100,
      adaptabilityScore: this.calculateAdaptabilityScore(recentSnapshots)
    }
  }

  private generateProjectedMetrics(
    timeframe: string, 
    baseline: CognitiveTrajectory['currentBaseline'],
    trends: any
  ): CognitiveTrajectory['projectedMetrics'] {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : timeframe === 'quarter' ? 90 : 365
    const projections = []
    
    for (let i = 1; i <= days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      // Apply trend-based projections with realistic constraints
      const capacityTrend = trends.cognitiveCapacity * i / days
      const flowTrend = trends.flowState * i / days
      const efficiencyTrend = trends.efficiency * i / days
      
      projections.push({
        date: date.toISOString().split('T')[0],
        cognitiveCapacity: Math.max(0, Math.min(100, baseline.averageCognitiveCapacity + capacityTrend)),
        flowStateProbability: Math.max(0, Math.min(1, baseline.flowStateFrequency + flowTrend)),
        efficiency: Math.max(0, Math.min(1, baseline.cognitiveEfficiency + efficiencyTrend)),
        confidenceInterval: Math.max(50, 95 - (i / days) * 30) // Confidence decreases over time
      })
    }
    
    return projections
  }

  // === PRODUCTIVITY SNAPSHOTS SYSTEM ===

  createProductivitySnapshot(name: string, tags: string[] = []): ProductivitySnapshot {
    const snapshot = this.captureProductivitySnapshot()
    snapshot.name = name
    snapshot.tags = [...snapshot.tags, ...tags]
    
    console.log(`💾 Created productivity snapshot: ${name}`)
    return snapshot
  }

  returnToSnapshot(snapshotId: string): {
    snapshot: ProductivitySnapshot
    recreationPlan: string[]
    contextualGuidance: string[]
    adaptationSuggestions: string[]
  } {
    const snapshot = this.snapshots.find(s => s.id === snapshotId)
    if (!snapshot) {
      throw new Error('Snapshot not found')
    }
    
    console.log(`🔄 Returning to snapshot: ${snapshot.name}`)
    
    return {
      snapshot,
      recreationPlan: this.generateRecreationPlan(snapshot),
      contextualGuidance: this.generateContextualGuidance(snapshot),
      adaptationSuggestions: this.generateAdaptationSuggestions(snapshot)
    }
  }

  // === UTILITY METHODS ===

  private initializeWithHistoricalData() {
    // Create sample snapshots for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      this.captureProductivitySnapshot(date.toISOString().split('T')[0])
    }
    
    console.log(`📚 Initialized with ${this.snapshots.length} historical snapshots`)
  }

  private generateSnapshotName(date: string): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = dayNames[new Date(date).getDay()]
    const adjectives = ['Productive', 'Focused', 'Creative', 'Analytical', 'Energetic', 'Balanced', 'Intense']
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    
    return `${adjective} ${dayName}`
  }

  private generateCognitiveMetrics(date: string): ProductivitySnapshot['cognitiveMetrics'] {
    const basePerformance = 60 + Math.random() * 30
    const dayOfWeek = new Date(date).getDay()
    const weekendPenalty = (dayOfWeek === 0 || dayOfWeek === 6) ? 10 : 0
    
    return {
      totalCognitiveCalories: Math.round(100 + Math.random() * 150),
      peakFlowDuration: Math.round(15 + Math.random() * 60),
      averageEnergyLevel: Math.round(basePerformance - weekendPenalty),
      cognitiveEfficiency: Math.round((0.5 + Math.random() * 0.4) * 100) / 100,
      flowStateAchievements: Math.floor(Math.random() * 4),
      interruptionFrequency: Math.round((Math.random() * 3) * 10) / 10,
      stressLevel: Math.round((0.2 + Math.random() * 0.6) * 100) / 100,
      recoveryQuality: Math.round(50 + Math.random() * 50)
    }
  }

  private generateContextualFactors(date: string): ProductivitySnapshot['contextualFactors'] {
    const weather = ['sunny', 'cloudy', 'rainy', 'overcast'][Math.floor(Math.random() * 4)]
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    return {
      sleepQuality: Math.round(5 + Math.random() * 5),
      weatherCondition: weather,
      dayOfWeek: dayNames[new Date(date).getDay()],
      biologicalRhythm: ['peak', 'high', 'moderate', 'low'][Math.floor(Math.random() * 4)],
      workEnvironment: ['home', 'office', 'cafe', 'co-working'][Math.floor(Math.random() * 4)],
      socialInteractions: Math.floor(Math.random() * 10),
      physicalActivity: Math.round(Math.random() * 100),
      nutrition: ['balanced', 'high-protein', 'low-carb', 'intermittent-fasting'][Math.floor(Math.random() * 4)].split(',')
    }
  }

  private generateProductivityEvents(date: string): ProductivitySnapshot['productivityEvents'] {
    const events = []
    const baseTime = new Date(date).getTime()
    
    // Generate 8-12 events throughout the day
    const eventCount = 8 + Math.floor(Math.random() * 5)
    
    for (let i = 0; i < eventCount; i++) {
      const hour = 8 + Math.floor(Math.random() * 10) // 8 AM to 6 PM
      const minute = Math.floor(Math.random() * 60)
      const timestamp = baseTime + (hour * 60 + minute) * 60 * 1000
      
      const eventTypes = ['session_start', 'flow_entered', 'break_taken', 'interruption', 'energy_peak']
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as any
      
      events.push({
        timestamp,
        eventType,
        description: this.generateEventDescription(eventType),
        impact: Math.round((Math.random() - 0.5) * 200), // -100 to 100
        duration: Math.floor(Math.random() * 60) + 5 // 5-65 minutes
      })
    }
    
    return events.sort((a, b) => a.timestamp - b.timestamp)
  }

  private generateEventDescription(eventType: string): string {
    const descriptions = {
      session_start: 'Started focused work session',
      flow_entered: 'Entered deep flow state',
      flow_exited: 'Flow state ended naturally',
      break_taken: 'Took strategic recovery break',
      interruption: 'Unexpected interruption occurred',
      energy_peak: 'Peak energy level achieved',
      energy_dip: 'Natural energy decline'
    }
    
    return descriptions[eventType] || 'Productivity event occurred'
  }

  private generateOutcomes(date: string): ProductivitySnapshot['outcomes'] {
    return {
      tasksCompleted: Math.floor(3 + Math.random() * 8),
      qualityRating: Math.round(5 + Math.random() * 5),
      satisfactionLevel: Math.round(5 + Math.random() * 5),
      energyAtEndOfDay: Math.round(20 + Math.random() * 60),
      nextDayPreparation: Math.round(5 + Math.random() * 5)
    }
  }

  private generateTags(date: string): string[] {
    const allTags = ['deep-work', 'creative', 'collaborative', 'learning', 'problem-solving', 'planning', 'review', 'innovation']
    const tagCount = 1 + Math.floor(Math.random() * 3)
    const selectedTags = []
    
    for (let i = 0; i < tagCount; i++) {
      const tag = allTags[Math.floor(Math.random() * allTags.length)]
      if (!selectedTags.includes(tag)) {
        selectedTags.push(tag)
      }
    }
    
    return selectedTags
  }

  private generateReplayData(date: string): ProductivitySnapshot['replay'] {
    return {
      keyMoments: [
        { time: '09:30', description: 'Morning energy peak achieved', lesson: 'Morning hours are optimal for deep work' },
        { time: '11:15', description: 'Entered sustained flow state', lesson: 'Eliminate distractions during peak hours' },
        { time: '14:30', description: 'Strategic break prevented energy crash', lesson: 'Proactive breaks maintain performance' }
      ],
      successFactors: [
        'High sleep quality from previous night',
        'Distraction-free environment setup',
        'Strategic break timing',
        'Optimal task sequencing'
      ],
      warningSignsIgnored: [
        'Early signs of decision fatigue',
        'Gradual increase in stress levels'
      ],
      alternativeChoices: [
        'Could have taken micro-break at 10:45',
        'Different task order might have extended flow state',
        'Earlier lunch could have improved afternoon performance'
      ]
    }
  }

  // Helper methods for complex calculations
  private interpretEventSignificance(event: any, snapshot: ProductivitySnapshot): string {
    if (event.impact > 50) return 'Major positive catalyst for the day'
    if (event.impact > 20) return 'Positive contribution to productivity'
    if (event.impact < -50) return 'Significant disruption to flow'
    if (event.impact < -20) return 'Minor setback'
    return 'Neutral productivity event'
  }

  private generateRecreationGuide(snapshot: ProductivitySnapshot): string[] {
    const guide = []
    
    if (snapshot.contextualFactors.sleepQuality > 8) {
      guide.push('Prioritize high-quality sleep (8+ hours) the night before')
    }
    
    if (snapshot.cognitiveMetrics.flowStateAchievements > 2) {
      guide.push('Create distraction-free environment for extended focus periods')
    }
    
    if (snapshot.cognitiveMetrics.interruptionFrequency < 1) {
      guide.push('Use focus techniques to minimize interruptions')
    }
    
    guide.push('Follow the same daily rhythm and energy management patterns')
    guide.push('Recreate similar environmental conditions when possible')
    
    return guide
  }

  private identifyCommonFactors(snapshots: ProductivitySnapshot[], type: string): string[] {
    const factors = new Map<string, number>()
    
    snapshots.forEach(snapshot => {
      // Environmental factors
      factors.set(`weather-${snapshot.contextualFactors.weatherCondition}`, 
        (factors.get(`weather-${snapshot.contextualFactors.weatherCondition}`) || 0) + 1)
      
      // Sleep quality
      if (snapshot.contextualFactors.sleepQuality > 7) {
        factors.set('high-sleep-quality', (factors.get('high-sleep-quality') || 0) + 1)
      }
      
      // Work environment
      factors.set(`environment-${snapshot.contextualFactors.workEnvironment}`,
        (factors.get(`environment-${snapshot.contextualFactors.workEnvironment}`) || 0) + 1)
    })
    
    return Array.from(factors.entries())
      .filter(([_, count]) => count >= snapshots.length * 0.6) // 60% threshold
      .map(([factor, _]) => factor)
      .slice(0, 5) // Top 5 factors
  }

  private findOptimalHours(snapshots: ProductivitySnapshot[]): number[] {
    const hourCounts = new Map<number, number>()
    
    snapshots.forEach(snapshot => {
      snapshot.productivityEvents.forEach(event => {
        if (event.eventType === 'flow_entered' || event.eventType === 'energy_peak') {
          const hour = new Date(event.timestamp).getHours()
          hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
        }
      })
    })
    
    return Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, _]) => hour)
  }

  private extractContextualFactors(snapshots: ProductivitySnapshot[]): string[] {
    const factors = new Set<string>()
    
    snapshots.forEach(snapshot => {
      if (snapshot.contextualFactors.sleepQuality > 7) factors.add('high-sleep-quality')
      if (snapshot.contextualFactors.physicalActivity > 50) factors.add('regular-exercise')
      if (snapshot.contextualFactors.socialInteractions < 3) factors.add('minimal-social-demands')
      factors.add(`${snapshot.contextualFactors.workEnvironment}-environment`)
    })
    
    return Array.from(factors)
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)
    
    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
    
    return denominator === 0 ? 0 : numerator / denominator
  }

  private traceProductivityEvolution(snapshots: ProductivitySnapshot[]): ArchaeologyFindings['productivityEvolution'] {
    // Simplified evolution tracking
    return [
      {
        phase: 'Foundation Building',
        duration: 30,
        characteristics: ['Learning basic productivity principles', 'Establishing routines'],
        keyEvents: ['First flow state achievement', 'Routine optimization'],
        lessonsLearned: ['Consistency beats intensity', 'Environment matters']
      },
      {
        phase: 'Pattern Recognition',
        duration: 45,
        characteristics: ['Identifying personal rhythms', 'Optimizing energy management'],
        keyEvents: ['Peak hour discovery', 'Break strategy refinement'],
        lessonsLearned: ['Biological rhythms drive performance', 'Recovery is productive']
      }
    ]
  }

  private generateDeepInsights(snapshots: ProductivitySnapshot[]): ArchaeologyFindings['deepInsights'] {
    return [
      {
        category: 'Biological Optimization',
        insight: 'Your cognitive performance follows a predictable 90-minute cycle',
        evidenceStrength: 85,
        practicalApplication: 'Schedule demanding work in 90-minute blocks with strategic breaks'
      },
      {
        category: 'Environmental Design',
        insight: 'Consistent environment reduces cognitive load by 15%',
        evidenceStrength: 78,
        practicalApplication: 'Create dedicated spaces for different types of cognitive work'
      }
    ]
  }

  private identifyForgottenWisdom(snapshots: ProductivitySnapshot[]): ArchaeologyFindings['forgottenWisdom'] {
    return [
      {
        insight: 'Morning planning sessions consistently led to 20% better day outcomes',
        lastObserved: '3 weeks ago',
        whyForgotten: 'Routine disruption during busy period',
        howToRestore: 'Reinstate 10-minute morning planning ritual'
      }
    ]
  }

  private analyzeHistoricalTrends(): any {
    // Simplified trend analysis
    return {
      cognitiveCapacity: 2, // Improving by 2 points per month
      flowState: 0.05, // Improving by 5% per month
      efficiency: 0.03 // Improving by 3% per month
    }
  }

  private generateAssumptions(timeframe: string): string[] {
    return [
      'Current biological rhythms remain stable',
      'No major lifestyle changes occur',
      'Environmental factors stay consistent',
      'Continued practice of productivity techniques',
      'No significant health changes'
    ]
  }

  private identifyInfluencingFactors(): CognitiveTrajectory['influencingFactors'] {
    return {
      biological: [
        { factor: 'Sleep quality', impact: 0.8 },
        { factor: 'Circadian rhythm alignment', impact: 0.7 },
        { factor: 'Physical fitness', impact: 0.6 }
      ],
      behavioral: [
        { factor: 'Focus techniques practice', impact: 0.9 },
        { factor: 'Break strategy adherence', impact: 0.7 },
        { factor: 'Distraction management', impact: 0.8 }
      ],
      environmental: [
        { factor: 'Workspace optimization', impact: 0.6 },
        { factor: 'Noise levels', impact: 0.5 },
        { factor: 'Lighting conditions', impact: 0.4 }
      ]
    }
  }

  private generateScenarios(timeframe: string, baseline: any): CognitiveTrajectory['scenarios'] {
    return {
      optimistic: {
        description: 'Consistent application of best practices with favorable conditions',
        probability: 25,
        outcomes: ['+30% cognitive efficiency', '+50% flow state frequency', '+25% energy levels']
      },
      realistic: {
        description: 'Steady improvement with occasional setbacks',
        probability: 50,
        outcomes: ['+15% cognitive efficiency', '+25% flow state frequency', '+10% energy levels']
      },
      pessimistic: {
        description: 'Minimal improvement due to external challenges',
        probability: 25,
        outcomes: ['+5% cognitive efficiency', '+10% flow state frequency', 'Stable energy levels']
      }
    }
  }

  private generateTrajectoryRecommendations(timeframe: string, baseline: any): CognitiveTrajectory['recommendations'] {
    return {
      shortTerm: [
        'Optimize sleep schedule for consistent 8+ hours',
        'Implement 90-minute work blocks with strategic breaks',
        'Create distraction-free environment for deep work'
      ],
      longTerm: [
        'Develop advanced flow state triggers',
        'Build cognitive resilience through varied challenges',
        'Establish sustainable energy management systems'
      ],
      riskMitigation: [
        'Monitor for signs of cognitive overload',
        'Maintain flexibility in productivity systems',
        'Regular assessment and adjustment of strategies'
      ]
    }
  }

  private calculateAdaptabilityScore(snapshots: ProductivitySnapshot[]): number {
    // Simplified adaptability calculation based on variety and resilience
    const environments = new Set(snapshots.map(s => s.contextualFactors.workEnvironment))
    const taskVariety = new Set(snapshots.flatMap(s => s.tags))
    
    const environmentAdaptability = Math.min(1, environments.size / 4) // Max 4 environments
    const taskAdaptability = Math.min(1, taskVariety.size / 8) // Max 8 task types
    
    return (environmentAdaptability + taskAdaptability) / 2
  }

  private generateRecreationPlan(snapshot: ProductivitySnapshot): string[] {
    return [
      `Start day at ${snapshot.contextualFactors.sleepQuality > 7 ? '7:00 AM' : '8:00 AM'} after quality sleep`,
      'Recreate the same workspace environment',
      'Follow the identified peak performance windows',
      'Apply the same break and recovery strategies',
      'Monitor energy levels and adjust accordingly'
    ]
  }

  private generateContextualGuidance(snapshot: ProductivitySnapshot): string[] {
    return [
      `Weather was ${snapshot.contextualFactors.weatherCondition} - consider similar conditions`,
      `Work environment: ${snapshot.contextualFactors.workEnvironment}`,
      `Social interaction level: ${snapshot.contextualFactors.socialInteractions} interactions`,
      `Physical activity: ${snapshot.contextualFactors.physicalActivity}% of optimal`
    ]
  }

  private generateAdaptationSuggestions(snapshot: ProductivitySnapshot): string[] {
    return [
      'Adapt the timing to your current circadian rhythm',
      'Modify task complexity based on current cognitive capacity',
      'Adjust break frequency based on current stress levels',
      'Scale expectations based on current life context'
    ]
  }

  // === PUBLIC API ===

  getAllSnapshots(): ProductivitySnapshot[] {
    return [...this.snapshots]
  }

  getRecentSnapshots(count: number = 10): ProductivitySnapshot[] {
    return this.snapshots.slice(0, count)
  }

  getSnapshotsByTag(tag: string): ProductivitySnapshot[] {
    return this.snapshots.filter(s => s.tags.includes(tag))
  }

  getMostProductiveDays(count: number = 5): ProductivitySnapshot[] {
    return [...this.snapshots]
      .sort((a, b) => b.cognitiveMetrics.cognitiveEfficiency - a.cognitiveMetrics.cognitiveEfficiency)
      .slice(0, count)
  }

  getTimeTravelOverview(): {
    totalSnapshots: number
    oldestSnapshot: string
    newestSnapshot: string
    topPatterns: ProductivityPattern[]
    currentTrajectory: CognitiveTrajectory | null
    recentFindings: ArchaeologyFindings | null
  } {
    return {
      totalSnapshots: this.snapshots.length,
      oldestSnapshot: this.snapshots[this.snapshots.length - 1]?.date || 'None',
      newestSnapshot: this.snapshots[0]?.date || 'None',
      topPatterns: this.patterns.slice(0, 3),
      currentTrajectory: this.trajectories[this.trajectories.length - 1] || null,
      recentFindings: this.archaeologyCache[this.archaeologyCache.length - 1] || null
    }
  }
}

export default CognitiveTimeTravelEngine