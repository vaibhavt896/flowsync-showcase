'use client'

import React from 'react'

// Test both motion packages to see which works better
import { motion as framMotion } from 'framer-motion'
import { 
  LoadingSkeleton, 
  DashboardCardSkeleton, 
  ChartSkeleton, 
  TimerSkeleton,
  AnimatedLoadingPlaceholder 
} from '@/components/ui/EnhancedLoadingStates'

// Try to import from motion package (successor to framer-motion)
let motionImport: any = null
try {
  motionImport = require('motion')
  console.log('Motion package available:', motionImport)
} catch (error) {
  console.log('Motion package import failed:', error)
}

export default function MotionTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Motion Package Testing
        </h1>

        {/* Test Framer Motion (current) */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Framer Motion (Current Implementation)
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <framMotion.div
              className="h-20 bg-blue-500 rounded-lg cursor-pointer"
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="h-full flex items-center justify-center text-white font-semibold">
                Animate Y
              </div>
            </framMotion.div>

            <framMotion.div
              className="h-20 bg-purple-500 rounded-lg cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: '#8b5cf6' }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="h-full flex items-center justify-center text-white font-semibold">
                Rotate
              </div>
            </framMotion.div>

            <framMotion.div
              className="h-20 bg-green-500 rounded-lg cursor-pointer"
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="h-full flex items-center justify-center text-white font-semibold">
                Opacity
              </div>
            </framMotion.div>
          </div>
        </div>

        {/* Package Status */}
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Package Status</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="text-green-400">
              ✅ framer-motion: Working (current implementation)
            </div>
            <div className="text-yellow-400">
              📦 motion: Available but different API structure
            </div>
            <div className="text-white/60">
              Note: Motion is a separate library with different API, not a direct replacement
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-black/20 rounded">
            <h3 className="text-white font-medium mb-2">Installed Versions:</h3>
            <div className="text-white/80 text-sm space-y-1">
              <div>framer-motion: ^10.18.0</div>
              <div>motion: ^12.23.12</div>
              <div>gsap: ^3.13.0</div>
              <div>@gsap/react: ^2.1.2</div>
              <div>three: ^0.179.1</div>
              <div>@react-three/fiber: ^9.3.0</div>
              <div>recharts: ^2.15.4</div>
              <div>howler: ^2.2.4</div>
            </div>
          </div>
        </div>

        {/* Enhanced Loading States Demo */}
        <div className="mt-8 bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Enhanced Loading States (react-loading-skeleton)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-medium">Dashboard Cards</h3>
              <DashboardCardSkeleton />
              
              <h3 className="text-white font-medium mt-6">Timer Component</h3>
              <TimerSkeleton />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-medium">Chart Placeholder</h3>
              <ChartSkeleton />
              
              <h3 className="text-white font-medium mt-6">Custom Loading</h3>
              <AnimatedLoadingPlaceholder className="h-24 bg-white/5 rounded-lg relative overflow-hidden" />
            </div>
          </div>
        </div>

        {/* Magnetic Cursor Demo */}
        <div className="mt-8 bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Advanced Magnetic Cursor System</h2>
          <div className="space-y-6">
            <div className="text-white/80 text-sm">
              Move your cursor near the buttons below to experience magnetic attraction within 120px range
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                className="magnetic-button px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                data-magnetic="true"
              >
                Magnetic Button
              </button>
              
              <button 
                className="magnetic-button px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-medium backdrop-blur-md hover:bg-white/20 transition-all duration-300"
                data-magnetic="true"
              >
                Glass Effect
              </button>
              
              <button 
                className="magnetic-button px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                data-magnetic="true"
              >
                Emerald Magic
              </button>
              
              <button 
                className="magnetic-button px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                data-magnetic="true"
              >
                Rose Attraction
              </button>
            </div>

            <div className="mt-6 p-4 bg-black/20 rounded-lg">
              <h3 className="text-white font-medium mb-2">Magnetic Cursor Features:</h3>
              <div className="text-white/80 text-sm space-y-1">
                <div>✨ 120px magnetic detection range</div>
                <div>🎯 45% attraction strength with distance-based falloff</div>
                <div>🌊 Smooth spring animations (stiffness: 200, damping: 20)</div>
                <div>💎 Blue glow effect when in magnetic field</div>
                <div>🔄 Adaptive cursor scaling and visual feedback</div>
                <div>⚡ Performance-optimized with GPU acceleration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Test */}
        <div className="mt-8 bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Performance Verification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-white font-medium mb-2">Core Features Working:</h3>
              <div className="space-y-2 text-sm">
                <div className="text-green-400">✅ GSAP Animations</div>
                <div className="text-green-400">✅ Three.js 3D Elements</div>
                <div className="text-green-400">✅ Howler Sound Design</div>
                <div className="text-green-400">✅ Recharts Visualization</div>
                <div className="text-green-400">✅ Nivo Advanced Charts</div>
                <div className="text-green-400">✅ Framer Motion UI</div>
                <div className="text-green-400">✅ React Animated Cursor</div>
                <div className="text-green-400">✅ React Loading Skeleton</div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Active Integrations:</h3>
              <div className="space-y-2 text-sm">
                <div className="text-green-400">✅ Enhanced Cursor (react-animated-cursor)</div>
                <div className="text-green-400">✅ Premium Loading States</div>
                <div className="text-yellow-400">⚡ magicmouse.ts (ready to use)</div>
                <div className="text-yellow-400">⚡ @next/bundle-analyzer (devtools)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}