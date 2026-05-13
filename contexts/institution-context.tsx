"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useInstitutions } from '@/hooks/use-institutions'
import { InstitutionById_institution } from '@/types/InstitutionById'
import { Institutions_institutions } from '@/types/Institutions'
import { useUpdateInstitutionContactMutation, useUpdateInstitutionMutation } from '@/hooks/graphql/use-institution-mutation'
import { ErrorLike } from '@apollo/client'
import { UpdateInstitutionContact } from '@/types/UpdateInstitutionContact'
import { useUser } from "@/hooks/use-user";
import { useAuth } from './auth-context'

interface InstitutionContextType {
  institutions: Institutions_institutions[];
  switchInstitution: (institutionId: string) => void;
  addInstitution: (institution: any) => void;
  loading: boolean;
  error?: any;
  createInstitution: (...args: any[]) => any;
  createLoading?: boolean;
  createError?: any;
  createdInstitution?: any;
  deleteInstitution: (...args: any[]) => any;
  deleteLoading?: boolean;
  deleteError?: any;
  deletedInstitution?: any;
  updateInstitution: ReturnType<typeof useUpdateInstitutionMutation>[0];
  updateLoading?: boolean;
  updateError?: any;
  updatedInstitution?: any;
  refetchInstitutions: () => void;
  refetchInstitutionById: () => void;
  currentInstitutionData: InstitutionById_institution | null;
  updateInstitutionContact: ReturnType<typeof useUpdateInstitutionContactMutation>[0]
  updatedInstitutionContact: UpdateInstitutionContact | null | undefined
  updateContactLoading: boolean
  updateContactError: ErrorLike | undefined
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined)

export const useInstitution = () => {
  const context = useContext(InstitutionContext)
  if (context === undefined) {
    throw new Error('useInstitution must be used within an InstitutionProvider')
  }
  return context
}

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para instituição ativa
  const { user: authUser } = useAuth();
  const { user  } = useUser({});
  
  // Calcular institutions ANTES de tudo
  const {
    institutions: rawInstitutions,
    currentInstitutionData,
    loading,
    error,
    createInstitution,
    createLoading,
    createError,
    createdInstitution,
    deleteInstitution,
    deleteLoading,
    deleteError,
    deletedInstitution,
    refetchInstitutions,
    refetchInstitutionById,
    updateInstitution,
    updateLoading,
    updateError,
    updatedInstitution,
    updateContactError,
    updateContactLoading,
    updateInstitutionContact,
    updatedInstitutionContact
  } = useInstitutions(undefined); // Passar undefined inicialmente para carregar lista
  
  // Mapear institutions com logo
  const institutions = React.useMemo(() => {
    return (rawInstitutions || []).map(inst => ({
      ...inst,
      logo: Building2,
    }));
  }, [rawInstitutions]);

  const STORAGE_KEY = 'active_institution_id';

  // Helper SSR-safe para ler localStorage
  const readStoredInstitutionId = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem(STORAGE_KEY) || undefined;
  };

  // Definir activeInstitutionId com fallback inteligente
  // Prioridade: localStorage salvo → institution_id do user logado → undefined (useEffect resolve)
  const [activeInstitutionId, setActiveInstitutionId] = useState<string | undefined>(() => {
    const stored = readStoredInstitutionId();
    if (stored) return stored;
    if (authUser?.institution_id) return authUser.institution_id;
    if (user?.institution_id) return user.institution_id;
    return undefined;
  });

  // Agora buscar dados da instituição específica
  const {
    currentInstitutionData: specificInstitutionData,
    loading: specificLoading,
    refetchInstitutionById: refetchSpecificInstitution
  } = useInstitutions(activeInstitutionId);

  // Atualizar activeInstitutionId quando necessário (apenas se ainda não foi definido)
  useEffect(() => {
    if (!activeInstitutionId) {
      const stored = readStoredInstitutionId();
      if (stored) {
        setActiveInstitutionId(stored);
      } else if (authUser?.institution_id) {
        setActiveInstitutionId(authUser.institution_id);
      } else if (user?.institution_id) {
        setActiveInstitutionId(user.institution_id);
      } else if (institutions.length > 0) {
        setActiveInstitutionId(institutions[0].id);
      }
    }
  }, [authUser, user, institutions, activeInstitutionId]);
  


  // Troca de instituição — persiste no localStorage
  const switchInstitution = useCallback(async (institutionId: string) => {
    const institution = institutions.find(inst => inst.id === institutionId);
    if (institution && institution.id !== activeInstitutionId) {
      setActiveInstitutionId(institution.id);

      // Persistir para sobreviver a reloads
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, institution.id);
      }

      toast.success(
        `Switched to ${institution.name}\n📊 Loading institution data...`,
        {
          duration: 4000,
          style: { minWidth: '300px' }
        }
      );
    }
  }, [activeInstitutionId, institutions]);

  // Adiciona instituição (apenas local, para efeito imediato; persistência via createInstitution)
  const addInstitution = useCallback((institutionData: any) => {
    // Chama a mutation do hook para criar na API
    // O objeto institutionData deve conter os campos de CreateInstitutionVariables
    createInstitution({ variables: institutionData });
    // O hook já irá atualizar a lista ao receber o novo dado
  }, [createInstitution]);

  const value: InstitutionContextType = useMemo(() => ({
    institutions,
    switchInstitution,
    addInstitution,
    loading: loading || specificLoading,
    error,
    createInstitution,
    createLoading,
    createError,
    createdInstitution,
    deleteInstitution,
    deleteLoading,
    deleteError,
    deletedInstitution,
    updateInstitution,
    updateLoading,
    updateError,
    updatedInstitution,
    refetchInstitutions,
    refetchInstitutionById: refetchSpecificInstitution,
    currentInstitutionData: specificInstitutionData || currentInstitutionData,
    updateInstitutionContact,
    updatedInstitutionContact,
    updateContactLoading,
    updateContactError
  }), [
    institutions,
    switchInstitution,
    addInstitution,
    loading,
    specificLoading,
    error,
    createInstitution,
    createLoading,
    createError,
    createdInstitution,
    deleteInstitution,
    deleteLoading,
    deleteError,
    deletedInstitution,
    updateInstitution,
    updateLoading,
    updateError,
    updatedInstitution,
    refetchInstitutions,
    refetchSpecificInstitution,
    specificInstitutionData,
    currentInstitutionData,
    updateInstitutionContact,
    updatedInstitutionContact,
    updateContactLoading,
    updateContactError
  ]);

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  )
}
