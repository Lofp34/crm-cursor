import React from 'react'
import { Users, BarChart3, CheckSquare, User } from 'lucide-react'
import { cn } from '../../lib/utils'

interface TabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: BarChart3 },
  { id: 'tasks', label: 'Tâches', icon: CheckSquare },
  { id: 'profile', label: 'Profil', icon: User }
]

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all duration-200',
                'min-w-[60px] active:scale-95',
                isActive 
                  ? 'text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon 
                size={24} 
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-primary-600' : 'text-gray-500'
                )} 
              />
              <span 
                className={cn(
                  'text-caption-2 mt-1 font-medium transition-colors duration-200',
                  isActive ? 'text-primary-600' : 'text-gray-500'
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Hook pour gérer la navigation
export function useTabNavigation() {
  const [activeTab, setActiveTab] = React.useState('contacts')
  
  return {
    activeTab,
    setActiveTab
  }
}