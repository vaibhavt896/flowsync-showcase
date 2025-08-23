import React from 'react'
import { AppleLiquidGlass, AppleLiquidButton, AppleLiquidCard } from '../ui/AppleLiquidGlass'
import { usePerformanceMonitoring, useCoreWebVitals } from '../../utils/performanceMonitor'

/**
 * Demonstration component showing accessible Apple Liquid Glass implementation
 * with WCAG compliance, performance monitoring, and graceful fallbacks
 */
export function AccessibleGlassDemo() {
  const performanceMetrics = usePerformanceMonitoring()
  const coreWebVitals = useCoreWebVitals()

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Accessible Apple Liquid Glass</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Production-ready implementation with WCAG compliance and performance optimization
        </p>
      </div>

      {/* Performance Metrics Display */}
      {performanceMetrics && (
        <AppleLiquidCard className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">FPS:</span> {performanceMetrics.fps}
            </div>
            <div>
              <span className="font-medium">Quality:</span> {performanceMetrics.glassQuality}
            </div>
            <div>
              <span className="font-medium">Cores:</span> {performanceMetrics.deviceCapabilities.hardwareConcurrency}
            </div>
            <div>
              <span className="font-medium">WebGL:</span> {performanceMetrics.deviceCapabilities.webglSupport ? '✓' : '✗'}
            </div>
          </div>
        </AppleLiquidCard>
      )}

      {/* Core Web Vitals */}
      {coreWebVitals.size > 0 && (
        <AppleLiquidCard className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {Array.from(coreWebVitals.entries()).map(([metric, value]) => (
              <div key={metric}>
                <span className="font-medium">{metric}:</span> {Math.round(value)}ms
              </div>
            ))}
          </div>
        </AppleLiquidCard>
      )}

      {/* Glass Materials Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Standard Glass */}
        <AppleLiquidGlass material="regular" className="p-6">
          <h3 className="text-lg font-semibold mb-2">Regular Glass</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Standard glass material with medium blur and transparency
          </p>
        </AppleLiquidGlass>

        {/* Accessible Glass - WCAG Compliant */}
        <div className="accessible-glass p-6">
          <h3 className="text-lg font-semibold mb-2">Accessible Glass</h3>
          <p className="text-sm">
            WCAG-compliant version with 4.5:1 contrast ratio for normal text
          </p>
        </div>

        {/* Large Text Accessible Glass */}
        <div className="accessible-glass-large-text p-6">
          <h2 className="text-xl font-bold mb-2">Large Text Glass</h2>
          <p className="text-base">
            3:1 contrast ratio for large text (18pt+)
          </p>
        </div>

        {/* Interactive Glass */}
        <AppleLiquidGlass material="thick" interactive className="p-6">
          <h3 className="text-lg font-semibold mb-2">Interactive Glass</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Hover and click for interactive effects
          </p>
        </AppleLiquidGlass>

        {/* Ultra Thick Glass */}
        <AppleLiquidGlass material="ultra-thick" blur="ultra" className="p-6">
          <h3 className="text-lg font-semibold mb-2">Ultra Glass</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Maximum blur and thickness for dramatic effect
          </p>
        </AppleLiquidGlass>

        {/* Thin Glass */}
        <AppleLiquidGlass material="thin" blur="light" className="p-6">
          <h3 className="text-lg font-semibold mb-2">Minimal Glass</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Subtle effect for performance-critical contexts
          </p>
        </AppleLiquidGlass>
      </div>

      {/* Button Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Glass Buttons</h2>
        
        <div className="flex flex-wrap gap-4">
          <AppleLiquidButton variant="primary" size="md">
            Primary Action
          </AppleLiquidButton>
          
          <AppleLiquidButton variant="secondary" size="md">
            Secondary Action
          </AppleLiquidButton>
          
          <AppleLiquidButton variant="ghost" size="md">
            Ghost Button
          </AppleLiquidButton>
          
          {/* Accessible Button Alternative */}
          <button className="accessible-glass-button">
            Accessible Button
          </button>
        </div>
      </div>

      {/* Cards Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Glass Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppleLiquidCard padding="lg">
            <h3 className="text-xl font-semibold mb-3">Standard Card</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This card uses the standard Apple Liquid Glass material with error boundaries 
              and graceful fallbacks for browsers that don't support backdrop-filter.
            </p>
            <div className="flex space-x-2">
              <AppleLiquidButton size="sm" variant="primary">
                Learn More
              </AppleLiquidButton>
              <AppleLiquidButton size="sm" variant="ghost">
                Dismiss
              </AppleLiquidButton>
            </div>
          </AppleLiquidCard>

          <div className="accessible-glass p-8">
            <h3 className="text-xl font-semibold mb-3">Accessible Card</h3>
            <p className="mb-4">
              This card maintains high contrast ratios and works with all accessibility 
              preferences including reduced transparency and reduced motion.
            </p>
            <div className="flex space-x-2">
              <button className="accessible-glass-button px-4 py-2 text-sm">
                Accessible Action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Documentation */}
      <AppleLiquidCard className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Implementation Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
              ✅ Accessibility Compliance
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• WCAG 2.1 AA compliant contrast ratios</li>
              <li>• 4.5:1 ratio for normal text (14pt-18pt)</li>
              <li>• 3:1 ratio for large text (18pt+)</li>
              <li>• Respects prefers-reduced-transparency</li>
              <li>• Respects prefers-reduced-motion</li>
              <li>• Supports prefers-contrast: high</li>
              <li>• Minimum 44px touch targets</li>
              <li>• Proper focus indicators</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
              🚀 Performance Optimizations
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Real-time FPS monitoring</li>
              <li>• Adaptive quality based on device</li>
              <li>• Core Web Vitals tracking</li>
              <li>• GPU acceleration with translateZ(0)</li>
              <li>• CSS containment for paint optimization</li>
              <li>• Critical CSS for above-fold content</li>
              <li>• Mobile-specific optimizations</li>
              <li>• Error boundaries with fallbacks</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
            📱 Browser Compatibility
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="font-medium">Safari 14+</div>
              <div className="text-green-600">Full Support</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="font-medium">Chrome 76+</div>
              <div className="text-green-600">Full Support</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="font-medium">Firefox 103+</div>
              <div className="text-green-600">Full Support</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="font-medium">Legacy</div>
              <div className="text-yellow-600">Fallback</div>
            </div>
          </div>
        </div>
      </AppleLiquidCard>
    </div>
  )
}

export default AccessibleGlassDemo