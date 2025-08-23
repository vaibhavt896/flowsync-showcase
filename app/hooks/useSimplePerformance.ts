'use client'

import { useState, useEffect } from 'react'

interface SimpleMetrics {
  fps: number
  quality: 'high' | 'medium' | 'low'
  adaptiveBlur: number
  isGpuAccelerated: boolean
}

export function useSimplePerformance() {
  const [metrics, setMetrics] = useState<SimpleMetrics>({
    fps: 60,
    quality: 'high',
    adaptiveBlur: 20,
    isGpuAccelerated: true
  })

  useEffect(() => {
    // Simple GPU detection
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    setMetrics(prev => ({
      ...prev,
      isGpuAccelerated: !!gl
    }))
  }, [])

  return metrics
}