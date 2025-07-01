import React, { useState } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useDeals, useContacts } from '../../hooks/useDatabase'
import { formatCurrency, formatDate, cn } from '../../lib/utils'
import { DEAL_STAGES } from '../../types'
import type { Deal, DealStage } from '../../types'

interface PipelineBoardProps {
  onAddDeal: () => void
  onDealSelect: (deal: Deal) => void
}

export function PipelineBoard({ onAddDeal, onDealSelect }: PipelineBoardProps) {
  const { deals, loading, updateDeal, getDealsByStage } = useDeals()
  const { contacts } = useContacts()
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)

  const stages: DealStage[] = ['prospect', 'engaged', 'meeting', 'proposal', 'won', 'lost']

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId)
    return contact?.name || 'Contact inconnu'
  }

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      await updateDeal(draggedDeal.id, { stage: targetStage })
      setDraggedDeal(null)
    }
  }

  const isExpiringSoon = (deal: Deal) => {
    const daysDiff = Math.ceil((deal.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 3 && daysDiff > 0
  }

  const isExpired = (deal: Deal) => {
    return deal.dueDate.getTime() < Date.now()
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-subhead text-gray-500 mt-2">Chargement du pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-large-title font-bold text-gray-900">Pipeline</h1>
          <Button onClick={onAddDeal} size="sm">
            <Plus size={20} className="mr-1" />
            Nouveau deal
          </Button>
        </div>
      </div>

      {/* Board Kanban */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-4 p-4 min-w-max">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage)
            const stageConfig = DEAL_STAGES[stage]
            
            return (
              <div
                key={stage}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* En-tête de colonne */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-title-3 font-semibold text-gray-900">
                      {stageConfig.label}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stageConfig.color }}
                      />
                      <span className="text-footnote text-gray-500 font-medium">
                        {stageDeals.length}
                      </span>
                    </div>
                  </div>
                  {stageConfig.maxDays > 0 && (
                    <p className="text-caption-1 text-gray-500 mt-1">
                      Max {stageConfig.maxDays} jours
                    </p>
                  )}
                </div>

                {/* Cartes des deals */}
                <div className="space-y-3">
                  {stageDeals.length === 0 ? (
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <p className="text-footnote text-gray-500">
                        Aucun deal dans cette étape
                      </p>
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <Card
                        key={deal.id}
                        className={cn(
                          'cursor-move hover:shadow-medium transition-all duration-200',
                          isExpired(deal) && 'ring-2 ring-red-200 bg-red-50',
                          isExpiringSoon(deal) && !isExpired(deal) && 'ring-2 ring-yellow-200 bg-yellow-50'
                        )}
                        draggable
                        onDragStart={() => handleDragStart(deal)}
                        onClick={() => onDealSelect(deal)}
                      >
                        <div className="space-y-3">
                          {/* En-tête du deal */}
                          <div className="flex items-start justify-between">
                            <h4 className="text-headline font-semibold text-gray-900 line-clamp-2">
                              {deal.title}
                            </h4>
                            {(isExpired(deal) || isExpiringSoon(deal)) && (
                              <AlertTriangle 
                                size={16} 
                                className={cn(
                                  isExpired(deal) ? 'text-red-500' : 'text-yellow-500'
                                )}
                              />
                            )}
                          </div>

                          {/* Contact */}
                          <p className="text-subhead text-gray-600 truncate">
                            {getContactName(deal.contactId)}
                          </p>

                          {/* Valeur */}
                          <div className="flex items-center justify-between">
                            <span className="text-title-3 font-bold text-gray-900">
                              {formatCurrency(deal.value)}
                            </span>
                            <span className="text-caption-1 text-gray-500">
                              {deal.probability}%
                            </span>
                          </div>

                          {/* Date d'échéance */}
                          <div className="flex items-center justify-between text-footnote">
                            <span className="text-gray-500">
                              Échéance : {formatDate(deal.dueDate)}
                            </span>
                            {isExpired(deal) && (
                              <Badge variant="status" status="lost">
                                Expiré
                              </Badge>
                            )}
                            {isExpiringSoon(deal) && !isExpired(deal) && (
                              <Badge variant="status" status="warm">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between text-footnote text-gray-600">
          <span>
            Total : {deals.length} deals actifs
          </span>
          <span>
            Valeur totale : {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
          </span>
        </div>
      </div>
    </div>
  )
}