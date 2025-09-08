'use client'

import React, { useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { useSoundStore } from '@/stores/soundStore'
import { audioService } from '@/services/audioService'
import { AppleLiquidCard } from '@/components/ui/AppleLiquidGlass'

export default function SoundTest() {
  const { 
    tickingSounds,
    tickingSound,
    tickingVolume,
    enableSounds
  } = useSoundStore()

  useEffect(() => {
    // Preload ticking sounds for testing
    audioService.preloadSounds(tickingSounds)
    console.log('Sound Test: Preloading sounds...', tickingSounds.length)
  }, [tickingSounds])

  const testSound = async (soundId: string, volume: number = 70) => {
    try {
      console.log(`Testing sound: ${soundId} at volume ${volume}`)
      await audioService.testPlay(soundId, volume)
    } catch (error) {
      console.error(`Failed to test sound: ${soundId}`, error)
    }
  }

  const testCurrentSettings = async () => {
    console.log('Testing current sound settings...')
    
    // Test ticking
    if (tickingSound && tickingSound !== 'none') {
      console.log(`Testing ticking: ${tickingSound}`)
      await testSound(tickingSound, tickingVolume)
      await new Promise(resolve => setTimeout(resolve, 3000))
    } else {
      console.log('No ticking sound to test')
    }
  }

  return (
    <AppleLiquidCard hover={false} padding="lg" className="bg-white/90 dark:bg-gray-900/90 border border-white/60 dark:border-gray-700/60 shadow-lg">
      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-orange-500" />
          Sound System Test
        </h3>

        <div className="space-y-4">
          <button
            onClick={testCurrentSettings}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors duration-200"
          >
            <Play className="w-4 h-4" />
            Test Current Settings
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Settings Display */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Current Settings</h4>
              <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <div>Sound Enabled: <span className="font-medium">{enableSounds ? 'Yes' : 'No'}</span></div>
                <div>Ticking Sound: <span className="font-medium">{tickingSound} ({tickingVolume}%)</span></div>
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Quick Tests</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => testSound(tickingSound, tickingVolume)}
                  disabled={!enableSounds || tickingSound === 'none'}
                  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Test Ticking
                </button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-3">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Debug Info:</strong> Check browser console for detailed audio loading logs. 
              Make sure your browser allows audio playback.
            </p>
          </div>
        </div>
      </div>
    </AppleLiquidCard>
  )
}