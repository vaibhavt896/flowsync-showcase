'use client'

import React, { useRef, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useGSAPWithCleanup } from '@/hooks/useAdvancedMemoryManager'
import { useProgressiveLoad } from '@/hooks/useConditionalLoad'

/**
 * Ultra Animations - Most advanced effects with WebGL integration
 * Highest GPU usage, loaded only when absolutely necessary
 */

interface UltraAnimationProps {
  children?: React.ReactNode
  className?: string
}

export function UltraParticleSystem({ className = '' }: UltraAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()
  
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particleCount = 100
    const particles: HTMLDivElement[] = []

    // Create ultra-high particle count system
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute gpu-accelerated'
      particle.style.cssText = `
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: hsl(${Math.random() * 360}, 70%, 60%);
        border-radius: 50%;
        pointer-events: none;
      `
      
      container.appendChild(particle)
      particles.push(particle)

      // Ultra complex animation path
      const path = `M${Math.random() * 400},${Math.random() * 300} Q${Math.random() * 400},${Math.random() * 300} ${Math.random() * 400},${Math.random() * 300}`
      
      animate(particle, {
        motionPath: {
          path: path,
          autoRotate: true
        },
        scale: [0.5, 2, 0.5],
        opacity: [0, 1, 0],
        duration: Math.random() * 5 + 3,
        repeat: -1,
        ease: 'none'
      }, `ultra-particle-${i}`)
    }

    return () => {
      particles.forEach(p => p.remove())
    }
  }, [animate])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden webgl-container ${className}`}
      style={{ height: '400px', width: '100%' }}
    />
  )
}

export function HolographicCard({ 
  children, 
  className = '' 
}: UltraAnimationProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10
        
        animate(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.1
        }, 'holographic-tilt')
      }

      const handleMouseLeave = () => {
        animate(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, 'holographic-reset')
      }

      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [animate])

  return (
    <div
      ref={cardRef}
      className={`complex-animation relative ${className}`}
      style={{
        background: 'linear-gradient(45deg, rgba(255,0,150,0.1), rgba(0,255,255,0.1))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 opacity-20 animate-pulse" />
      {children}
    </div>
  )
}

export function QuantumLoader({ className = '' }: UltraAnimationProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (loaderRef.current) {
      const rings = loaderRef.current.querySelectorAll('.quantum-ring')
      
      rings.forEach((ring, index) => {
        animate(ring, {
          rotation: 360,
          scale: [1, 1.2, 1],
          opacity: [0.3, 1, 0.3],
          duration: 2 + index * 0.3,
          repeat: -1,
          ease: 'none'
        }, `quantum-ring-${index}`)
      })
    }
  }, [animate])

  return (
    <div ref={loaderRef} className={`relative w-24 h-24 ${className}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="quantum-ring absolute inset-0 border-2 rounded-full gpu-accelerated"
          style={{
            borderColor: `hsl(${i * 60 + 200}, 70%, 60%)`,
            borderTopColor: 'transparent',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}

export function NeuralNetwork({ className = '' }: UltraAnimationProps) {
  const networkRef = useRef<SVGSVGElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (networkRef.current) {
      const nodes = Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 300,
        y: Math.random() * 200,
        id: i
      }))

      const svg = networkRef.current
      
      // Create animated connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((otherNode, j) => {
          if (Math.random() > 0.7) { // 30% connection probability
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            line.setAttribute('x1', node.x.toString())
            line.setAttribute('y1', node.y.toString())
            line.setAttribute('x2', otherNode.x.toString())
            line.setAttribute('y2', otherNode.y.toString())
            line.setAttribute('stroke', '#3b82f6')
            line.setAttribute('stroke-width', '1')
            line.setAttribute('opacity', '0')
            
            svg.appendChild(line)
            
            animate(line, {
              opacity: [0, 0.6, 0],
              strokeWidth: [1, 3, 1],
              duration: Math.random() * 3 + 2,
              repeat: -1,
              delay: Math.random() * 2
            }, `neural-connection-${i}-${j}`)
          }
        })

        // Create animated nodes
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', node.x.toString())
        circle.setAttribute('cy', node.y.toString())
        circle.setAttribute('r', '3')
        circle.setAttribute('fill', '#8b5cf6')
        
        svg.appendChild(circle)
        
        animate(circle, {
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
          duration: Math.random() * 2 + 1,
          repeat: -1,
          delay: Math.random()
        }, `neural-node-${i}`)
      })
    }
  }, [animate])

  return (
    <svg
      ref={networkRef}
      className={`webgl-container ${className}`}
      width="300"
      height="200"
      viewBox="0 0 300 200"
    />
  )
}

export function DimensionalPortal({ className = '' }: UltraAnimationProps) {
  const portalRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (portalRef.current) {
      const rings = portalRef.current.querySelectorAll('.portal-ring')
      
      rings.forEach((ring, index) => {
        animate(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          scale: [0.8, 1.2, 0.8],
          filter: [
            'hue-rotate(0deg) saturate(1)',
            'hue-rotate(180deg) saturate(1.5)',
            'hue-rotate(360deg) saturate(1)'
          ],
          duration: 4 + index,
          repeat: -1,
          ease: 'none'
        }, `portal-ring-${index}`)
      })
    }
  }, [animate])

  return (
    <div
      ref={portalRef}
      className={`relative w-32 h-32 ${className}`}
      style={{ perspective: '1000px' }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="portal-ring absolute inset-0 border rounded-full gpu-accelerated"
          style={{
            borderWidth: `${2 + i}px`,
            borderColor: `hsl(${i * 40 + 200}, 80%, 60%)`,
            borderStyle: 'dashed',
            transform: `translateZ(${i * -10}px) scale(${1 - i * 0.1})`
          }}
        />
      ))}
    </div>
  )
}

// Ultra complex component with progressive loading
export function UltraComplexScene({ className = '' }: UltraAnimationProps) {
  const { Component, isLoading, bindProps } = useProgressiveLoad(
    () => Promise.resolve({
      default: () => (
        <div className="space-y-8">
          <UltraParticleSystem />
          <div className="grid grid-cols-2 gap-4">
            <HolographicCard>
              <div className="p-6">
                <QuantumLoader />
              </div>
            </HolographicCard>
            <div className="space-y-4">
              <NeuralNetwork />
              <DimensionalPortal />
            </div>
          </div>
        </div>
      )
    }),
    {
      triggers: ['hover', 'click'],
      engagementThreshold: 3,
      priority: 'low',
      delay: 1000
    }
  )

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-300/50 rounded" />
          <div className="h-24 bg-gray-300/50 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className={className} {...bindProps}>
      <Suspense fallback={<div>Loading ultra animations...</div>}>
        {Component && <Component />}
      </Suspense>
    </div>
  )
}

const UltraAnimations = {
  UltraParticleSystem,
  HolographicCard,
  QuantumLoader,
  NeuralNetwork,
  DimensionalPortal,
  UltraComplexScene
}

export default UltraAnimations