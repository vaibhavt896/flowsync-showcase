import { ReactNode, HTMLAttributes } from 'react'
import { useTextBreathing } from '../../hooks/useBreathingAnimation'

interface BreathingTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  intensity?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  className?: string
}

export function BreathingText({ 
  children, 
  intensity = 0.5, 
  as: Component = 'div',
  className = '', 
  ...props 
}: BreathingTextProps) {
  const breathing = useTextBreathing(intensity)
  
  return (
    <Component
      className={className}
      style={breathing}
      {...props}
    >
      {children}
    </Component>
  )
}

export default BreathingText