"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "react-i18next"
import { profileTranslations } from "@/lib/translations/profile"
import { ProfileHeader } from "@/components/profile/profile-header"
import { PersonalInfoSection } from "@/components/profile/personal-info-section"
import { ChurchInfoSection } from "@/components/profile/church-info-section"
import { ProfileStatusAlert } from "@/components/profile/profile-status-alert"
import { useProfileEditor, ExtendedProfile } from "@/hooks/use-profile-editor"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { AdventistLogo } from "@/components/ui/adventist-logo"
import { useUser } from "@/hooks/use-user"
import { UpdateUserVariables } from "@/types/UpdateUser"
import { usePageTitle } from "@/hooks/use-page-title"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import "@/lib/i18n"
import { ChevronRight, Building2 } from "lucide-react"

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user: authUser, isAuthenticated, isLoading } = useAuth()
  const { user, loading: userLoading, refetch: refetchUser } = useUser({id: authUser?.id})
  const router = useRouter()

  // Set page title (must be before any conditional returns)
  usePageTitle({
    title: t('common.profile'),
    showBreadcrumbsInHeader: false
  })

  // Configurar traduções do perfil
  useEffect(() => {
    i18n.addResourceBundle('en', 'translation', { profile: profileTranslations.en }, true, true)
    i18n.addResourceBundle('pt', 'translation', { profile: profileTranslations.pt }, true, true)
    i18n.addResourceBundle('es', 'translation', { profile: profileTranslations.es }, true, true)
    i18n.addResourceBundle('nl', 'translation', { profile: profileTranslations.nl }, true, true)
  }, [i18n])


  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Create profile from auth user data
  const userProfile: ExtendedProfile = useMemo(() => {
    
    // For now, we'll use a mock role until the backend user_roles is properly configured
    const mockRoles = "Administrador, Pastor"; // This should come from user.user_roles when available
    
    const profile = {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.contact?.phone || "",
      address: user?.contact?.address || "",
      institution_id: user?.institution_id || "",
      church_id: user?.church_id || "",
      language_preference: user?.language_preference || "PT",
      // Additional fields for display
      institution_name: user?.institution?.name || "",
      church_name: user?.church?.name || "",
      role: mockRoles, // Lista de roles do usuário (mockado por enquanto)
    }

    return profile
  }, [user])

  const {
    editingSection,
    profile,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
  } = useProfileEditor(userProfile, refetchUser)
  // Debug when userProfile changes
  useEffect(() => {
    if (userProfile) {
      console.log("🎯 userProfile updated, passing to useProfileEditor:", userProfile)
    }
  }, [userProfile])



  // Show loading state
  if (isLoading) {
    return (
      <LoadingSpinner
        text={t('profile.loading')}
        customIcon={Building2}
        size="lg"
        fullScreen
        className="space-y-6 max-w-sm mx-auto px-8"
      />
    )
  }

  // Don't render if no user
  if (!user || !userProfile) {
    return null
  }


  // Check for incomplete profile data
  const incompleteFields = []
  
    // Only check if we have valid profile data
    if (userProfile) {
      // Personal fields
      if (!userProfile.name) {
        incompleteFields.push({ key: "name", label: t('profile.personal.full_name'), section: "personal" as const })
      }
      if (!userProfile.email) {
        incompleteFields.push({ key: "email", label: t('profile.personal.email'), section: "personal" as const })
      }
      if (!userProfile.phone) {
        incompleteFields.push({ key: "phone", label: t('profile.personal.phone'), section: "personal" as const })
      }
      if (!userProfile.address) {
        incompleteFields.push({ key: "address", label: t('profile.personal.address'), section: "personal" as const })
      }
      
      // Church fields
      if (!userProfile.institution_id) {
        incompleteFields.push({ key: "institution_id", label: t('profile.church.institution'), section: "church" as const })
      }
      if (!userProfile.church_id) {
        incompleteFields.push({ key: "church_id", label: t('profile.church.church'), section: "church" as const })
      }    console.log("📊 Incomplete fields detected:", incompleteFields)
  }

  // Handle field click to edit section
  const handleFieldClick = (section: "personal" | "church") => {
    handleEdit(section)
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Container com largura total */}
        <div className="w-full space-y-8">
          
          {/* Page Header */}
          <ProfileHeader
            name={profile.name || ""}
            email={profile.email || ""}
            isComplete={incompleteFields.length === 0}
          />

          {/* Profile Status Alert */}
          {incompleteFields.length > 0 && (
            <ProfileStatusAlert
              incompleteFields={incompleteFields}
              onFieldClick={handleFieldClick}
            />
          )}

          {/* Profile Sections Stack */}
          <div className="space-y-6">
            
            {/* Personal Data Section */}
            <PersonalInfoSection
              name={editData.name || profile.name || ""}
              email={editData.email || profile.email || ""}
              phone={editData.phone || profile.phone || ""}
              address={editData.address || profile.address || ""}
              language={editData.language_preference || profile.language_preference || "en"}
              isEditing={editingSection === "personal"}
              onEdit={() => handleEdit("personal")}
              onSave={() => handleSave("personal")}
              onCancel={handleCancel}
              onNameChange={(value) => handleFieldChange("name", value)}
              onEmailChange={(value) => handleFieldChange("email", value)}
              onPhoneChange={(value) => handleFieldChange("phone", value)}
              onAddressChange={(value) => handleFieldChange("address", value)}
              onLanguageChange={(value) => handleFieldChange("language_preference", value)}
            />

            {/* Church Information Section */}
            <ChurchInfoSection
              role={profile.role || ""}
              institution={profile.institution_name || ""}
              church={profile.church_name || ""}
              isEditing={false}
              onEdit={() => {}} // Bloqueado
              onSave={() => {}} // Bloqueado
              onCancel={() => {}} // Bloqueado
              onRoleChange={() => {}} // Bloqueado
              onInstitutionChange={() => {}} // Bloqueado
              onChurchChange={() => {}} // Bloqueado
            />

          </div>
        </div>
      </div>
    </AppLayout>
  )
}
