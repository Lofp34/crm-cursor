import React, { useState, useMemo } from 'react'
import { Search, Plus, Filter } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge, ScoreBadge } from '../ui/Badge'
import { useContacts } from '../../hooks/useDatabase'
import { formatRelativeDate, getInitials } from '../../lib/utils'
import type { Contact, ContactStatus } from '../../types'

interface ContactsListProps {
  onAddContact: () => void
  onContactSelect: (contact: Contact) => void
}

export function ContactsList({ onAddContact, onContactSelect }: ContactsListProps) {
  const { contacts, loading, searchContacts } = useContacts()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])

  // Filtrage en temps réel
  const displayedContacts = useMemo(() => {
    let result = contacts

    // Filtre par statut
    if (statusFilter !== 'all') {
      result = result.filter(contact => contact.status === statusFilter)
    }

    // Recherche
    if (searchQuery.trim()) {
      result = result.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Tri par score puis par dernière mise à jour
    return result.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score // Score décroissant
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [contacts, searchQuery, statusFilter])

  const getStatusLabel = (status: ContactStatus) => {
    const labels = {
      cold: 'Froid',
      warm: 'Tiède', 
      hot: 'Chaud'
    }
    return labels[status]
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-subhead text-gray-500 mt-2">Chargement des contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-large-title font-bold text-gray-900">Contacts</h1>
          <Button onClick={onAddContact} size="sm">
            <Plus size={20} className="mr-1" />
            Ajouter
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-3">
          <Input
            placeholder="Rechercher un contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>

        {/* Filtres */}
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 rounded-lg text-footnote font-medium transition-colors ${
              statusFilter === 'all' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {(['hot', 'warm', 'cold'] as ContactStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-footnote font-medium transition-colors ${
                statusFilter === status 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des contacts */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {displayedContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-title-3 font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'Aucun résultat' : 'Aucun contact'}
            </h3>
            <p className="text-body text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier contact'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={onAddContact}>
                <Plus size={20} className="mr-2" />
                Ajouter un contact
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedContacts.map((contact) => (
              <Card
                key={contact.id}
                onClick={() => onContactSelect(contact)}
                className="cursor-pointer hover:shadow-medium transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: contact.status === 'hot' ? '#EF4444' : contact.status === 'warm' ? '#F59E0B' : '#6B7280' }}
                  >
                    {getInitials(contact.name)}
                  </div>

                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-headline font-semibold text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <ScoreBadge score={contact.score} />
                    </div>
                    
                    <p className="text-subhead text-gray-600 truncate">
                      {contact.email}
                    </p>
                    
                    {contact.company && (
                      <p className="text-footnote text-gray-500 truncate">
                        {contact.company}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="status" status={contact.status}>
                        {getStatusLabel(contact.status)}
                      </Badge>
                      <span className="text-caption-1 text-gray-400">
                        {formatRelativeDate(contact.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}