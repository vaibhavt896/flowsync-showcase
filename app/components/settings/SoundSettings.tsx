'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Play, Pause, VolumeX, RotateCcw } from 'lucide-react'
import { useSoundStore, SoundOption } from '@/stores/soundStore'
import { audioService } from '@/services/audioService'
import { AppleLiquidCard } from '@/components/ui/AppleLiquidGlass'
import { cn } from '@/utils/helpers'

interface SoundCategoryProps {
  title: string
  description: string
  selectedSound: string
  volume: number
  sounds: SoundOption[]
  onSoundChange: (soundId: string) => void
  onVolumeChange: (volume: number) => void
  previewId: string
}

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
        disabled ? "text-neutral-400" : "text-neutral-600"
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
            "[&::-webkit-slider-thumb]:hover:scale-110",
            "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
            "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
            "[&::-moz-range-thumb]:bg-gradient-to-r",
            "[&::-moz-range-thumb]:from-orange-500 [&::-moz-range-thumb]:to-pink-500",
            "[&::-moz-range-thumb]:cursor-pointer"
          )}
          style={{
            background: `linear-gradient(to right, 
              #EF6F38 0%, 
              #F088A3 ${value}%, 
              #e5e7eb ${value}%, 
              #e5e7eb 100%)`
          }}
        />
        <div className="absolute right-0 top-6 text-xs font-bold text-neutral-700">
          {value}
        </div>
      </div>
      <Volume2 className={cn(
        "w-4 h-4 transition-colors",
        disabled ? "text-neutral-400" : "text-orange-500"
      )} />
    </div>
  )
}

function SoundDropdown({ 
  sounds, 
  selectedSound, 
  onSoundChange, 
  onPreview,
  previewId,
  isPlaying 
}: {
  sounds: SoundOption[]
  selectedSound: string
  onSoundChange: (soundId: string) => void
  onPreview: (soundId: string) => void
  previewId: string
  isPlaying: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = sounds.find(s => s.id === selectedSound)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between",
          "bg-white/80 hover:bg-white/90 border border-neutral-200/80",
          "rounded-xl px-4 py-3 text-left transition-all duration-200",
          "text-neutral-900 font-medium shadow-sm hover:shadow-md",
          isOpen && "ring-2 ring-orange-500/20 border-orange-300"
        )}
      >
        <span>{selectedOption?.name || 'Select sound'}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden"
        >
          {sounds.map((sound) => (
            <div
              key={sound.id}
              className={cn(
                "flex items-center justify-between px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors",
                selectedSound === sound.id && "bg-orange-100 border-l-4 border-orange-500"
              )}
              onClick={() => {
                onSoundChange(sound.id)
                setIsOpen(false)
              }}
            >
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{sound.name}</div>
                {sound.description && (
                  <div className="text-xs text-neutral-600 mt-1">{sound.description}</div>
                )}
              </div>
              
              {sound.file && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(sound.id)
                  }}
                  className={cn(
                    "ml-3 p-2 rounded-lg transition-all duration-200",
                    "hover:bg-orange-200 text-neutral-600 hover:text-orange-600",
                    isPlaying && previewId === sound.id && "bg-orange-500 text-white"
                  )}
                >
                  {isPlaying && previewId === sound.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function SoundCategory({ 
  title, 
  description, 
  selectedSound, 
  volume, 
  sounds, 
  onSoundChange, 
  onVolumeChange,
  previewId
}: SoundCategoryProps) {
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [currentPreviewId, setCurrentPreviewId] = useState<string>('')

  const handlePreview = async (soundId: string) => {
    try {
      if (isPreviewPlaying && currentPreviewId === soundId) {
        await audioService.stopSound(soundId)
        setIsPreviewPlaying(false)
        setCurrentPreviewId('')
      } else {
        // Stop any current preview
        if (currentPreviewId) {
          await audioService.stopSound(currentPreviewId)
        }
        
        await audioService.testPlay(soundId, volume)
        setIsPreviewPlaying(true)
        setCurrentPreviewId(soundId)
        
        // Auto-stop after 3 seconds
        setTimeout(() => {
          audioService.stopSound(soundId)
          setIsPreviewPlaying(false)
          setCurrentPreviewId('')
        }, 3000)
      }
    } catch (error) {
      console.warn('Failed to preview sound:', error)
    }
  }

  const selectedOption = sounds.find(s => s.id === selectedSound)
  const disabled = selectedSound === 'none' || !selectedOption?.file

  return (
    <AppleLiquidCard 
      hover={false} 
      padding="lg" 
      className="bg-white/90 border border-white/60 shadow-lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-neutral-900">{title}</h4>
            <p className="text-sm text-neutral-600 font-medium">{description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <SoundDropdown
            sounds={sounds}
            selectedSound={selectedSound}
            onSoundChange={onSoundChange}
            onPreview={handlePreview}
            previewId={currentPreviewId}
            isPlaying={isPreviewPlaying}
          />

          <VolumeSlider
            value={volume}
            onChange={onVolumeChange}
            disabled={disabled}
          />
        </div>
      </div>
    </AppleLiquidCard>
  )
}

export default function SoundSettings() {
  const {
    alarmSound,
    alarmVolume,
    tickingSound,
    tickingVolume,
    enableSounds,
    alarmSounds,
    tickingSounds,
    setAlarmSound,
    setAlarmVolume,
    setTickingSound,
    setTickingVolume,
    toggleSounds,
    resetToDefaults
  } = useSoundStore()

  // Preload sounds on component mount
  useEffect(() => {
    const allSounds = [
      ...alarmSounds,
      ...tickingSounds
    ]
    audioService.preloadSounds(allSounds)
  }, [alarmSounds, tickingSounds])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-neutral-600" />
          <h3 className="text-xl font-black text-neutral-900 uppercase tracking-wider">
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
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            )}
          >
            {enableSounds ? 'Sounds On' : 'Sounds Off'}
          </button>
          
          <button
            onClick={resetToDefaults}
            className="p-2 rounded-lg text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
            title="Reset to defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sound Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoundCategory
          title="Alarm Sound"
          description="Sound played when timer ends"
          selectedSound={alarmSound}
          volume={alarmVolume}
          sounds={alarmSounds}
          onSoundChange={setAlarmSound}
          onVolumeChange={setAlarmVolume}
          previewId="alarm"
        />

        <SoundCategory
          title="Ticking Sound"
          description="Background ticking during focus sessions"
          selectedSound={tickingSound}
          volume={tickingVolume}
          sounds={tickingSounds}
          onSoundChange={setTickingSound}
          onVolumeChange={setTickingVolume}
          previewId="ticking"
        />
      </div>

      {!enableSounds && (
        <AppleLiquidCard 
          hover={false} 
          padding="md" 
          className="bg-yellow-50/90 border border-yellow-200/60"
        >
          <div className="flex items-center gap-3 text-yellow-800">
            <VolumeX className="w-5 h-5" />
            <span className="font-medium">
              Sound effects are currently disabled. Enable them above to hear audio feedback.
            </span>
          </div>
        </AppleLiquidCard>
      )}
    </div>
  )
}