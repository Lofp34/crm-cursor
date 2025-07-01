import React, { useState } from 'react'
import { Plus, Clock, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useTasks, useContacts } from '../../hooks/useDatabase'
import { formatDate, formatRelativeDate, cn } from '../../lib/utils'
import type { Task, TaskStatus, TaskPriority } from '../../types'

interface TasksListProps {
  onAddTask: () => void
  onTaskSelect: (task: Task) => void
}

export function TasksList({ onAddTask, onTaskSelect }: TasksListProps) {
  const { tasks, loading, updateTask, getTasksByStatus } = useTasks()
  const { contacts } = useContacts()
  const [activeSection, setActiveSection] = useState<'today' | 'overdue' | 'upcoming'>('today')

  const todayTasks = getTasksByStatus('today')
  const overdueTasks = getTasksByStatus('overdue')
  const upcomingTasks = getTasksByStatus('upcoming')

  const getContactName = (contactId?: string) => {
    if (!contactId) return null
    const contact = contacts.find(c => c.id === contactId)
    return contact?.name
  }

  const handleCompleteTask = async (task: Task) => {
    await updateTask(task.id, { 
      status: 'completed' as TaskStatus,
      completedAt: new Date()
    })
  }

  const handleSnoozeTask = async (task: Task, days: number) => {
    const newDueDate = new Date()
    newDueDate.setDate(newDueDate.getDate() + days)
    
    await updateTask(task.id, { 
      dueDate: newDueDate,
      status: 'snoozed' as TaskStatus
    })
  }

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} className="text-red-500" />
      case 'medium':
        return <Clock size={16} className="text-yellow-500" />
      case 'low':
        return <Calendar size={16} className="text-gray-400" />
    }
  }

  const getTaskTypeLabel = (type: string) => {
    const labels = {
      call: 'Appel',
      email: 'E-mail',
      meeting: 'Rendez-vous',
      'follow-up': 'Relance',
      other: 'Autre'
    }
    return labels[type as keyof typeof labels] || 'Autre'
  }

  const sections = [
    { id: 'today', label: 'Aujourd\'hui', tasks: todayTasks, icon: Calendar },
    { id: 'overdue', label: 'Retard', tasks: overdueTasks, icon: AlertCircle },
    { id: 'upcoming', label: 'À venir', tasks: upcomingTasks, icon: Clock }
  ] as const

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-subhead text-gray-500 mt-2">Chargement des tâches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-large-title font-bold text-gray-900">Tâches</h1>
          <Button onClick={onAddTask} size="sm">
            <Plus size={20} className="mr-1" />
            Nouvelle tâche
          </Button>
        </div>

        {/* Filtres par section */}
        <div className="flex space-x-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-footnote font-medium transition-colors',
                  activeSection === section.id
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Icon size={16} />
                <span>{section.label}</span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-caption-2 font-semibold',
                  section.id === 'overdue' && section.tasks.length > 0
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-200 text-gray-600'
                )}>
                  {section.tasks.length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {(() => {
          const currentSection = sections.find(s => s.id === activeSection)
          const currentTasks = currentSection?.tasks || []

          if (currentTasks.length === 0) {
            return (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeSection === 'today' && '📅'}
                  {activeSection === 'overdue' && '⚠️'}
                  {activeSection === 'upcoming' && '⏰'}
                </div>
                <h3 className="text-title-3 font-semibold text-gray-900 mb-2">
                  {activeSection === 'today' && 'Aucune tâche pour aujourd\'hui'}
                  {activeSection === 'overdue' && 'Aucune tâche en retard'}
                  {activeSection === 'upcoming' && 'Aucune tâche à venir'}
                </h3>
                <p className="text-body text-gray-500 mb-6">
                  {activeSection === 'today' && 'Parfait ! Vous êtes à jour.'}
                  {activeSection === 'overdue' && 'Excellent ! Tout est sous contrôle.'}
                  {activeSection === 'upcoming' && 'Planifiez vos prochaines actions.'}
                </p>
                <Button onClick={onAddTask}>
                  <Plus size={20} className="mr-2" />
                  Ajouter une tâche
                </Button>
              </div>
            )
          }

          return (
            <div className="space-y-3">
              {currentTasks.map((task) => (
                <Card
                  key={task.id}
                  onClick={() => onTaskSelect(task)}
                  className={cn(
                    'cursor-pointer hover:shadow-medium transition-shadow',
                    activeSection === 'overdue' && 'ring-2 ring-red-100 bg-red-50'
                  )}
                >
                  <div className="flex items-start space-x-3">
                    {/* Bouton de completion */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCompleteTask(task)
                      }}
                      className="mt-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <CheckCircle2 
                        size={20} 
                        className="text-gray-400 hover:text-green-500 transition-colors" 
                      />
                    </button>

                    {/* Contenu de la tâche */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getPriorityIcon(task.priority)}
                            <h3 className="text-headline font-semibold text-gray-900 truncate">
                              {task.title}
                            </h3>
                          </div>
                          
                          {task.description && (
                            <p className="text-subhead text-gray-600 line-clamp-2 mb-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-3 text-footnote text-gray-500">
                            <Badge variant="status" status={task.type}>
                              {getTaskTypeLabel(task.type)}
                            </Badge>
                            
                            {getContactName(task.contactId) && (
                              <span>
                                👤 {getContactName(task.contactId)}
                              </span>
                            )}
                            
                            <span>
                              📅 {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>

                        {/* Actions rapides */}
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSnoozeTask(task, 1)
                            }}
                            className="px-2 py-1 text-caption-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          >
                            +1j
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSnoozeTask(task, 3)
                            }}
                            className="px-2 py-1 text-caption-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          >
                            +3j
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        })()}
      </div>

      {/* Résumé en bas */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between text-footnote text-gray-600">
          <span>
            {overdueTasks.length > 0 
              ? `${overdueTasks.length} tâche(s) en retard`
              : 'Aucune tâche en retard'
            }
          </span>
          <span>
            {todayTasks.length} tâche(s) aujourd'hui
          </span>
        </div>
      </div>
    </div>
  )
}