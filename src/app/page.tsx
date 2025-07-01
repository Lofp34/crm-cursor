'use client'

import React, { useState, useEffect } from 'react'
import { TabBar, useTabNavigation } from '../components/navigation/TabBar'
import { ContactsList } from '../components/contacts/ContactsList'
import { PipelineBoard } from '../components/pipeline/PipelineBoard'
import { TasksList } from '../components/tasks/TasksList'
import { useOnboarding, usePipelineManager } from '../hooks/useDatabase'
import { seedDemoData } from '../lib/seedData'
import type { Contact, Deal, Task } from '../types'

export default function Home() {
  const { activeTab, setActiveTab } = useTabNavigation()
  const { onboarding } = useOnboarding()
  const { checkExpiredDeals } = usePipelineManager()

  // États pour les modales et formulaires
  const [showAddContact, setShowAddContact] = useState(false)
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
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
            onDealSelect={setSelectedDeal}
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

      {/* TODO: Ajouter les modales pour les formulaires */}
      {/* Modal d'ajout de contact */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-2 font-bold">Nouveau contact</h3>
                <button
                  onClick={() => setShowAddContact(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-body text-gray-500">
                Formulaire d'ajout de contact à implémenter...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de deal */}
      {showAddDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-2 font-bold">Nouveau deal</h3>
                <button
                  onClick={() => setShowAddDeal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-body text-gray-500">
                Formulaire d'ajout de deal à implémenter...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de tâche */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-2 font-bold">Nouvelle tâche</h3>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-body text-gray-500">
                Formulaire d'ajout de tâche à implémenter...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}