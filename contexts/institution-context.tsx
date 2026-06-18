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
  const { user: authUser } = useAuth();
  const { user } = useUser({});

  const STORAGE_KEY = 'active_institution_id';

  // T8: Read localStorage synchronously in the initializer — SSR-safe via typeof window guard.
  // Using useEffect to set this caused an extra render cycle (undefined → id → data loaded)
  // which produced a blank screen flash between spinners post-login.
  const [activeInstitutionId, setActiveInstitutionId] = React.useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('active_institution_id') || undefined;
  });



  // T6/T7: Single useInstitutions() call — pass activeInstitutionId directly.
  // Previously there were TWO calls (one with undefined, one with activeInstitutionId)
  // which caused two simultaneous GraphQL queries and a combined loading state
  // that rendered double loading overlays post-login.
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
  } = useInstitutions(activeInstitutionId); // single call — list + specific institution together

  // Mapear institutions com logo
  const institutions = React.useMemo(() => {
    return (rawInstitutions || []).map(inst => ({
      ...inst,
      logo: Building2,
    }));
  }, [rawInstitutions]);

  // T8: Resolve activeInstitutionId on first client-side render only.
  // Priority: localStorage → authUser.institution_id → user.institution_id → first institution in list
  useEffect(() => {
    if (activeInstitutionId) return; // already set, do nothing

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setActiveInstitutionId(stored);
        return;
      }
    }

    if (authUser?.institution_id) {
      setActiveInstitutionId(authUser.institution_id);
    } else if (user?.institution_id) {
      setActiveInstitutionId(user.institution_id);
    } else if (institutions.length > 0) {
      setActiveInstitutionId(institutions[0].id);
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
    loading, // T7: single loading state — no more combined loading || specificLoading
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
    refetchInstitutionById,
    currentInstitutionData,
    updateInstitutionContact,
    updatedInstitutionContact,
    updateContactLoading,
    updateContactError
  }), [
    institutions,
    switchInstitution,
    addInstitution,
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
    updateInstitution,
    updateLoading,
    updateError,
    updatedInstitution,
    refetchInstitutions,
    refetchInstitutionById,
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
