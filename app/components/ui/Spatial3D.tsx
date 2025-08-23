'use client'

import React, { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, OrbitControls, Environment } from '@react-three/drei'
import { Vector3 } from 'three'

interface Spatial3DElementProps {
  text?: string
  color?: string
  size?: number
  floatSpeed?: number
  rotationIntensity?: number
  floatIntensity?: number
  enableControls?: boolean
  className?: string
}

function FloatingText3D({ 
  text = 'FlowSync',
  color = '#3b82f6',
  size = 0.4,
  floatSpeed = 1.2,
  rotationIntensity = 0.15,
  floatIntensity = 0.3
}: Omit<Spatial3DElementProps, 'enableControls' | 'className'>) {
  const textRef = useRef<any>()
  
  useFrame((state) => {
    if (textRef.current) {
      // Subtle breathing effect for productivity focus
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
      textRef.current.scale.setScalar(1 + breathe)
    }
  })

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={rotationIntensity}
      floatIntensity={floatIntensity}
    >
      <Text
        ref={textRef}
        font="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"
        fontSize={size}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        {text}
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </Text>
    </Float>
  )
}

function ProductivitySphere({ position }: { position: Vector3 }) {
  const sphereRef = useRef<any>()
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.3
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={sphereRef} position={position}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.6}
          metalness={0.8}
          roughness={0.2}
          emissive="#8b5cf6"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  )
}

export function Spatial3DElement({
  text = 'Productivity',
  color = '#3b82f6',
  size = 0.4,
  floatSpeed = 1.2,
  rotationIntensity = 0.15,
  floatIntensity = 0.3,
  enableControls = false,
  className = ''
}: Spatial3DElementProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`w-full h-64 relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={() => setIsLoading(false)}
      >
        <Suspense fallback={null}>
          {/* Subtle ambient lighting for productivity focus */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.3} />
          <pointLight position={[-10, -10, -10]} intensity={0.1} color="#8b5cf6" />
          
          {/* Subtle environment for reflections */}
          <Environment preset="studio" environmentIntensity={0.2} />

          {/* Main floating text */}
          <FloatingText3D
            text={text}
            color={color}
            size={size}
            floatSpeed={floatSpeed}
            rotationIntensity={rotationIntensity}
            floatIntensity={floatIntensity}
          />

          {/* Accent geometric elements */}
          <ProductivitySphere position={new Vector3(2, 1, -1)} />
          <ProductivitySphere position={new Vector3(-2, -0.5, 1)} />

          {/* Optional orbit controls for interaction */}
          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
              autoRotate
              autoRotateSpeed={0.5}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="text-white/70 text-sm animate-pulse">Loading 3D...</div>
        </div>
      )}
    </div>
  )
}

// Lightweight CSS-only spatial element for performance-critical areas
export function CSSTransform3D({ 
  children, 
  depth = 0, 
  rotateX = 0, 
  rotateY = 0,
  className = '' 
}: {
  children: React.ReactNode
  depth?: number
  rotateX?: number
  rotateY?: number
  className?: string
}) {
  return (
    <div
      className={`transform-gpu ${className}`}
      style={{
        transform: `perspective(1000px) translateZ(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  )
}

// Productivity-focused subtle depth card
export function DepthCard({ 
  children, 
  className = '',
  hover = true,
  depth = 20
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
  depth?: number
}) {
  return (
    <div
      className={`
        relative transform-gpu transition-all duration-300 ease-out
        ${hover ? 'hover:scale-105 hover:-translate-y-2' : ''}
        ${className}
      `}
      style={{
        transform: `perspective(800px) translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))'
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
      {/* Subtle depth indicator */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg -z-10"
        style={{
          transform: `translateZ(-${depth/2}px)`,
        }}
      />
    </div>
  )
}

// Additional components for showcase and productivity focus
export function Spatial3DContainer({
  height = '300px',
  productivity = 85,
  focus = 78,
  data = [],
  enableControls = false,
  className = ''
}: {
  height?: string
  productivity?: number
  focus?: number
  data?: number[]
  enableControls?: boolean
  className?: string
}) {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <Spatial3DElement
        text={`${productivity}%`}
        color="#3b82f6"
        size={0.3}
        enableControls={enableControls}
        className="h-full"
      />
      
      {/* Productivity data visualization overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg p-3">
        <div className="flex justify-between text-white/80 text-sm">
          <span>Productivity: {productivity}%</span>
          <span>Focus: {focus}%</span>
        </div>
        <div className="flex gap-1 mt-2">
          {data.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-blue-500/30 rounded-sm"
              style={{ height: `${(value / 100) * 20}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Spatial3DCard({ 
  children, 
  className = '',
  depth = 15
}: {
  children: React.ReactNode
  className?: string
  depth?: number
}) {
  return (
    <DepthCard 
      className={className}
      depth={depth}
      hover={true}
    >
      {children}
    </DepthCard>
  )
}

export function Spatial3DIcon({ 
  icon: Icon, 
  color = '#3b82f6', 
  size = 24,
  className = ''
}: {
  icon: React.ComponentType<any>
  color?: string
  size?: number
  className?: string
}) {
  return (
    <CSSTransform3D 
      depth={10}
      className={`inline-block transform-gpu transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${className}`}
    >
      <div 
        className="p-2 rounded-lg"
        style={{
          backgroundColor: `${color}20`,
          border: `1px solid ${color}40`,
          boxShadow: `0 4px 12px ${color}30`,
        }}
      >
        <Icon 
          size={size} 
          style={{ color }}
          className="drop-shadow-sm"
        />
      </div>
    </CSSTransform3D>
  )
}

export default Spatial3DElement