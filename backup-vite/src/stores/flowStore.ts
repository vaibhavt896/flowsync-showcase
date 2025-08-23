import { create } from 'zustand'
import { FlowState, ActivityMetrics } from '@/types'

interface FlowStore {
  currentFlowState: FlowState | null
  activityMetrics: ActivityMetrics[]
  flowSessions: FlowState[]
  
  // Actions
  updateFlowState: (flowState: FlowState) => void
  addActivityMetric: (metric: ActivityMetrics) => void
  startFlowSession: () => void
  endFlowSession: () => void
  getFlowHistory: (hours?: number) => FlowState[]
  calculateFlowScore: () => number
  isCurrentlyInFlow: () => boolean
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  currentFlowState: null,
  activityMetrics: [],
  flowSessions: [],

  updateFlowState: (flowState) => {
    set({ currentFlowState: flowState })
    
    // If flow state ended, add to sessions
    if (!flowState.isInFlow && get().currentFlowState?.isInFlow) {
      const endedSession: FlowState = {
        ...get().currentFlowState!,
        duration: Date.now() - new Date(get().currentFlowState!.startTime!).getTime()
      }
      
      set(state => ({
        flowSessions: [endedSession, ...state.flowSessions].slice(0, 100) // Keep last 100 sessions
      }))
    }
  },

  addActivityMetric: (metric) => {
    set(state => ({
      activityMetrics: [metric, ...state.activityMetrics].slice(0, 1000) // Keep last 1000 metrics
    }))
  },

  startFlowSession: () => {
    const flowState: FlowState = {
      isInFlow: true,
      flowScore: 0.5,
      detectionMethod: 'hybrid',
      confidence: 0.7,
      startTime: new Date(),
    }
    set({ currentFlowState: flowState })
  },

  endFlowSession: () => {
    const { currentFlowState } = get()
    if (currentFlowState && currentFlowState.isInFlow) {
      const endedSession: FlowState = {
        ...currentFlowState,
        isInFlow: false,
        duration: Date.now() - new Date(currentFlowState.startTime!).getTime()
      }
      
      set({ 
        currentFlowState: { ...endedSession },
        flowSessions: [endedSession, ...get().flowSessions].slice(0, 100)
      })
    }
  },

  getFlowHistory: (hours = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return get().flowSessions.filter(session => 
      session.startTime && new Date(session.startTime) > cutoff
    )
  },

  calculateFlowScore: () => {
    const recentMetrics = get().activityMetrics.slice(0, 10)
    if (recentMetrics.length === 0) return 0

    // Simple flow score calculation based on activity consistency
    const avgKeystrokes = recentMetrics.reduce((sum, m) => sum + m.keystrokes, 0) / recentMetrics.length
    const avgMouseMovements = recentMetrics.reduce((sum, m) => sum + m.mouseMovements, 0) / recentMetrics.length
    const avgIdleTime = recentMetrics.reduce((sum, m) => sum + m.idleTime, 0) / recentMetrics.length
    
    // High activity with low idle time suggests flow
    const activityScore = Math.min(1, (avgKeystrokes + avgMouseMovements) / 100)
    const focusScore = Math.max(0, 1 - avgIdleTime / 60) // Penalize idle time
    
    return (activityScore * 0.6 + focusScore * 0.4)
  },

  isCurrentlyInFlow: () => {
    return get().currentFlowState?.isInFlow || false
  },
}))