import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigationStore } from '@/stores/navigationStore'
import { useUserStore } from '@/stores/userStore'
import { createSettingsLiquifyTransition, organicSpring, liquidMorph } from '@/utils/flipAnimations'
import { Save, Bell, Volume2, Shield, Palette, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Create motion-enabled Button component
const MotionButton = motion(Button)

// Type definitions for settings
interface BaseSetting {
  key: string
  label: string
}

interface ToggleSetting extends BaseSetting {
  type: 'toggle'
  value: boolean
  onChange: (value: boolean) => void
}

interface NumberSetting extends BaseSetting {
  type: 'number'
  value: number
  onChange: (value: number) => void
  suffix?: string
}

type Setting = ToggleSetting | NumberSetting

interface SettingSection {
  title: string
  icon: any
  settings: Setting[]
}

export default function MorphingSettings() {
  const { currentState, transitionProgress, isTransitioning, previousState } = useNavigationStore()
  const { preferences, updatePreferences } = useUserStore()
  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [hasChanges, setHasChanges] = useState(false)

  const progress = useMotionValue(transitionProgress)
  const springProgress = useSpring(progress, { damping: 25, stiffness: 120 })

  useEffect(() => {
    progress.set(transitionProgress)
  }, [transitionProgress, progress])

  // Liquify transformations when transitioning to timer
  const isLiquifying = isTransitioning && currentState === 'timer' && previousState === 'settings'
  const { scaleX, scaleY, skewX, borderRadius } = createSettingsLiquifyTransition(springProgress)

  const updateLocalPref = (key: keyof typeof preferences, value: any) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    updatePreferences(localPreferences)
    setHasChanges(false)
  }

  const resetToDefaults = () => {
    const defaults = {
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      longBreakInterval: 4,
      theme: 'system' as const,
      notifications: true,
      soundEnabled: true,
      autoStartBreaks: false,
      autoStartSessions: false,
      blockWebsites: false,
      blockedSites: []
    }
    setLocalPreferences(defaults)
    setHasChanges(true)
  }

  const settingSections: SettingSection[] = [
    {
      title: 'Timer Settings',
      icon: Clock,
      settings: [
        {
          key: 'focusDuration',
          label: 'Focus Duration',
          type: 'number',
          value: Math.floor(localPreferences.focusDuration / 60),
          onChange: (value: number) => updateLocalPref('focusDuration', value * 60),
          suffix: 'minutes'
        } as NumberSetting,
        {
          key: 'shortBreakDuration',
          label: 'Short Break',
          type: 'number',
          value: Math.floor(localPreferences.shortBreakDuration / 60),
          onChange: (value: number) => updateLocalPref('shortBreakDuration', value * 60),
          suffix: 'minutes'
        } as NumberSetting,
        {
          key: 'longBreakDuration',
          label: 'Long Break',
          type: 'number',
          value: Math.floor(localPreferences.longBreakDuration / 60),
          onChange: (value: number) => updateLocalPref('longBreakDuration', value * 60),
          suffix: 'minutes'
        } as NumberSetting
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'notifications',
          label: 'Enable Notifications',
          type: 'toggle',
          value: localPreferences.notifications,
          onChange: (value: boolean) => updateLocalPref('notifications', value)
        } as ToggleSetting,
        {
          key: 'soundEnabled',
          label: 'Sound Effects',
          type: 'toggle',
          value: localPreferences.soundEnabled,
          onChange: (value: boolean) => updateLocalPref('soundEnabled', value)
        } as ToggleSetting
      ]
    },
    {
      title: 'Automation',
      icon: Zap,
      settings: [
        {
          key: 'autoStartBreaks',
          label: 'Auto-start Breaks',
          type: 'toggle',
          value: localPreferences.autoStartBreaks,
          onChange: (value: boolean) => updateLocalPref('autoStartBreaks', value)
        } as ToggleSetting,
        {
          key: 'autoStartSessions',
          label: 'Auto-start Sessions',
          type: 'toggle',
          value: localPreferences.autoStartSessions,
          onChange: (value: boolean) => updateLocalPref('autoStartSessions', value)
        } as ToggleSetting
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        style={isLiquifying ? {
          scaleX,
          scaleY,
          skewX,
        } : {}}
        transition={isLiquifying ? liquidMorph : organicSpring}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          animate={isLiquifying ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
          transition={organicSpring}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your FlowSync experience
          </p>
        </motion.div>

        {/* Settings Grid */}
        <motion.div
          className="grid gap-8"
          style={isLiquifying ? { borderRadius } : {}}
          animate={isLiquifying ? { 
            opacity: 0, 
            scale: 0.9,
            filter: "blur(4px)"
          } : { 
            opacity: 1, 
            scale: 1,
            filter: "blur(0px)"
          }}
          transition={liquidMorph}
        >
          {settingSections.map((section, sectionIndex) => {
            const Icon = section.icon

            return (
              <motion.div
                key={section.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1, ...organicSpring }}
                whileHover={{ 
                  scale: isLiquifying ? 1 : 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-primary-500 to-focus-500 rounded-lg flex items-center justify-center"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={organicSpring}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <motion.div
                      key={setting.key}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      transition={organicSpring}
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white">
                          {setting.label}
                        </label>
                      </div>

                      {setting.type === 'toggle' ? (
                        <motion.button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            setting.value
                              ? 'bg-primary-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          onClick={() => setting.onChange(!setting.value)}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                            animate={{
                              x: setting.value ? 24 : 4
                            }}
                            transition={organicSpring}
                          />
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.input
                            type="number"
                            value={setting.value}
                            onChange={(e) => setting.onChange(parseInt(e.target.value))}
                            className="w-20 px-3 py-1 text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                            whileFocus={{ scale: 1.05, borderColor: "#3b82f6" }}
                            transition={organicSpring}
                          />
                          {setting.suffix && (
                            <span className="text-sm text-gray-500">
                              {setting.suffix}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-between items-center mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          animate={isLiquifying ? { 
            opacity: 0, 
            scale: 0.8,
            y: 20
          } : { 
            opacity: 1, 
            scale: 1,
            y: 0
          }}
          transition={liquidMorph}
        >
          <motion.button
            onClick={resetToDefaults}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset to Defaults
          </motion.button>

          <motion.div
            className="flex gap-3"
            initial={{ opacity: hasChanges ? 1 : 0.5 }}
            animate={{ opacity: hasChanges ? 1 : 0.5 }}
            transition={organicSpring}
          >
            <MotionButton
              onClick={saveSettings}
              disabled={!hasChanges}
              className="flex items-center gap-2"
              whileHover={{ scale: hasChanges ? 1.05 : 1 }}
              whileTap={{ scale: hasChanges ? 0.95 : 1 }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </MotionButton>
          </motion.div>
        </motion.div>

        {/* Liquify effect overlay */}
        {isLiquifying && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Liquid droplets falling */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-primary-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '10%'
                }}
                animate={{
                  y: [0, window.innerHeight],
                  scale: [1, 0.5, 0],
                  opacity: [0.8, 0.4, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeIn"
                }}
              />
            ))}

            {/* Morphing waves */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/10 to-transparent"
              animate={{
                scaleY: [0, 1, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}