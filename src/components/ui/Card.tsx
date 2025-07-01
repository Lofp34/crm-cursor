import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
}

export function Card({ children, className, onClick, padding = 'md', draggable = false, onDragStart }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-soft border border-gray-100',
        paddingStyles[padding],
        onClick && 'cursor-pointer hover:shadow-medium transition-shadow duration-200 active:scale-[0.98]',
        className
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('pb-3 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-headline font-semibold text-gray-900', className)}>
      {children}
    </h3>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('pt-3', className)}>
      {children}
    </div>
  )
}