/**
 * Advanced Physics Engine for FlowSync
 * Natural physics for all animations with choreographed sequences
 */

export interface SpringConfig {
  stiffness: number
  damping: number
  mass?: number
}

export interface TimingFunction {
  enter: string
  exit: string
  loop: string
}

// Spring Constants for different interaction types
export const SpringConstants: Record<string, SpringConfig> = {
  navigation: { stiffness: 170, damping: 26 }, // snappy but smooth
  ambient: { stiffness: 50, damping: 20 },     // gentle floating
  urgent: { stiffness: 300, damping: 30 },     // immediate response
  vortex: { stiffness: 120, damping: 25 },     // dramatic but controlled
  aurora: { stiffness: 40, damping: 18 },      // flowing and organic
  quantum: { stiffness: 200, damping: 28 },    // precise but soft
}

// Natural timing functions
export const TimingFunctions: TimingFunction = {
  enter: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // slight overshoot
  exit: 'cubic-bezier(0.4, 0.0, 0.2, 1)',          // natural deceleration
  loop: 'cubic-bezier(0.4, 0.0, 0.6, 1)',          // breathing effect
}

// Choreographed animation sequences
export const Choreography = {
  sessionStart: {
    buttonPress: { delay: 0, duration: 100 },
    timerScale: { delay: 100, duration: 200 },
    uiFade: { delay: 200, duration: 300 },
    timerBounce: { delay: 400, duration: 200 },
    particleOrganize: { delay: 600, duration: 400 },
    finalState: { delay: 1000, duration: 0 }
  },
  
  vortexEntry: {
    preparation: { delay: 0, duration: 200 },
    spiral: { delay: 200, duration: 800 },
    absorption: { delay: 1000, duration: 400 },
    emergence: { delay: 1400, duration: 600 }
  },
  
  quantumReveal: {
    longPressDetect: { delay: 0, duration: 150 },
    ripple: { delay: 150, duration: 300 },
    orbitEmerge: { delay: 450, duration: 500 },
    stabilize: { delay: 950, duration: 200 }
  }
}

/**
 * Calculate spring animation parameters
 */
export function calculateSpring(config: SpringConfig): any {
  const { stiffness, damping, mass = 1 } = config
  return {
    type: "spring",
    stiffness,
    damping,
    mass,
    restDelta: 0.001,
    restSpeed: 0.01
  }
}

/**
 * Generate natural wave function for breathing effects
 */
export function createBreathingWave(
  amplitude: number = 0.05,
  frequency: number = 0.3,
  offset: number = 0
): (time: number) => number {
  return (time: number) => {
    return Math.sin((time * frequency) + offset) * amplitude + 1
  }
}

/**
 * Particle physics for aurora and vortex effects
 */
export class ParticleSystem {
  particles: Particle[] = []
  forces: Force[] = []
  
  constructor(private maxParticles: number = 100) {}
  
  addParticle(particle: Particle) {
    if (this.particles.length < this.maxParticles) {
      this.particles.push(particle)
    }
  }
  
  addForce(force: Force) {
    this.forces.push(force)
  }
  
  update(deltaTime: number) {
    // Apply forces to particles
    this.particles.forEach(particle => {
      this.forces.forEach(force => {
        force.apply(particle, deltaTime)
      })
      particle.update(deltaTime)
    })
    
    // Remove dead particles
    this.particles = this.particles.filter(p => p.life > 0)
  }
  
  getParticleData() {
    return this.particles.map(p => ({
      x: p.position.x,
      y: p.position.y,
      z: p.position.z,
      opacity: p.life,
      size: p.size,
      color: p.color
    }))
  }
}

export interface Vector3 {
  x: number
  y: number
  z: number
}

export class Particle {
  position: Vector3
  velocity: Vector3
  acceleration: Vector3
  life: number
  maxLife: number
  size: number
  color: string
  
  constructor(
    position: Vector3,
    velocity: Vector3 = { x: 0, y: 0, z: 0 },
    life: number = 1,
    size: number = 1,
    color: string = '#ffffff'
  ) {
    this.position = position
    this.velocity = velocity
    this.acceleration = { x: 0, y: 0, z: 0 }
    this.life = life
    this.maxLife = life
    this.size = size
    this.color = color
  }
  
  update(deltaTime: number) {
    // Update velocity with acceleration
    this.velocity.x += this.acceleration.x * deltaTime
    this.velocity.y += this.acceleration.y * deltaTime
    this.velocity.z += this.acceleration.z * deltaTime
    
    // Update position with velocity
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime
    this.position.z += this.velocity.z * deltaTime
    
    // Decay life
    this.life = Math.max(0, this.life - deltaTime * 0.01)
    
    // Reset acceleration
    this.acceleration = { x: 0, y: 0, z: 0 }
  }
}

export abstract class Force {
  abstract apply(particle: Particle, deltaTime: number): void
}

export class GravityForce extends Force {
  constructor(private gravity: Vector3) {
    super()
  }
  
  apply(particle: Particle, deltaTime: number) {
    particle.acceleration.x += this.gravity.x
    particle.acceleration.y += this.gravity.y
    particle.acceleration.z += this.gravity.z
  }
}

export class VortexForce extends Force {
  constructor(
    private center: Vector3,
    private strength: number,
    private radius: number
  ) {
    super()
  }
  
  apply(particle: Particle, deltaTime: number) {
    const dx = particle.position.x - this.center.x
    const dy = particle.position.y - this.center.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < this.radius && distance > 0) {
      const force = this.strength / (distance * distance)
      const angle = Math.atan2(dy, dx) + Math.PI * 0.5
      
      particle.acceleration.x += Math.cos(angle) * force
      particle.acceleration.y += Math.sin(angle) * force
      
      // Pull towards center
      particle.acceleration.x -= (dx / distance) * force * 0.3
      particle.acceleration.y -= (dy / distance) * force * 0.3
    }
  }
}

/**
 * Performance-aware animation controller
 */
export class AnimationController {
  private rafId: number | null = null
  private lastTime: number = 0
  private fps: number = 60
  private frameTime: number = 1000 / 60
  
  constructor(private targetFPS: number = 60) {
    this.frameTime = 1000 / targetFPS
  }
  
  start(callback: (deltaTime: number) => void) {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime
      
      if (deltaTime >= this.frameTime) {
        callback(deltaTime)
        this.lastTime = currentTime
      }
      
      this.rafId = requestAnimationFrame(animate)
    }
    
    this.rafId = requestAnimationFrame(animate)
  }
  
  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }
  
  adaptToPerformance(actualFPS: number) {
    if (actualFPS < this.targetFPS * 0.8) {
      // Reduce complexity if performance drops
      this.targetFPS = Math.max(30, actualFPS)
      this.frameTime = 1000 / this.targetFPS
    }
  }
}