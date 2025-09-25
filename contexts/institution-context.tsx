"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useInstitutions } from '@/hooks/use-institutions'

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
  institutions: any[]
  activeInstitution: any | null
  setActiveInstitution: (institution: any) => void
  switchInstitution: (institutionId: string) => void
  addInstitution: (institution: any) => void
  loading: boolean
  error?: any
  createInstitution: (...args: any[]) => any
  createLoading?: boolean
  createError?: any
  createdInstitution?: any
  refetchInstitutions: () => void;
  refetchInstitutionById: () => void;
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



export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para instituição ativa
  const [activeInstitution, setActiveInstitution] = useState<any>(null);

  // Hook original
  const {
    institutions: rawInstitutions,
    currentInstitutionData,
    loading,
    error,
    createInstitution,
    createLoading,
    createError,
    createdInstitution,
    refetchInstitutions,
    refetchInstitutionById,
  } = useInstitutions(activeInstitution?.id);

  // Garante que cada instituição tenha um logo válido
  const institutions = React.useMemo(() => {
    return (rawInstitutions || []).map(inst => ({
      ...inst,
      logo: Building2,
    }));
  }, [rawInstitutions]);


  // Atualiza activeInstitution quando institutions mudam ou ao inicializar
  React.useEffect(() => {
    if (institutions && institutions.length > 0) {
      setActiveInstitution((prev: typeof institutions[0] | null) => {
        if (!prev || !institutions.find(i => i.id === prev.id)) {
          return institutions[0];
        }
        return prev;
      });
    } else {
      setActiveInstitution(null);
    }
  }, [institutions]);

  // Troca de instituição
  const switchInstitution = useCallback((institutionId: string) => {
    const institution = institutions.find(inst => inst.id === institutionId);
    if (institution && (!activeInstitution || institution.id !== activeInstitution.id)) {
      setActiveInstitution(institution);
      toast.success(
        `🏢 Switched to ${institution.name}\n📊 Loading institution data...`,
        {
          duration: 4000,
          style: { minWidth: '300px' }
        }
      );
    }
  }, [activeInstitution, institutions]);

  // Adiciona instituição (apenas local, para efeito imediato; persistência via createInstitution)
  const addInstitution = useCallback((institutionData: any) => {
    // Chama a mutation do hook para criar na API
    // O objeto institutionData deve conter os campos de CreateInstitutionVariables
    createInstitution({ variables: institutionData });
    // O hook já irá atualizar a lista ao receber o novo dado
  }, [createInstitution]);


  const value: InstitutionContextType & {
    refetchInstitutions: () => void;
    refetchInstitutionById: () => void;
  } = useMemo(() => ({
    institutions,
    activeInstitution,
    setActiveInstitution,
    switchInstitution,
    addInstitution,
    loading,
    error,
    createInstitution,
    createLoading,
    createError,
    createdInstitution,
    refetchInstitutions,
    refetchInstitutionById,
  }), [institutions, activeInstitution, switchInstitution, addInstitution, loading, error, createInstitution, createLoading, createError, createdInstitution, refetchInstitutions, refetchInstitutionById]);

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  )
}
