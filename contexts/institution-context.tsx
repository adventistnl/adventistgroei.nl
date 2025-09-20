"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Institution {
  id: string
  name: string
  denomination: string
  language_preference: "en" | "nl"
  logo: React.ElementType
  description: string
  regions_count: number
  churches_count: number
  members_count: number
  active_users: number
  created_at: string
}

interface InstitutionContextType {
  institutions: Institution[]
  activeInstitution: Institution
  setActiveInstitution: (institution: Institution) => void
  switchInstitution: (institutionId: string) => void
  addInstitution: (institution: Omit<Institution, 'id' | 'created_at'>) => void
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined)

export const useInstitution = () => {
  const context = useContext(InstitutionContext)
  if (context === undefined) {
    throw new Error('useInstitution must be used within an InstitutionProvider')
  }
  return context
}

// Dados mockados das instituições
const MOCK_INSTITUTIONS: Institution[] = [
  {
    id: "5290578a-b88e-43c3-98dd-a7694910fc6b",
    name: "União Sul-Paulista",
    denomination: "SDA",
    language_preference: "en",
    logo: Building2,
    description: "Church Growth International - Southeast Division",
    regions_count: 12,
    churches_count: 89,
    members_count: 28500,
    active_users: 1250,
    created_at: "2020-01-15"
  },
  {
    id: "ucb",
    name: "União Central Brasileira",
    denomination: "SDA", 
    language_preference: "en",
    logo: Building2,
    description: "Church Growth International - Central Division",
    regions_count: 8,
    churches_count: 52,
    members_count: 16800,
    active_users: 890,
    created_at: "2019-03-20"
  },
  {
    id: "uan",
    name: "União Amazônica",
    denomination: "SDA",
    language_preference: "en", 
    logo: Building2,
    description: "Church Growth International - Amazon Division",
    regions_count: 6,
    churches_count: 34,
    members_count: 7200,
    active_users: 420,
    created_at: "2021-06-10"
  },
  {
    id: "une",
    name: "União Nordeste Brasileira",
    denomination: "SDA",
    language_preference: "en",
    logo: Building2,
    description: "Church Growth International - Northeast Division", 
    regions_count: 10,
    churches_count: 67,
    members_count: 19400,
    active_users: 1080,
    created_at: "2018-11-05"
  }
]

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_INSTITUTIONS)
  const [activeInstitution, setActiveInstitution] = useState<Institution>(MOCK_INSTITUTIONS[0])

  const switchInstitution = useCallback((institutionId: string) => {
    const institution = institutions.find(inst => inst.id === institutionId)
    if (institution && institution.id !== activeInstitution.id) {
      setActiveInstitution(institution)
      
      toast.success(
        `🏢 Switched to ${institution.name}\n📊 Loading institution data...`,
        {
          duration: 4000,
          style: { minWidth: '300px' }
        }
      )
    }
  }, [activeInstitution.id, institutions])

  const addInstitution = useCallback((institutionData: Omit<Institution, 'id' | 'created_at'>) => {
    const newInstitution: Institution = {
      ...institutionData,
      id: institutionData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      created_at: new Date().toISOString(),
      // Default values for new institution
      regions_count: 0,
      churches_count: 0,
      members_count: 0,
      active_users: 0,
    }

    setInstitutions(prev => [...prev, newInstitution])
    
    toast.success(
      `🎉 Institution "${newInstitution.name}" added successfully!`,
      { duration: 4000 }
    )
  }, [])

  const value: InstitutionContextType = useMemo(() => ({
    institutions,
    activeInstitution,
    setActiveInstitution,
    switchInstitution,
    addInstitution,
  }), [institutions, activeInstitution, switchInstitution, addInstitution])

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  )
}
