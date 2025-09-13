import { motion } from 'framer-motion'
import { Save, Bell, Palette } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useUserStore } from '@/stores/userStore'
import { useThemeStore } from '@/stores/themeStore'
import { useTimerStore } from '@/stores/timerStore'
import SimpleSoundSettings from '@/components/settings/SimpleSoundSettings'
import { useState } from 'react'

export default function Settings() {
  const { preferences, updatePreferences } = useUserStore()
  const { theme, setTheme } = useThemeStore()
  const { updateFromPreferences } = useTimerStore()
  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [hasChanges, setHasChanges] = useState(false)

  const updateLocalPref = (key: keyof typeof preferences, value: any) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    updatePreferences(localPreferences)
    updateFromPreferences() // Update timer with new preferences
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
      blockedSites: [
        'facebook.com',
        'twitter.com',
        'instagram.com',
        'youtube.com',
        'reddit.com',
        'tiktok.com',
      ],
    }
    setLocalPreferences(defaults)
    setHasChanges(true)
  }

  return (
    <div className="p-2 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Customize your FlowSync experience
        </p>
      </motion.div>

      {/* Timer Settings - Mobile Optimized */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40 rounded-xl p-4 sm:p-6 lg:hidden"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            ⏱️
          </div>
          Timer Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Focus Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="90"
                value={Math.round(localPreferences.focusDuration / 60)}
                onChange={(e) => updateLocalPref('focusDuration', parseInt(e.target.value) * 60)}
                className="input-field flex-1 min-h-[44px]"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">minutes</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Break
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={Math.round(localPreferences.shortBreakDuration / 60)}
                onChange={(e) => updateLocalPref('shortBreakDuration', parseInt(e.target.value) * 60)}
                className="input-field flex-1 min-h-[44px]"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">minutes</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Break
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="60"
                value={Math.round(localPreferences.longBreakDuration / 60)}
                onChange={(e) => updateLocalPref('longBreakDuration', parseInt(e.target.value) * 60)}
                className="input-field flex-1 min-h-[44px]"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">minutes</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Desktop version with card styling */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 hidden lg:block"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            ⏱️
          </div>
          Timer Settings
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Focus Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="90"
                value={Math.round(localPreferences.focusDuration / 60)}
                onChange={(e) => updateLocalPref('focusDuration', parseInt(e.target.value) * 60)}
                className="input-field flex-1 min-h-[44px]"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">minutes</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Short Break
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={Math.round(localPreferences.shortBreakDuration / 60)}
                onChange={(e) => updateLocalPref('shortBreakDuration', parseInt(e.target.value) * 60)}
                className="input-field flex-1 min-h-[44px]"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">minutes</span>
            </div>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Long Break
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="60"
                value={Math.round(localPreferences.longBreakDuration / 60)}
                onChange={(e) => updateLocalPref('longBreakDuration', parseInt(e.target.value) * 60)}
                className="input-field flex-1 min-h-[44px]"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">minutes</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Appearance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          Appearance
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`p-4 rounded-lg border-2 transition-colors min-h-[48px] touch-manipulation ${
                    theme === themeOption
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{themeOption}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>


      {/* Sound Settings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SimpleSoundSettings />
      </motion.section>

      {/* Notifications */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          Notifications
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={localPreferences.notifications}
              onChange={(e) => updateLocalPref('notifications', e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable browser notifications
            </span>
          </label>
        </div>
      </motion.section>

      {/* Automation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            🤖
          </div>
          Automation
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={localPreferences.autoStartBreaks}
              onChange={(e) => updateLocalPref('autoStartBreaks', e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-start breaks
            </span>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={localPreferences.autoStartSessions}
              onChange={(e) => updateLocalPref('autoStartSessions', e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-start focus sessions
            </span>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={localPreferences.blockWebsites}
              onChange={(e) => updateLocalPref('blockWebsites', e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Block distracting websites during focus sessions
            </span>
          </label>
        </div>
      </motion.section>

      {/* Action Buttons - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4"
      >
        <Button
          onClick={saveSettings}
          disabled={!hasChanges}
          className="flex items-center gap-2 w-full sm:w-auto min-h-[44px] touch-manipulation"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
        
        <Button
          onClick={resetToDefaults}
          variant="secondary"
          className="w-full sm:w-auto min-h-[44px] touch-manipulation"
        >
          Reset to Defaults
        </Button>
        
        {hasChanges && (
          <span className="text-sm text-amber-600 dark:text-amber-400 text-center sm:text-left">
            You have unsaved changes
          </span>
        )}
      </motion.div>
    </div>
  )
}