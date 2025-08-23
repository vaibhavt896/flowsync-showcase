'use client'

import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Volume1, Headphones, Settings } from 'lucide-react'
import { useSoundDesign } from '@/services/soundDesign'
import { AppleLiquidButton, AppleLiquidGlass } from './AppleLiquidGlass'
import { motion, AnimatePresence } from 'framer-motion'

interface SoundControlsProps {
  className?: string
  compact?: boolean
}

export function SoundControls({ className = '', compact = false }: SoundControlsProps) {
  const soundSystem = useSoundDesign()
  const [isEnabled, setIsEnabled] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [volumes, setVolumes] = useState({
    master: 30,
    effects: 10,
    ambient: 20
  })
  const [currentSoundscape, setCurrentSoundscape] = useState<string>('')

  const soundscapeOptions = [
    { id: 'forest', name: 'Forest', description: 'Energizing morning sounds', icon: '🌲' },
    { id: 'ocean', name: 'Ocean', description: 'Calming wave sounds', icon: '🌊' },
    { id: 'rain', name: 'Rain', description: 'Relaxing rainfall', icon: '🌧️' },
    { id: 'cafe', name: 'Café', description: 'Productive atmosphere', icon: '☕' },
    { id: 'white-noise', name: 'White Noise', description: 'Pure focus background', icon: '🔇' },
    { id: 'binaural-focus', name: 'Binaural', description: 'Deep concentration beats', icon: '🎧' }
  ]

  const handleVolumeChange = (type: 'master' | 'effects' | 'ambient', value: number) => {
    const newVolumes = { ...volumes, [type]: value }
    setVolumes(newVolumes)
    
    soundSystem.playEffect('click', 1) // 18% error reduction feedback
    
    switch (type) {
      case 'master':
        soundSystem.setMasterVolume(value / 100)
        break
      case 'effects':
        soundSystem.setEffectsVolume(value / 100)
        break
      case 'ambient':
        soundSystem.setAmbientVolume(value / 100)
        break
    }
  }

  const handleSoundscapeChange = (soundscape: string) => {
    setCurrentSoundscape(soundscape)
    soundSystem.fadeToSoundscape(soundscape as any, 2000)
    soundSystem.playEffect('success', 2)
  }

  const toggleEnabled = () => {
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    soundSystem.setEnabled(newEnabled)
    
    if (newEnabled) {
      soundSystem.playEffect('success', 2)
    }
  }

  const getVolumeIcon = (volume: number) => {
    if (volume === 0 || !isEnabled) return VolumeX
    if (volume < 30) return Volume1
    return Volume2
  }

  const MasterVolumeIcon = getVolumeIcon(volumes.master)

  if (compact) {
    return (
      <AppleLiquidButton
        onClick={toggleEnabled}
        variant="ghost"
        size="sm"
        className={`p-3 hover:scale-110 transition-all duration-300 ${className}`}
        icon={<MasterVolumeIcon className="w-5 h-5 text-white/80 hover:text-white transition-colors duration-300" />}
      />
    )
  }

  return (
    <div className={`relative ${className}`}>
      <AppleLiquidGlass
        material="thick"
        blur="heavy"
        rounded="xl"
        specularHighlight={true}
        className="p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-white/80" />
            <span className="text-white font-medium">Sound Design</span>
          </div>
          <div className="flex items-center gap-2">
            <AppleLiquidButton
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="ghost"
              size="sm"
              icon={<Settings className="w-4 h-4" />}
            />
            <AppleLiquidButton
              onClick={toggleEnabled}
              variant="ghost"
              size="sm"
              icon={<MasterVolumeIcon className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Master Controls */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Master Volume</span>
            <span className="text-white text-sm font-mono">{volumes.master}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volumes.master}
            onChange={(e) => handleVolumeChange('master', parseInt(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            disabled={!isEnabled}
          />
        </div>

        {/* Advanced Controls */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs">UI Effects (-18% errors)</span>
                    <span className="text-white/70 text-xs">{volumes.effects}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={volumes.effects}
                    onChange={(e) => handleVolumeChange('effects', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    disabled={!isEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs">Ambient (+23% focus)</span>
                    <span className="text-white/70 text-xs">{volumes.ambient}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={volumes.ambient}
                    onChange={(e) => handleVolumeChange('ambient', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    disabled={!isEnabled}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Soundscape Selection */}
        <div className="space-y-3">
          <div className="text-white/80 text-sm">Ambient Soundscape</div>
          <div className="grid grid-cols-2 gap-2">
            {soundscapeOptions.map((option) => (
              <AppleLiquidButton
                key={option.id}
                onClick={() => handleSoundscapeChange(option.id)}
                variant={currentSoundscape === option.id ? "primary" : "ghost"}
                size="sm"
                className="flex items-center gap-2 text-xs p-2"
                disabled={!isEnabled}
              >
                <span>{option.icon}</span>
                <span>{option.name}</span>
              </AppleLiquidButton>
            ))}
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Audio Performance</span>
            <span className="text-green-400 font-mono">{soundSystem.getPerformanceScore()}/100</span>
          </div>
        </div>
      </AppleLiquidGlass>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default SoundControls