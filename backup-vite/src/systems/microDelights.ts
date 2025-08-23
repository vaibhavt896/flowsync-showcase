/**
 * Micro-Delights System
 * Impossible details that create magical user experiences
 */

export class MicroDelights {
  private constellationParticles: { x: number; y: number; brightness: number }[] = []
  private faviconCanvas: HTMLCanvasElement | null = null
  private breathAnimationId: number | null = null
  
  constructor() {
    this.initializeMicroDelights()
  }
  
  private initializeMicroDelights() {
    this.setupDynamicFavicon()
    this.setupConstellationSystem()
    this.setupBreathingAnimations()
    this.setupLoadingGames()
    this.setupHelpfulSpirits()
    this.setupScreenshotEnhancer()
  }
  
  /**
   * Dynamic favicon that changes based on productivity
   */
  private setupDynamicFavicon() {
    this.faviconCanvas = document.createElement('canvas')
    this.faviconCanvas.width = 32
    this.faviconCanvas.height = 32
  }
  
  updateFavicon(productivity: number, flowState: number) {
    if (!this.faviconCanvas) return
    
    const ctx = this.faviconCanvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, 32, 32)
    
    // Draw base circle
    ctx.beginPath()
    ctx.arc(16, 16, 14, 0, Math.PI * 2)
    
    // Color based on productivity
    const hue = 200 + productivity * 80 // Blue to green
    const saturation = 70 + flowState * 30 // More saturated in flow
    const lightness = 50 + productivity * 20
    
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    ctx.fill()
    
    // Add productivity ring
    if (productivity > 0.1) {
      ctx.beginPath()
      ctx.arc(16, 16, 12, -Math.PI/2, (-Math.PI/2) + (productivity * Math.PI * 2))
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()
    }
    
    // Add flow indicator
    if (flowState > 0.7) {
      ctx.beginPath()
      ctx.arc(16, 16, 8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fill()
    }
    
    // Update favicon
    const dataURL = this.faviconCanvas.toDataURL()
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    
    favicon.href = dataURL
  }
  
  /**
   * Success celebrations create temporary constellations
   */
  private setupConstellationSystem() {
    // Will be triggered on achievements
  }
  
  createSuccessConstellation(centerX: number, centerY: number) {
    const stars = 12
    this.constellationParticles = []
    
    for (let i = 0; i < stars; i++) {
      const angle = (i / stars) * Math.PI * 2
      const distance = 50 + Math.random() * 100
      
      this.constellationParticles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        brightness: Math.random() * 0.5 + 0.5
      })
    }
    
    this.animateConstellation()
  }
  
  private animateConstellation() {
    const canvas = document.createElement('canvas')
    canvas.className = 'fixed inset-0 pointer-events-none z-[9999]'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let opacity = 1
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw constellation
      this.constellationParticles.forEach((star, index) => {
        // Draw star
        ctx.save()
        ctx.globalAlpha = opacity * star.brightness
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw connections to nearby stars
        this.constellationParticles.forEach((otherStar, otherIndex) => {
          if (otherIndex <= index) return
          
          const distance = Math.sqrt(
            Math.pow(star.x - otherStar.x, 2) + 
            Math.pow(star.y - otherStar.y, 2)
          )
          
          if (distance < 120) {
            ctx.globalAlpha = opacity * 0.3
            ctx.strokeStyle = '#FFD700'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(star.x, star.y)
            ctx.lineTo(otherStar.x, otherStar.y)
            ctx.stroke()
          }
        })
        
        ctx.restore()
      })
      
      opacity -= 0.02
      
      if (opacity > 0) {
        requestAnimationFrame(animate)
      } else {
        document.body.removeChild(canvas)
      }
    }
    
    animate()
  }
  
  /**
   * Refresh creates a satisfying "deep breath" animation
   */
  private setupBreathingAnimations() {
    // Will be triggered on page refresh
  }
  
  triggerDeepBreathAnimation() {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center'
    overlay.style.background = 'rgba(59, 130, 246, 0.1)'
    document.body.appendChild(overlay)
    
    const breathCircle = document.createElement('div')
    breathCircle.className = 'w-32 h-32 rounded-full border-2 border-blue-400/50'
    breathCircle.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)'
    overlay.appendChild(breathCircle)
    
    // Breathing animation
    let scale = 0.1
    let growing = true
    
    const breathe = () => {
      if (growing) {
        scale += 0.02
        if (scale >= 1) growing = false
      } else {
        scale -= 0.015
        if (scale <= 0.3) growing = true
      }
      
      breathCircle.style.transform = `scale(${scale})`
      breathCircle.style.opacity = `${0.5 + Math.sin(scale * Math.PI) * 0.3}`
      
      this.breathAnimationId = requestAnimationFrame(breathe)
    }
    
    breathe()
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (this.breathAnimationId) {
        cancelAnimationFrame(this.breathAnimationId)
      }
      document.body.removeChild(overlay)
    }, 3000)
  }
  
  /**
   * Loading states become mini-games
   */
  private setupLoadingGames() {
    // Stack particles while waiting
  }
  
  createParticleStackingGame(container: HTMLElement): () => void {
    let particles: HTMLElement[] = []
    let score = 0
    
    const gameArea = document.createElement('div')
    gameArea.className = 'absolute inset-0 flex flex-col items-center justify-center'
    container.appendChild(gameArea)
    
    const scoreDisplay = document.createElement('div')
    scoreDisplay.className = 'text-white text-sm mb-4'
    scoreDisplay.textContent = 'Stack particles while loading... Score: 0'
    gameArea.appendChild(scoreDisplay)
    
    const stackArea = document.createElement('div')
    stackArea.className = 'relative w-48 h-32 border border-white/30 rounded'
    gameArea.appendChild(stackArea)
    
    // Drop particles
    const dropParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-4 h-4 bg-blue-400 rounded-full cursor-pointer'
      particle.style.left = Math.random() * (stackArea.offsetWidth - 16) + 'px'
      particle.style.top = '0px'
      
      let y = 0
      const fall = () => {
        y += 2
        particle.style.top = y + 'px'
        
        if (y < stackArea.offsetHeight - 16) {
          requestAnimationFrame(fall)
        } else {
          // Particle reached bottom
          score++
          scoreDisplay.textContent = `Stack particles while loading... Score: ${score}`
        }
      }
      
      particle.onclick = () => {
        // Caught the particle
        particle.style.background = '#10B981'
        score += 5
        scoreDisplay.textContent = `Stack particles while loading... Score: ${score}`
      }
      
      stackArea.appendChild(particle)
      particles.push(particle)
      fall()
    }
    
    const gameInterval = setInterval(dropParticle, 800)
    
    return () => {
      clearInterval(gameInterval)
      container.removeChild(gameArea)
    }
  }
  
  /**
   * Error messages appear as helpful spirits
   */
  private setupHelpfulSpirits() {
    // Will replace standard error dialogs
  }
  
  showHelpfulSpirit(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    const spirit = document.createElement('div')
    spirit.className = 'fixed bottom-8 right-8 z-[9999] max-w-sm'
    
    const colors = {
      info: 'from-blue-500 to-cyan-500',
      warning: 'from-yellow-500 to-orange-500',
      error: 'from-red-500 to-pink-500'
    }
    
    spirit.innerHTML = `
      <div class="bg-gradient-to-br ${colors[type]} p-1 rounded-2xl">
        <div class="bg-white dark:bg-gray-900 rounded-xl p-4 m-0.5">
          <div class="flex items-start gap-3">
            <div class="text-2xl">${type === 'error' ? '🔮' : type === 'warning' ? '✨' : '💫'}</div>
            <div class="flex-1">
              <p class="text-sm text-gray-800 dark:text-gray-200">${message}</p>
              <div class="mt-2 text-xs text-gray-500">
                Helpful spirit • Click to dismiss
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    // Floating animation
    spirit.style.animation = 'float 3s ease-in-out infinite'
    
    // Add floating keyframes if not exists
    if (!document.querySelector('#floating-keyframes')) {
      const style = document.createElement('style')
      style.id = 'floating-keyframes'
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
      `
      document.head.appendChild(style)
    }
    
    spirit.onclick = () => {
      spirit.style.animation = 'none'
      spirit.style.transform = 'scale(0.8) translateY(20px)'
      spirit.style.opacity = '0'
      spirit.style.transition = 'all 0.3s ease'
      
      setTimeout(() => {
        document.body.removeChild(spirit)
      }, 300)
    }
    
    document.body.appendChild(spirit)
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      if (document.body.contains(spirit)) {
        spirit.click()
      }
    }, 5000)
  }
  
  /**
   * Screenshots automatically include productivity aura effects
   */
  private setupScreenshotEnhancer() {
    // Enhance screenshots with context
  }
  
  enhanceScreenshot(canvas: HTMLCanvasElement, productivity: number, flowState: number) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Add subtle aura overlay
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 4, 0,
      canvas.width / 2, canvas.height / 4, canvas.width / 2
    )
    
    const hue = 200 + productivity * 80
    gradient.addColorStop(0, `hsla(${hue}, 60%, 60%, 0.1)`)
    gradient.addColorStop(0.5, `hsla(${hue}, 40%, 40%, 0.05)`)
    gradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add productivity badge
    if (productivity > 0.5) {
      const badgeText = `${Math.round(productivity * 100)}% Productive`
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(canvas.width - 150, 20, 130, 30)
      
      ctx.fillStyle = 'white'
      ctx.font = '12px Inter, sans-serif'
      ctx.fillText(badgeText, canvas.width - 140, 40)
    }
  }
  
  /**
   * Device performance adaptation
   */
  adaptToDevice() {
    const { deviceMemory, hardwareConcurrency } = navigator as any
    const connection = (navigator as any).connection
    
    const performance = {
      memory: deviceMemory || 4,
      cores: hardwareConcurrency || 4,
      networkSpeed: connection?.effectiveType === '4g' ? 1 : 0.5,
      batteryLevel: 1 // Will be updated by battery API
    }
    
    // Reduce effects on weak devices
    if (performance.memory < 4 || performance.cores < 4) {
      document.documentElement.style.setProperty('--reduced-motion', '1')
    }
    
    // Adapt to network speed
    if (performance.networkSpeed < 0.8) {
      document.documentElement.style.setProperty('--prefers-reduced-data', '1')
    }
  }
  
  /**
   * User stress level detection (experimental)
   */
  detectStressLevel(): number {
    // Simplified stress detection based on interaction patterns
    const recentClicks = this.getRecentClickFrequency()
    const rapidMouse = this.getRapidMouseMovement()
    
    // High frequency interactions might indicate stress
    const stressLevel = Math.min(1, (recentClicks + rapidMouse) / 2)
    
    // Adapt UI for high stress
    if (stressLevel > 0.7) {
      this.enableCalmingMode()
    }
    
    return stressLevel
  }
  
  private getRecentClickFrequency(): number {
    // Implementation would track click patterns
    return 0.3 // Placeholder
  }
  
  private getRapidMouseMovement(): number {
    // Implementation would track mouse velocity
    return 0.2 // Placeholder
  }
  
  private enableCalmingMode() {
    document.documentElement.style.setProperty('--animation-duration-multiplier', '1.5')
    document.documentElement.style.setProperty('--calming-mode', '1')
  }
  
  /**
   * Cleanup
   */
  destroy() {
    if (this.breathAnimationId) {
      cancelAnimationFrame(this.breathAnimationId)
    }
  }
}