'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import 3D components to prevent SSR issues
const Spatial3DElement = dynamic(() => import('./Spatial3D'), {
  ssr: false,
  loading: () => (
    <div className="h-48 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg animate-pulse">
      <div className="text-white/60 text-sm">Loading 3D Visualization...</div>
    </div>
  )
})

interface ClientOnly3DProps {
  text?: string
  color?: string
  size?: number
  floatSpeed?: number
  rotationIntensity?: number
  floatIntensity?: number
  className?: string
}

export function ClientOnly3D(props: ClientOnly3DProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-48 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
        <div className="text-white/60 text-sm animate-pulse">Loading 3D Visualization...</div>
      </div>
    )
  }

  return <Spatial3DElement {...props} />
}

export default ClientOnly3D