// Cognitive Nutrition System - Revolutionary Feature #4
// Track mental energy like physical calories and prescribe recovery nutrients

interface CognitiveActivity {
  id: string
  name: string
  type: 'deep-work' | 'creative' | 'analytical' | 'communication' | 'routine' | 'learning'
  complexity: 'low' | 'medium' | 'high' | 'extreme'
  duration: number // minutes
  cognitiveCalories: number // mental energy burned
  timestamp: number
  qualityRating: number // 1-10 user rating of session quality
  interruptions: number
  multitaskingLevel: number // 0-1
  stressLevel: number // 0-1
  flowStateAchieved: boolean
}

interface CognitiveCalorieRate {
  taskType: string
  complexity: string
  baseCaloriesPerMinute: number
  flowStateMultiplier: number
  stressMultiplier: number
  multitaskingPenalty: number
  interruptionPenalty: number
}

interface RecoveryNutrient {
  id: string
  name: string
  type: 'micro' | 'mini' | 'power' | 'deep'
  duration: number // minutes
  cognitiveValue: number // energy restored
  targetedDeficit: 'attention' | 'creativity' | 'decision' | 'executive' | 'general'
  activities: {
    primary: string
    alternatives: string[]
    music?: string[]
    environment?: string[]
  }
  scientificBasis: string
  effectivenessScore: number // 0-1
}

interface CognitiveFitnessMetrics {
  currentScore: number // 0-100
  trend: 'improving' | 'stable' | 'declining'
  weeklyProgress: number // points gained/lost this week
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  nextLevelRequirements: {
    points: number
    activities: string[]
  }
}

interface DailyNutritionData {
  date: string
  caloriesBurned: number
  caloriesBudget: number
  energyRecovered: number
  netEnergyBalance: number
  sessionsCompleted: number
  recoveryBreaksTaken: number
  fitnessScore: number
  mood: 'energized' | 'balanced' | 'tired' | 'exhausted'
}

interface NutritionProfile {
  dailyCalorieBudget: number
  optimalSessionLength: number
  preferredRecoveryTypes: string[]
  cognitiveStrengths: string[]
  energyPatterns: {
    peakHours: number[]
    lowEnergyHours: number[]
    optimalBreakFrequency: number
  }
  fitnessGoals: {
    targetScore: number
    focusAreas: string[]
    timeline: number // weeks
  }
}

export class CognitiveNutritionTracker {
  private activityHistory: CognitiveActivity[] = []
  private dailyData: DailyNutritionData[] = []
  private userProfile: NutritionProfile | null = null
  private currentSession: CognitiveActivity | null = null
  private fitnessScore = 50 // Starting score
  private isTracking = false

  // Cognitive Calorie Rate Database
  private calorieRates: CognitiveCalorieRate[] = [
    {
      taskType: 'deep-work',
      complexity: 'extreme',
      baseCaloriesPerMinute: 8.5,
      flowStateMultiplier: 0.8, // Flow makes tasks more efficient
      stressMultiplier: 1.4,
      multitaskingPenalty: 1.6,
      interruptionPenalty: 0.3 // per interruption
    },
    {
      taskType: 'analytical',
      complexity: 'high',
      baseCaloriesPerMinute: 7.2,
      flowStateMultiplier: 0.85,
      stressMultiplier: 1.3,
      multitaskingPenalty: 1.5,
      interruptionPenalty: 0.25
    },
    {
      taskType: 'creative',
      complexity: 'high',
      baseCaloriesPerMinute: 6.8,
      flowStateMultiplier: 0.7, // Creativity benefits most from flow
      stressMultiplier: 1.5, // Stress hurts creativity more
      multitaskingPenalty: 1.8,
      interruptionPenalty: 0.4
    },
    {
      taskType: 'learning',
      complexity: 'medium',
      baseCaloriesPerMinute: 6.0,
      flowStateMultiplier: 0.8,
      stressMultiplier: 1.2,
      multitaskingPenalty: 1.4,
      interruptionPenalty: 0.2
    },
    {
      taskType: 'communication',
      complexity: 'medium',
      baseCaloriesPerMinute: 4.5,
      flowStateMultiplier: 0.9,
      stressMultiplier: 1.1,
      multitaskingPenalty: 1.2,
      interruptionPenalty: 0.1
    },
    {
      taskType: 'routine',
      complexity: 'low',
      baseCaloriesPerMinute: 2.8,
      flowStateMultiplier: 0.95,
      stressMultiplier: 1.05,
      multitaskingPenalty: 1.1,
      interruptionPenalty: 0.05
    }
  ]

  // Recovery Nutrients Database
  private recoveryNutrients: RecoveryNutrient[] = [
    {
      id: 'attention_micro',
      name: 'Attention Reset',
      type: 'micro',
      duration: 2,
      cognitiveValue: 15,
      targetedDeficit: 'attention',
      activities: {
        primary: '20-20-20 Rule: Look at something 20 feet away for 20 seconds',
        alternatives: ['Close eyes and breathe deeply', 'Gentle neck stretches'],
        music: ['Nature sounds', 'White noise']
      },
      scientificBasis: 'Oculomotor rest restores visual attention capacity',
      effectivenessScore: 0.85
    },
    {
      id: 'creativity_power',
      name: 'Creative Flow Boost',
      type: 'power',
      duration: 15,
      cognitiveValue: 45,
      targetedDeficit: 'creativity',
      activities: {
        primary: 'Walking meditation with no specific destination',
        alternatives: ['Doodling/sketching', 'Listen to instrumental music'],
        music: ['Binaural beats 40Hz', 'Classical music', 'Lo-fi hip hop'],
        environment: ['Natural light', 'Plants/nature views', 'Cool temperature']
      },
      scientificBasis: 'Default mode network activation enhances creative insight',
      effectivenessScore: 0.92
    },
    {
      id: 'decision_mini',
      name: 'Decision Clarity',
      type: 'mini',
      duration: 8,
      cognitiveValue: 25,
      targetedDeficit: 'decision',
      activities: {
        primary: 'Box breathing (4-4-4-4) with light movement',
        alternatives: ['Progressive muscle relaxation', 'Mindful tea/water drinking'],
        music: ['Ambient music', 'Rain sounds']
      },
      scientificBasis: 'Glucose restoration and parasympathetic activation restore willpower',
      effectivenessScore: 0.88
    },
    {
      id: 'executive_deep',
      name: 'Executive Function Restoration',
      type: 'deep',
      duration: 25,
      cognitiveValue: 70,
      targetedDeficit: 'executive',
      activities: {
        primary: 'Power nap with progressive muscle relaxation',
        alternatives: ['Meditation with body scan', 'Gentle yoga flow'],
        music: ['Delta wave music', 'Deep relaxation sounds'],
        environment: ['Dark room', 'Cool temperature', 'Minimal noise']
      },
      scientificBasis: 'Prefrontal cortex recovery through parasympathetic dominance',
      effectivenessScore: 0.95
    },
    {
      id: 'general_mini',
      name: 'Energy Refresh',
      type: 'mini',
      duration: 5,
      cognitiveValue: 20,
      targetedDeficit: 'general',
      activities: {
        primary: 'Hydration with mindful drinking + light stretching',
        alternatives: ['Deep breathing exercises', 'Brief walk'],
        music: ['Upbeat instrumental', 'Nature sounds']
      },
      scientificBasis: 'Hydration and movement boost cognitive performance',
      effectivenessScore: 0.75
    }
  ]

  constructor() {
    this.initializeProfile()
    this.loadHistoricalData()
    console.log('🍎 Cognitive Nutrition System: Initializing mental energy tracking')
  }

  // === COGNITIVE CALORIE TRACKING ===

  startSession(activityType: CognitiveActivity['type'], complexity: CognitiveActivity['complexity'], taskName: string) {
    if (this.isTracking) {
      console.warn('Session already in progress')
      return null
    }

    this.currentSession = {
      id: `session_${Date.now()}`,
      name: taskName,
      type: activityType,
      complexity,
      duration: 0,
      cognitiveCalories: 0,
      timestamp: Date.now(),
      qualityRating: 0,
      interruptions: 0,
      multitaskingLevel: 0,
      stressLevel: 0.5,
      flowStateAchieved: false
    }

    this.isTracking = true
    console.log(`🚀 Started tracking: ${taskName} (${activityType}, ${complexity})`)
    
    return this.currentSession.id
  }

  recordInterruption() {
    if (this.currentSession) {
      this.currentSession.interruptions++
      console.log('⚡ Interruption recorded')
    }
  }

  updateSessionMetrics(metrics: {
    multitaskingLevel?: number
    stressLevel?: number
    flowStateAchieved?: boolean
  }) {
    if (this.currentSession) {
      Object.assign(this.currentSession, metrics)
    }
  }

  endSession(qualityRating: number = 7): CognitiveActivity | null {
    if (!this.currentSession || !this.isTracking) {
      console.warn('No active session to end')
      return null
    }

    const endTime = Date.now()
    this.currentSession.duration = Math.round((endTime - this.currentSession.timestamp) / (1000 * 60))
    this.currentSession.qualityRating = qualityRating
    this.currentSession.cognitiveCalories = this.calculateCognitiveCalories(this.currentSession)

    // Save to history
    this.activityHistory.push({ ...this.currentSession })
    
    // Update daily tracking
    this.updateDailyData(this.currentSession)
    
    // Update fitness score
    this.updateFitnessScore(this.currentSession)

    const completedSession = { ...this.currentSession }
    this.currentSession = null
    this.isTracking = false

    console.log(`✅ Session completed: ${completedSession.cognitiveCalories} cognitive calories burned`)
    
    return completedSession
  }

  // === COGNITIVE CALORIE CALCULATION ===

  private calculateCognitiveCalories(activity: CognitiveActivity): number {
    const rate = this.calorieRates.find(r => 
      r.taskType === activity.type && r.complexity === activity.complexity
    ) || this.calorieRates[this.calorieRates.length - 1] // fallback to routine/low

    let baseCalories = rate.baseCaloriesPerMinute * activity.duration

    // Apply modifiers
    if (activity.flowStateAchieved) {
      baseCalories *= rate.flowStateMultiplier
    }

    baseCalories *= (1 + (activity.stressLevel * (rate.stressMultiplier - 1)))
    baseCalories *= (1 + (activity.multitaskingLevel * (rate.multitaskingPenalty - 1)))
    baseCalories += (activity.interruptions * rate.interruptionPenalty * rate.baseCaloriesPerMinute)

    // Quality modifier
    const qualityModifier = 0.7 + (activity.qualityRating / 10) * 0.6 // 0.7 to 1.3
    baseCalories *= qualityModifier

    return Math.round(baseCalories * 10) / 10 // Round to 1 decimal place
  }

  // === RECOVERY NUTRIENTS SYSTEM ===

  prescribeRecoveryNutrient(deficitType?: 'attention' | 'creativity' | 'decision' | 'executive'): RecoveryNutrient {
    const currentEnergy = this.getCurrentEnergyLevel()
    const timeOfDay = new Date().getHours()
    
    // Determine deficit type if not provided
    if (!deficitType) {
      deficitType = this.detectCognitiveDeficit()
    }

    // Filter nutrients by deficit type
    let availableNutrients = this.recoveryNutrients.filter(n => 
      n.targetedDeficit === deficitType || n.targetedDeficit === 'general'
    )

    // Choose appropriate duration based on energy level and time
    let preferredType: RecoveryNutrient['type']
    if (currentEnergy < 0.3) {
      preferredType = timeOfDay > 14 ? 'deep' : 'power' // Deep rest if afternoon/evening
    } else if (currentEnergy < 0.6) {
      preferredType = 'mini'
    } else {
      preferredType = 'micro'
    }

    // Find best match
    let selectedNutrient = availableNutrients.find(n => n.type === preferredType) ||
                          availableNutrients.find(n => n.effectivenessScore > 0.85) ||
                          availableNutrients[0]

    console.log(`💊 Prescribed: ${selectedNutrient.name} for ${deficitType} deficit`)
    
    return selectedNutrient
  }

  private detectCognitiveDeficit(): 'attention' | 'creativity' | 'decision' | 'executive' {
    const recentActivities = this.getRecentActivities(60) // Last hour
    
    if (recentActivities.length === 0) return 'general' as any

    // Analyze recent cognitive load
    const avgInterruptions = recentActivities.reduce((sum, a) => sum + a.interruptions, 0) / recentActivities.length
    const avgMultitasking = recentActivities.reduce((sum, a) => sum + a.multitaskingLevel, 0) / recentActivities.length
    const avgStress = recentActivities.reduce((sum, a) => sum + a.stressLevel, 0) / recentActivities.length
    const totalDuration = recentActivities.reduce((sum, a) => sum + a.duration, 0)

    // Decision rules for deficit detection
    if (avgInterruptions > 3 || totalDuration > 90) return 'attention'
    if (avgStress > 0.7) return 'executive'
    if (avgMultitasking > 0.6) return 'decision'
    if (recentActivities.some(a => a.type === 'creative' && !a.flowStateAchieved)) return 'creativity'
    
    return 'general' as any
  }

  applyRecoveryNutrient(nutrient: RecoveryNutrient, effectiveness: number = 1.0) {
    const energyRestored = nutrient.cognitiveValue * effectiveness
    
    // Update today's data
    const today = this.getTodayData()
    if (today) {
      today.energyRecovered += energyRestored
      today.recoveryBreaksTaken++
      today.netEnergyBalance = today.energyRecovered - today.caloriesBurned
    }

    console.log(`⚡ Applied ${nutrient.name}: +${energyRestored} cognitive energy`)
    
    return {
      energyRestored,
      newEnergyLevel: Math.min(1.0, this.getCurrentEnergyLevel() + energyRestored / 100)
    }
  }

  // === COGNITIVE FITNESS SCORE ===

  private updateFitnessScore(activity: CognitiveActivity) {
    const basePoints = this.calculateBasePoints(activity)
    const bonusPoints = this.calculateBonusPoints(activity)
    const penalties = this.calculatePenalties(activity)
    
    const sessionPoints = basePoints + bonusPoints - penalties
    this.fitnessScore = Math.max(0, Math.min(100, this.fitnessScore + sessionPoints))
    
    console.log(`📈 Fitness score updated: ${this.fitnessScore.toFixed(1)} (+${sessionPoints.toFixed(1)})`)
  }

  private calculateBasePoints(activity: CognitiveActivity): number {
    let points = 0
    
    // Duration points
    if (activity.duration >= 25) points += 2
    if (activity.duration >= 45) points += 3
    if (activity.duration >= 90) points += 2
    
    // Quality points
    points += (activity.qualityRating - 5) * 0.5
    
    // Complexity points
    const complexityMultiplier = {
      'low': 0.5,
      'medium': 1.0,
      'high': 1.5,
      'extreme': 2.0
    }
    points *= complexityMultiplier[activity.complexity]
    
    return points
  }

  private calculateBonusPoints(activity: CognitiveActivity): number {
    let bonus = 0
    
    // Flow state bonus
    if (activity.flowStateAchieved) bonus += 5
    
    // Low interruption bonus
    if (activity.interruptions === 0 && activity.duration >= 25) bonus += 2
    if (activity.interruptions <= 1 && activity.duration >= 45) bonus += 1
    
    // Single-tasking bonus
    if (activity.multitaskingLevel < 0.2) bonus += 1
    
    // Stress management bonus
    if (activity.stressLevel < 0.3 && activity.type === 'deep-work') bonus += 1
    
    return bonus
  }

  private calculatePenalties(activity: CognitiveActivity): number {
    let penalty = 0
    
    // Interruption penalties
    penalty += activity.interruptions * 0.5
    
    // Multitasking penalties
    penalty += activity.multitaskingLevel * 2
    
    // High stress penalties
    if (activity.stressLevel > 0.8) penalty += 2
    
    // Low quality penalties
    if (activity.qualityRating < 4) penalty += 1
    
    return penalty
  }

  getCognitiveFitnessMetrics(): CognitiveFitnessMetrics {
    const weeklyData = this.getWeeklyData()
    const lastWeekScore = weeklyData.length > 0 ? weeklyData[0].fitnessScore : this.fitnessScore
    const weeklyProgress = this.fitnessScore - lastWeekScore
    
    return {
      currentScore: Math.round(this.fitnessScore * 10) / 10,
      trend: weeklyProgress > 2 ? 'improving' : weeklyProgress < -2 ? 'declining' : 'stable',
      weeklyProgress: Math.round(weeklyProgress * 10) / 10,
      strengths: this.identifyStrengths(),
      weaknesses: this.identifyWeaknesses(),
      recommendations: this.generateFitnessRecommendations(),
      nextLevelRequirements: this.getNextLevelRequirements()
    }
  }

  private identifyStrengths(): string[] {
    const recentActivities = this.getRecentActivities(7 * 24 * 60) // Last week
    const strengths: string[] = []
    
    if (recentActivities.some(a => a.flowStateAchieved)) {
      strengths.push('Flow state achievement')
    }
    
    const avgInterruptions = recentActivities.reduce((sum, a) => sum + a.interruptions, 0) / recentActivities.length
    if (avgInterruptions < 1) {
      strengths.push('Focus maintenance')
    }
    
    const avgQuality = recentActivities.reduce((sum, a) => sum + a.qualityRating, 0) / recentActivities.length
    if (avgQuality > 7) {
      strengths.push('High-quality sessions')
    }
    
    return strengths.length > 0 ? strengths : ['Consistent practice']
  }

  private identifyWeaknesses(): string[] {
    const recentActivities = this.getRecentActivities(7 * 24 * 60)
    const weaknesses: string[] = []
    
    const avgMultitasking = recentActivities.reduce((sum, a) => sum + a.multitaskingLevel, 0) / recentActivities.length
    if (avgMultitasking > 0.5) {
      weaknesses.push('Multitasking tendency')
    }
    
    const avgStress = recentActivities.reduce((sum, a) => sum + a.stressLevel, 0) / recentActivities.length
    if (avgStress > 0.7) {
      weaknesses.push('Stress management')
    }
    
    const avgInterruptions = recentActivities.reduce((sum, a) => sum + a.interruptions, 0) / recentActivities.length
    if (avgInterruptions > 3) {
      weaknesses.push('Distraction control')
    }
    
    return weaknesses.length > 0 ? weaknesses : ['Room for improvement in consistency']
  }

  private generateFitnessRecommendations(): string[] {
    const recommendations: string[] = []
    const weaknesses = this.identifyWeaknesses()
    
    if (weaknesses.includes('Multitasking tendency')) {
      recommendations.push('Practice single-tasking: dedicate each session to one specific task')
    }
    
    if (weaknesses.includes('Stress management')) {
      recommendations.push('Take more frequent micro-breaks and practice stress-reduction techniques')
    }
    
    if (weaknesses.includes('Distraction control')) {
      recommendations.push('Create a distraction-free environment and use focus techniques')
    }
    
    if (this.fitnessScore < 60) {
      recommendations.push('Start with shorter, high-quality sessions to build cognitive endurance')
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue current practices and gradually increase session complexity']
  }

  private getNextLevelRequirements() {
    const nextScoreTarget = Math.ceil(this.fitnessScore / 10) * 10
    const pointsNeeded = nextScoreTarget - this.fitnessScore
    
    return {
      points: Math.round(pointsNeeded * 10) / 10,
      activities: [
        'Complete 3 high-quality deep work sessions',
        'Achieve flow state in 2 sessions',
        'Maintain focus without interruptions for 45+ minutes'
      ]
    }
  }

  // === DATA MANAGEMENT ===

  getCurrentEnergyLevel(): number {
    const today = this.getTodayData()
    if (!today) return 0.8 // Default high energy
    
    const energyUsed = today.caloriesBurned / today.caloriesBudget
    const energyRecovered = today.energyRecovered / today.caloriesBudget
    
    return Math.max(0, Math.min(1, 1 - energyUsed + energyRecovered))
  }

  getTodayData(): DailyNutritionData | null {
    const today = new Date().toISOString().split('T')[0]
    return this.dailyData.find(d => d.date === today) || null
  }

  private updateDailyData(activity: CognitiveActivity) {
    const today = new Date().toISOString().split('T')[0]
    let dailyData = this.dailyData.find(d => d.date === today)
    
    if (!dailyData) {
      dailyData = {
        date: today,
        caloriesBurned: 0,
        caloriesBudget: this.userProfile?.dailyCalorieBudget || 200,
        energyRecovered: 0,
        netEnergyBalance: 0,
        sessionsCompleted: 0,
        recoveryBreaksTaken: 0,
        fitnessScore: this.fitnessScore,
        mood: 'balanced'
      }
      this.dailyData.push(dailyData)
    }
    
    dailyData.caloriesBurned += activity.cognitiveCalories
    dailyData.sessionsCompleted++
    dailyData.fitnessScore = this.fitnessScore
    dailyData.netEnergyBalance = dailyData.energyRecovered - dailyData.caloriesBurned
    dailyData.mood = this.determineMood(dailyData)
  }

  private determineMood(data: DailyNutritionData): DailyNutritionData['mood'] {
    const energyRatio = data.caloriesBurned / data.caloriesBudget
    const recovery = data.energyRecovered / data.caloriesBurned
    
    if (energyRatio > 1.2 && recovery < 0.3) return 'exhausted'
    if (energyRatio > 0.9 && recovery < 0.5) return 'tired'
    if (energyRatio < 0.7 && recovery > 0.4) return 'energized'
    return 'balanced'
  }

  private getRecentActivities(minutes: number): CognitiveActivity[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.activityHistory.filter(a => a.timestamp > cutoff)
  }

  private getWeeklyData(): DailyNutritionData[] {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const cutoff = weekAgo.toISOString().split('T')[0]
    
    return this.dailyData.filter(d => d.date >= cutoff)
  }

  private initializeProfile() {
    // Initialize default user profile
    this.userProfile = {
      dailyCalorieBudget: 200, // Average cognitive calories per day
      optimalSessionLength: 45,
      preferredRecoveryTypes: ['mini', 'micro'],
      cognitiveStrengths: ['analytical'],
      energyPatterns: {
        peakHours: [9, 10, 14, 15],
        lowEnergyHours: [13, 16, 17],
        optimalBreakFrequency: 45 // minutes
      },
      fitnessGoals: {
        targetScore: 80,
        focusAreas: ['flow-achievement', 'distraction-control'],
        timeline: 8 // weeks
      }
    }
  }

  private loadHistoricalData() {
    // Initialize with some sample data for demo
    const today = new Date().toISOString().split('T')[0]
    this.dailyData.push({
      date: today,
      caloriesBurned: 85,
      caloriesBudget: 200,
      energyRecovered: 40,
      netEnergyBalance: -45,
      sessionsCompleted: 3,
      recoveryBreaksTaken: 2,
      fitnessScore: this.fitnessScore,
      mood: 'balanced'
    })
  }

  // === PUBLIC API ===

  getNutritionOverview() {
    const today = this.getTodayData()
    const currentEnergy = this.getCurrentEnergyLevel()
    const fitnessMetrics = this.getCognitiveFitnessMetrics()
    
    return {
      today: today || this.createEmptyDayData(),
      currentEnergyLevel: Math.round(currentEnergy * 100),
      suggestedNextBreak: this.prescribeRecoveryNutrient(),
      fitnessMetrics,
      weeklyProgress: this.getWeeklyData(),
      activeSession: this.currentSession,
      isTracking: this.isTracking
    }
  }

  private createEmptyDayData(): DailyNutritionData {
    return {
      date: new Date().toISOString().split('T')[0],
      caloriesBurned: 0,
      caloriesBudget: 200,
      energyRecovered: 0,
      netEnergyBalance: 0,
      sessionsCompleted: 0,
      recoveryBreaksTaken: 0,
      fitnessScore: this.fitnessScore,
      mood: 'energized'
    }
  }

  getCalorieEstimate(taskType: CognitiveActivity['type'], complexity: CognitiveActivity['complexity'], duration: number): number {
    const mockActivity: CognitiveActivity = {
      id: 'estimate',
      name: 'Estimate',
      type: taskType,
      complexity,
      duration,
      cognitiveCalories: 0,
      timestamp: Date.now(),
      qualityRating: 7,
      interruptions: 0,
      multitaskingLevel: 0.2,
      stressLevel: 0.5,
      flowStateAchieved: false
    }
    
    return this.calculateCognitiveCalories(mockActivity)
  }

  // Manual session data for testing
  recordManualSession(data: Partial<CognitiveActivity>) {
    const session: CognitiveActivity = {
      id: `manual_${Date.now()}`,
      name: data.name || 'Manual Session',
      type: data.type || 'routine',
      complexity: data.complexity || 'medium',
      duration: data.duration || 25,
      cognitiveCalories: 0,
      timestamp: Date.now(),
      qualityRating: data.qualityRating || 7,
      interruptions: data.interruptions || 0,
      multitaskingLevel: data.multitaskingLevel || 0,
      stressLevel: data.stressLevel || 0.5,
      flowStateAchieved: data.flowStateAchieved || false
    }
    
    session.cognitiveCalories = this.calculateCognitiveCalories(session)
    this.activityHistory.push(session)
    this.updateDailyData(session)
    this.updateFitnessScore(session)
    
    return session
  }
}

export default CognitiveNutritionTracker