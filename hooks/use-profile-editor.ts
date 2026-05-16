"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useUpdateOwnUser } from "./graphql/use-update-own-user"
import { useCheckEmailAvailability, useSendEmailVerificationCodeMutation, useVerifyEmailRegistrationCodeMutation } from "./graphql/use-email-verification-mutation"
import { classifySmtpError, SmtpErrorMessages } from "@/lib/classify-smtp-error"
import { registerTranslations } from "@/lib/translations/register"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

// Extended profile type for display purposes
export interface ExtendedProfile {
  id: string
  name?: string
  email?: string
  phone?: string
  address?: string
  language_preference?: string
  institution_id?: string
  church_id?: string
  institution_name?: string
  church_name?: string
  role?: string
  recieve_emails?: boolean
}

export function useProfileEditor(initialProfile: ExtendedProfile, refetchUser?: () => void) {
  const { i18n } = useTranslation()
  const [updateOwnUser, { loading: updateLoading }] = useUpdateOwnUser()
  const { updateAuthUser, user: authUser } = useAuth()
  const [checkEmailAvailability] = useCheckEmailAvailability()
  const [sendEmailVerificationCode] = useSendEmailVerificationCodeMutation()
  const [verifyEmailRegistrationCode] = useVerifyEmailRegistrationCodeMutation()

  // Resolve translations for the current language
  const t = useMemo(() => {
    const lang = (i18n?.language || 'en').split('-')[0] as keyof typeof registerTranslations
    return registerTranslations[lang] || registerTranslations.en
  }, [i18n?.language])

  const smtpMessages: SmtpErrorMessages = useMemo(() => ({
    smtpAuthFailed: t.smtpAuthFailed,
    smtpConnectionFailed: t.smtpConnectionFailed,
    smtpInvalidAddress: t.smtpInvalidAddress,
    smtpRateLimited: t.smtpRateLimited,
    smtpTlsFailed: t.smtpTlsFailed,
    fallback: t.emailSendError,
  }), [t])
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [profile, setProfile] = useState<ExtendedProfile>(initialProfile)
  const [editData, setEditData] = useState<Partial<ExtendedProfile>>(initialProfile)

  // Email change verification state
  const [pendingEmailSave, setPendingEmailSave] = useState<string | null>(null)
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)   // spinner while OTP is being sent
  const [otpSendError, setOtpSendError] = useState<string | null>(null)  // error shown inside modal

  // Sync profile when initialProfile changes (e.g., when user data loads)
  useEffect(() => {
    setProfile(initialProfile)
    setEditData(initialProfile)
  }, [initialProfile])

  const handleEdit = useCallback((section: string) => {
    setEditingSection(section)
    setEditData(profile)
  }, [profile])

  const handleSave = useCallback(async (section: string) => {
    try {
      // Prepare the update data - only send fields that were actually changed
      const updateData: any = {}
      
      if (editData.name && editData.name !== profile.name) {
        updateData.name = editData.name
      }
      if (editData.email && editData.email !== profile.email) {
        // Email changed: open modal immediately, then send OTP in background
        const newEmail = editData.email.toLowerCase().trim()

        // Open the modal right away so the user gets instant feedback
        setPendingEmailSave(newEmail)
        setIsEmailVerified(false)
        setOtpSendError(null)
        setIsSendingCode(true)
        setIsEmailVerificationOpen(true)

        // Run the async work (availability check + send) without blocking the modal render
        ;(async () => {
          // Check availability
          try {
            const { data: checkData } = await checkEmailAvailability({ variables: { email: newEmail } })
            if (checkData?.checkEmailAvailability?.success === false) {
              setIsSendingCode(false)
              setOtpSendError('This email address is already in use.')
              return
            }
          } catch {
            // connectivity issue — proceed; server will catch duplicate
          }

          // Send OTP
          try {
            const { data: sendData } = await sendEmailVerificationCode({
              variables: { email: newEmail, userName: profile.name, language: authUser?.language_preference || 'en' },
            })
            if (!sendData?.sendEmailVerificationCode?.success) {
              const rawError = sendData?.sendEmailVerificationCode?.error || ''
              setOtpSendError(classifySmtpError(rawError, smtpMessages))
            }
            // success: isSendingCode → false will reveal the OTP inputs
          } catch (e: any) {
            setOtpSendError(classifySmtpError(e?.message || '', smtpMessages))
          } finally {
            setIsSendingCode(false)
          }
        })()

        return // handleSave exits here; flow resumes in verifyEmailForSave()
      }
      if (editData.phone !== undefined && editData.phone !== profile.phone) {
        // Remove máscara do telefone antes de salvar (apenas números)
        updateData.phone = editData.phone.replace(/\D/g, '')
      }
      if (editData.address !== undefined && editData.address !== profile.address) {
        updateData.address = editData.address
      }
      if (editData.language_preference && editData.language_preference !== profile.language_preference) {
        updateData.language_preference = editData.language_preference
      }
      if (editData.institution_id && editData.institution_id !== profile.institution_id) {
        updateData.institution_id = editData.institution_id
      }
      if (editData.church_id && editData.church_id !== profile.church_id) {
        updateData.church_id = editData.church_id
      }
      if (editData.recieve_emails !== undefined && editData.recieve_emails !== profile.recieve_emails) {
        updateData.recieve_emails = editData.recieve_emails
      }

      await performUpdate(updateData)
    } catch (error: any) {
      if (error.message?.includes('permission')) {
        toast.error('You do not have permission to update your profile')
      } else if (error.message?.includes('email')) {
        toast.error('Invalid email address')
      } else {
        toast.error('Failed to update profile. Please try again.')
      }
    }
  }, [profile, editData, updateOwnUser, refetchUser, authUser, updateAuthUser, checkEmailAvailability, sendEmailVerificationCode, smtpMessages])

  /** Shared update logic after all validations pass */
  const performUpdate = useCallback(async (updateData: any) => {
    if (Object.keys(updateData).length === 0) {
      toast('No changes to save', { duration: 2000 })
      setEditingSection(null)
      return
    }

    const result = await updateOwnUser({ variables: { data: updateData } })

    if (result.data) {
      const updatedUser = result.data.updateOwnUser
      const newProfile = {
        ...profile,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.contact?.phone || '',
        address: updatedUser.contact?.address || '',
        language_preference: updatedUser.language_preference || 'en',
        institution_id: updatedUser.institution_id || '',
        church_id: updatedUser.church_id || '',
        institution_name: updatedUser.institution?.name || '',
        church_name: updatedUser.church?.name || '',
        recieve_emails: updatedUser.recieve_emails ?? profile.recieve_emails ?? true,
      }
      setProfile(newProfile)
      setEditData(newProfile)
      setEditingSection(null)
      if (refetchUser) await refetchUser()
      if (authUser) {
        updateAuthUser({
          ...authUser,
          name: updatedUser.name,
          email: updatedUser.email,
          language_preference: updatedUser.language_preference || authUser.language_preference,
          contact: authUser.contact ? {
            ...authUser.contact,
            phone: updatedUser.contact?.phone || authUser.contact.phone || '',
            address: updatedUser.contact?.address || authUser.contact.address || '',
          } : undefined,
        })
      }
      toast.success('Profile updated successfully!')
    }
  }, [profile, updateOwnUser, refetchUser, authUser, updateAuthUser])

  /** Verifies OTP entered by the user, then persists the new email. */
  const verifyEmailForSave = useCallback(async (code: string): Promise<boolean> => {
    if (!pendingEmailSave) return false
    setIsVerifyingEmail(true)
    try {
      const { data } = await verifyEmailRegistrationCode({
        variables: { email: pendingEmailSave, code },
      })
      const success = data?.verifyEmailRegistrationCode?.success ?? false
      if (success) {
        setIsEmailVerified(true)
        await performUpdate({ email: pendingEmailSave })
        setIsEmailVerificationOpen(false)
        setPendingEmailSave(null)
      }
      return success
    } catch {
      return false
    } finally {
      setIsVerifyingEmail(false)
    }
  }, [pendingEmailSave, verifyEmailRegistrationCode, performUpdate])

  const resendVerificationCode = useCallback(async (): Promise<boolean> => {
    if (!pendingEmailSave) return false
    try {
      const { data } = await sendEmailVerificationCode({
        variables: { email: pendingEmailSave, userName: profile.name, language: authUser?.language_preference || 'en' },
      })
      return data?.sendEmailVerificationCode?.success ?? false
    } catch {
      return false
    }
  }, [pendingEmailSave, sendEmailVerificationCode, profile.name, authUser])

  const cancelEmailChange = useCallback(() => {
    setIsEmailVerificationOpen(false)
    setPendingEmailSave(null)
    setIsEmailVerified(false)
    setOtpSendError(null)
    setIsSendingCode(false)
  }, [])

  /** Retry sending the OTP after a failure (called from the error state in the dialog) */
  const retryEmailSend = useCallback(async () => {
    if (!pendingEmailSave) return
    setOtpSendError(null)
    setIsSendingCode(true)
    try {
      const { data: sendData } = await sendEmailVerificationCode({
        variables: { email: pendingEmailSave, userName: profile.name, language: authUser?.language_preference || 'en' },
      })
      if (!sendData?.sendEmailVerificationCode?.success) {
        const rawError = sendData?.sendEmailVerificationCode?.error || ''
        setOtpSendError(classifySmtpError(rawError, smtpMessages))
      }
    } catch (e: any) {
      setOtpSendError(classifySmtpError(e?.message || '', smtpMessages))
    } finally {
      setIsSendingCode(false)
    }
  }, [pendingEmailSave, sendEmailVerificationCode, profile.name, authUser, smtpMessages])

  const handleCancel = useCallback(() => {
    setEditData(profile)
    setEditingSection(null)
  }, [profile])

  const handleFieldChange = useCallback((field: keyof ExtendedProfile, value: string | boolean) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }, [])

  return {
    editingSection,
    profile,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
    updateLoading,
    // Email change verification
    isEmailVerificationOpen,
    pendingEmailSave,
    isEmailVerified,
    isVerifyingEmail,
    isSendingCode,
    otpSendError,
    verifyEmailForSave,
    resendVerificationCode,
    cancelEmailChange,
    retryEmailSend,
  }
}
