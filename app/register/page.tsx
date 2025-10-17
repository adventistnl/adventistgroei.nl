"use client"

import * as React from "react"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { Form } from "@/components/ui/form"
import { registerTranslations } from "@/lib/translations/register"
import { MultiStepForm } from "@/components/shared/multi-step-form"

// Componentes organizados
import { RegistrationLayout } from "@/components/registration/registration-layout"
import { RegistrationHeader } from "@/components/registration/registration-header"
import { RoleBadge } from "@/components/registration/role-badge"
import { LoadingState, ValidatingInviteState, InvalidInviteState } from "@/components/registration/registration-states"

// Steps do formulário
import { PersonalInfoStep } from "@/components/registration/steps/personal-info-step"
import { PasswordSetupStep } from "@/components/registration/steps/password-setup-step"
import { InstitutionDataStep } from "@/components/registration/steps/institution-data-step"

// Hook customizado para lógica de registro
import { useRegistration } from "@/hooks/use-registration"
import { validateToken } from "@/utils/validateToken"
import { useChurches } from "@/hooks/use-churches"
import { useInstitutions } from "@/hooks/use-institutions"
import { departments } from "@/data/usersData"
import { useDepartments } from "@/hooks/use-departments"
import { GenderType } from "@/types/graphql-global-types"
import { GenderSelectionStep } from "@/components/registration/steps/gender-selection-step"

// Idiomas suportados pelo sistema
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
]

// Labels para os roles de usuário
const ROLE_LABELS = {
  member: "Membro",
  volunteer: "Voluntário",
  leader: "Líder",
  pastor: "Pastor",
  admin: "Administrador",
}

/**
 * COMPONENTE PRINCIPAL DE REGISTRO
 * Gerencia todo o fluxo de registro de usuários
 */
function RegisterPageContent() {
  const { i18n } = useTranslation()

  // Hook customizado que gerencia toda a lógica de registro
  const {
    inviteData,
    isValidInvite,
    currentStep,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    isLoading,
    showContent,
    selectedDepartment,
    setCurrentStep,
    setShowPassword,
    setShowConfirmPassword,
    form,
    validateStep1,
    validateStep2,
    validateStep3,
    onSubmit,
    // goToLogin,
  } = useRegistration({
    translations: i18n?.language || "en",
  })
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = registerTranslations[currentLanguage as keyof typeof registerTranslations] || registerTranslations.en
  const { currentInstitutionData } = useInstitutions(inviteData?.institution_id || "")
  const departments = currentInstitutionData?.departments || []
  const  churches = currentInstitutionData?.churches || []

  /**
   * CONFIGURAÇÃO DOS STEPS DO FORMULÁRIO
   * Cada step é um objeto com título, descrição, validação e campos
   */

  const steps = [
    {
      id: "personal-info",
      title: t.personalInfo,
      description: t.personalInfoDesc,
      validation: validateStep1,
      fields: (
        <PersonalInfoStep
          form={form}
          translations={{
            name: t.name,
            namePlaceholder: t.namePlaceholder,
            email: t.email,
            emailPlaceholder: t.emailPlaceholder,
            emailAutoFilled: t.emailAutoFilled
          }}
          inviteEmail={inviteData?.email}
        />
      )
    },
    {
      id: "password-setup",
      title: t.passwordSetup,
      description: t.passwordSetupDesc,
      validation: validateStep2,
      fields: (
        <PasswordSetupStep
          control={form.control}
          translations={{
            password: t.password,
            passwordPlaceholder: t.passwordPlaceholder,
            confirmPassword: t.confirmPassword,
            confirmPasswordPlaceholder: t.confirmPasswordPlaceholder
          }}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      )
    },
    {
      id: "department-church",
      title: t.institutionData,
      description: t.institutionDataDesc,
      validation: validateStep3,
      fields: (
        <InstitutionDataStep
          control={form.control}
          translations={{
            department: t.department,
            church: t.church
          }}
          departments={departments}
          churches={churches}
          selectedDepartment={selectedDepartment}
        />
      )
    },
    {
      id: "gender-selection",
      title: t.genderSelection,
      description: t.genderSelectionDesc,
      validation: validateStep1, // Reutilizando validação do primeiro step
      fields: (
        <GenderSelectionStep
          form={form.control}
        />
      )
    }
  ]

  /**
   * RENDERIZAÇÃO CONDICIONAL BASEADA NO ESTADO
   * Exibe diferentes componentes dependendo do estado atual
   */

  // Estado de loading inicial
  if (isLoading) {
    return <LoadingState message={t.loading} />
  }

  // Estado de validação do convite
  if (isValidInvite === null) {
    return <ValidatingInviteState message={t.validatingInvite} />
  }

  // Estado de convite inválido
  if (!isValidInvite ) {
    return (
      <InvalidInviteState
        title={t.invalidInvite}
        description={t.invalidInviteDesc}
        // buttonText={t.goToLogin}
        // onGoToLogin={goToLogin}
      />
    )
  }

  /**
   * ESTADO PRINCIPAL - FORMULÁRIO DE REGISTRO
   * Renderiza o formulário multi-step completo
   */
  return (
    <RegistrationLayout isVisible={showContent}>
      {/* Header com título, subtítulo e controles */}
      <RegistrationHeader
        title={t.title}
        subtitle={t.subtitle}
        languages={LANGUAGES}
        currentLanguage={currentLanguage}
      />
      
      {/* Badge do role do convite */}
      {/* <RoleBadge 
        inviteData={inviteData} 
        roleLabels={ROLE_LABELS} 
      /> */}

      {/* Formulário multi-step */}
      <Form {...form}>
        <MultiStepForm
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onSubmit={() => form.handleSubmit(onSubmit)()}
          isSubmitting={isSubmitting}
          previousLabel={t.previous}
          nextLabel={t.next}
          submitLabel={t.finishRegistration}
          submittingLabel={t.finishing}
          titleVariant="centered"
          buttonsVariant="modern"
          fieldsLayout="stack"
          containerGap="2.5rem"
        />
              </Form>
    </RegistrationLayout>
  )
}

/**
 * COMPONENTE EXPORTADO PRINCIPAL
 * Envolve o conteúdo em Suspense para carregamento assíncrono
 * Necessário para componentes que usam useSearchParams
 */
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  )
}

/**
 * DOCUMENTAÇÃO DO FLUXO DE REGISTRO
 * 
 * 1. VALIDAÇÃO DE CONVITE:
 *    - Verifica se existe token de convite na URL
 *    - Decodifica JWT e valida expiração
 *    - Preenche email se fornecido no convite
 * 
 * 2. STEPS DO FORMULÁRIO:
 *    - Step 1: Informações pessoais (nome, email)
 *    - Step 2: Configuração de senha (senha, confirmação)
 *    - Step 3: Dados institucionais (departamento, igreja)
 * 
 * 3. VALIDAÇÃO POR STEP:
 *    - Cada step tem validação específica
 *    - Avanço automático ao pressionar Enter
 *    - Feedback visual com toasts
 * 
 * 4. SUBMISSÃO:
 *    - Coleta todos os dados do formulário
 *    - Adiciona dados automáticos (institution_id, language_preference)
 *    - Simula API call com loading
 *    - Redireciona para login após sucesso
 * 
 * 5. COMPONENTES UTILIZADOS:
 *    - RegistrationLayout: Layout 7 colunas com sidebar
 *    - RegistrationHeader: Cabeçalho com controles
 *    - RoleBadge: Badge do role do convite
 *    - PersonalInfoStep: Campos pessoais
 *    - PasswordSetupStep: Configuração de senha
 *    - InstitutionDataStep: Seleção departamento/igreja
 *    - MultiStepForm: Formulário multi-step reutilizável
 *    - LoadingState/ValidatingInviteState/InvalidInviteState: Estados de UI
 */
