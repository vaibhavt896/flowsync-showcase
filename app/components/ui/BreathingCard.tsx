import { ReactNode, HTMLAttributes } from 'react'
import { useCardBreathing } from '../../hooks/useBreathingAnimation'

interface BreathingCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  intensity?: number
  className?: string
}

export function BreathingCard({ 
  children, 
  intensity = 1, 
  className = '', 
  ...props 
}: BreathingCardProps) {
  const breathing = useCardBreathing(intensity)
  
  return (
    <div
      className={`card ${className}`}
      style={breathing}
      {...props}
    >
      {children}
    </div>
  )
}

export default BreathingCard