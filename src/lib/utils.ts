import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  if (isToday(date)) return 'Aujourd\'hui'
  if (isTomorrow(date)) return 'Demain'
  if (isYesterday(date)) return 'Hier'
  
  return format(date, 'dd MMM yyyy', { locale: fr })
}

export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: fr 
  })
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    cold: '#6B7280',
    warm: '#F59E0B', 
    hot: '#EF4444',
    prospect: '#6B7280',
    engaged: '#3B82F6',
    meeting: '#8B5CF6',
    proposal: '#F59E0B',
    won: '#10B981',
    lost: '#EF4444',
    pending: '#F59E0B',
    completed: '#10B981',
    snoozed: '#6B7280'
  }
  return colors[status] || '#6B7280'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function vibrate(pattern: number | number[] = 10): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}