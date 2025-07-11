import { db } from './database'
import type { Contact, Deal, Task } from '../types'

export async function seedDemoData() {
  // Vérifier si des données existent déjà
  const existingContacts = await db.contacts.count()
  if (existingContacts > 0) return

  // Contacts de démonstration
  const demoContacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Marie Dubois',
      email: 'marie.dubois@example.com',
      phone: '+33 6 12 34 56 78',
      company: 'TechStart SAS',
      tags: ['startup', 'tech'],
      status: 'hot',
      score: 4,
      lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
      notes: 'Très intéressée par notre solution. À recontacter rapidement.'
    },
    {
      name: 'Pierre Martin',
      email: 'p.martin@grandecorp.fr',
      phone: '+33 1 23 45 67 89',
      company: 'Grande Corp',
      tags: ['enterprise', 'finance'],
      status: 'warm',
      score: 3,
      lastInteraction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
      notes: 'Directeur IT, décideur final. Budget disponible Q1.'
    },
    {
      name: 'Sophie Leclerc',
      email: 'sophie@consulting-plus.com',
      company: 'Consulting Plus',
      tags: ['consulting', 'pme'],
      status: 'cold',
      score: 2,
      notes: 'Premier contact établi. À qualifier davantage.'
    },
    {
      name: 'Thomas Rousseau',
      email: 'thomas.rousseau@retail-chain.fr',
      phone: '+33 4 56 78 90 12',
      company: 'Retail Chain',
      tags: ['retail', 'commerce'],
      status: 'warm',
      score: 3,
      lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Hier
      notes: 'Responsable digital, cherche à moderniser les processus.'
    }
  ]

  // Ajouter les contacts
  const addedContacts: Contact[] = []
  for (const contactData of demoContacts) {
    const contact: Contact = {
      ...contactData,
      id: crypto.randomUUID(),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Dans les 30 derniers jours
      updatedAt: new Date()
    }
    await db.contacts.add(contact)
    addedContacts.push(contact)
  }

  // Deals de démonstration
  const demoDeals: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'dueDate' | 'isArchived'>[] = [
    {
      title: 'Implémentation CRM TechStart',
      contactId: addedContacts[0].id,
      value: 25000,
      stage: 'proposal',
      probability: 75,
      description: 'Mise en place d\'une solution CRM complète pour l\'équipe commerciale.'
    },
    {
      title: 'Transformation digitale Grande Corp',
      contactId: addedContacts[1].id,
      value: 85000,
      stage: 'meeting',
      probability: 50,
      description: 'Audit et recommandations pour la transformation digitale.'
    },
    {
      title: 'Formation équipe Consulting Plus',
      contactId: addedContacts[2].id,
      value: 8500,
      stage: 'prospect',
      probability: 30,
      description: 'Formation de l\'équipe aux nouvelles méthodologies.'
    },
    {
      title: 'Optimisation e-commerce Retail Chain',
      contactId: addedContacts[3].id,
      value: 45000,
      stage: 'engaged',
      probability: 65,
      description: 'Optimisation de la plateforme e-commerce existante.'
    }
  ]

  // Ajouter les deals
  const addedDeals: Deal[] = []
  for (const dealData of demoDeals) {
    const createdAt = new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) // Dans les 20 derniers jours
    const maxDays = {
      prospect: 30,
      engaged: 14,
      meeting: 7,
      proposal: 21,
      won: 0,
      lost: 0
    }[dealData.stage] || 30

    const deal: Deal = {
      ...dealData,
      id: crypto.randomUUID(),
      createdAt,
      updatedAt: new Date(),
      dueDate: new Date(createdAt.getTime() + maxDays * 24 * 60 * 60 * 1000),
      isArchived: false
    }
    await db.deals.add(deal)
    addedDeals.push(deal)
  }

  // Tâches de démonstration
  const demoTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: 'Appeler Marie pour finaliser la proposition',
      description: 'Revoir les derniers détails techniques et valider le budget.',
      contactId: addedContacts[0].id,
      dealId: addedDeals[0].id,
      type: 'call',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Demain
      isAutoGenerated: false
    },
    {
      title: 'Préparer la présentation pour Grande Corp',
      description: 'Adapter la présentation aux besoins spécifiques du client.',
      contactId: addedContacts[1].id,
      dealId: addedDeals[1].id,
      type: 'other',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(), // Aujourd'hui
      isAutoGenerated: false
    },
    {
      title: 'Envoyer la documentation à Sophie',
      description: 'Transmettre les brochures et études de cas pertinentes.',
      contactId: addedContacts[2].id,
      dealId: addedDeals[2].id,
      type: 'email',
      status: 'pending',
      priority: 'low',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
      isAutoGenerated: false
    },
    {
      title: 'RDV démonstration avec Thomas',
      description: 'Présentation de la solution en live avec l\'équipe technique.',
      contactId: addedContacts[3].id,
      dealId: addedDeals[3].id,
      type: 'meeting',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Après-demain
      isAutoGenerated: false
    },
    {
      title: 'Tâche en retard - Relancer le prospect',
      description: 'Tâche générée automatiquement suite à l\'expiration d\'un deal.',
      contactId: addedContacts[2].id,
      type: 'follow-up',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours (en retard)
      isAutoGenerated: true
    }
  ]

  // Ajouter les tâches
  for (const taskData of demoTasks) {
    const task: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Dans les 10 derniers jours
      updatedAt: new Date()
    }
    await db.tasks.add(task)
  }

  console.log('📊 Données de démonstration ajoutées avec succès !')
  console.log(`✅ ${addedContacts.length} contacts créés`)
  console.log(`✅ ${addedDeals.length} deals créés`)
  console.log(`✅ ${demoTasks.length} tâches créées`)
}