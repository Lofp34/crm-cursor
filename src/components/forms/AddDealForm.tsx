'use client'

import React, { useState } from 'react'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { useDeals, useContacts } from '../../hooks/useDatabase'
import type { DealStage } from '../../types'

interface AddDealFormProps {
  onSuccess: () => void
}

export default function AddDealForm({ onSuccess }: AddDealFormProps) {
  const { addDeal } = useDeals()
  const { contacts } = useContacts()

  const [title, setTitle] = useState('')
  const [contactId, setContactId] = useState('')
  const [value, setValue] = useState('')
  const [stage, setStage] = useState<DealStage>('prospect')
  const [probability, setProbability] = useState('50')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !contactId) return

    setLoading(true)
    try {
      await addDeal({
        title,
        contactId,
        value: parseFloat(value) || 0,
        stage,
        probability: parseInt(probability, 10) || 50,
        description: description.trim() || undefined
      })
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  const stageOptions: { value: DealStage; label: string }[] = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'engaged', label: 'Engagé' },
    { value: 'meeting', label: 'Rendez-vous' },
    { value: 'proposal', label: 'Proposition' },
    { value: 'won', label: 'Gagné' },
    { value: 'lost', label: 'Perdu' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />

      {/* Contact associé */}
      <div>
        <label className="block text-subhead font-medium text-gray-700 mb-1">Contact</label>
        <select
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Sélectionner...</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Valeur (€)"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* Étape du pipeline */}
      <div>
        <label className="block text-subhead font-medium text-gray-700 mb-1">Étape</label>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value as DealStage)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {stageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Probabilité (%)"
        type="number"
        value={probability}
        onChange={(e) => setProbability(e.target.value)}
      />

      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Ajouter le deal'}
      </Button>
    </form>
  )
}