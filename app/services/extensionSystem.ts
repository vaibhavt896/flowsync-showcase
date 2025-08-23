'use client'

/**
 * Raycast-inspired extension architecture with JSON-RPC communication
 * Provides sophisticated multi-process communication and extension management
 */

import { EventEmitter } from 'events'

export interface ExtensionManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  permissions: string[]
  commands: Command[]
  preferences: Preference[]
  main?: string
  icon?: string
  category: 'productivity' | 'utility' | 'workflow' | 'integration'
}

export interface Command {
  name: string
  title: string
  description: string
  mode: 'view' | 'no-view' | 'menu-bar'
  keywords?: string[]
  icon?: string
  arguments?: Argument[]
}

export interface Argument {
  name: string
  placeholder: string
  type: 'text' | 'password' | 'dropdown'
  required?: boolean
  options?: string[]
}

export interface Preference {
  name: string
  title: string
  description: string
  type: 'textfield' | 'password' | 'checkbox' | 'dropdown'
  required?: boolean
  default?: any
  options?: string[]
}

export interface ExtensionContext {
  preferences: Record<string, any>
  environment: Record<string, string>
  clipboard: ClipboardAPI
  showToast: (options: ToastOptions) => void
  showHUD: (text: string) => void
  openExtensionPreferences: () => void
  cache: CacheAPI
  AI: AIAssistantAPI
}

export interface ToastOptions {
  style: 'success' | 'failure' | 'info'
  title: string
  message?: string
  primaryAction?: {
    title: string
    onAction: () => void
  }
}

export interface ClipboardAPI {
  readText(): Promise<string>
  writeText(text: string): Promise<void>
  readImage(): Promise<Blob | null>
  writeImage(image: Blob): Promise<void>
}

export interface CacheAPI {
  get<T = any>(key: string): Promise<T | null>
  set(key: string, value: any, ttl?: number): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

export interface AIAssistantAPI {
  ask(prompt: string, model?: string): Promise<string>
  complete(text: string): Promise<string>
  summarize(text: string): Promise<string>
}

export interface JSONRPCRequest {
  jsonrpc: '2.0'
  method: string
  params?: any
  id?: string | number
}

export interface JSONRPCResponse {
  jsonrpc: '2.0'
  result?: any
  error?: JSONRPCErrorData
  id?: string | number
}

interface JSONRPCErrorData {
  code: number
  message: string
  data?: any
}

class RaycastExtensionSystem extends EventEmitter {
  private extensions = new Map<string, ExtensionManifest>()
  private extensionWorkers = new Map<string, Worker>()
  private extensionContexts = new Map<string, ExtensionContext>()
  private messageHandlers = new Map<string, (request: JSONRPCRequest) => Promise<any>>()
  private cache = new Map<string, { value: any; expires: number }>()
  private preferences = new Map<string, Record<string, any>>()

  constructor() {
    super()
    this.setupCoreExtensions()
    this.setupMessageHandling()
  }

  /**
   * Register built-in core extensions
   */
  private setupCoreExtensions(): void {
    // Timer Control Extension
    this.registerExtension({
      id: 'timer-control',
      name: 'Timer Control',
      version: '1.0.0',
      description: 'Control FlowSync timer with quick commands',
      author: 'FlowSync',
      category: 'productivity',
      permissions: ['timer:read', 'timer:write'],
      commands: [
        {
          name: 'start-timer',
          title: 'Start Focus Timer',
          description: 'Start a new focus session',
          mode: 'no-view',
          keywords: ['focus', 'start', 'timer', 'pomodoro'],
          arguments: [
            {
              name: 'duration',
              placeholder: 'Duration in minutes (default: 25)',
              type: 'text',
              required: false
            }
          ]
        },
        {
          name: 'pause-timer',
          title: 'Pause Timer',
          description: 'Pause the current timer',
          mode: 'no-view',
          keywords: ['pause', 'stop', 'break']
        }
      ],
      preferences: [
        {
          name: 'default_duration',
          title: 'Default Timer Duration',
          description: 'Default focus session duration in minutes',
          type: 'textfield',
          default: '25'
        }
      ]
    })

    // Quick Notes Extension
    this.registerExtension({
      id: 'quick-notes',
      name: 'Quick Notes',
      version: '1.0.0',
      description: 'Capture and manage quick notes during focus sessions',
      author: 'FlowSync',
      category: 'utility',
      permissions: ['storage:read', 'storage:write'],
      commands: [
        {
          name: 'add-note',
          title: 'Add Quick Note',
          description: 'Add a quick note to current session',
          mode: 'view',
          keywords: ['note', 'write', 'capture'],
          arguments: [
            {
              name: 'content',
              placeholder: 'Note content...',
              type: 'text',
              required: true
            }
          ]
        }
      ],
      preferences: []
    })
  }

  /**
   * Setup JSON-RPC message handling
   */
  private setupMessageHandling(): void {
    // Core API handlers
    this.messageHandlers.set('timer.start', this.handleTimerStart.bind(this))
    this.messageHandlers.set('timer.pause', this.handleTimerPause.bind(this))
    this.messageHandlers.set('timer.getStatus', this.handleTimerGetStatus.bind(this))
    this.messageHandlers.set('notes.add', this.handleNotesAdd.bind(this))
    this.messageHandlers.set('notes.list', this.handleNotesList.bind(this))
    this.messageHandlers.set('preferences.get', this.handlePreferencesGet.bind(this))
    this.messageHandlers.set('preferences.set', this.handlePreferencesSet.bind(this))
    this.messageHandlers.set('cache.get', this.handleCacheGet.bind(this))
    this.messageHandlers.set('cache.set', this.handleCacheSet.bind(this))
  }

  /**
   * Register a new extension
   */
  public registerExtension(manifest: ExtensionManifest): void {
    this.extensions.set(manifest.id, manifest)
    this.createExtensionContext(manifest)
    this.emit('extensionRegistered', manifest)
  }

  /**
   * Create extension context with APIs
   */
  private createExtensionContext(manifest: ExtensionManifest): ExtensionContext {
    const context: ExtensionContext = {
      preferences: this.preferences.get(manifest.id) || {},
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        EXTENSION_ID: manifest.id,
        EXTENSION_VERSION: manifest.version
      },
      clipboard: this.createClipboardAPI(),
      showToast: this.createToastAPI(),
      showHUD: this.createHUDAPI(),
      openExtensionPreferences: () => this.openPreferences(manifest.id),
      cache: this.createCacheAPI(manifest.id),
      AI: this.createAIAPI()
    }

    this.extensionContexts.set(manifest.id, context)
    return context
  }

  /**
   * Execute extension command with JSON-RPC
   */
  public async executeCommand(
    extensionId: string,
    commandName: string,
    args: Record<string, any> = {}
  ): Promise<any> {
    const extension = this.extensions.get(extensionId)
    if (!extension) {
      throw new Error(`Extension not found: ${extensionId}`)
    }

    const command = extension.commands.find(cmd => cmd.name === commandName)
    if (!command) {
      throw new Error(`Command not found: ${commandName}`)
    }

    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      method: commandName,
      params: args,
      id: `${extensionId}_${Date.now()}`
    }

    return this.sendMessage(extensionId, request)
  }

  /**
   * Send JSON-RPC message to extension
   */
  private async sendMessage(extensionId: string, request: JSONRPCRequest): Promise<any> {
    const handler = this.messageHandlers.get(request.method)
    
    if (!handler) {
      throw new JSONRPCError(-32601, `Method not found: ${request.method}`)
    }

    try {
      const result = await handler(request)
      return {
        jsonrpc: '2.0',
        result,
        id: request.id
      } as JSONRPCResponse
    } catch (error) {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: error instanceof Error ? error.message : 'Unknown error',
          data: error
        },
        id: request.id
      } as JSONRPCResponse
    }
  }

  /**
   * Timer API handlers
   */
  private async handleTimerStart(request: JSONRPCRequest): Promise<any> {
    const duration = request.params?.duration || 25
    
    // Emit timer start event
    this.emit('timerStart', { duration: duration * 60 * 1000 })
    
    return { success: true, duration, message: `Timer started for ${duration} minutes` }
  }

  private async handleTimerPause(request: JSONRPCRequest): Promise<any> {
    this.emit('timerPause')
    return { success: true, message: 'Timer paused' }
  }

  private async handleTimerGetStatus(request: JSONRPCRequest): Promise<any> {
    // This would integrate with actual timer state
    return { 
      isRunning: false, 
      remainingTime: 0,
      totalTime: 25 * 60 * 1000,
      type: 'focus'
    }
  }

  /**
   * Notes API handlers
   */
  private async handleNotesAdd(request: JSONRPCRequest): Promise<any> {
    const content = request.params?.content
    if (!content) {
      throw new Error('Note content is required')
    }

    const note = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      sessionId: 'current'
    }

    // Store note (would integrate with actual storage)
    const notes = this.cache.get('session_notes')?.value || []
    notes.push(note)
    this.cache.set('session_notes', { value: notes, expires: Date.now() + 24 * 60 * 60 * 1000 })

    return { success: true, note }
  }

  private async handleNotesList(request: JSONRPCRequest): Promise<any> {
    const notes = this.cache.get('session_notes')?.value || []
    return { notes }
  }

  /**
   * Preferences API handlers
   */
  private async handlePreferencesGet(request: JSONRPCRequest): Promise<any> {
    const extensionId = request.params?.extensionId
    return this.preferences.get(extensionId) || {}
  }

  private async handlePreferencesSet(request: JSONRPCRequest): Promise<any> {
    const { extensionId, preferences } = request.params
    this.preferences.set(extensionId, preferences)
    return { success: true }
  }

  /**
   * Cache API handlers
   */
  private async handleCacheGet(request: JSONRPCRequest): Promise<any> {
    const key = request.params?.key
    const cached = this.cache.get(key)
    
    if (!cached || cached.expires < Date.now()) {
      return null
    }
    
    return cached.value
  }

  private async handleCacheSet(request: JSONRPCRequest): Promise<any> {
    const { key, value, ttl = 3600000 } = request.params // Default 1 hour TTL
    this.cache.set(key, { value, expires: Date.now() + ttl })
    return { success: true }
  }

  /**
   * Create Clipboard API
   */
  private createClipboardAPI(): ClipboardAPI {
    return {
      async readText(): Promise<string> {
        try {
          return await navigator.clipboard.readText()
        } catch {
          return ''
        }
      },
      async writeText(text: string): Promise<void> {
        await navigator.clipboard.writeText(text)
      },
      async readImage(): Promise<Blob | null> {
        try {
          const items = await navigator.clipboard.read()
          for (const item of items) {
            for (const type of item.types) {
              if (type.startsWith('image/')) {
                return await item.getType(type)
              }
            }
          }
          return null
        } catch {
          return null
        }
      },
      async writeImage(image: Blob): Promise<void> {
        await navigator.clipboard.write([
          new ClipboardItem({ [image.type]: image })
        ])
      }
    }
  }

  /**
   * Create Toast API
   */
  private createToastAPI() {
    return (options: ToastOptions) => {
      const event = new CustomEvent('flowsync-toast', {
        detail: options
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * Create HUD API
   */
  private createHUDAPI() {
    return (text: string) => {
      const event = new CustomEvent('flowsync-hud', {
        detail: { text }
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * Create Cache API for extension
   */
  private createCacheAPI(extensionId: string): CacheAPI {
    const cache = this.cache
    return {
      async get<T = any>(key: string): Promise<T | null> {
        const prefixedKey = `${extensionId}:${key}`
        const cached = cache.get(prefixedKey)
        
        if (!cached || cached.expires < Date.now()) {
          return null
        }
        
        return cached.value
      },
      async set(key: string, value: any, ttl: number = 3600000): Promise<void> {
        const prefixedKey = `${extensionId}:${key}`
        cache.set(prefixedKey, { value, expires: Date.now() + ttl })
      },
      async remove(key: string): Promise<void> {
        const prefixedKey = `${extensionId}:${key}`
        cache.delete(prefixedKey)
      },
      async clear(): Promise<void> {
        const prefix = `${extensionId}:`
        for (const key of Array.from(cache.keys())) {
          if (key.startsWith(prefix)) {
            cache.delete(key)
          }
        }
      }
    }
  }

  /**
   * Create AI Assistant API
   */
  private createAIAPI(): AIAssistantAPI {
    return {
      async ask(prompt: string, model?: string): Promise<string> {
        // This would integrate with actual AI service
        return `AI response to: ${prompt}`
      },
      async complete(text: string): Promise<string> {
        return `${text} [AI completion]`
      },
      async summarize(text: string): Promise<string> {
        return `Summary of: ${text.substring(0, 50)}...`
      }
    }
  }

  /**
   * Open extension preferences
   */
  private openPreferences(extensionId: string): void {
    const event = new CustomEvent('flowsync-open-preferences', {
      detail: { extensionId }
    })
    window.dispatchEvent(event)
  }

  /**
   * Get all registered extensions
   */
  public getExtensions(): ExtensionManifest[] {
    return Array.from(this.extensions.values())
  }

  /**
   * Get extension by ID
   */
  public getExtension(id: string): ExtensionManifest | null {
    return this.extensions.get(id) || null
  }

  /**
   * Search extensions and commands
   */
  public searchCommands(query: string): Array<{ extension: ExtensionManifest; command: Command }> {
    const results: Array<{ extension: ExtensionManifest; command: Command }> = []
    const queryLower = query.toLowerCase()

    for (const extension of Array.from(this.extensions.values())) {
      for (const command of extension.commands) {
        const searchText = [
          command.title,
          command.description,
          ...(command.keywords || [])
        ].join(' ').toLowerCase()

        if (searchText.includes(queryLower)) {
          results.push({ extension, command })
        }
      }
    }

    return results.sort((a, b) => {
      // Sort by relevance (exact title matches first)
      const aExact = a.command.title.toLowerCase().includes(queryLower)
      const bExact = b.command.title.toLowerCase().includes(queryLower)
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      return a.command.title.localeCompare(b.command.title)
    })
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.extensionWorkers.forEach(worker => worker.terminate())
    this.extensionWorkers.clear()
    this.extensions.clear()
    this.extensionContexts.clear()
    this.messageHandlers.clear()
    this.cache.clear()
    this.preferences.clear()
    this.removeAllListeners()
  }
}

export class JSONRPCError extends Error {
  constructor(public code: number, message: string, public data?: any) {
    super(message)
    this.name = 'JSONRPCError'
  }
}

// Export singleton instance
let extensionSystem: RaycastExtensionSystem | null = null

export function getExtensionSystem(): RaycastExtensionSystem {
  if (!extensionSystem) {
    extensionSystem = new RaycastExtensionSystem()
  }
  return extensionSystem
}

export default getExtensionSystem