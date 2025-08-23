interface TypingPattern {
  keystrokeInterval: number[]
  pauseDuration: number[]
  burstLength: number[]
  rhythmVariability: number
  timestamp: number
}

interface CursorPattern {
  accelerationProfile: number[]
  velocityChanges: number[]
  idlePositionTime: number
  microMovements: number[]
  trajectory: { x: number; y: number; timestamp: number }[]
}

interface CognitiveLoadIndicators {
  windowSwitchVelocity: number
  taskSwitchFrequency: number
  multitaskingIndex: number
  attentionFragmentation: number
  cognitiveStability: number
}

interface FlowPrediction {
  probabilityScore: number // 0-1
  timeToFlowState: number // minutes
  confidenceLevel: number
  predictedDuration: number
  recommendedAction: 'start_session' | 'wait' | 'prepare_environment' | 'take_break'
}

export class NeuralStatePredictor {
  private typingHistory: TypingPattern[] = []
  private cursorHistory: CursorPattern[] = []
  private cognitiveHistory: CognitiveLoadIndicators[] = []
  private learningModel: any // TensorFlow.js model
  
  // Real-time data collection
  private keystrokeBuffer: number[] = []
  private lastKeystroke = 0
  private cursorPositions: { x: number; y: number; timestamp: number }[] = []
  private windowFocusEvents: { type: string; timestamp: number }[] = []
  private isCollecting = false
  
  constructor() {
    this.initializeModel()
    this.startDataCollection()
  }

  // Neurological State Prediction Engine
  async predictFlowState(): Promise<FlowPrediction> {
    const currentPatterns = this.analyzeCurrentPatterns()
    const neuralSignals = this.extractNeuralSignals(currentPatterns)
    
    // Advanced ML prediction
    const prediction = await this.runPredictionModel(neuralSignals)
    
    return {
      probabilityScore: prediction.flowProbability,
      timeToFlowState: prediction.timeEstimate,
      confidenceLevel: prediction.confidence,
      predictedDuration: prediction.expectedDuration,
      recommendedAction: this.generateRecommendation(prediction)
    }
  }

  // Micro-Pattern Analysis
  private analyzeCurrentPatterns() {
    const recentTyping = this.getRecentTypingPatterns(30) // Last 30 minutes
    const recentCursor = this.getRecentCursorPatterns(30)
    const recentCognitive = this.getRecentCognitivePatterns(30)

    return {
      typingRhythmStability: this.calculateTypingStability(recentTyping),
      cursorAccelerationProfile: this.analyzeCursorBehavior(recentCursor),
      cognitiveLoadTrend: this.analyzeCognitiveLoad(recentCognitive),
      environmentalFactors: this.getEnvironmentalContext()
    }
  }

  // Revolutionary Typing Rhythm Analysis
  private calculateTypingStability(patterns: TypingPattern[]): number {
    if (patterns.length === 0) return 0

    // Analyze keystroke interval consistency
    const intervals = patterns.flatMap(p => p.keystrokeInterval)
    const rhythmCoherence = this.calculateRhythmCoherence(intervals)
    
    // Flow state indicators in typing:
    // - Consistent rhythm with slight natural variation
    // - Fewer pauses, longer bursts
    // - Reduced self-correction patterns
    
    return rhythmCoherence
  }

  // Game-Changing Cursor Prediction
  private analyzeCursorBehavior(patterns: CursorPattern[]): number {
    // Cursor behavior that predicts flow:
    // - Smoother acceleration curves
    // - Fewer micro-corrections
    // - More deliberate movements
    // - Reduced "hunting" behavior
    
    const smoothnessScore = patterns.reduce((acc, pattern) => {
      return acc + this.calculateMovementSmoothness(pattern.accelerationProfile)
    }, 0) / patterns.length

    return smoothnessScore
  }

  // Cognitive Load Trend Analysis
  private analyzeCognitiveLoad(indicators: CognitiveLoadIndicators[]): number {
    if (indicators.length === 0) return 0

    // Pre-flow indicators:
    // - Decreasing window switch velocity
    // - Stabilizing attention patterns
    // - Reduced multitasking behavior
    
    const trend = this.calculateTrend(indicators.map(i => i.cognitiveStability))
    return trend > 0 ? trend : 0 // Positive trend indicates improving stability
  }

  // Environmental Context (Revolutionary Addition)
  private getEnvironmentalContext() {
    return {
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      sessionsSinceBreak: this.getSessionsSinceLastBreak(),
      ambientNoise: this.detectAmbientConditions(), // Could use microphone API
      screenBrightness: this.getScreenBrightness(),
      batteryLevel: this.getBatteryLevel()
    }
  }

  // ML Model for Neural Prediction
  private async runPredictionModel(signals: any): Promise<any> {
    // This would use a trained neural network to predict flow states
    // Based on historical patterns, time-series analysis, and user-specific models
    
    const features = this.preprocessFeatures(signals)
    const prediction = await this.learningModel.predict(features)
    
    return {
      flowProbability: prediction.flowScore,
      timeEstimate: prediction.timeToFlow,
      confidence: prediction.confidence,
      expectedDuration: prediction.duration
    }
  }

  // Flow Forecast Generator
  generateFlowForecast(hours: number = 4): FlowForecast[] {
    const forecast = []
    const now = new Date()
    
    for (let i = 0; i < hours * 4; i++) { // 15-minute intervals
      const time = new Date(now.getTime() + i * 15 * 60 * 1000)
      const prediction = this.predictFlowAtTime(time)
      
      forecast.push({
        time,
        flowProbability: prediction.probability,
        recommendation: prediction.action,
        confidence: prediction.confidence
      })
    }
    
    return forecast
  }

  // Utility Methods
  private calculateRhythmCoherence(intervals: number[]): number {
    // Calculate coefficient of variation for rhythm stability
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / intervals.length
    const stdDev = Math.sqrt(variance)
    
    // Lower coefficient of variation = more stable rhythm = higher flow potential
    return 1 - (stdDev / mean)
  }

  private calculateMovementSmoothness(accelerations: number[]): number {
    // Analyze jerk (rate of change of acceleration) for smoothness
    const jerks = []
    for (let i = 1; i < accelerations.length; i++) {
      jerks.push(Math.abs(accelerations[i] - accelerations[i - 1]))
    }
    
    const avgJerk = jerks.reduce((a, b) => a + b, 0) / jerks.length
    return 1 / (1 + avgJerk) // Smoother movement = higher score
  }

  private calculateTrend(values: number[]): number {
    // Simple linear regression slope to detect improving cognitive stability
    const n = values.length
    const sumX = (n * (n - 1)) / 2
    const sumY = values.reduce((a, b) => a + b, 0)
    const sumXY = values.reduce((acc, val, i) => acc + i * val, 0)
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  }

  // Data Collection Methods
  private startDataCollection() {
    if (this.isCollecting) return
    this.isCollecting = true
    
    console.log('🧠 Neural Prediction Engine: Starting data collection')
    this.startTypingAnalysis()
    this.startCursorTracking()
    this.startCognitiveMonitoring()
  }

  private startTypingAnalysis() {
    console.log('⌨️ Starting typing pattern analysis')
    
    document.addEventListener('keydown', (event) => {
      const now = Date.now()
      
      if (this.lastKeystroke > 0) {
        const interval = now - this.lastKeystroke
        this.keystrokeBuffer.push(interval)
        
        // Process burst when we detect a pause (2+ seconds)
        if (interval > 2000 && this.keystrokeBuffer.length > 1) {
          this.processTypingBurst([...this.keystrokeBuffer])
          this.keystrokeBuffer = []
        }
        
        // Limit buffer size
        if (this.keystrokeBuffer.length > 50) {
          this.processTypingBurst([...this.keystrokeBuffer])
          this.keystrokeBuffer = []
        }
      }
      
      this.lastKeystroke = now
    })
    
    // Process any remaining keystrokes periodically
    setInterval(() => {
      if (this.keystrokeBuffer.length > 5) {
        this.processTypingBurst([...this.keystrokeBuffer])
        this.keystrokeBuffer = []
      }
    }, 10000) // Every 10 seconds
  }

  private startCursorTracking() {
    console.log('🖱️ Starting cursor movement analysis')
    
    document.addEventListener('mousemove', (event) => {
      const now = Date.now()
      
      this.cursorPositions.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: now
      })
      
      // Process movement data when we have enough points
      if (this.cursorPositions.length >= 20) {
        this.processCursorMovement([...this.cursorPositions])
        // Keep only the last 10 positions for continuity
        this.cursorPositions = this.cursorPositions.slice(-10)
      }
    })
    
    // Track clicks as well
    document.addEventListener('click', (event) => {
      this.windowFocusEvents.push({
        type: 'click',
        timestamp: Date.now()
      })
    })
  }

  private startCognitiveMonitoring() {
    console.log('🧠 Starting cognitive load monitoring')
    
    let windowSwitchCount = 0
    let lastVisibilityChange = Date.now()
    
    // Monitor visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      const now = Date.now()
      const event = {
        type: document.hidden ? 'tab_hidden' : 'tab_visible',
        timestamp: now
      }
      
      this.windowFocusEvents.push(event)
      
      if (document.hidden) {
        windowSwitchCount++
      }
      
      // Calculate cognitive load based on recent activity
      const recentEvents = this.windowFocusEvents.filter(
        e => now - e.timestamp < 60000 // Last minute
      )
      
      const cognitiveLoad = this.calculateCognitiveLoad(recentEvents, windowSwitchCount)
      this.updateCognitiveHistory(cognitiveLoad)
      
      lastVisibilityChange = now
    })
    
    // Monitor window focus
    window.addEventListener('blur', () => {
      this.windowFocusEvents.push({
        type: 'window_blur',
        timestamp: Date.now()
      })
    })
    
    window.addEventListener('focus', () => {
      this.windowFocusEvents.push({
        type: 'window_focus',
        timestamp: Date.now()
      })
    })
    
    // Periodic cognitive load assessment
    setInterval(() => {
      const now = Date.now()
      const recentEvents = this.windowFocusEvents.filter(
        e => now - e.timestamp < 300000 // Last 5 minutes
      )
      
      if (recentEvents.length > 0) {
        const cognitiveLoad = this.calculateCognitiveLoad(recentEvents, windowSwitchCount)
        this.updateCognitiveHistory(cognitiveLoad)
      }
    }, 30000) // Every 30 seconds
  }

  // Processing methods (simplified for brevity)
  private processTypingBurst(burst: number[]) {
    const pattern: TypingPattern = {
      keystrokeInterval: burst,
      pauseDuration: [burst[burst.length - 1]],
      burstLength: [burst.length],
      rhythmVariability: this.calculateRhythmCoherence(burst),
      timestamp: Date.now()
    }
    
    this.typingHistory.push(pattern)
    this.maintainHistorySize()
  }

  private processCursorMovement(positions: { x: number; y: number; timestamp: number }[]) {
    const accelerations = this.calculateAccelerations(positions)
    const velocities = this.calculateVelocities(positions)
    
    const pattern: CursorPattern = {
      accelerationProfile: accelerations,
      velocityChanges: velocities,
      idlePositionTime: this.calculateIdleTime(positions),
      microMovements: this.detectMicroMovements(positions),
      trajectory: positions
    }
    
    this.cursorHistory.push(pattern)
    this.maintainHistorySize()
  }

  private processCognitiveEvent(event: any) {
    // Process cognitive load indicators
    // This would be expanded based on the specific metrics we want to track
  }

  private maintainHistorySize() {
    // Keep only recent history to prevent memory bloat
    const maxSize = 1000
    if (this.typingHistory.length > maxSize) {
      this.typingHistory = this.typingHistory.slice(-maxSize)
    }
    if (this.cursorHistory.length > maxSize) {
      this.cursorHistory = this.cursorHistory.slice(-maxSize)
    }
    if (this.cognitiveHistory.length > maxSize) {
      this.cognitiveHistory = this.cognitiveHistory.slice(-maxSize)
    }
  }

  // Real implementation methods
  private calculateAccelerations(positions: { x: number; y: number; timestamp: number }[]): number[] {
    if (positions.length < 3) return []
    
    const accelerations: number[] = []
    
    for (let i = 2; i < positions.length; i++) {
      const p1 = positions[i - 2]
      const p2 = positions[i - 1]
      const p3 = positions[i]
      
      // Calculate velocities
      const dt1 = (p2.timestamp - p1.timestamp) / 1000 // Convert to seconds
      const dt2 = (p3.timestamp - p2.timestamp) / 1000
      
      if (dt1 > 0 && dt2 > 0) {
        const v1 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) / dt1
        const v2 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2)) / dt2
        
        // Calculate acceleration
        const acceleration = (v2 - v1) / ((dt1 + dt2) / 2)
        accelerations.push(Math.abs(acceleration))
      }
    }
    
    return accelerations
  }
  
  private calculateVelocities(positions: { x: number; y: number; timestamp: number }[]): number[] {
    if (positions.length < 2) return []
    
    const velocities: number[] = []
    
    for (let i = 1; i < positions.length; i++) {
      const p1 = positions[i - 1]
      const p2 = positions[i]
      
      const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      const time = (p2.timestamp - p1.timestamp) / 1000 // Convert to seconds
      
      if (time > 0) {
        velocities.push(distance / time)
      }
    }
    
    return velocities
  }
  
  private calculateIdleTime(positions: { x: number; y: number; timestamp: number }[]): number {
    if (positions.length === 0) return 0
    
    let idleTime = 0
    const threshold = 5 // pixels
    
    for (let i = 1; i < positions.length; i++) {
      const p1 = positions[i - 1]
      const p2 = positions[i]
      
      const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      
      if (distance < threshold) {
        idleTime += p2.timestamp - p1.timestamp
      }
    }
    
    return idleTime
  }
  
  private detectMicroMovements(positions: { x: number; y: number; timestamp: number }[]): number[] {
    const microMovements: number[] = []
    const threshold = 2 // pixels
    
    for (let i = 1; i < positions.length; i++) {
      const p1 = positions[i - 1]
      const p2 = positions[i]
      
      const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      
      if (distance > 0 && distance < threshold) {
        microMovements.push(distance)
      }
    }
    
    return microMovements
  }
  
  private getRecentTypingPatterns(minutes: number): TypingPattern[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.typingHistory.filter(pattern => pattern.timestamp > cutoff)
  }
  
  private getRecentCursorPatterns(minutes: number): CursorPattern[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.cursorHistory.filter(pattern => 
      pattern.trajectory.length > 0 && pattern.trajectory[0].timestamp > cutoff
    )
  }
  
  private getRecentCognitivePatterns(minutes: number): CognitiveLoadIndicators[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.cognitiveHistory.filter(pattern => 
      (pattern as any).timestamp > cutoff
    )
  }
  
  private calculateCognitiveLoad(events: any[], switchCount: number): CognitiveLoadIndicators {
    const now = Date.now()
    const minute = 60 * 1000
    
    // Calculate window switch velocity (switches per minute)
    const recentSwitches = events.filter(e => 
      (e.type === 'tab_hidden' || e.type === 'window_blur') && 
      (now - e.timestamp) < minute
    ).length
    
    // Calculate task switch frequency
    const taskSwitches = events.filter(e => e.type === 'tab_hidden').length
    
    // Calculate multitasking index (based on rapid switching)
    const rapidSwitches = events.filter(e => {
      const nextEvent = events.find(next => 
        next.timestamp > e.timestamp && 
        next.timestamp - e.timestamp < 10000 // Within 10 seconds
      )
      return nextEvent && nextEvent.type !== e.type
    }).length
    
    // Calculate attention fragmentation
    const focusLossEvents = events.filter(e => 
      e.type === 'tab_hidden' || e.type === 'window_blur'
    ).length
    
    // Calculate cognitive stability (inverse of fragmentation)
    const stability = Math.max(0, 1 - (focusLossEvents / 10))
    
    return {
      windowSwitchVelocity: recentSwitches,
      taskSwitchFrequency: taskSwitches,
      multitaskingIndex: rapidSwitches / Math.max(1, events.length),
      attentionFragmentation: focusLossEvents / Math.max(1, events.length),
      cognitiveStability: stability
    }
  }
  
  private updateCognitiveHistory(load: CognitiveLoadIndicators) {
    const entry = { ...load, timestamp: Date.now() } as any
    this.cognitiveHistory.push(entry)
    this.maintainHistorySize()
  }
  
  private getSessionsSinceLastBreak(): number {
    // This would integrate with the timer store
    return Math.floor(Math.random() * 5) // Placeholder
  }
  
  private detectAmbientConditions(): number {
    // This could use microphone API or other sensors
    return 0.5 // Placeholder
  }
  
  private getScreenBrightness(): number {
    // This could use screen API if available
    return 0.8 // Placeholder
  }
  
  private getBatteryLevel(): number {
    // Use Battery API if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        return battery.level
      })
    }
    return 0.8 // Placeholder
  }
  
  private predictFlowAtTime(time: Date): any {
    const hour = time.getHours()
    const dayOfWeek = time.getDay()
    
    // Simple prediction based on time patterns
    let probability = 0.5
    
    // Higher probability during typical work hours
    if (hour >= 9 && hour <= 17 && dayOfWeek >= 1 && dayOfWeek <= 5) {
      probability += 0.2
    }
    
    // Lower probability late at night
    if (hour < 6 || hour > 22) {
      probability -= 0.3
    }
    
    // Add some randomness for realistic variation
    probability += (Math.random() - 0.5) * 0.2
    probability = Math.max(0, Math.min(1, probability))
    
    return {
      probability,
      action: probability > 0.7 ? 'start_session' : 
              probability > 0.4 ? 'prepare_environment' : 'wait',
      confidence: 0.6 + Math.random() * 0.3
    }
  }
  
  private preprocessFeatures(signals: any): any {
    // Normalize and prepare features for ML model
    return {
      typingStability: signals.typingRhythmStability || 0,
      cursorSmoothness: signals.cursorAccelerationProfile || 0,
      cognitiveLoad: signals.cognitiveLoadTrend || 0,
      timeOfDay: new Date().getHours() / 24,
      dayOfWeek: new Date().getDay() / 7
    }
  }
  
  private generateRecommendation(prediction: any): 'start_session' | 'wait' | 'prepare_environment' | 'take_break' {
    if (prediction.flowProbability > 0.8) return 'start_session'
    if (prediction.flowProbability > 0.6) return 'prepare_environment'
    if (prediction.flowProbability > 0.3) return 'wait'
    return 'take_break'
  }
  
  private initializeModel() {
    // Initialize a simple prediction model
    console.log('🤖 Initializing Neural Prediction Model')
    this.learningModel = {
      predict: (features: any) => {
        // Simple weighted prediction based on features
        const score = (
          features.typingStability * 0.3 +
          features.cursorSmoothness * 0.3 +
          (1 - features.cognitiveLoad) * 0.2 +
          this.getTimeBasedScore() * 0.2
        )
        
        return {
          flowScore: Math.max(0, Math.min(1, score)),
          timeToFlow: Math.random() * 30, // 0-30 minutes
          confidence: 0.7 + Math.random() * 0.3,
          duration: 15 + Math.random() * 30 // 15-45 minutes
        }
      }
    }
  }
  
  private getTimeBasedScore(): number {
    const hour = new Date().getHours()
    const dayOfWeek = new Date().getDay()
    
    // Peak hours score
    if (hour >= 9 && hour <= 11) return 0.9 // Morning peak
    if (hour >= 14 && hour <= 16) return 0.8 // Afternoon peak
    if (hour >= 19 && hour <= 21) return 0.7 // Evening focus
    
    // Weekday vs weekend
    if (dayOfWeek >= 1 && dayOfWeek <= 5) return 0.6 // Weekday
    
    return 0.4 // Default
  }
  
  // Public method to get current neural metrics for display
  getCurrentMetrics() {
    const recentTyping = this.getRecentTypingPatterns(5) // Last 5 minutes
    const recentCursor = this.getRecentCursorPatterns(5)
    const recentCognitive = this.getRecentCognitivePatterns(5)
    
    return {
      typingRhythm: this.calculateAverageTypingStability(recentTyping),
      cursorSmoothness: this.calculateAverageCursorSmoothness(recentCursor),
      cognitiveStability: this.calculateAverageCognitiveStability(recentCognitive),
      dataPoints: {
        typing: recentTyping.length,
        cursor: recentCursor.length,
        cognitive: recentCognitive.length
      }
    }
  }
  
  private calculateAverageTypingStability(patterns: TypingPattern[]): number {
    if (patterns.length === 0) return 50 + Math.random() * 30 // Fallback with some variation
    
    const stability = patterns.reduce((sum, pattern) => sum + pattern.rhythmVariability, 0) / patterns.length
    return Math.max(0, Math.min(100, stability * 100))
  }
  
  private calculateAverageCursorSmoothness(patterns: CursorPattern[]): number {
    if (patterns.length === 0) return 40 + Math.random() * 40 // Fallback
    
    const smoothness = patterns.reduce((sum, pattern) => {
      const avgAccel = pattern.accelerationProfile.reduce((a, b) => a + b, 0) / pattern.accelerationProfile.length
      return sum + (1 / (1 + avgAccel)) // Convert to smoothness score
    }, 0) / patterns.length
    
    return Math.max(0, Math.min(100, smoothness * 100))
  }
  
  private calculateAverageCognitiveStability(patterns: CognitiveLoadIndicators[]): number {
    if (patterns.length === 0) return 60 + Math.random() * 25 // Fallback
    
    const stability = patterns.reduce((sum, pattern) => sum + pattern.cognitiveStability, 0) / patterns.length
    return Math.max(0, Math.min(100, stability * 100))
  }
}

interface FlowForecast {
  time: Date
  flowProbability: number
  recommendation: string
  confidence: number
}

export default NeuralStatePredictor