'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { useQueryClient, useMutation, QueryKey } from '@tanstack/react-query'
import { getSyncEngine } from '@/services/syncEngine'

/**
 * Industry-leading optimistic update patterns inspired by Linear, Arc Browser, and Raycast
 * Provides immediate UI feedback with intelligent rollback and conflict resolution
 */

interface OptimisticState<T = any> {
  data: T
  isPending: boolean
  error: Error | null
  rollbackData?: T
}

interface UseOptimisticUpdateOptions<T, R> {
  queryKey: QueryKey
  mutationFn: (variables: T) => Promise<R>
  updateFn?: (previous: any, variables: T) => any
  rollbackDelay?: number
  enableSync?: boolean
  onSuccess?: (data: R, variables: T, context: any) => void
  onError?: (error: Error, variables: T, context: any) => void
  onSettled?: (data: R | undefined, error: Error | null, variables: T, context: any) => void
}

/**
 * Linear-inspired optimistic update hook with intelligent rollback
 */
export function useOptimisticUpdate<T, R>(
  options: UseOptimisticUpdateOptions<T, R>
) {
  const queryClient = useQueryClient()
  const syncEngine = getSyncEngine()
  const rollbackTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const mutation = useMutation({
    mutationFn: options.mutationFn,
    onMutate: async (variables: T) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: options.queryKey })
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(options.queryKey)
      
      // Optimistically update to the new value
      queryClient.setQueryData(options.queryKey, (old: any) => {
        return options.updateFn ? options.updateFn(old, variables) : { ...old, ...variables }
      })

      // Apply to sync engine if enabled
      if (options.enableSync) {
        syncEngine.applyAction({
          type: 'optimistic-update',
          payload: { queryKey: options.queryKey, variables, previousData }
        })
      }

      return { previousData }
    },
    onError: (error: Error, variables: T, context: any) => {
      // Rollback to previous state
      if (context?.previousData) {
        queryClient.setQueryData(options.queryKey, context.previousData)
      }
      
      options.onError?.(error, variables, context)
    },
    onSuccess: (data: R, variables: T, context: any) => {
      // Schedule delayed confirmation to show optimistic feedback
      const rollbackId = Math.random().toString(36)
      const timeout = setTimeout(() => {
        // Confirm the update after delay to show responsiveness
        queryClient.setQueryData(options.queryKey, data)
        rollbackTimeouts.current.delete(rollbackId)
      }, options.rollbackDelay || 150)
      
      rollbackTimeouts.current.set(rollbackId, timeout)
      
      options.onSuccess?.(data, variables, context)
    },
    onSettled: (data: R | undefined, error: Error | null, variables: T, context: any) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: options.queryKey })
      
      options.onSettled?.(data, error, variables, context)
    },
  })

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      rollbackTimeouts.current.forEach(timeout => clearTimeout(timeout))
      rollbackTimeouts.current.clear()
    }
  }, [])

  return mutation
}

/**
 * Arc Browser-inspired performance optimized state updates
 * Uses RAF and batching for 60fps interactions
 */
export function usePerformanceOptimizedState<T>(
  initialValue: T,
  options?: {
    batchUpdates?: boolean
    useRAF?: boolean
    throttleMs?: number
  }
) {
  const [state, setState] = useState<T>(initialValue)
  const pendingUpdates = useRef<T[]>([])
  const rafId = useRef<number>()
  const lastUpdate = useRef<number>(0)

  const flushUpdates = useCallback(() => {
    if (pendingUpdates.current.length === 0) return

    // Batch all pending updates
    const finalUpdate = pendingUpdates.current.reduce((acc, update) => {
      return typeof update === 'function' ? update(acc) : { ...acc, ...update }
    }, state)

    setState(finalUpdate)
    pendingUpdates.current = []
    rafId.current = undefined
  }, [state])

  const optimizedSetState = useCallback((update: T | ((prev: T) => T)) => {
    const now = Date.now()
    const throttleMs = options?.throttleMs || 16 // 60fps default

    if (options?.batchUpdates) {
      pendingUpdates.current.push(update as T)

      if (options?.useRAF && !rafId.current) {
        rafId.current = requestAnimationFrame(flushUpdates)
      } else if (!options?.useRAF && now - lastUpdate.current > throttleMs) {
        flushUpdates()
        lastUpdate.current = now
      }
    } else {
      setState(update)
    }
  }, [flushUpdates, options])

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return [state, optimizedSetState] as const
}

/**
 * Raycast-inspired extension communication pattern
 * Provides JSON-RPC style communication between components
 */
export function useExtensionMessaging<T = any, R = any>() {
  const messageHandlers = useRef<Map<string, (payload: T) => Promise<R> | R>>(new Map())
  const [isConnected, setIsConnected] = useState(true)

  const registerHandler = useCallback((method: string, handler: (payload: T) => Promise<R> | R) => {
    messageHandlers.current.set(method, handler)
  }, [])

  const unregisterHandler = useCallback((method: string) => {
    messageHandlers.current.delete(method)
  }, [])

  const sendMessage = useCallback(async (method: string, payload: T): Promise<R> => {
    const handler = messageHandlers.current.get(method)
    
    if (!handler) {
      throw new Error(`No handler registered for method: ${method}`)
    }

    try {
      const result = await handler(payload)
      return result
    } catch (error) {
      console.error(`Extension message handler error for ${method}:`, error)
      throw error
    }
  }, [])

  const broadcastMessage = useCallback((method: string, payload: T) => {
    // Simulate broadcasting to multiple handlers
    messageHandlers.current.forEach(async (handler, registeredMethod) => {
      if (registeredMethod.startsWith(method) || method === '*') {
        try {
          await handler(payload)
        } catch (error) {
          console.error(`Broadcast handler error for ${registeredMethod}:`, error)
        }
      }
    })
  }, [])

  return {
    registerHandler,
    unregisterHandler,
    sendMessage,
    broadcastMessage,
    isConnected
  }
}

/**
 * Linear-inspired sync hook with real-time updates
 */
export function useSyncEngine(lastSyncId: number = 0) {
  const queryClient = useQueryClient()
  const syncEngine = getSyncEngine()
  const [syncState, setSyncState] = useState(syncEngine.getState())

  useEffect(() => {
    const handleSyncApplied = (delta: any) => {
      // Invalidate affected queries
      queryClient.invalidateQueries()
    }

    const handleConnectionChanged = ({ online }: { online: boolean }) => {
      setSyncState(prev => ({ ...prev, isOnline: online }))
    }

    const handleActionApplied = (action: any) => {
      setSyncState(prev => ({ ...prev, lastSyncId: prev.lastSyncId + 1 }))
    }

    syncEngine.on('syncApplied', handleSyncApplied)
    syncEngine.on('connectionChanged', handleConnectionChanged)
    syncEngine.on('actionApplied', handleActionApplied)

    // Initial state sync
    setSyncState(syncEngine.getState())

    return () => {
      syncEngine.off('syncApplied', handleSyncApplied)
      syncEngine.off('connectionChanged', handleConnectionChanged) 
      syncEngine.off('actionApplied', handleActionApplied)
    }
  }, [syncEngine, queryClient])

  const applyAction = useCallback((type: string, payload: any) => {
    return syncEngine.applyAction({ type, payload })
  }, [syncEngine])

  return {
    syncState,
    applyAction,
    isOnline: syncState.isOnline,
    isConnected: syncState.isConnected,
    pendingCount: syncState.pendingActions.length
  }
}

/**
 * Hook for optimistic UI feedback with toast integration
 */
export function useOptimisticFeedback() {
  const showFeedback = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    // Enhanced feedback with better UX patterns
    const event = new CustomEvent('flowsync-feedback', {
      detail: { message, type, timestamp: Date.now() }
    })
    
    window.dispatchEvent(event)
    
    // Fallback console logging
    console.log(`${type.toUpperCase()}: ${message}`)
  }, [])

  const showOptimisticSuccess = useCallback((message: string) => {
    showFeedback(`✓ ${message}`, 'success')
  }, [showFeedback])

  const showOptimisticError = useCallback((message: string) => {
    showFeedback(`✗ ${message}`, 'error')
  }, [showFeedback])

  return { 
    showFeedback, 
    showOptimisticSuccess, 
    showOptimisticError 
  }
}