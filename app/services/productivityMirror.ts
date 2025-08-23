// The Productivity Mirror™ - Revolutionary Feature #3
// Real-time visualization of mental state through abstract particle systems

interface Particle {
  id: string
  x: number
  y: number
  vx: number // velocity x
  vy: number // velocity y
  size: number
  opacity: number
  color: string
  age: number
  lifespan: number
  type: 'focus' | 'flow' | 'distraction' | 'fatigue' | 'creativity'
  energy: number // 0-1
  harmony: number // how well it syncs with others
}

interface MentalStateSnapshot {
  focusLevel: number // 0-1
  flowState: number // 0-1
  distractionLevel: number // 0-1
  creativityLevel: number // 0-1
  fatigueLevel: number // 0-1
  cognitiveLoad: number // 0-1
  emotionalState: 'calm' | 'excited' | 'stressed' | 'energized' | 'tired'
  timestamp: number
}

interface VisualizationConfig {
  particleCount: number
  canvasWidth: number
  canvasHeight: number
  colorScheme: 'focus' | 'flow' | 'creative' | 'distracted' | 'fatigued'
  animationSpeed: number
  harmonyFactor: number
  chaosFactor: number
}

export class ProductivityMirror {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private particles: Particle[] = []
  private animationId: number | null = null
  private mentalStateHistory: MentalStateSnapshot[] = []
  private currentMentalState: MentalStateSnapshot | null = null
  private config: VisualizationConfig
  private isRunning = false
  private lastUpdateTime = 0
  private mousePosition = { x: 0, y: 0 }
  private attractors: { x: number; y: number; strength: number }[] = []

  // Color palettes for different mental states
  private colorPalettes = {
    flow: ['#667eea', '#764ba2', '#f093fb', '#f5576c'], // Purple-pink gradient
    focus: ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7'], // Blue-teal gradient
    creative: ['#fa709a', '#fee140', '#ffeaa7', '#fab1a0'], // Warm creative colors
    distracted: ['#ff7675', '#fd79a8', '#e84393', '#a29bfe'], // Chaotic reds
    fatigued: ['#b2bec3', '#74b9ff', '#0984e3', '#636e72'], // Muted blues
    calm: ['#00b894', '#00cec9', '#55efc4', '#81ecec'], // Peaceful greens
  }

  constructor() {
    this.config = {
      particleCount: 150,
      canvasWidth: 800,
      canvasHeight: 400,
      colorScheme: 'focus',
      animationSpeed: 1,
      harmonyFactor: 0.8,
      chaosFactor: 0.2
    }
    
    console.log('🎨 Productivity Mirror™: Initializing particle visualization system')
    this.startMentalStateTracking()
  }

  // === CORE VISUALIZATION ENGINE ===

  initializeCanvas(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement
    this.ctx = canvasElement.getContext('2d')
    
    if (!this.ctx) {
      console.error('Failed to get 2D context')
      return
    }

    // Set canvas size
    this.canvas.width = this.config.canvasWidth
    this.canvas.height = this.config.canvasHeight
    
    // Initialize particles
    this.createParticleSystem()
    
    // Add mouse interaction
    this.setupMouseInteraction()
    
    // Start animation loop
    this.startVisualization()
    
    console.log('🎨 Canvas initialized - Productivity Mirror™ active')
  }

  private createParticleSystem() {
    this.particles = []
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.createParticle())
    }
    
    // Create attractors for harmony patterns
    this.createAttractors()
  }

  private createParticle(): Particle {
    const types: Particle['type'][] = ['focus', 'flow', 'distraction', 'fatigue', 'creativity']
    const type = types[Math.floor(Math.random() * types.length)]
    
    return {
      id: `particle_${Date.now()}_${Math.random()}`,
      x: Math.random() * this.config.canvasWidth,
      y: Math.random() * this.config.canvasHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.7,
      color: this.getParticleColor(type),
      age: 0,
      lifespan: 500 + Math.random() * 1000,
      type,
      energy: Math.random(),
      harmony: Math.random()
    }
  }

  private createAttractors() {
    // Create harmony points that particles can be attracted to during flow states
    this.attractors = [
      { x: this.config.canvasWidth * 0.25, y: this.config.canvasHeight * 0.5, strength: 1 },
      { x: this.config.canvasWidth * 0.75, y: this.config.canvasHeight * 0.5, strength: 1 },
      { x: this.config.canvasWidth * 0.5, y: this.config.canvasHeight * 0.3, strength: 0.8 },
      { x: this.config.canvasWidth * 0.5, y: this.config.canvasHeight * 0.7, strength: 0.8 },
    ]
  }

  // === MENTAL STATE TRACKING ===

  private startMentalStateTracking() {
    // Track mental state every 2 seconds
    setInterval(() => {
      this.updateMentalState()
    }, 2000)
    
    // Initial state
    this.updateMentalState()
  }

  private updateMentalState() {
    // In a real implementation, this would integrate with:
    // - Neural predictor data
    // - Biological rhythm data
    // - User input patterns
    // - Eye tracking (if available)
    // - Heart rate variability (if available)
    
    const now = Date.now()
    const hour = new Date().getHours()
    
    // Simulate realistic mental state based on time and patterns
    const newState: MentalStateSnapshot = {
      focusLevel: this.simulateFocusLevel(hour),
      flowState: this.simulateFlowState(hour),
      distractionLevel: this.simulateDistractionLevel(),
      creativityLevel: this.simulateCreativityLevel(hour),
      fatigueLevel: this.simulateFatigueLevel(hour),
      cognitiveLoad: this.simulateCognitiveLoad(),
      emotionalState: this.determineEmotionalState(hour),
      timestamp: now
    }
    
    this.currentMentalState = newState
    this.mentalStateHistory.push(newState)
    
    // Keep history manageable
    if (this.mentalStateHistory.length > 1000) {
      this.mentalStateHistory = this.mentalStateHistory.slice(-800)
    }
    
    // Update visualization based on new mental state
    this.updateVisualizationFromMentalState(newState)
    
    console.log('🧠 Mental state updated:', {
      focus: Math.round(newState.focusLevel * 100),
      flow: Math.round(newState.flowState * 100),
      emotional: newState.emotionalState
    })
  }

  // === PARTICLE BEHAVIOR BASED ON MENTAL STATE ===

  private updateVisualizationFromMentalState(state: MentalStateSnapshot) {
    // Update configuration based on mental state
    this.updateVisualizationConfig(state)
    
    // Update particle behaviors
    this.updateParticleBehaviors(state)
    
    // Update color scheme
    this.updateColorScheme(state)
  }

  private updateVisualizationConfig(state: MentalStateSnapshot) {
    // Flow state: High harmony, smooth movement
    if (state.flowState > 0.7) {
      this.config.harmonyFactor = 0.9
      this.config.chaosFactor = 0.1
      this.config.animationSpeed = 0.8
      this.config.colorScheme = 'flow'
    }
    // High focus: Structured movement
    else if (state.focusLevel > 0.7) {
      this.config.harmonyFactor = 0.7
      this.config.chaosFactor = 0.3
      this.config.animationSpeed = 1.0
      this.config.colorScheme = 'focus'
    }
    // High creativity: Dynamic, flowing
    else if (state.creativityLevel > 0.7) {
      this.config.harmonyFactor = 0.6
      this.config.chaosFactor = 0.4
      this.config.animationSpeed = 1.2
      this.config.colorScheme = 'creative'
    }
    // High distraction: Chaotic movement
    else if (state.distractionLevel > 0.6) {
      this.config.harmonyFactor = 0.2
      this.config.chaosFactor = 0.8
      this.config.animationSpeed = 1.5
      this.config.colorScheme = 'distracted'
    }
    // High fatigue: Slow, muted
    else if (state.fatigueLevel > 0.6) {
      this.config.harmonyFactor = 0.4
      this.config.chaosFactor = 0.2
      this.config.animationSpeed = 0.5
      this.config.colorScheme = 'fatigued'
    }
    // Default: Balanced
    else {
      this.config.harmonyFactor = 0.5
      this.config.chaosFactor = 0.5
      this.config.animationSpeed = 1.0
      this.config.colorScheme = 'focus'
    }
  }

  private updateParticleBehaviors(state: MentalStateSnapshot) {
    this.particles.forEach(particle => {
      // Update particle properties based on mental state
      if (state.flowState > 0.7) {
        // Flow state: particles move in harmony
        particle.harmony = Math.min(1, particle.harmony + 0.1)
        this.applyHarmoniousMovement(particle)
      } else if (state.distractionLevel > 0.6) {
        // Distracted: chaotic movement
        particle.harmony = Math.max(0, particle.harmony - 0.1)
        this.applyChaoticMovement(particle)
      }
      
      // Adjust particle energy based on focus
      particle.energy = particle.energy * 0.9 + state.focusLevel * 0.1
      
      // Update particle color intensity based on state
      particle.opacity = 0.3 + state.focusLevel * 0.7
    })
  }

  private applyHarmoniousMovement(particle: Particle) {
    // Attract particles to harmony points during flow
    const nearestAttractor = this.findNearestAttractor(particle)
    if (nearestAttractor) {
      const dx = nearestAttractor.x - particle.x
      const dy = nearestAttractor.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 0) {
        const force = nearestAttractor.strength / (distance * 0.01)
        particle.vx += (dx / distance) * force * 0.02
        particle.vy += (dy / distance) * force * 0.02
      }
    }
    
    // Apply gentle velocity damping for smooth movement
    particle.vx *= 0.98
    particle.vy *= 0.98
    
    // Add subtle orbital motion
    const angle = Math.atan2(particle.y - this.config.canvasHeight/2, particle.x - this.config.canvasWidth/2)
    particle.vx += Math.cos(angle + Math.PI/2) * 0.1 * particle.harmony
    particle.vy += Math.sin(angle + Math.PI/2) * 0.1 * particle.harmony
  }

  private applyChaoticMovement(particle: Particle) {
    // Add random forces for chaotic movement
    particle.vx += (Math.random() - 0.5) * 2 * this.config.chaosFactor
    particle.vy += (Math.random() - 0.5) * 2 * this.config.chaosFactor
    
    // Increase velocity variation
    particle.vx *= (0.9 + Math.random() * 0.2)
    particle.vy *= (0.9 + Math.random() * 0.2)
  }

  private findNearestAttractor(particle: Particle): { x: number; y: number; strength: number } | null {
    let nearest = null
    let minDistance = Infinity
    
    this.attractors.forEach(attractor => {
      const dx = attractor.x - particle.x
      const dy = attractor.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < minDistance) {
        minDistance = distance
        nearest = attractor
      }
    })
    
    return nearest
  }

  // === ANIMATION LOOP ===

  private startVisualization() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.lastUpdateTime = performance.now()
    this.animate()
  }

  private animate = (currentTime: number = performance.now()) => {
    if (!this.isRunning || !this.ctx || !this.canvas) return
    
    const deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime
    
    // Clear canvas with subtle trail effect for smooth motion
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)' // Dark background with transparency
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Update and draw particles
    this.updateParticles(deltaTime)
    this.drawParticles()
    
    // Draw connections between nearby particles for harmony effect
    if (this.config.harmonyFactor > 0.5) {
      this.drawParticleConnections()
    }
    
    // Continue animation
    this.animationId = requestAnimationFrame(this.animate)
  }

  private updateParticles(deltaTime: number) {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx * this.config.animationSpeed
      particle.y += particle.vy * this.config.animationSpeed
      
      // Update age
      particle.age += deltaTime
      
      // Boundary wrapping for infinite canvas feel
      if (particle.x < 0) particle.x = this.config.canvasWidth
      if (particle.x > this.config.canvasWidth) particle.x = 0
      if (particle.y < 0) particle.y = this.config.canvasHeight
      if (particle.y > this.config.canvasHeight) particle.y = 0
      
      // Regenerate old particles
      if (particle.age > particle.lifespan) {
        Object.assign(particle, this.createParticle())
      }
    })
  }

  private drawParticles() {
    if (!this.ctx) return
    
    this.particles.forEach(particle => {
      this.ctx!.save()
      
      // Create radial gradient for each particle
      const gradient = this.ctx!.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )
      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, 'transparent')
      
      this.ctx!.fillStyle = gradient
      this.ctx!.globalAlpha = particle.opacity * particle.energy
      
      // Draw particle
      this.ctx!.beginPath()
      this.ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx!.fill()
      
      this.ctx!.restore()
    })
  }

  private drawParticleConnections() {
    if (!this.ctx) return
    
    const connectionDistance = 100
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i]
        const p2 = this.particles[j]
        
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < connectionDistance && p1.harmony > 0.5 && p2.harmony > 0.5) {
          const opacity = (1 - distance / connectionDistance) * 0.3 * this.config.harmonyFactor
          
          this.ctx.save()
          this.ctx.strokeStyle = `rgba(103, 126, 234, ${opacity})`
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.stroke()
          this.ctx.restore()
        }
      }
    }
  }

  // === UTILITY METHODS ===

  private getParticleColor(type: Particle['type']): string {
    const palette = this.colorPalettes[this.config.colorScheme] || this.colorPalettes.calm
    return palette[Math.floor(Math.random() * palette.length)]
  }

  private updateColorScheme(state: MentalStateSnapshot) {
    // Update all particle colors gradually
    this.particles.forEach(particle => {
      if (Math.random() < 0.1) { // Gradual color transition
        particle.color = this.getParticleColor(particle.type)
      }
    })
  }

  private setupMouseInteraction() {
    if (!this.canvas) return
    
    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas!.getBoundingClientRect()
      this.mousePosition.x = event.clientX - rect.left
      this.mousePosition.y = event.clientY - rect.top
      
      // Add mouse as a temporary attractor
      this.particles.forEach(particle => {
        const dx = this.mousePosition.x - particle.x
        const dy = this.mousePosition.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100 && distance > 0) {
          const force = 50 / distance
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }
      })
    })
  }

  // === SIMULATION METHODS (would be replaced with real data) ===

  private simulateFocusLevel(hour: number): number {
    // Simulate focus based on time of day and natural rhythms
    let focus = 0.5
    
    // Morning focus peak
    if (hour >= 9 && hour <= 11) focus += 0.3
    // Afternoon dip
    if (hour >= 13 && hour <= 15) focus -= 0.2
    // Evening focus
    if (hour >= 19 && hour <= 21) focus += 0.1
    
    // Add some randomness
    focus += (Math.random() - 0.5) * 0.3
    
    return Math.max(0, Math.min(1, focus))
  }

  private simulateFlowState(hour: number): number {
    const focus = this.simulateFocusLevel(hour)
    const creativity = this.simulateCreativityLevel(hour)
    
    // Flow is combination of focus and creativity
    let flow = (focus + creativity) / 2
    
    // Peak flow times
    if ((hour >= 10 && hour <= 11) || (hour >= 14 && hour <= 16)) {
      flow += 0.2
    }
    
    return Math.max(0, Math.min(1, flow))
  }

  private simulateDistractionLevel(): number {
    // Random distraction with some patterns
    let distraction = Math.random() * 0.4
    
    // Higher distraction if recent tab switches (simulate)
    if (Math.random() < 0.3) distraction += 0.3
    
    return Math.max(0, Math.min(1, distraction))
  }

  private simulateCreativityLevel(hour: number): number {
    let creativity = 0.5
    
    // Creative peaks often in afternoon/evening
    if (hour >= 14 && hour <= 17) creativity += 0.2
    if (hour >= 19 && hour <= 21) creativity += 0.3
    
    creativity += (Math.random() - 0.5) * 0.3
    
    return Math.max(0, Math.min(1, creativity))
  }

  private simulateFatigueLevel(hour: number): number {
    let fatigue = 0.3
    
    // Natural fatigue patterns
    if (hour >= 13 && hour <= 15) fatigue += 0.3 // Post-lunch
    if (hour >= 22 || hour <= 6) fatigue += 0.4 // Night/early morning
    
    fatigue += Math.random() * 0.2
    
    return Math.max(0, Math.min(1, fatigue))
  }

  private simulateCognitiveLoad(): number {
    // Simulate current cognitive load
    return 0.3 + Math.random() * 0.5
  }

  private determineEmotionalState(hour: number): MentalStateSnapshot['emotionalState'] {
    const states: MentalStateSnapshot['emotionalState'][] = ['calm', 'excited', 'stressed', 'energized', 'tired']
    
    // Time-based emotional tendencies
    if (hour >= 9 && hour <= 11) return Math.random() < 0.6 ? 'energized' : 'excited'
    if (hour >= 13 && hour <= 15) return Math.random() < 0.5 ? 'tired' : 'calm'
    if (hour >= 19 && hour <= 21) return Math.random() < 0.4 ? 'stressed' : 'calm'
    
    return states[Math.floor(Math.random() * states.length)]
  }

  // === PUBLIC API ===

  getCurrentMentalState(): MentalStateSnapshot | null {
    return this.currentMentalState
  }

  getVisualizationMetrics() {
    return {
      particleCount: this.particles.length,
      harmonyLevel: this.config.harmonyFactor,
      chaosLevel: this.config.chaosFactor,
      currentColorScheme: this.config.colorScheme,
      averageParticleHarmony: this.particles.reduce((sum, p) => sum + p.harmony, 0) / this.particles.length,
      averageParticleEnergy: this.particles.reduce((sum, p) => sum + p.energy, 0) / this.particles.length
    }
  }

  // Manual mental state override for testing
  setMentalState(state: Partial<MentalStateSnapshot>) {
    if (this.currentMentalState) {
      this.currentMentalState = { ...this.currentMentalState, ...state, timestamp: Date.now() }
      this.updateVisualizationFromMentalState(this.currentMentalState)
    }
  }

  stopVisualization() {
    this.isRunning = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  destroy() {
    this.stopVisualization()
    this.particles = []
    this.mentalStateHistory = []
  }
}

export default ProductivityMirror