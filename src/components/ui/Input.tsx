import React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ 
  label, 
  error, 
  icon,
  className, 
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-subhead font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50',
            'text-body text-gray-900 placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white',
            'transition-all duration-200',
            icon && 'pl-10',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-caption-1 text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ 
  label, 
  error, 
  className, 
  ...props 
}: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-subhead font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50',
          'text-body text-gray-900 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white',
          'transition-all duration-200 resize-none',
          error && 'border-red-300 focus:ring-red-500',
          className
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-caption-1 text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}