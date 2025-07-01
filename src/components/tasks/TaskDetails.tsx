'use client'

import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { useTasks } from '../../hooks/useDatabase'
import type { Task } from '../../types'

interface TaskDetailsProps {
  task: Task | null
  onClose: () => void
}

export default function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const { updateTask, deleteTask } = useTasks()

  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [dueDate, setDueDate] = useState<string>(() => task ? new Date(task.dueDate).toISOString().split('T')[0] : '')
  const [loading, setLoading] = useState(false)

  if (!task) return null

  const handleSave = async () => {
    setLoading(true)
    await updateTask(task.id, {
      title,
      description: description.trim() || undefined,
      dueDate: new Date(dueDate)
    })
    setLoading(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer cette tâche ?')) return
    setLoading(true)
    await deleteTask(task.id)
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={!!task} onClose={onClose}>
      <div className="p-4 space-y-4">
        <h3 className="text-title-2 font-bold">Détails de la tâche</h3>
        <Input label="Titre" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
        <Textarea label="Description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} />
        <Input label="Date d'échéance" type="date" value={dueDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)} />

        <div className="flex space-x-2">
          <Button className="flex-1" onClick={handleSave} disabled={loading}>Enregistrer</Button>
          <Button variant="secondary" className="flex-1" onClick={handleDelete} disabled={loading}>Supprimer</Button>
        </div>
      </div>
    </Modal>
  )
}