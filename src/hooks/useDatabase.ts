import { useState, useEffect, useCallback } from 'react'
import { db, PipelineManager, initializeDefaultUser, initializeOnboarding } from '../lib/database'
import type { Contact, Deal, Task, User, OnboardingState, ContactStatus, DealStage } from '../types'

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const loadContacts = useCallback(async () => {
    try {
      const allContacts = await db.contacts.orderBy('updatedAt').reverse().toArray()
      setContacts(allContacts)
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const addContact = useCallback(async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => {
    const newContact: Contact = {
      ...contactData,
      id: crypto.randomUUID(),
      score: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.contacts.add(newContact)
    await loadContacts()
    return newContact
  }, [loadContacts])

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>) => {
    await db.contacts.update(id, { ...updates, updatedAt: new Date() })
    await loadContacts()
  }, [loadContacts])

  const deleteContact = useCallback(async (id: string) => {
    await db.contacts.delete(id)
    await loadContacts()
  }, [loadContacts])

  const searchContacts = useCallback(async (query: string) => {
    if (!query.trim()) {
      return contacts
    }
    
    const searchResults = await db.contacts
      .filter(contact => 
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(query.toLowerCase()))
      )
      .toArray()
    
    return searchResults
  }, [contacts])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    searchContacts,
    refresh: loadContacts
  }
}

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  const loadDeals = useCallback(async () => {
    try {
      const allDeals = await db.deals
        .where('isArchived')
        .equals(0)
        .orderBy('updatedAt')
        .reverse()
        .toArray()
      setDeals(allDeals)
    } catch (error) {
      console.error('Error loading deals:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const addDeal = useCallback(async (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'dueDate' | 'isArchived'>) => {
    const now = new Date()
    const stage = dealData.stage
    const maxDays = {
      prospect: 30,
      engaged: 14,
      meeting: 7,
      proposal: 21,
      won: 0,
      lost: 0
    }[stage] || 30

    const newDeal: Deal = {
      ...dealData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      dueDate: new Date(now.getTime() + maxDays * 24 * 60 * 60 * 1000),
      isArchived: false
    }
    
    await db.deals.add(newDeal)
    await loadDeals()
    return newDeal
  }, [loadDeals])

  const updateDeal = useCallback(async (id: string, updates: Partial<Deal>) => {
    const deal = await db.deals.get(id)
    if (deal && updates.stage && updates.stage !== deal.stage) {
      // Recalculer la date d'échéance si l'étape change
      const maxDays = {
        prospect: 30,
        engaged: 14,
        meeting: 7,
        proposal: 21,
        won: 0,
        lost: 0
      }[updates.stage] || 30

      if (maxDays > 0) {
        updates.dueDate = new Date(Date.now() + maxDays * 24 * 60 * 60 * 1000)
      }
    }

    await db.deals.update(id, { ...updates, updatedAt: new Date() })
    await loadDeals()
  }, [loadDeals])

  const deleteDeal = useCallback(async (id: string) => {
    await db.deals.delete(id)
    await loadDeals()
  }, [loadDeals])

  const getDealsByStage = useCallback((stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage)
  }, [deals])

  useEffect(() => {
    loadDeals()
  }, [loadDeals])

  return {
    deals,
    loading,
    addDeal,
    updateDeal,
    deleteDeal,
    getDealsByStage,
    refresh: loadDeals
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await db.tasks.orderBy('dueDate').toArray()
      setTasks(allTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.tasks.add(newTask)
    await loadTasks()
    return newTask
  }, [loadTasks])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const updateData = { ...updates, updatedAt: new Date() }
    
    if (updates.status === 'completed' && !updates.completedAt) {
      updateData.completedAt = new Date()
    }

    await db.tasks.update(id, updateData)
    await loadTasks()
  }, [loadTasks])

  const deleteTask = useCallback(async (id: string) => {
    await db.tasks.delete(id)
    await loadTasks()
  }, [loadTasks])

  const getTasksByStatus = useCallback((status: 'today' | 'overdue' | 'upcoming') => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    return tasks.filter(task => {
      if (task.status === 'completed') return false
      
      switch (status) {
        case 'today':
          return task.dueDate >= today && task.dueDate < tomorrow
        case 'overdue':
          return task.dueDate < today
        case 'upcoming':
          return task.dueDate >= tomorrow
        default:
          return false
      }
    })
  }, [tasks])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    refresh: loadTasks
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const userData = await initializeDefaultUser()
      setUser(userData)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return
    
    await db.users.update(user.id, updates)
    await loadUser()
  }, [user, loadUser])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return {
    user,
    loading,
    updateUser,
    refresh: loadUser
  }
}

export function useOnboarding() {
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null)
  const [loading, setLoading] = useState(true)

  const loadOnboarding = useCallback(async () => {
    try {
      const onboardingData = await initializeOnboarding()
      setOnboarding(onboardingData)
    } catch (error) {
      console.error('Error loading onboarding:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOnboarding = useCallback(async (updates: Partial<OnboardingState>) => {
    if (!onboarding) return
    
    await db.onboarding.update(1, updates)
    await loadOnboarding()
  }, [onboarding, loadOnboarding])

  const completeStep = useCallback(async (step: 'contact' | 'deal' | 'task') => {
    if (!onboarding) return

    const updates: Partial<OnboardingState> = {}
    
    switch (step) {
      case 'contact':
        updates.hasCreatedContact = true
        break
      case 'deal':
        updates.hasCreatedDeal = true
        break
      case 'task':
        updates.hasCreatedTask = true
        break
    }

    if (updates.hasCreatedContact && updates.hasCreatedDeal && updates.hasCreatedTask) {
      updates.isCompleted = true
    }

    await updateOnboarding(updates)
  }, [onboarding, updateOnboarding])

  useEffect(() => {
    loadOnboarding()
  }, [loadOnboarding])

  return {
    onboarding,
    loading,
    updateOnboarding,
    completeStep,
    refresh: loadOnboarding
  }
}

export function usePipelineManager() {
  const checkExpiredDeals = useCallback(async () => {
    await PipelineManager.checkAndArchiveExpiredDeals()
  }, [])

  const calculateContactScore = useCallback(async (contactId: string) => {
    return await PipelineManager.calculateContactScore(contactId)
  }, [])

  const getPipelineHealth = useCallback(async () => {
    return await PipelineManager.getPipelineHealth()
  }, [])

  return {
    checkExpiredDeals,
    calculateContactScore,
    getPipelineHealth
  }
}