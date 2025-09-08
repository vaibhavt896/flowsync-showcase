'use client'

import { useEffect, useRef } from 'react'
import { useSoundStore } from '@/stores/soundStore'
import { audioService } from '@/services/audioService'

interface TimerState {
  isRunning: boolean
  isPaused: boolean
  currentSession: any
  timeRemaining: number
}

export function useSounds(timerState: TimerState) {
  const {
    enableSounds,
    tickingSound,
    tickingVolume,
    alarmSound,
    alarmVolume,
    tickingSounds,
    alarmSounds
  } = useSoundStore()

  const tickingPlayingRef = useRef(false)

  // Helper function to get sound file
  const getSoundFile = (soundId: string, soundsArray: any[]) => {
    return soundsArray.find(s => s.id === soundId)?.file
  }

  // Start/stop ticking sound
  const handleTickingSound = async (shouldPlay: boolean) => {
    console.log('🔊 handleTickingSound called:', {
      shouldPlay,
      enableSounds,
      tickingSound,
      tickingVolume,
      currentlyPlaying: tickingPlayingRef.current
    })

    if (!enableSounds || !tickingSound || tickingSound === 'none') {
      console.log('🔊 Ticking disabled:', { enableSounds, tickingSound })
      if (tickingPlayingRef.current) {
        await audioService.stopTicking(tickingSound)
        tickingPlayingRef.current = false
      }
      return
    }

    const soundFile = getSoundFile(tickingSound, tickingSounds)
    console.log('🔊 Sound file found:', soundFile)
    if (!soundFile) {
      console.warn('🔊 No sound file for:', tickingSound)
      return
    }

    try {
      if (shouldPlay && !tickingPlayingRef.current) {
        console.log('🔊 STARTING ticking sound:', tickingSound, 'volume:', tickingVolume)
        await audioService.playTicking(tickingSound, tickingVolume)
        tickingPlayingRef.current = true
        console.log('🔊 Ticking sound started successfully!')
      } else if (!shouldPlay && tickingPlayingRef.current) {
        console.log('🔊 STOPPING ticking sound')
        await audioService.stopTicking(tickingSound)
        tickingPlayingRef.current = false
        console.log('🔊 Ticking sound stopped successfully!')
      } else {
        console.log('🔊 No action needed:', { shouldPlay, currentlyPlaying: tickingPlayingRef.current })
      }
    } catch (error) {
      console.error('🔊 ERROR in handleTickingSound:', error)
    }
  }

  // Main effect to handle timer state changes
  useEffect(() => {
    const { isRunning, isPaused, currentSession } = timerState
    const isActiveSession = !!currentSession
    const isSessionRunning = isRunning && !isPaused && isActiveSession

    console.log('🔊 Timer State Check:', {
      isRunning,
      isPaused,
      currentSession: currentSession?.type || 'none',
      isActiveSession,
      isSessionRunning,
      enableSounds,
      tickingSound,
      tickingVolume
    })

    // Timer running with active session = play ticking
    if (isSessionRunning) {
      console.log('🔊 Should start ticking sound')
      handleTickingSound(true)
    } else {
      console.log('🔊 Should stop ticking sound')
      handleTickingSound(false)
    }

  }, [timerState.isRunning, timerState.isPaused, timerState.currentSession, enableSounds, tickingSound, tickingVolume])

  // Handle volume changes for active sounds
  useEffect(() => {
    if (tickingPlayingRef.current && tickingSound) {
      audioService.setVolume(tickingSound, tickingVolume)
    }
  }, [tickingSound, tickingVolume])

  // Handle sound changes (stop old, start new if needed)
  useEffect(() => {
    const wasTickingPlaying = tickingPlayingRef.current

    if (wasTickingPlaying) {
      handleTickingSound(false).then(() => {
        if (wasTickingPlaying && timerState.isRunning && !timerState.isPaused && timerState.currentSession) {
          handleTickingSound(true)
        }
      })
    }
  }, [tickingSound])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioService.stopAllSounds(true)
      tickingPlayingRef.current = false
    }
  }, [])

  // Preload sounds on mount
  useEffect(() => {
    const allSounds = [...tickingSounds, ...alarmSounds]
    audioService.preloadSounds(allSounds)
  }, [tickingSounds, alarmSounds])

  // Public API
  return {
    isTickingPlaying: tickingPlayingRef.current,
    testTicking: () => audioService.testPlay(tickingSound, tickingVolume),
    testAlarm: () => audioService.playAlarm(alarmSound, alarmVolume),
  }
}