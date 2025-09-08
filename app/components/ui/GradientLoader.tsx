'use client'

import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import { motion } from 'framer-motion'

interface GradientLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  colorScheme?: 'primary' | 'golden' | 'pink' | 'custom'
  customColors?: {
    primary: string
    secondary: string
    accent: string
  }
  speed?: number
  autoplay?: boolean
  loop?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24', 
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
}

const colorSchemes = {
  primary: {
    primary: '#EF6F38', // Orange
    secondary: '#F3A340', // Golden
    accent: '#FFFFFF'
  },
  golden: {
    primary: '#F3A340', // Golden
    secondary: '#F0BB43', // Light Golden
    accent: '#FEF9E7'
  },
  pink: {
    primary: '#F088A3', // Pink
    secondary: '#EF6F38', // Orange
    accent: '#FEF7F7'
  },
  custom: {
    primary: '#EF6F38',
    secondary: '#F3A340', 
    accent: '#FFFFFF'
  }
}

export default function GradientLoader({
  size = 'md',
  colorScheme = 'primary',
  customColors,
  speed = 1,
  autoplay = true,
  loop = true,
  className = ''
}: GradientLoaderProps) {
  const [animationData, setAnimationData] = useState(null)
  const lottieRef = useRef(null)

  // Load and customize the animation data
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch('/lottie/gradient-loader.json')
        const data = await response.json()
        
        // Get color configuration
        const colors = customColors || colorSchemes[colorScheme]
        
        // Deep clone to avoid mutating original data
        const customizedData = JSON.parse(JSON.stringify(data))
        
        // Function to customize colors in Lottie data
        const customizeColors = (obj: any) => {
          if (Array.isArray(obj)) {
            obj.forEach(customizeColors)
          } else if (obj && typeof obj === 'object') {
            // Look for Tint effect (red to blue gradient mapping)
            if (obj.ty === 20 && obj.nm === 'Tint' && obj.ef) {
              obj.ef.forEach((effect: any) => {
                if (effect.nm === 'Map Black To' && effect.v && effect.v.k) {
                  // Map the red color (1, 0.33, 0.22) to our primary color
                  const rgb = hexToRgb(colors.primary)
                  if (rgb) {
                    effect.v.k = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1]
                  }
                }
                if (effect.nm === 'Map White To' && effect.v && effect.v.k) {
                  // Map the blue color (0.26, 0.29, 0.90) to our secondary color
                  const rgb = hexToRgb(colors.secondary)
                  if (rgb) {
                    effect.v.k = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1]
                  }
                }
              })
            }
            
            // Look for gradient fills and customize them
            if (obj.ty === 'gf' && obj.g && obj.g.k && obj.g.k.k) {
              const gradientColors = obj.g.k.k
              // Gradient typically has format: [stop1, r1, g1, b1, stop2, r2, g2, b2]
              if (gradientColors.length >= 8) {
                // First color (usually at stop 0)
                const rgb1 = hexToRgb(colors.primary)
                if (rgb1) {
                  gradientColors[1] = rgb1.r / 255
                  gradientColors[2] = rgb1.g / 255
                  gradientColors[3] = rgb1.b / 255
                }
                
                // Second color (usually at stop 1)
                const rgb2 = hexToRgb(colors.accent)
                if (rgb2) {
                  gradientColors[5] = rgb2.r / 255
                  gradientColors[6] = rgb2.g / 255
                  gradientColors[7] = rgb2.b / 255
                }
              }
            }
            
            // Recursively process nested objects
            Object.values(obj).forEach(customizeColors)
          }
        }
        
        // Apply color customization
        customizeColors(customizedData)
        
        setAnimationData(customizedData)
      } catch (error) {
        console.error('Failed to load gradient loader animation:', error)
      }
    }

    loadAnimation()
  }, [colorScheme, customColors])

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Control animation playback
  useEffect(() => {
    if (lottieRef.current) {
      const animation = lottieRef.current
      animation.setSpeed(speed)
    }
  }, [speed])

  if (!animationData) {
    // Fallback loading spinner with matching colors
    const colors = customColors || colorSchemes[colorScheme]
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
        <motion.div
          className="w-8 h-8 border-2 border-t-transparent rounded-full"
          style={{ 
            borderColor: `${colors.primary} transparent transparent transparent`
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay={autoplay}
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  )
}

// Export preset configurations for easy use
export const GradientLoaderPresets = {
  Primary: (props: Partial<GradientLoaderProps>) => 
    <GradientLoader colorScheme="primary" {...props} />,
  
  Golden: (props: Partial<GradientLoaderProps>) => 
    <GradientLoader colorScheme="golden" {...props} />,
  
  Pink: (props: Partial<GradientLoaderProps>) => 
    <GradientLoader colorScheme="pink" {...props} />,
  
  Large: (props: Partial<GradientLoaderProps>) => 
    <GradientLoader size="lg" {...props} />,
  
  ExtraLarge: (props: Partial<GradientLoaderProps>) => 
    <GradientLoader size="xl" {...props} />
}