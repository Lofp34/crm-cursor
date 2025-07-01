'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

/**
 * Generic modal component using a dark transparent backdrop.
 * Clicking on the backdrop (outside the content container) closes the modal.
 * The content container will never close the modal when clicked inside thanks to stopPropagation.
 */
export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Content container */}
      <div
        className={cn(
          'bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-auto animate-slide-up',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}