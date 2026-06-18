"use client"

import * as React from "react"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { Form } from "@/components/ui/form"
import { registerTranslations } from "@/lib/translations/register"
import { MultiStepForm } from "@/components/shared/multi-step-form"
import { AppLoader } from "@/components/shared/app-loader"

// Componentes organizados
import { RegistrationLayout } from "@/components/registration/registration-layout"
import { RegistrationHeader } from "@/components/registration/registration-header"
import { InvalidInviteState, SuccessRegistrationState } from "@/components/registration/registration-states"

// Steps do formulário
import { PersonalInfoStep } from "@/components/registration/steps/personal-info-step"
import { PasswordSetupStep } from "@/components/registration/steps/password-setup-step"
import { EmailVerificationStep } from "@/components/registration/steps/email-verification-step"

// Hook customizado para lógica de registro
import { useRegistration } from "@/hooks/use-registration"
import { useInstitutions } from "@/hooks/use-institutions"

// Idiomas suportados pelo sistema
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pt', name: 'Português' },
]

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
    isRedirecting,
    isEmailVerified,
    isVerifyingEmail,
    setCurrentStep,
    setShowPassword,
    setShowConfirmPassword,
    form,
    validateStep1,
    validateEmailVerification,
    validateStep2,
    handleVerifyEmailCode,
    sendVerificationCode,
    onSubmit,
    goToLogin,
  } = useRegistration({
    language: i18n?.language || "en",
  })
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = registerTranslations[currentLanguage as keyof typeof registerTranslations] || registerTranslations.en
  const { currentInstitutionData } = useInstitutions(inviteData?.institution_id || "")
  const institutionDepartment = currentInstitutionData?.departments ? currentInstitutionData.departments.find(department => department.id === inviteData?.institution_department_id) : undefined
  const church = currentInstitutionData?.churches ? currentInstitutionData.churches.find(church => church.id === inviteData?.church_id) : undefined
  const churchDepartment = church?.departments ? church.departments.find(department => department.id === inviteData?.church_department_id) : undefined

  // Email currently entered in the form (used by the OTP step)
  const emailValue = form.watch("email")

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
            emailAutoFilled: t.emailAutoFilled,
            church: t.church,
            churchDepartment: t.churchDepartment,
            institution: t.institution,
            institutionDepartment: t.institutionDepartment,
            infoSubtitle: t.personalInfoSubtitle,
            affiliationInfoDesc: t.affiliationInfoDesc,
            genderLabel: t.genderLabel,
            genderPlaceholder: t.genderPlaceholder,
            gender: t.gender,
            showAffiliationInfo: t.showAffiliationInfo,
            hideAffiliationInfo: t.hideAffiliationInfo,
            noGenderSelected: t.noGenderSelected,
          }}
          inviteEmail={inviteData?.email}
          church={church?.name}
          churchDepartment={churchDepartment?.name}
          institution={currentInstitutionData?.name || ""}
          institutionDepartment={institutionDepartment?.name}
        />
      )
    },
    {
      id: "email-verification",
      title: t.emailVerification,
      description: t.emailVerificationDesc,
      validation: validateEmailVerification,
      fields: (
        <EmailVerificationStep
          email={emailValue || inviteData?.email || ""}
          translations={{
            title: t.emailVerificationTitle,
            description: t.emailVerificationDescription,
            codeSentTo: t.codeSentTo,
            enterCode: t.enterCode,
            resendCode: t.resendCode,
            resendIn: t.resendIn,
            verifying: t.verifying,
            verified: t.verified,
            invalidCode: t.invalidCode,
            sending: t.sending,
            codeSent: t.codeSent,
          }}
          onVerify={handleVerifyEmailCode}
          onResend={async () => { const r = await sendVerificationCode(); return r.success }}
          isVerified={isEmailVerified}
          isLoading={isVerifyingEmail}
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
  ]

  /**
   * RENDERIZAÇÃO CONDICIONAL BASEADA NO ESTADO
   * Exibe diferentes componentes dependendo do estado atual
   */

  // Estado de loading inicial
  if (isLoading) {
    return <AppLoader fullScreen message={t.loading} />
  }

  // Estado de validação do convite
  if (isValidInvite === null) {
    return <AppLoader fullScreen message={t.validatingInvite} />
  }

  // Estado de convite inválido
  if (!isValidInvite ) {
    return (
      <InvalidInviteState
        title={t.invalidInvite}
        description={t.invalidInviteDesc}
        buttonText={t.goToLogin}
        onGoToLogin={goToLogin}
      />
    )
  }

  // Estado de redirecionamento após registro completo
  if (isRedirecting) {
    return (
      <SuccessRegistrationState
        title={t.registrationComplete}
        message={t.redirectingToDashboard}
        description={t.accessGranted}
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
    <Suspense fallback={<AppLoader fullScreen />}>
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
 *    - Step 1: Informações pessoais (nome, email, gênero)
 *    - Step 2: Verificação de email (OTP de 6 dígitos)
 *    - Step 3: Configuração de senha (senha, confirmação)
 * 
 * 3. VERIFICAÇÃO DE EMAIL (Step 2):
 *    - Ao avançar do Step 1, o código é enviado automaticamente
 *    - O usuário insere o código de 6 dígitos recebido por email
 *    - Auto-submit ao completar todos os 6 dígitos
 *    - Suporte a colar (paste), retroceder (backspace) e reenviar
 *    - Countdown de 60s antes de permitir reenvio
 * 
 * 4. SUBMISSÃO:
 *    - Coleta todos os dados do formulário
 *    - Adiciona dados automáticos (institution_id, language_preference)
 *    - Redireciona para dashboard após login automático
 */
