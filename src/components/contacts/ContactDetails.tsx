'use client'

import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Input'
import { useTasks, useContacts } from '../../hooks/useDatabase'
import { formatDate } from '../../lib/utils'
import type { Contact } from '../../types'

interface ContactDetailsProps {
  contact: Contact | null
  onClose: () => void
}

export default function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const { tasks } = useTasks()
  const { updateContact } = useContacts()
  const [note, setNote] = useState('')

  if (!contact) return null

  const contactTasks = tasks.filter((t) => t.contactId === contact.id)

  const handleAddNote = async () => {
    if (!note.trim()) return
    const existing = contact.notes ? contact.notes + '\n' : ''
    await updateContact(contact.id, { notes: existing + note.trim() })
    setNote('')
  }

  const notesArray = contact.notes ? contact.notes.split('\n').filter(Boolean) : []

  return (
    <Modal isOpen={!!contact} onClose={onClose}>
      <div className="p-4 space-y-4">
        <h3 className="text-title-2 font-bold">{contact.name}</h3>
        <p className="text-body text-gray-600">{contact.email}</p>
        {contact.phone && <p className="text-body text-gray-600">📞 {contact.phone}</p>}
        {contact.company && <p className="text-body text-gray-600">🏢 {contact.company}</p>}

        {/* Notes */}
        <div className="space-y-2">
          <h4 className="text-headline font-semibold">Notes</h4>
          {notesArray.length === 0 ? (
            <p className="text-body text-gray-500">Aucune note</p>
          ) : (
            <ul className="max-h-40 overflow-auto space-y-1 pr-2">
              {notesArray.map((n, idx) => (
                <li key={idx} className="text-body text-gray-700 border-b border-gray-100 pb-1">
                  {n}
                </li>
              ))}
            </ul>
          )}
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note..." />
          <Button size="sm" onClick={handleAddNote} disabled={!note.trim()}>
            Ajouter la note
          </Button>
        </div>

        {/* Tâches */}
        <div className="space-y-2">
          <h4 className="text-headline font-semibold">Tâches</h4>
          {contactTasks.length === 0 ? (
            <p className="text-body text-gray-500">Aucune tâche pour ce contact.</p>
          ) : (
            <div className="max-h-60 overflow-auto pr-2 space-y-3">
              {contactTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{task.title}</span>
                    <span className="text-caption-1 text-gray-500">{formatDate(task.dueDate)}</span>
                  </div>
                  {task.description && (
                    <p className="text-subhead text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="secondary" className="w-full" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  )
}