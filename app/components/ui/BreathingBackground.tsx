import { useBreathing } from '../../contexts/BreathingContext'
import { useBackgroundBreathing, useOrganicMovement } from '../../hooks/useBreathingAnimation'

export function BreathingBackground() {
  const { breathingState, breathingRate } = useBreathing()
  const backgroundBreathing = useBackgroundBreathing()
  
  // Create multiple floating elements for organic feel
  const FloatingElement = ({ delay = 0, size = 20, opacity = 0.1 }) => {
    const movement = useOrganicMovement(0.3)
    
    const style = {
      position: 'absolute' as const,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(14, 165, 233, ${opacity}) 0%, rgba(14, 165, 233, 0) 70%)`,
      transform: `translate(${movement.x}px, ${movement.y}px) scale(${movement.scale})`,
      transition: 'none',
      animationDelay: `${delay}s`,
      pointerEvents: 'none' as const
    }
    
    return <div style={style} />
  }

  // Breathing indicator in corner
  const BreathingIndicator = () => {
    const style = {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: getStateColor(),
      ...backgroundBreathing,
      zIndex: 1000,
      boxShadow: `0 0 20px ${getStateColor()}40`
    }
    
    return <div style={style} title={`Breathing state: ${breathingState}`} />
  }

  const getStateColor = () => {
    switch (breathingState) {
      case 'focus': return '#10b981' // Green
      case 'transition': return '#f59e0b' // Amber
      case 'break': return '#3b82f6' // Blue
      case 'idle': return '#6b7280' // Gray
      default: return '#6b7280'
    }
  }

  // Subtle gradient overlay that breathes
  const BreathingOverlay = () => {
    const style = {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: getGradientForState(),
      pointerEvents: 'none' as const,
      zIndex: -1,
      ...backgroundBreathing
    }
    
    return <div style={style} />
  }

  const getGradientForState = () => {
    const baseOpacity = 0.02
    switch (breathingState) {
      case 'focus':
        return `radial-gradient(ellipse at center, rgba(16, 185, 129, ${baseOpacity}) 0%, transparent 60%)`
      case 'transition':
        return `radial-gradient(ellipse at center, rgba(245, 158, 11, ${baseOpacity}) 0%, transparent 60%)`
      case 'break':
        return `radial-gradient(ellipse at center, rgba(59, 130, 246, ${baseOpacity}) 0%, transparent 60%)`
      case 'idle':
      default:
        return `radial-gradient(ellipse at center, rgba(107, 114, 128, ${baseOpacity}) 0%, transparent 60%)`
    }
  }

  return (
    <>
      <BreathingOverlay />
      <BreathingIndicator />
      
      {/* Floating background elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: -1 }}>
        <FloatingElement delay={0} size={30} opacity={0.05} />
        <FloatingElement delay={2} size={20} opacity={0.03} />
        <FloatingElement delay={4} size={25} opacity={0.04} />
        <FloatingElement delay={6} size={15} opacity={0.02} />
        <FloatingElement delay={8} size={35} opacity={0.06} />
      </div>
    </>
  )
}

export default BreathingBackground