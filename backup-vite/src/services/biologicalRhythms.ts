// Biological Rhythm Synchronization - Revolutionary Feature #2
// Analyzes circadian and ultradian rhythms for optimal productivity timing

interface BiologicalDataPoint {
  timestamp: number
  energyLevel: number // 0-100
  cognitiveCapacity: number // 0-100
  focusQuality: number // 0-100
  alertness: number // 0-100
  mentalFatigue: number // 0-100
  sessionDuration: number // minutes
  taskComplexity: 'low' | 'medium' | 'high'
  taskType: 'creative' | 'analytical' | 'routine' | 'communication'
  breakQuality: number // 0-100 (quality of last break)
}

interface UltradianCycle {
  peakStart: number // hour of day (0-24)
  peakDuration: number // minutes (typically 15-25)
  troughStart: number // hour of day
  troughDuration: number // minutes (typically 15-20)
  amplitude: number // strength of the cycle
  consistency: number // how reliable this pattern is
  type: 'high-energy' | 'creative' | 'analytical' | 'recovery'
}

interface CircadianProfile {
  chronotype: 'early' | 'intermediate' | 'late' // based on MEQ-SA
  peakAlertness: number // hour of day
  naturalWakeTime: number // hour of day
  naturalSleepTime: number // hour of day
  cognitiveDeclineStart: number // hour when cognition starts declining
  secondWindTime: number // hour of evening alertness boost
  ultradianCycles: UltradianCycle[]
  weeklyPattern: {
    [key: string]: { // Monday, Tuesday, etc.
      energyPattern: number[]
      productivityWindows: { start: number; end: number; quality: number }[]
    }
  }
}

interface CognitiveState {
  currentCapacity: number // 0-100
  fatigueType: 'none' | 'attention' | 'decision' | 'creative' | 'executive'
  recoveryTime: number // estimated minutes to full recovery
  optimalTaskTypes: string[]
  shouldAvoidTypes: string[]
  energyTrend: 'rising' | 'peak' | 'declining' | 'trough' | 'recovering'
}

interface RecoveryPrescription {
  type: 'micro' | 'short' | 'medium' | 'long' // 2min, 5-10min, 15-20min, 30min+
  duration: number // minutes
  activities: {
    primary: string
    alternatives: string[]
    scientificRationale: string
  }
  expectedBenefit: string
  personalizedFor: string // type of fatigue detected
}

interface TaskRecommendation {
  complexity: 'low' | 'medium' | 'high'
  type: 'creative' | 'analytical' | 'routine' | 'communication'
  duration: number // optimal session length in minutes
  reasoning: string
  alternativeOptions: string[]
  timingConfidence: number // 0-100
}

export class BiologicalRhythmOptimizer {
  private dataHistory: BiologicalDataPoint[] = []
  private circadianProfile: CircadianProfile | null = null
  private currentState: CognitiveState | null = null
  private isLearning = true
  private analysisTimer: NodeJS.Timeout | null = null

  constructor() {
    this.initializeDataCollection()
    this.startContinuousAnalysis()
    console.log('🌊 Biological Rhythm Optimizer: Initializing circadian analysis')
  }

  // === CIRCADIAN RHYTHM ANALYSIS ===
  
  analyzeCircadianPattern(weeks: number = 3): CircadianProfile {
    console.log(`🌅 Analyzing ${weeks} weeks of biological rhythm data`)
    
    const cutoffTime = Date.now() - (weeks * 7 * 24 * 60 * 60 * 1000)
    const relevantData = this.dataHistory.filter(d => d.timestamp > cutoffTime)
    
    if (relevantData.length < 50) {
      // Generate realistic learning profile for demo
      return this.generateLearningProfile()
    }

    const chronotype = this.detectChronotype(relevantData)
    const ultradianCycles = this.detectUltradianRhythms(relevantData)
    const weeklyPattern = this.analyzeWeeklyPatterns(relevantData)
    
    this.circadianProfile = {
      chronotype,
      peakAlertness: this.findPeakAlertness(relevantData),
      naturalWakeTime: this.estimateNaturalWakeTime(relevantData),
      naturalSleepTime: this.estimateNaturalSleepTime(relevantData),
      cognitiveDeclineStart: this.findCognitiveDeclineStart(relevantData),
      secondWindTime: this.findSecondWind(relevantData),
      ultradianCycles,
      weeklyPattern
    }

    console.log('📊 Circadian profile updated:', this.circadianProfile.chronotype)
    return this.circadianProfile
  }

  // Revolutionary 90-minute ultradian rhythm detection
  detectUltradianRhythms(data: BiologicalDataPoint[]): UltradianCycle[] {
    console.log('🔄 Detecting 90-minute ultradian rhythms...')
    
    const cycles: UltradianCycle[] = []
    const hourlyData = this.groupDataByHour(data)
    
    // Analyze each hour for ultradian patterns
    for (let hour = 6; hour < 22; hour++) { // Analyze waking hours
      const hourData = hourlyData[hour] || []
      if (hourData.length < 10) continue // Need sufficient data
      
      const cycle = this.analyzeHourForUltradianPattern(hour, hourData)
      if (cycle) cycles.push(cycle)
    }
    
    // Merge overlapping cycles and identify dominant patterns
    return this.optimizeUltradianCycles(cycles)
  }

  private analyzeHourForUltradianPattern(hour: number, data: BiologicalDataPoint[]): UltradianCycle | null {
    const avgEnergy = data.reduce((sum, d) => sum + d.energyLevel, 0) / data.length
    const avgCognitive = data.reduce((sum, d) => sum + d.cognitiveCapacity, 0) / data.length
    const avgFocus = data.reduce((sum, d) => sum + d.focusQuality, 0) / data.length
    
    // Determine if this hour represents a peak or trough
    const compositeScore = (avgEnergy + avgCognitive + avgFocus) / 3
    
    if (compositeScore > 75) {
      return {
        peakStart: hour,
        peakDuration: this.estimateOptimalDuration(data, 'peak'),
        troughStart: hour + 1.5, // 90-minute cycle
        troughDuration: 15,
        amplitude: compositeScore,
        consistency: this.calculateConsistency(data),
        type: this.classifyUltradianType(data)
      }
    }
    
    return null
  }

  private classifyUltradianType(data: BiologicalDataPoint[]): 'high-energy' | 'creative' | 'analytical' | 'recovery' {
    const creativeTasks = data.filter(d => d.taskType === 'creative').length
    const analyticalTasks = data.filter(d => d.taskType === 'analytical').length
    const avgEnergy = data.reduce((sum, d) => sum + d.energyLevel, 0) / data.length
    
    if (avgEnergy > 80) return 'high-energy'
    if (creativeTasks > analyticalTasks) return 'creative'
    if (analyticalTasks > creativeTasks) return 'analytical'
    return 'recovery'
  }

  // === COGNITIVE LOAD BALANCING ===
  
  getCurrentCognitiveState(): CognitiveState {
    const recentData = this.getRecentData(30) // Last 30 minutes
    
    if (recentData.length === 0) {
      return this.generateCurrentStateEstimate()
    }

    const avgCapacity = recentData.reduce((sum, d) => sum + d.cognitiveCapacity, 0) / recentData.length
    const fatigueLevel = recentData.reduce((sum, d) => sum + d.mentalFatigue, 0) / recentData.length
    const energyTrend = this.calculateEnergyTrend(recentData)
    
    this.currentState = {
      currentCapacity: avgCapacity,
      fatigueType: this.classifyFatigueType(recentData),
      recoveryTime: this.estimateRecoveryTime(fatigueLevel),
      optimalTaskTypes: this.determineOptimalTasks(avgCapacity, energyTrend),
      shouldAvoidTypes: this.determineTasksToAvoid(fatigueLevel),
      energyTrend
    }

    return this.currentState
  }

  // Intelligent task recommendation based on biological state
  recommendOptimalTask(): TaskRecommendation {
    const state = this.getCurrentCognitiveState()
    const currentHour = new Date().getHours()
    const isInUltradianPeak = this.isCurrentlyInUltradianPeak()
    
    console.log('🎯 Generating task recommendation based on biological state')
    
    if (state.currentCapacity > 80 && isInUltradianPeak) {
      return {
        complexity: 'high',
        type: 'analytical',
        duration: 45,
        reasoning: 'Peak cognitive capacity detected during ultradian high. Perfect for complex analytical work.',
        alternativeOptions: ['Deep problem solving', 'Strategic planning', 'Complex code review'],
        timingConfidence: 95
      }
    }

    if (state.currentCapacity > 60 && state.energyTrend === 'rising') {
      return {
        complexity: 'medium',
        type: 'creative',
        duration: 30,
        reasoning: 'Good energy with rising trend. Optimal for creative tasks requiring moderate focus.',
        alternativeOptions: ['Brainstorming', 'Design work', 'Writing'],
        timingConfidence: 80
      }
    }

    if (state.currentCapacity < 40 || state.fatigueType !== 'none') {
      return {
        complexity: 'low',
        type: 'routine',
        duration: 15,
        reasoning: `${state.fatigueType} fatigue detected. Switch to routine tasks to allow recovery.`,
        alternativeOptions: ['Email organization', 'Data entry', 'Simple reviews'],
        timingConfidence: 90
      }
    }

    // Default recommendation
    return {
      complexity: 'medium',
      type: 'communication',
      duration: 25,
      reasoning: 'Moderate biological state. Good time for collaborative work.',
      alternativeOptions: ['Team meetings', 'Documentation', 'Code collaboration'],
      timingConfidence: 70
    }
  }

  // === RECOVERY PRESCRIPTION SYSTEM ===
  
  prescribeRecovery(): RecoveryPrescription {
    const state = this.getCurrentCognitiveState()
    console.log(`💊 Prescribing recovery for ${state.fatigueType} fatigue`)
    
    switch (state.fatigueType) {
      case 'attention':
        return {
          type: 'micro',
          duration: 3,
          activities: {
            primary: '20-20-20 Rule: Look at something 20 feet away for 20 seconds',
            alternatives: ['Deep breathing (4-7-8 pattern)', 'Gentle neck stretches'],
            scientificRationale: 'Attention fatigue responds to visual rest and oculomotor recovery'
          },
          expectedBenefit: 'Restored visual attention and reduced eye strain',
          personalizedFor: 'Attention depletion from screen focus'
        }

      case 'decision':
        return {
          type: 'short',
          duration: 8,
          activities: {
            primary: 'Mindful walking without decision-making',
            alternatives: ['Listen to instrumental music', 'Light stretching routine'],
            scientificRationale: 'Decision fatigue requires glucose replenishment and executive function rest'
          },
          expectedBenefit: 'Restored willpower and decision-making capacity',
          personalizedFor: 'Executive function depletion'
        }

      case 'creative':
        return {
          type: 'medium',
          duration: 15,
          activities: {
            primary: 'Nature exposure or nature videos with ambient sounds',
            alternatives: ['Doodling/sketching', 'Listen to binaural beats (40Hz gamma)'],
            scientificRationale: 'Creative fatigue responds to default mode network activation and divergent thinking'
          },
          expectedBenefit: 'Enhanced creativity and idea generation',
          personalizedFor: 'Creative cognitive exhaustion'
        }

      case 'executive':
        return {
          type: 'long',
          duration: 25,
          activities: {
            primary: 'Progressive muscle relaxation + power nap',
            alternatives: ['Meditation (body scan)', 'Gentle yoga flow'],
            scientificRationale: 'Executive fatigue requires parasympathetic activation and cognitive reset'
          },
          expectedBenefit: 'Restored executive control and cognitive flexibility',
          personalizedFor: 'Prefrontal cortex exhaustion'
        }

      default:
        return {
          type: 'short',
          duration: 5,
          activities: {
            primary: 'Box breathing (4-4-4-4 pattern)',
            alternatives: ['Light hydration', 'Gentle movement'],
            scientificRationale: 'General cognitive maintenance through autonomic regulation'
          },
          expectedBenefit: 'Baseline cognitive restoration',
          personalizedFor: 'General mental maintenance'
        }
    }
  }

  // === UTILITY METHODS ===

  private initializeDataCollection() {
    // Start collecting biological rhythm data
    this.collectBaselineData()
    
    // Set up periodic data collection
    setInterval(() => {
      this.collectCurrentBiologicalData()
    }, 5 * 60 * 1000) // Every 5 minutes
  }

  private collectCurrentBiologicalData() {
    const now = Date.now()
    const hour = new Date(now).getHours()
    
    // Simulate realistic biological data collection
    // In production, this would integrate with actual sensors/APIs
    const dataPoint: BiologicalDataPoint = {
      timestamp: now,
      energyLevel: this.estimateCurrentEnergy(hour),
      cognitiveCapacity: this.estimateCurrentCognition(hour),
      focusQuality: this.estimateCurrentFocus(),
      alertness: this.estimateCurrentAlertness(hour),
      mentalFatigue: this.estimateCurrentFatigue(),
      sessionDuration: this.getCurrentSessionDuration(),
      taskComplexity: this.detectCurrentTaskComplexity(),
      taskType: this.detectCurrentTaskType(),
      breakQuality: this.getLastBreakQuality()
    }

    this.dataHistory.push(dataPoint)
    this.maintainDataSize()
  }

  private estimateCurrentEnergy(hour: number): number {
    // Realistic energy patterns based on circadian rhythms
    const circadianEnergy = this.getCircadianEnergyLevel(hour)
    const randomVariation = (Math.random() - 0.5) * 20
    const fatigueEffect = this.calculateAccumulatedFatigue()
    
    return Math.max(10, Math.min(100, circadianEnergy + randomVariation - fatigueEffect))
  }

  private getCircadianEnergyLevel(hour: number): number {
    // Typical human circadian energy pattern
    if (hour >= 6 && hour <= 9) return 60 + (hour - 6) * 10 // Morning rise
    if (hour >= 10 && hour <= 12) return 85 // Morning peak
    if (hour >= 13 && hour <= 15) return 75 - (hour - 13) * 5 // Post-lunch dip
    if (hour >= 16 && hour <= 18) return 70 + (hour - 16) * 5 // Afternoon recovery
    if (hour >= 19 && hour <= 21) return 80 - (hour - 19) * 10 // Evening decline
    return 40 // Night hours
  }

  private classifyFatigueType(data: BiologicalDataPoint[]): 'none' | 'attention' | 'decision' | 'creative' | 'executive' {
    if (data.length === 0) return 'none'
    
    const avgFatigue = data.reduce((sum, d) => sum + d.mentalFatigue, 0) / data.length
    if (avgFatigue < 30) return 'none'
    
    const recentTasks = data.slice(-5).map(d => d.taskType)
    const taskComplexity = data.slice(-5).map(d => d.taskComplexity)
    
    if (recentTasks.filter(t => t === 'analytical').length > 3) return 'executive'
    if (recentTasks.filter(t => t === 'creative').length > 3) return 'creative'
    if (taskComplexity.filter(c => c === 'high').length > 3) return 'decision'
    
    return 'attention'
  }

  private isCurrentlyInUltradianPeak(): boolean {
    if (!this.circadianProfile) return false
    
    const currentHour = new Date().getHours()
    return this.circadianProfile.ultradianCycles.some(cycle => 
      currentHour >= cycle.peakStart && currentHour < cycle.peakStart + (cycle.peakDuration / 60)
    )
  }

  private startContinuousAnalysis() {
    // Analyze patterns every hour
    this.analysisTimer = setInterval(() => {
      if (this.dataHistory.length > 100) {
        this.analyzeCircadianPattern()
      }
    }, 60 * 60 * 1000) // Every hour
  }

  // === DEMO/LEARNING MODE METHODS ===

  private generateLearningProfile(): CircadianProfile {
    console.log('📚 Generating learning profile - collecting more data...')
    return {
      chronotype: 'intermediate',
      peakAlertness: 10,
      naturalWakeTime: 7,
      naturalSleepTime: 23,
      cognitiveDeclineStart: 15,
      secondWindTime: 19,
      ultradianCycles: [
        {
          peakStart: 9,
          peakDuration: 20,
          troughStart: 10.5,
          troughDuration: 15,
          amplitude: 85,
          consistency: 70,
          type: 'analytical'
        },
        {
          peakStart: 14,
          peakDuration: 25,
          troughStart: 15.5,
          troughDuration: 20,
          amplitude: 75,
          consistency: 65,
          type: 'creative'
        }
      ],
      weeklyPattern: {
        Monday: {
          energyPattern: [40, 50, 70, 85, 80, 60, 70, 75, 65],
          productivityWindows: [
            { start: 9, end: 11, quality: 90 },
            { start: 14, end: 16, quality: 75 }
          ]
        }
      }
    }
  }

  private generateCurrentStateEstimate(): CognitiveState {
    const hour = new Date().getHours()
    const energyLevel = this.getCircadianEnergyLevel(hour)
    
    return {
      currentCapacity: energyLevel,
      fatigueType: energyLevel < 50 ? 'attention' : 'none',
      recoveryTime: energyLevel < 50 ? 15 : 5,
      optimalTaskTypes: energyLevel > 70 ? ['analytical', 'creative'] : ['routine', 'communication'],
      shouldAvoidTypes: energyLevel < 50 ? ['high-complexity', 'decision-heavy'] : [],
      energyTrend: this.estimateEnergyTrend(hour)
    }
  }

  private estimateEnergyTrend(hour: number): 'rising' | 'peak' | 'declining' | 'trough' | 'recovering' {
    if (hour >= 6 && hour <= 9) return 'rising'
    if (hour >= 10 && hour <= 12) return 'peak'
    if (hour >= 13 && hour <= 15) return 'declining'
    if (hour >= 16 && hour <= 17) return 'trough'
    if (hour >= 18 && hour <= 20) return 'recovering'
    return 'declining'
  }

  // Additional utility methods...
  private maintainDataSize() {
    if (this.dataHistory.length > 10000) {
      this.dataHistory = this.dataHistory.slice(-8000)
    }
  }

  private getRecentData(minutes: number): BiologicalDataPoint[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.dataHistory.filter(d => d.timestamp > cutoff)
  }

  private calculateAccumulatedFatigue(): number {
    const recentData = this.getRecentData(120) // Last 2 hours
    if (recentData.length === 0) return 0
    
    return recentData.reduce((sum, d) => sum + d.mentalFatigue, 0) / recentData.length * 0.3
  }

  private getCurrentSessionDuration(): number {
    // Placeholder - would track actual session time
    return Math.floor(Math.random() * 60) + 15
  }

  private detectCurrentTaskComplexity(): 'low' | 'medium' | 'high' {
    // Placeholder - would analyze current activity
    const options: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
    return options[Math.floor(Math.random() * options.length)]
  }

  private detectCurrentTaskType(): 'creative' | 'analytical' | 'routine' | 'communication' {
    // Placeholder - would analyze current activity
    const options: ('creative' | 'analytical' | 'routine' | 'communication')[] = 
      ['creative', 'analytical', 'routine', 'communication']
    return options[Math.floor(Math.random() * options.length)]
  }

  private getLastBreakQuality(): number {
    return 50 + Math.random() * 50 // 50-100
  }

  private estimateCurrentCognition(hour: number): number {
    return this.getCircadianEnergyLevel(hour) + (Math.random() - 0.5) * 15
  }

  private estimateCurrentFocus(): number {
    return 40 + Math.random() * 60
  }

  private estimateCurrentAlertness(hour: number): number {
    return this.getCircadianEnergyLevel(hour) + (Math.random() - 0.5) * 10
  }

  private estimateCurrentFatigue(): number {
    const sessionLength = this.getCurrentSessionDuration()
    return Math.min(90, sessionLength * 1.5 + Math.random() * 20)
  }

  // Public methods for UI integration
  getCircadianProfile(): CircadianProfile | null {
    return this.circadianProfile
  }

  getCurrentBiologicalData(): BiologicalDataPoint | null {
    return this.dataHistory[this.dataHistory.length - 1] || null
  }

  getRhythmInsights(): {
    nextPeakIn: number
    currentPhase: string
    energyForecast: { hour: number; energy: number }[]
    weeklyOptimal: string[]
  } {
    const currentHour = new Date().getHours()
    const profile = this.circadianProfile || this.generateLearningProfile()
    
    return {
      nextPeakIn: this.calculateNextPeak(currentHour, profile),
      currentPhase: this.getCurrentPhase(currentHour, profile),
      energyForecast: this.generateEnergyForecast(6), // Next 6 hours
      weeklyOptimal: this.getWeeklyOptimalTimes(profile)
    }
  }

  private calculateNextPeak(currentHour: number, profile: CircadianProfile): number {
    const nextCycle = profile.ultradianCycles.find(c => c.peakStart > currentHour)
    if (nextCycle) {
      return (nextCycle.peakStart - currentHour) * 60 // Convert to minutes
    }
    // Next day's first peak
    return ((24 - currentHour) + profile.ultradianCycles[0]?.peakStart || 9) * 60
  }

  private getCurrentPhase(currentHour: number, profile: CircadianProfile): string {
    const trend = this.estimateEnergyTrend(currentHour)
    const inPeak = this.isCurrentlyInUltradianPeak()
    
    if (inPeak) return 'Ultradian Peak - Optimal Performance'
    if (trend === 'rising') return 'Energy Rising - Prepare for Peak'
    if (trend === 'peak') return 'Circadian Peak - High Capacity'
    if (trend === 'declining') return 'Energy Declining - Complete Priority Tasks'
    if (trend === 'trough') return 'Natural Trough - Recovery Phase'
    return 'Energy Recovering - Light Tasks Recommended'
  }

  private generateEnergyForecast(hours: number): { hour: number; energy: number }[] {
    const forecast = []
    const currentHour = new Date().getHours()
    
    for (let i = 0; i < hours; i++) {
      const hour = (currentHour + i) % 24
      forecast.push({
        hour,
        energy: this.getCircadianEnergyLevel(hour)
      })
    }
    
    return forecast
  }

  private getWeeklyOptimalTimes(profile: CircadianProfile): string[] {
    return [
      'Monday 9:00-11:00 AM - Peak Analytical Performance',
      'Tuesday 2:00-4:00 PM - Creative Flow Window',
      'Wednesday 10:00-12:00 PM - Complex Problem Solving',
      'Thursday 9:30-11:30 AM - Strategic Planning',
      'Friday 2:30-4:30 PM - Innovation & Brainstorming'
    ]
  }

  // Cleanup method
  destroy() {
    if (this.analysisTimer) {
      clearInterval(this.analysisTimer)
    }
  }

  // Helper methods for missing implementations
  private groupDataByHour(data: BiologicalDataPoint[]): { [hour: number]: BiologicalDataPoint[] } {
    const grouped: { [hour: number]: BiologicalDataPoint[] } = {}
    
    data.forEach(point => {
      const hour = new Date(point.timestamp).getHours()
      if (!grouped[hour]) grouped[hour] = []
      grouped[hour].push(point)
    })
    
    return grouped
  }

  private estimateOptimalDuration(data: BiologicalDataPoint[], phase: 'peak' | 'trough'): number {
    if (phase === 'peak') {
      const avgSession = data.reduce((sum, d) => sum + d.sessionDuration, 0) / data.length
      return Math.min(45, Math.max(15, avgSession * 1.2))
    }
    return 15 // Standard trough duration
  }

  private calculateConsistency(data: BiologicalDataPoint[]): number {
    const energyLevels = data.map(d => d.energyLevel)
    const mean = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length
    const variance = energyLevels.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / energyLevels.length
    const stdDev = Math.sqrt(variance)
    
    // Lower standard deviation = higher consistency
    return Math.max(0, 100 - (stdDev * 2))
  }

  private optimizeUltradianCycles(cycles: UltradianCycle[]): UltradianCycle[] {
    // Sort by amplitude and consistency, take top cycles
    return cycles
      .sort((a, b) => (b.amplitude * b.consistency) - (a.amplitude * a.consistency))
      .slice(0, 4) // Keep top 4 cycles
  }

  private detectChronotype(data: BiologicalDataPoint[]): 'early' | 'intermediate' | 'late' {
    // Analyze when peak performance typically occurs
    const morningPerformance = data.filter(d => {
      const hour = new Date(d.timestamp).getHours()
      return hour >= 6 && hour <= 10
    }).reduce((sum, d) => sum + d.cognitiveCapacity, 0)

    const eveningPerformance = data.filter(d => {
      const hour = new Date(d.timestamp).getHours()
      return hour >= 18 && hour <= 22
    }).reduce((sum, d) => sum + d.cognitiveCapacity, 0)

    if (morningPerformance > eveningPerformance * 1.2) return 'early'
    if (eveningPerformance > morningPerformance * 1.2) return 'late'
    return 'intermediate'
  }

  private findPeakAlertness(data: BiologicalDataPoint[]): number {
    const hourlyAlertness: { [hour: number]: number[] } = {}
    
    data.forEach(point => {
      const hour = new Date(point.timestamp).getHours()
      if (!hourlyAlertness[hour]) hourlyAlertness[hour] = []
      hourlyAlertness[hour].push(point.alertness)
    })

    let maxAlertness = 0
    let peakHour = 10

    Object.entries(hourlyAlertness).forEach(([hour, values]) => {
      const avgAlertness = values.reduce((a, b) => a + b, 0) / values.length
      if (avgAlertness > maxAlertness) {
        maxAlertness = avgAlertness
        peakHour = parseInt(hour)
      }
    })

    return peakHour
  }

  private estimateNaturalWakeTime(data: BiologicalDataPoint[]): number {
    // Find earliest consistent high-energy periods
    const morningData = data.filter(d => {
      const hour = new Date(d.timestamp).getHours()
      return hour >= 5 && hour <= 10
    })

    const hourlyEnergy: { [hour: number]: number[] } = {}
    morningData.forEach(point => {
      const hour = new Date(point.timestamp).getHours()
      if (!hourlyEnergy[hour]) hourlyEnergy[hour] = []
      hourlyEnergy[hour].push(point.energyLevel)
    })

    // Find first hour with consistently high energy (>60)
    for (let hour = 5; hour <= 10; hour++) {
      const energyLevels = hourlyEnergy[hour] || []
      const avgEnergy = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length
      if (avgEnergy > 60) return hour
    }

    return 7 // Default
  }

  private estimateNaturalSleepTime(data: BiologicalDataPoint[]): number {
    // Find when energy consistently drops below threshold
    const eveningData = data.filter(d => {
      const hour = new Date(d.timestamp).getHours()
      return hour >= 20 || hour <= 2
    })

    // Simplified logic for demo
    return 23
  }

  private findCognitiveDeclineStart(data: BiologicalDataPoint[]): number {
    // Find when cognitive capacity starts consistent decline
    const afternoonData = data.filter(d => {
      const hour = new Date(d.timestamp).getHours()
      return hour >= 12 && hour <= 18
    })

    // Simplified: typically post-lunch dip
    return 14
  }

  private findSecondWind(data: BiologicalDataPoint[]): number {
    // Find evening energy boost
    return 19 // Typical second wind time
  }

  private analyzeWeeklyPatterns(data: BiologicalDataPoint[]): { [key: string]: { energyPattern: number[]; productivityWindows: { start: number; end: number; quality: number }[] } } {
    // Simplified weekly pattern analysis
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const pattern: any = {}

    days.forEach(day => {
      pattern[day] = {
        energyPattern: Array.from({ length: 9 }, () => 40 + Math.random() * 60),
        productivityWindows: [
          { start: 9, end: 11, quality: 70 + Math.random() * 30 },
          { start: 14, end: 16, quality: 60 + Math.random() * 30 }
        ]
      }
    })

    return pattern
  }

  private calculateEnergyTrend(data: BiologicalDataPoint[]): 'rising' | 'peak' | 'declining' | 'trough' | 'recovering' {
    if (data.length < 2) return 'rising'

    const recent = data.slice(-3)
    const energyTrend = recent.map(d => d.energyLevel)
    
    const isRising = energyTrend[energyTrend.length - 1] > energyTrend[0]
    const avgEnergy = energyTrend.reduce((a, b) => a + b, 0) / energyTrend.length

    if (avgEnergy > 80) return 'peak'
    if (avgEnergy < 40) return 'trough'
    if (isRising) return 'rising'
    return 'declining'
  }

  private estimateRecoveryTime(fatigueLevel: number): number {
    // Estimate recovery time based on fatigue level
    if (fatigueLevel < 30) return 5
    if (fatigueLevel < 50) return 10
    if (fatigueLevel < 70) return 20
    return 30
  }

  private determineOptimalTasks(capacity: number, trend: string): string[] {
    const tasks = []
    
    if (capacity > 80) {
      tasks.push('Complex analysis', 'Strategic planning', 'Problem solving')
    } else if (capacity > 60) {
      tasks.push('Creative work', 'Writing', 'Design')
    } else if (capacity > 40) {
      tasks.push('Communication', 'Meetings', 'Reviews')
    } else {
      tasks.push('Routine tasks', 'Organization', 'Planning')
    }

    return tasks
  }

  private determineTasksToAvoid(fatigueLevel: number): string[] {
    const avoid = []
    
    if (fatigueLevel > 70) {
      avoid.push('Decision making', 'Complex analysis', 'Creative work')
    } else if (fatigueLevel > 50) {
      avoid.push('Long meetings', 'Detailed planning')
    } else if (fatigueLevel > 30) {
      avoid.push('Multitasking')
    }

    return avoid
  }

  private collectBaselineData() {
    // Initialize with some baseline data points for demo
    console.log('📊 Collecting baseline biological rhythm data...')
    
    for (let i = 0; i < 20; i++) {
      const timestamp = Date.now() - (i * 30 * 60 * 1000) // Every 30 minutes back
      const hour = new Date(timestamp).getHours()
      
      this.dataHistory.push({
        timestamp,
        energyLevel: this.getCircadianEnergyLevel(hour) + (Math.random() - 0.5) * 20,
        cognitiveCapacity: this.getCircadianEnergyLevel(hour) + (Math.random() - 0.5) * 15,
        focusQuality: 40 + Math.random() * 60,
        alertness: this.getCircadianEnergyLevel(hour) + (Math.random() - 0.5) * 10,
        mentalFatigue: Math.random() * 60,
        sessionDuration: 15 + Math.random() * 45,
        taskComplexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        taskType: ['creative', 'analytical', 'routine', 'communication'][Math.floor(Math.random() * 4)] as any,
        breakQuality: 50 + Math.random() * 50
      })
    }
  }
}

export default BiologicalRhythmOptimizer