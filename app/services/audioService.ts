'use client'

import { SoundOption } from '@/stores/soundStore'

interface AudioInstance {
  audio: HTMLAudioElement
  gainNode?: GainNode
  source?: AudioBufferSourceNode
  isPlaying: boolean
  isLooping: boolean
}

class AudioService {
  private audioContext: AudioContext | null = null
  private instances: Map<string, AudioInstance> = new Map()
  private bufferCache: Map<string, AudioBuffer> = new Map()
  private masterGainNode: GainNode | null = null
  private initialized = false

  async initialize() {
    if (this.initialized) return

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create master gain node for global volume control
      this.masterGainNode = this.audioContext.createGain()
      this.masterGainNode.connect(this.audioContext.destination)
      
      this.initialized = true
      console.log('AudioService initialized')
    } catch (error) {
      console.warn('AudioContext not supported, falling back to HTML5 audio:', error)
      this.initialized = true
    }
  }

  async loadAudio(soundOption: SoundOption): Promise<HTMLAudioElement | null> {
    if (!soundOption.file) return null

    try {
      console.log(`Loading audio: ${soundOption.name} from ${soundOption.file}`)
      const audio = new Audio(soundOption.file)
      audio.preload = 'auto'
      
      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          audio.removeEventListener('canplaythrough', handleLoad)
          audio.removeEventListener('error', handleError)
          reject(new Error('Audio load timeout'))
        }, 10000) // 10 second timeout

        const handleLoad = () => {
          clearTimeout(timeout)
          audio.removeEventListener('canplaythrough', handleLoad)
          audio.removeEventListener('error', handleError)
          console.log(`Successfully loaded: ${soundOption.name}`)
          resolve(audio)
        }
        const handleError = (error: any) => {
          clearTimeout(timeout)
          audio.removeEventListener('canplaythrough', handleLoad)
          audio.removeEventListener('error', handleError)
          console.warn(`Failed to load: ${soundOption.name}`, error)
          reject(error)
        }
        
        audio.addEventListener('canplaythrough', handleLoad)
        audio.addEventListener('error', handleError)
        
        // Also try loadeddata as fallback
        audio.addEventListener('loadeddata', handleLoad)
      })

      return audio
    } catch (error) {
      console.warn(`Failed to load audio: ${soundOption.file}`, error)
      return null
    }
  }

  async preloadSounds(sounds: SoundOption[]) {
    const loadPromises = sounds
      .filter(sound => sound.file && !this.bufferCache.has(sound.id))
      .map(async (sound) => {
        try {
          const audio = await this.loadAudio(sound)
          if (audio) {
            const instance: AudioInstance = {
              audio,
              isPlaying: false,
              isLooping: false
            }
            this.instances.set(sound.id, instance)
          }
        } catch (error) {
          console.warn(`Failed to preload sound: ${sound.id}`, error)
        }
      })

    await Promise.allSettled(loadPromises)
    console.log(`Preloaded ${loadPromises.length} sounds`)
  }

  async playSound(
    soundId: string, 
    volume: number = 70, 
    loop: boolean = false,
    fadeIn: boolean = false
  ): Promise<void> {
    await this.initialize()
    console.log('🎵 AudioService.playSound called:', soundId, { volume, loop, fadeIn })

    let instance = this.instances.get(soundId)
    if (!instance || !instance.audio) {
      console.warn(`🎵 Sound not found or loaded: ${soundId}`)
      console.log('🎵 Available instances:', Array.from(this.instances.keys()))
      return
    }

    try {
      console.log('🎵 Audio instance found, attempting to play...')
      
      // Stop current playback if any
      await this.stopSound(soundId)

      const audio = instance.audio
      audio.currentTime = 0
      audio.volume = fadeIn ? 0 : volume / 100
      audio.loop = loop

      console.log('🎵 Audio configured:', {
        currentTime: audio.currentTime,
        volume: audio.volume,
        loop: audio.loop,
        readyState: audio.readyState,
        src: audio.src
      })

      // Fade in effect
      if (fadeIn && this.audioContext) {
        console.log('🎵 Applying fade in effect...')
        const gainNode = this.audioContext.createGain()
        gainNode.connect(this.masterGainNode!)
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(volume / 100, this.audioContext.currentTime + 0.5)
        instance.gainNode = gainNode
      }

      console.log('🎵 Calling audio.play()...')
      await audio.play()
      instance.isPlaying = true
      instance.isLooping = loop
      
      console.log('🎵 ✅ Audio playing successfully!')

      // Handle natural end of playback
      const handleEnded = () => {
        console.log('🎵 Audio ended naturally:', soundId)
        instance!.isPlaying = false
        audio.removeEventListener('ended', handleEnded)
      }
      audio.addEventListener('ended', handleEnded)

    } catch (error) {
      console.error(`🎵 ❌ Failed to play sound: ${soundId}`, error)
    }
  }

  async stopSound(soundId: string, fadeOut: boolean = false): Promise<void> {
    const instance = this.instances.get(soundId)
    if (!instance || !instance.audio || !instance.isPlaying) return

    try {
      const audio = instance.audio

      if (fadeOut && this.audioContext && instance.gainNode) {
        // Fade out effect
        instance.gainNode.gain.setValueAtTime(audio.volume, this.audioContext.currentTime)
        instance.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3)
        
        setTimeout(() => {
          audio.pause()
          audio.currentTime = 0
          instance.isPlaying = false
        }, 300)
      } else {
        audio.pause()
        audio.currentTime = 0
        instance.isPlaying = false
      }
    } catch (error) {
      console.warn(`Failed to stop sound: ${soundId}`, error)
    }
  }

  async pauseSound(soundId: string): Promise<void> {
    const instance = this.instances.get(soundId)
    if (!instance || !instance.audio || !instance.isPlaying) return

    try {
      instance.audio.pause()
      instance.isPlaying = false
    } catch (error) {
      console.warn(`Failed to pause sound: ${soundId}`, error)
    }
  }

  async resumeSound(soundId: string): Promise<void> {
    const instance = this.instances.get(soundId)
    if (!instance || !instance.audio || instance.isPlaying) return

    try {
      await instance.audio.play()
      instance.isPlaying = true
    } catch (error) {
      console.warn(`Failed to resume sound: ${soundId}`, error)
    }
  }

  setVolume(soundId: string, volume: number): void {
    const instance = this.instances.get(soundId)
    if (!instance || !instance.audio) return

    const normalizedVolume = Math.max(0, Math.min(1, volume / 100))
    instance.audio.volume = normalizedVolume

    if (instance.gainNode) {
      instance.gainNode.gain.value = normalizedVolume
    }
  }

  isPlaying(soundId: string): boolean {
    const instance = this.instances.get(soundId)
    return instance?.isPlaying || false
  }

  async stopAllSounds(fadeOut: boolean = false): Promise<void> {
    const stopPromises = Array.from(this.instances.keys()).map(soundId => 
      this.stopSound(soundId, fadeOut)
    )
    await Promise.allSettled(stopPromises)
  }

  // Convenience methods for different sound types
  async playAlarm(soundId: string, volume: number = 70): Promise<void> {
    console.log('🔔 AudioService.playAlarm called:', soundId, 'volume:', volume)
    
    // For alarms, we need to handle autoplay restrictions
    try {
      // Try to play immediately first
      await this.playSound(soundId, volume, false, false)
    } catch (error) {
      console.warn('🔔 Direct play failed, possibly due to autoplay restrictions:', error)
      
      // If autoplay fails, try to create a user-activated audio element
      const instance = this.instances.get(soundId)
      if (instance && instance.audio) {
        try {
          // Reset and try again
          instance.audio.currentTime = 0
          instance.audio.volume = volume / 100
          await instance.audio.play()
          console.log('🔔 ✅ Alarm played successfully on retry!')
        } catch (retryError) {
          console.error('🔔 ❌ Failed to play alarm even on retry:', retryError)
          throw retryError
        }
      } else {
        console.error('🔔 ❌ No audio instance found for:', soundId)
        throw error
      }
    }
  }

  async playTicking(soundId: string, volume: number = 50): Promise<void> {
    console.log('🎵 AudioService.playTicking called:', soundId, 'volume:', volume)
    // Play ticking sound immediately without fade-in for instant feedback
    return this.playSound(soundId, volume, true, false)
  }

  async stopTicking(soundId: string): Promise<void> {
    return this.stopSound(soundId, true)
  }

  async playAmbient(soundId: string, volume: number = 30): Promise<void> {
    return this.playSound(soundId, volume, true, true)
  }

  async stopAmbient(soundId: string): Promise<void> {
    return this.stopSound(soundId, true)
  }

  async playNotification(soundId: string, volume: number = 60): Promise<void> {
    return this.playSound(soundId, volume, false, false)
  }

  // Test play for settings preview
  async testPlay(soundId: string, volume: number = 70): Promise<void> {
    return this.playSound(soundId, volume, false, false)
  }

  dispose(): void {
    this.stopAllSounds()
    this.instances.clear()
    this.bufferCache.clear()
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance
export const audioService = new AudioService()

// Initialize on first import
if (typeof window !== 'undefined') {
  audioService.initialize()
}