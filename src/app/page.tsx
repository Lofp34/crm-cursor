'use client'

import React, { useState, useEffect } from 'react'
import { TabBar, useTabNavigation } from '../components/navigation/TabBar'
import { ContactsList } from '../components/contacts/ContactsList'
import { PipelineBoard } from '../components/pipeline/PipelineBoard'
import { TasksList } from '../components/tasks/TasksList'
import { useOnboarding, usePipelineManager } from '../hooks/useDatabase'
import { seedDemoData } from '../lib/seedData'
import type { Contact, Task } from '../types'
import { Modal } from '../components/ui/Modal'
import AddContactForm from '../components/forms/AddContactForm'
import AddDealForm from '../components/forms/AddDealForm'
import AddTaskForm from '../components/forms/AddTaskForm'
import ContactDetails from '../components/contacts/ContactDetails'
import TaskDetails from '../components/tasks/TaskDetails'

export default function Home() {
  const { activeTab, setActiveTab } = useTabNavigation()
  const { onboarding } = useOnboarding()
  const { checkExpiredDeals } = usePipelineManager()

  // États pour les modales et formulaires
  const [showAddContact, setShowAddContact] = useState(false)
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Initialisation des données de démonstration
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await seedDemoData()
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error)
      }
    }
    
    initializeApp()
  }, [])

  // Vérification périodique des deals expirés
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredDeals()
    }, 5 * 60 * 1000) // Toutes les 5 minutes

    // Vérification initiale
    checkExpiredDeals()

    return () => clearInterval(interval)
  }, [checkExpiredDeals])

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'contacts':
        return (
          <ContactsList
            onAddContact={() => setShowAddContact(true)}
            onContactSelect={setSelectedContact}
          />
        )
      case 'pipeline':
        return (
          <PipelineBoard
            onAddDeal={() => setShowAddDeal(true)}
            onDealSelect={() => {}}
          />
        )
      case 'tasks':
        return (
          <TasksList
            onAddTask={() => setShowAddTask(true)}
            onTaskSelect={setSelectedTask}
          />
        )
      case 'profile':
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-title-2 font-bold text-gray-900 mb-2">Profil</h2>
              <p className="text-body text-gray-500">
                Bientôt disponible...
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Contenu principal */}
      <main className="flex-1 overflow-hidden pb-16">
        {renderActiveTab()}
      </main>

      {/* Navigation en bas */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modal d'ajout de contact */}
      <Modal isOpen={showAddContact} onClose={() => setShowAddContact(false)}>
        <div className="p-4 space-y-4">
          <h3 className="text-title-2 font-bold mb-2">Nouveau contact</h3>
          <AddContactForm onSuccess={() => setShowAddContact(false)} />
        </div>
      </Modal>

      {/* Modal d'ajout de deal */}
      <Modal isOpen={showAddDeal} onClose={() => setShowAddDeal(false)}>
        <div className="p-4 space-y-4">
          <h3 className="text-title-2 font-bold mb-2">Nouveau deal</h3>
          <AddDealForm onSuccess={() => setShowAddDeal(false)} />
        </div>
      </Modal>

      {/* Modal d'ajout de tâche */}
      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)}>
        <div className="p-4 space-y-4">
          <h3 className="text-title-2 font-bold mb-2">Nouvelle tâche</h3>
          <AddTaskForm onSuccess={() => setShowAddTask(false)} />
        </div>
      </Modal>

      {/* Détails du contact */}
      {selectedContact && (
        <ContactDetails contact={selectedContact} onClose={() => setSelectedContact(null)} />
      )}

      {/* Détails de la tâche */}
      {selectedTask && (
        <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  )
}