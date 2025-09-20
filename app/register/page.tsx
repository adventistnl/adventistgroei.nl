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

/**
 * CONFIGURAÇÕES E DADOS MOCK
 * Centralizados para fácil manutenção
 */

// ID padrão da instituição (será obtido do contexto do usuário logado)
const DEFAULT_INSTITUTION_ID = "1580c125-edfd-43e6-a169-cecd4b19e2e8"

// Departamentos disponíveis para seleção
const DEPARTMENTS = [
  { id: "6107a2bc-c1d7-4567-b8f8-5818eb4c4a04", name: "Administração", description: "Gestão administrativa e financeira" },
  { id: "7107a2bc-c1d7-4567-b8f8-5818eb4c4a05", name: "Pastoral", description: "Ministério pastoral e evangelismo" },
  { id: "8107a2bc-c1d7-4567-b8f8-5818eb4c4a06", name: "Educação", description: "Ensino e educação cristã" },
  { id: "9107a2bc-c1d7-4567-b8f8-5818eb4c4a07", name: "Comunicação", description: "Marketing e comunicação" },
  { id: "a107a2bc-c1d7-4567-b8f8-5818eb4c4a08", name: "Jovens", description: "Ministério jovem e adolescentes" },
  { id: "b107a2bc-c1d7-4567-b8f8-5818eb4c4a09", name: "Música", description: "Louvor e ministério musical" },
  { id: "c107a2bc-c1d7-4567-b8f8-5818eb4c4a0a", name: "Diaconia", description: "Serviços sociais e assistência" },
]

// Igrejas organizadas por departamento
const CHURCHES = {
  "6107a2bc-c1d7-4567-b8f8-5818eb4c4a04": [
    { id: "993acf3c-8b16-4cf2-a55d-9f93b06efe02", name: "Igreja Central de São Paulo", location: "Centro, SP" },
    { id: "a93acf3c-8b16-4cf2-a55d-9f93b06efe03", name: "Igreja de Vila Madalena", location: "Vila Madalena, SP" },
    { id: "b93acf3c-8b16-4cf2-a55d-9f93b06efe04", name: "Igreja da Mooca", location: "Mooca, SP" },
    { id: "c93acf3c-8b16-4cf2-a55d-9f93b06efe05", name: "Igreja do Ipiranga", location: "Ipiranga, SP" },
    { id: "d93acf3c-8b16-4cf2-a55d-9f93b06efe06", name: "Igreja de Santana", location: "Santana, SP" },
  ],
  "7107a2bc-c1d7-4567-b8f8-5818eb4c4a05": [
    { id: "e93acf3c-8b16-4cf2-a55d-9f93b06efe07", name: "Igreja Pastoral Central", location: "Centro Pastoral, SP" },
    { id: "f93acf3c-8b16-4cf2-a55d-9f93b06efe08", name: "Igreja Pastoral Norte", location: "Zona Norte, SP" },
    { id: "g93acf3c-8b16-4cf2-a55d-9f93b06efe09", name: "Igreja Pastoral Sul", location: "Zona Sul, SP" },
  ],
  "8107a2bc-c1d7-4567-b8f8-5818eb4c4a06": [
    { id: "h93acf3c-8b16-4cf2-a55d-9f93b06efe0a", name: "Centro Educacional Adventista", location: "Educação, SP" },
    { id: "i93acf3c-8b16-4cf2-a55d-9f93b06efe0b", name: "Escola Adventista Central", location: "Centro Educacional, SP" },
  ],
  "9107a2bc-c1d7-4567-b8f8-5818eb4c4a07": [
    { id: "j93acf3c-8b16-4cf2-a55d-9f93b06efe0c", name: "Centro de Comunicação", location: "Comunicação, SP" },
    { id: "k93acf3c-8b16-4cf2-a55d-9f93b06efe0d", name: "Estúdio de Mídia Adventista", location: "Mídia, SP" },
  ],
  "a107a2bc-c1d7-4567-b8f8-5818eb4c4a08": [
    { id: "l93acf3c-8b16-4cf2-a55d-9f93b06efe0e", name: "Centro de Jovens Central", location: "Jovens, SP" },
    { id: "m93acf3c-8b16-4cf2-a55d-9f93b06efe0f", name: "Clube de Desbravadores", location: "Desbravadores, SP" },
    { id: "n93acf3c-8b16-4cf2-a55d-9f93b06efe10", name: "Ministério Jovem Adventista", location: "Jovens, SP" },
  ],
}

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
    goToLogin,
  } = useRegistration({
    translations: i18n?.language || "en",
    defaultInstitutionId: DEFAULT_INSTITUTION_ID,
  })
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = registerTranslations[currentLanguage as keyof typeof registerTranslations] || registerTranslations.en

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
          departments={DEPARTMENTS}
          churches={CHURCHES}
          selectedDepartment={selectedDepartment}
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
  if (!isValidInvite) {
    return (
      <InvalidInviteState
        title={t.invalidInvite}
        description={t.invalidInviteDesc}
        buttonText={t.goToLogin}
        onGoToLogin={goToLogin}
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
