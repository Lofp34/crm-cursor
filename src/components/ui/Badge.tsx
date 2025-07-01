import React from 'react'
import { cn } from '../../lib/utils'
import { getStatusColor } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'status' | 'score' | 'priority'
  status?: string
  className?: string
}

export function Badge({ children, variant = 'status', status, className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2 py-1 rounded-lg text-caption-1 font-medium'
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'status':
        const statusColor = status ? getStatusColor(status) : '#6B7280'
        return {
          backgroundColor: `${statusColor}15`,
          color: statusColor,
          border: `1px solid ${statusColor}30`
        }
      case 'score':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'priority':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  if (variant === 'status' && status) {
    const statusColor = getStatusColor(status)
    return (
      <span
        className={cn(baseStyles, className)}
        style={{
          backgroundColor: `${statusColor}15`,
          color: statusColor,
          border: `1px solid ${statusColor}30`
        }}
      >
        {children}
      </span>
    )
  }

  return (
    <span className={cn(baseStyles, getVariantStyles(), className)}>
      {children}
    </span>
  )
}

interface ScoreBadgeProps {
  score: number
  className?: string
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            'w-3 h-3',
            star <= score ? 'text-yellow-400 fill-current' : 'text-gray-300'
          )}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}