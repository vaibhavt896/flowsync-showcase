'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SoundOption {
  id: string
  name: string
  file: string
  description?: string
}

export interface SoundSettings {
  tickingSound: string
  tickingVolume: number
  alarmSound: string
  alarmVolume: number
  enableSounds: boolean
}

interface SoundStore extends SoundSettings {
  // Sound options
  tickingSounds: SoundOption[]
  alarmSounds: SoundOption[]
  
  // Actions
  setTickingSound: (soundId: string) => void
  setTickingVolume: (volume: number) => void
  setAlarmSound: (soundId: string) => void
  setAlarmVolume: (volume: number) => void
  toggleSounds: () => void
  resetToDefaults: () => void
}

// Available ticking sounds
const TICKING_SOUNDS: SoundOption[] = [
  { id: 'clock-ticking', name: 'Clock Ticking', file: '/sounds/ticking/clock-ticking-sound-effect-240503.mp3', description: 'Traditional clock ticking' },
  { id: 'none', name: 'No Sound', file: '', description: 'Disable ticking sound' },
]

// Available alarm sounds
const ALARM_SOUNDS: SoundOption[] = [
  { id: 'school-bell', name: 'School Bell', file: '/sounds/alarms/school-bell-199584.mp3', description: 'Classic school bell notification' },
  { id: 'none', name: 'No Sound', file: '', description: 'Disable alarm sound' },
]

const DEFAULT_SETTINGS: SoundSettings = {
  tickingSound: 'clock-ticking',
  tickingVolume: 60,
  alarmSound: 'school-bell',
  alarmVolume: 80,
  enableSounds: true,
}

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      // Default settings
      ...DEFAULT_SETTINGS,
      
      // Sound options
      tickingSounds: TICKING_SOUNDS,
      alarmSounds: ALARM_SOUNDS,
      
      // Actions
      setTickingSound: (soundId: string) => set({ tickingSound: soundId }),
      setTickingVolume: (volume: number) => set({ tickingVolume: Math.max(0, Math.min(100, volume)) }),
      setAlarmSound: (soundId: string) => set({ alarmSound: soundId }),
      setAlarmVolume: (volume: number) => set({ alarmVolume: Math.max(0, Math.min(100, volume)) }),
      toggleSounds: () => set((state) => ({ enableSounds: !state.enableSounds })),
      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'flowsync-sound-settings',
      version: 2,
    }
  )
)