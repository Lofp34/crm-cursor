'use client'

import React, { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useContacts } from '../../hooks/useDatabase'
import type { ContactStatus } from '../../types'

interface AddContactFormProps {
  onSuccess: () => void
}

export default function AddContactForm({ onSuccess }: AddContactFormProps) {
  const { addContact } = useContacts()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<ContactStatus>('warm')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setLoading(true)
    try {
      await addContact({
        name,
        email,
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        tags: [],
        status
      })
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  const statusOptions: { value: ContactStatus; label: string }[] = [
    { value: 'hot', label: 'Chaud' },
    { value: 'warm', label: 'Tiède' },
    { value: 'cold', label: 'Froid' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input label="Société" value={company} onChange={(e) => setCompany(e.target.value)} />

      {/* Statut */}
      <div>
        <label className="block text-footnote font-medium text-gray-700 mb-1">Statut</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ContactStatus)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Ajouter le contact'}
      </Button>
    </form>
  )
}