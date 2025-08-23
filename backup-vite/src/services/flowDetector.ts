import { FlowState, ActivityMetrics } from '@/types'
import { useFlowStore } from '@/stores/flowStore'
import { useTimerStore } from '@/stores/timerStore'

export class FlowDetector {
  private isRunning = false
  private detectionInterval: NodeJS.Timeout | null = null
  private flowHistory: number[] = []
  private lastFlowState: FlowState | null = null

  // Flow detection parameters
  private readonly FLOW_THRESHOLD = 0.6
  private readonly FLOW_CONFIRMATION_PERIODS = 3
  private readonly DETECTION_INTERVAL = 10000 // 10 seconds
  
  start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    this.detectionInterval = setInterval(() => {
      this.detectFlowState()
    }, this.DETECTION_INTERVAL)
    
    console.log('Flow detection started')
  }

  stop(): void {
    if (!this.isRunning) return
    
    this.isRunning = false
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval)
      this.detectionInterval = null
    }
    
    console.log('Flow detection stopped')
  }

  private detectFlowState(): void {
    const flowStore = useFlowStore.getState()
    const timerStore = useTimerStore.getState()
    
    // Only detect flow during focus sessions
    if (!timerStore.currentSession || timerStore.currentSession.type !== 'focus') {
      return
    }

    const recentMetrics = flowStore.activityMetrics.slice(0, 5) // Last 5 metrics (2.5 minutes)
    if (recentMetrics.length < 2) return

    const flowScore = this.calculateFlowScore(recentMetrics)
    const isInFlow = this.determineFlowState(flowScore)
    const confidence = this.calculateConfidence(recentMetrics, flowScore)

    const newFlowState: FlowState = {
      isInFlow,
      flowScore,
      detectionMethod: 'hybrid',
      confidence,
      startTime: isInFlow && !this.lastFlowState?.isInFlow ? new Date() : this.lastFlowState?.startTime,
    }

    // Update flow state if significant change
    if (!this.lastFlowState || 
        this.lastFlowState.isInFlow !== newFlowState.isInFlow ||
        Math.abs(this.lastFlowState.flowScore - newFlowState.flowScore) > 0.1) {
      
      flowStore.updateFlowState(newFlowState)
      this.lastFlowState = newFlowState
      
      // Trigger notifications or UI updates if needed
      this.handleFlowStateChange(newFlowState)
    }
  }

  private calculateFlowScore(metrics: ActivityMetrics[]): number {
    if (metrics.length === 0) return 0

    // Activity consistency score (30%)
    const activityScore = this.calculateActivityScore(metrics)
    
    // Focus consistency score (40%)
    const focusScore = this.calculateFocusScore(metrics)
    
    // Typing rhythm score (30%)
    const rhythmScore = this.calculateRhythmScore(metrics)

    return activityScore * 0.3 + focusScore * 0.4 + rhythmScore * 0.3
  }

  private calculateActivityScore(metrics: ActivityMetrics[]): number {
    // Steady activity without extremes indicates flow
    const keystrokeCounts = metrics.map(m => m.keystrokes)
    const mouseCounts = metrics.map(m => m.mouseMovements)
    
    const avgKeystrokes = keystrokeCounts.reduce((a, b) => a + b, 0) / keystrokeCounts.length
    const avgMouse = mouseCounts.reduce((a, b) => a + b, 0) / mouseCounts.length
    
    // Calculate consistency (lower variance = higher flow)
    const keystrokeVariance = this.calculateVariance(keystrokeCounts)
    const mouseVariance = this.calculateVariance(mouseCounts)
    
    // Normalize and combine
    const keystrokeConsistency = Math.max(0, 1 - keystrokeVariance / Math.max(1, avgKeystrokes))
    const mouseConsistency = Math.max(0, 1 - mouseVariance / Math.max(1, avgMouse))
    
    // Activity level component
    const activityLevel = Math.min(1, (avgKeystrokes + avgMouse) / 50)
    
    return (keystrokeConsistency * 0.4 + mouseConsistency * 0.3 + activityLevel * 0.3)
  }

  private calculateFocusScore(metrics: ActivityMetrics[]): number {
    const avgIdleTime = metrics.reduce((sum, m) => sum + m.idleTime, 0) / metrics.length
    const avgWindowSwitches = metrics.reduce((sum, m) => sum + m.windowSwitches, 0) / metrics.length
    
    // Low idle time and window switches indicate focus
    const idleScore = Math.max(0, 1 - avgIdleTime / 60) // Penalize more than 1 minute idle
    const switchScore = Math.max(0, 1 - avgWindowSwitches / 5) // Penalize more than 5 switches per period
    
    return (idleScore * 0.7 + switchScore * 0.3)
  }

  private calculateRhythmScore(metrics: ActivityMetrics[]): number {
    if (metrics.length < 3) return 0.5
    
    // Look for steady typing rhythm
    const keystrokeRates = metrics.map(m => m.keystrokes / 30) // Per second
    const intervals = []
    
    for (let i = 1; i < keystrokeRates.length; i++) {
      intervals.push(Math.abs(keystrokeRates[i] - keystrokeRates[i - 1]))
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = this.calculateVariance(intervals)
    
    // Lower variance in typing intervals suggests flow rhythm
    return Math.max(0, 1 - variance / Math.max(0.1, avgInterval))
  }

  private calculateVariance(numbers: number[]): number {
    const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length
    const squaredDiffs = numbers.map(n => Math.pow(n - avg, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length
  }

  private determineFlowState(flowScore: number): boolean {
    // Add to history
    this.flowHistory.push(flowScore)
    if (this.flowHistory.length > 10) {
      this.flowHistory.shift()
    }

    // Need confirmation periods to enter flow
    if (flowScore >= this.FLOW_THRESHOLD) {
      const recentHighScores = this.flowHistory.slice(-this.FLOW_CONFIRMATION_PERIODS)
      return recentHighScores.length >= this.FLOW_CONFIRMATION_PERIODS &&
             recentHighScores.every(score => score >= this.FLOW_THRESHOLD)
    }

    // Exit flow if score drops significantly
    if (this.lastFlowState?.isInFlow && flowScore < this.FLOW_THRESHOLD * 0.8) {
      return false
    }

    return this.lastFlowState?.isInFlow || false
  }

  private calculateConfidence(metrics: ActivityMetrics[], flowScore: number): number {
    // Confidence based on data quality and consistency
    const dataQuality = Math.min(1, metrics.length / 5) // More data = higher confidence
    const scoreStability = this.flowHistory.length > 1 ? 
      1 - Math.abs(flowScore - this.flowHistory[this.flowHistory.length - 2]) : 0.5
    
    return Math.min(1, dataQuality * 0.6 + scoreStability * 0.4)
  }

  private handleFlowStateChange(newFlowState: FlowState): void {
    const timerStore = useTimerStore.getState()
    
    // Flow state entered - might want to extend timer or disable notifications
    if (newFlowState.isInFlow && !this.lastFlowState?.isInFlow) {
      console.log('Flow state detected - protecting deep work')
      
      // Could trigger flow protection features here
      this.onFlowEntered(newFlowState)
    }
    
    // Flow state ended - good time for break suggestions
    if (!newFlowState.isInFlow && this.lastFlowState?.isInFlow) {
      console.log('Flow state ended - break opportunity detected')
      
      this.onFlowExited(newFlowState)
    }
  }

  private onFlowEntered(flowState: FlowState): void {
    // Flow protection logic
    // - Disable non-critical notifications
    // - Enable website blocking if configured
    // - Potentially extend current session if near completion
    
    const timerStore = useTimerStore.getState()
    if (timerStore.currentSession && timerStore.timeRemaining < 5 * 60) {
      // If less than 5 minutes remaining, we might suggest extending
      console.log('Consider extending session - user in flow state')
    }
  }

  private onFlowExited(flowState: FlowState): void {
    // Break suggestion logic
    // - Natural break point detected
    // - Could suggest micro-break or session completion
    
    const duration = flowState.duration || 0
    if (duration > 15 * 60 * 1000) { // 15+ minutes of flow
      console.log('Significant flow session ended - suggest break')
    }
  }

  // Public methods for external use
  getCurrentFlowScore(): number {
    return this.flowHistory.length > 0 ? this.flowHistory[this.flowHistory.length - 1] : 0
  }

  isInFlow(): boolean {
    return this.lastFlowState?.isInFlow || false
  }

  getFlowDuration(): number {
    if (!this.lastFlowState?.isInFlow || !this.lastFlowState.startTime) return 0
    return Date.now() - new Date(this.lastFlowState.startTime).getTime()
  }
}