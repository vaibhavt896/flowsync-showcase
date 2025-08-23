import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

interface CircularProgressProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
  showValue?: boolean
  color?: 'primary' | 'focus' | 'success' | 'warning'
}

export function CircularProgress({
  value,
  size = 200,
  strokeWidth = 8,
  className,
  children,
  showValue = false,
  color = 'primary'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (value / 100) * circumference

  const colors = {
    primary: 'stroke-primary-500',
    focus: 'stroke-focus-500',
    success: 'stroke-success-500',
    warning: 'stroke-yellow-500',
  }

  return (
    <div 
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress circle */}
        <motion.circle
          className={colors[color]}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(value)}%
          </span>
        ))}
      </div>
    </div>
  )
}