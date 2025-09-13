'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Play, Pause, VolumeX, RotateCcw } from 'lucide-react'
import { useSoundStore } from '@/stores/soundStore'
import { audioService } from '@/services/audioService'
import { AppleLiquidCard } from '@/components/ui/AppleLiquidGlass'
import { cn } from '@/utils/helpers'

function VolumeSlider({ 
  value, 
  onChange, 
  disabled = false 
}: { 
  value: number
  onChange: (value: number) => void
  disabled?: boolean 
}) {
  return (
    <div className="flex items-center gap-3">
      <VolumeX className={cn(
        "w-4 h-4 transition-colors",
        disabled ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
      )} />
      <div className="flex-1 relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className={cn(
            "w-full h-2 rounded-lg appearance-none cursor-pointer",
            "bg-gradient-to-r from-neutral-200 to-neutral-300",
            "focus:outline-none focus:ring-2 focus:ring-orange-500/20",
            disabled && "opacity-50 cursor-not-allowed",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-gradient-to-r",
            "[&::-webkit-slider-thumb]:from-orange-500 [&::-webkit-slider-thumb]:to-pink-500",
            "[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-orange-500/30",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200",
            "[&::-webkit-slider-thumb]:hover:scale-110"
          )}
          style={{
            background: `linear-gradient(to right, 
              #EF6F38 0%, 
              #F088A3 ${value}%, 
              #e5e7eb ${value}%, 
              #e5e7eb 100%)`
          }}
        />
        <div className="absolute right-0 top-6 text-xs font-bold text-gray-700 dark:text-gray-300">
          {value}
        </div>
      </div>
      <Volume2 className={cn(
        "w-4 h-4 transition-colors",
        disabled ? "text-gray-400 dark:text-gray-500" : "text-orange-500 dark:text-orange-400"
      )} />
    </div>
  )
}

export default function SimpleSoundSettings() {
  const {
    tickingSound,
    tickingVolume,
    enableSounds,
    tickingSounds,
    setTickingSound,
    setTickingVolume,
    toggleSounds,
    resetToDefaults
  } = useSoundStore()

  const [isPlaying, setIsPlaying] = useState(false)

  // Preload sounds on component mount
  useEffect(() => {
    audioService.preloadSounds(tickingSounds)
  }, [tickingSounds])

  const handlePreview = async () => {
    if (!tickingSound || tickingSound === 'none') return

    try {
      if (isPlaying) {
        await audioService.stopSound(tickingSound)
        setIsPlaying(false)
      } else {
        await audioService.testPlay(tickingSound, tickingVolume)
        setIsPlaying(true)
        
        // Auto-stop after 3 seconds
        setTimeout(() => {
          audioService.stopSound(tickingSound)
          setIsPlaying(false)
        }, 3000)
      }
    } catch (error) {
      console.warn('Failed to preview sound:', error)
      setIsPlaying(false)
    }
  }

  const selectedOption = tickingSounds.find(s => s.id === tickingSound)
  const disabled = tickingSound === 'none' || !selectedOption?.file

  return (
    <div>
      {/* Mobile: Clean layout without excessive nesting */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40 rounded-xl p-4 lg:hidden">
        <div className="space-y-4">
          {/* Header - Mobile Simplified */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Sound Settings
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSounds}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px]",
                  enableSounds
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
              >
                {enableSounds ? 'Sound On' : 'Sound Off'}
              </button>
            </div>
          </div>

          {/* Ticking Sound Controls - Mobile Optimized */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                Ticking Sound (During Timer)
              </label>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select
                      value={tickingSound}
                      onChange={(e) => setTickingSound(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 dark:focus:border-orange-400 transition-all duration-200 min-h-[44px] appearance-none cursor-pointer text-left"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '16px',
                      }}
                    >
                      {tickingSounds.map((sound) => (
                        <option key={sound.id} value={sound.id}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedOption?.file && (
                    <button
                      onClick={handlePreview}
                      disabled={!enableSounds}
                      className={cn(
                        "p-3 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center",
                        "hover:bg-orange-200 dark:hover:bg-orange-900/30 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400",
                        isPlaying && "bg-orange-500 text-white",
                        !enableSounds && "opacity-50 cursor-not-allowed"
                      )}
                      title="Preview sound"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Volume
                  </label>
                  <VolumeSlider
                    value={tickingVolume}
                    onChange={setTickingVolume}
                    disabled={disabled || !enableSounds}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                Completion Sound (When Timer Ends)
              </label>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select
                      value="success" // You can add completion sound to store later
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 dark:focus:border-orange-400 transition-all duration-200 min-h-[44px] appearance-none cursor-pointer text-left"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '16px',
                      }}
                    >
                      <option value="success">Success Bell</option>
                      <option value="chime">Soft Chime</option>
                      <option value="none">No Sound</option>
                    </select>
                  </div>
                  
                  <button
                    disabled={!enableSounds}
                    className={cn(
                      "p-3 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center",
                      "hover:bg-blue-200 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400",
                      !enableSounds && "opacity-50 cursor-not-allowed"
                    )}
                    title="Preview completion sound"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Keep AppleLiquidCard design */}
      <div className="hidden lg:block">
        <AppleLiquidCard 
          hover={false} 
          padding="lg" 
          className="bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-700/60 shadow-lg"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Sound Settings
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSounds}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    enableSounds
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  )}
                >
                  {enableSounds ? 'Sound On' : 'Sound Off'}
                </button>
                
                <button
                  onClick={resetToDefaults}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sound Selection */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                  Choose Ticking Sound
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      value={tickingSound}
                      onChange={(e) => setTickingSound(e.target.value)}
                      className="w-full bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 border border-gray-200/80 dark:border-gray-600/80 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 dark:focus:border-orange-400 transition-all duration-200 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '16px',
                      }}
                    >
                      {tickingSounds.map((sound) => (
                        <option key={sound.id} value={sound.id}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedOption?.file && (
                    <button
                      onClick={handlePreview}
                      disabled={!enableSounds}
                      className={cn(
                        "p-3 rounded-lg transition-all duration-200",
                        "hover:bg-orange-200 dark:hover:bg-orange-900/30 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400",
                        isPlaying && "bg-orange-500 text-white",
                        !enableSounds && "opacity-50 cursor-not-allowed"
                      )}
                      title="Preview sound"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                
                {selectedOption?.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {selectedOption.description}
                  </p>
                )}
              </div>

              {/* Volume Control */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                  Volume Level
                </label>
                <VolumeSlider
                  value={tickingVolume}
                  onChange={setTickingVolume}
                  disabled={disabled || !enableSounds}
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
              <div className="flex items-start gap-3 text-blue-800 dark:text-blue-200">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="text-white text-xs">ⓘ</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">How it works:</p>
                  <p className="leading-relaxed">
                    Sound controls help you customize audio feedback. Ticking sounds play during focus sessions, and completion sounds notify you when timers end.
                  </p>
                </div>
              </div>
            </div>

            {!enableSounds && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                  <VolumeX className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">
                    Sound effects are currently disabled. Enable them above to hear audio feedback during focus sessions.
                  </span>
                </div>
              </div>
            )}
          </div>
        </AppleLiquidCard>
      </div>
    </div>
  )
}