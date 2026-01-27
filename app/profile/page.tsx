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
import { useInstitution } from "@/contexts/institution-context"
import { useQuery } from "@apollo/client"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import "@/lib/i18n"
import { ChevronRight, Building2 } from "lucide-react"

// Função para formatar telefone brasileiro: (DD) XXXXX-XXXX
function formatPhoneDisplay(phone: string): string {
  if (!phone) return ''
  
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '')
  
  // Aplica a máscara
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  }
  
  return phone
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user: authUser, isAuthenticated, isLoading } = useAuth()
  const { currentInstitutionData } = useInstitution()
  const router = useRouter()

  // Buscar o user completo do contexto de instituição (que tem user_roles)
  const user = useMemo(() => {
    if (!currentInstitutionData?.users || !authUser?.id) return null
    return currentInstitutionData.users.find((u: any) => u.id === authUser.id) || null
  }, [currentInstitutionData?.users, authUser?.id])

  // Buscar todas as igrejas da instituição do usuário
  const { data: churchesData, loading: churchesLoading } = useQuery(GET_CHURCHES_QUERY, {
    variables: { institution_id: currentInstitutionData?.id },
    skip: !currentInstitutionData?.id,
    fetchPolicy: 'cache-and-network'
  })

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

  // Processar igrejas disponíveis
  const availableChurches = useMemo(() => {
    if (!churchesData?.churches) return []
    return churchesData.churches
      .filter((church: any) => !church.is_deleted)
      .map((church: any) => ({
        id: church.id,
        name: church.name
      }))
  }, [churchesData])

  // Create profile from auth user data
  const userProfile: ExtendedProfile = useMemo(() => {
    // Get roles from user_roles - agora funciona porque user vem do InstitutionContext (tipo User)
    const userRoles = (user as any)?.user_roles?.map((ur: any) => {
      return ur.role?.name
    }).filter(Boolean).join(", ") || t('profile.church.no_role')
    
    const profile = {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: formatPhoneDisplay(user?.contact?.phone || ""),
      address: "", // Contact em users não tem address, precisará ser carregado separadamente
      institution_id: currentInstitutionData?.id || user?.institution?.id || "",
      church_id: user?.church?.id || "",
      language_preference: user?.language_preference || "PT",
      // Additional fields for display
      institution_name: currentInstitutionData?.name || user?.institution?.name || "",
      church_name: user?.church?.name || "",
      role: userRoles,
    }

    return profile
  }, [user, currentInstitutionData, t])

  // Função para refetch - agora usa o contexto de instituição
  const refetchUser = async () => {
    // O refetch será automático quando o InstitutionContext atualizar
    console.log("♻️ User data will be refreshed via InstitutionContext")
  }

  const {
    editingSection,
    profile,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
    updateLoading,
  } = useProfileEditor(userProfile, refetchUser)




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
      // TODO: Reativar quando address estiver disponível no InstitutionById query
      // if (!userProfile.address) {
      //   incompleteFields.push({ key: "address", label: t('profile.personal.address'), section: "personal" as const })
      // }
      
      // Church fields
      if (!userProfile.institution_id) {
        incompleteFields.push({ key: "institution_id", label: t('profile.church.institution'), section: "church" as const })
      }
      if (!userProfile.church_id) {
        incompleteFields.push({ key: "church_id", label: t('profile.church.church'), section: "church" as const })
      }   
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
              // address={editData.address || profile.address || ""}
              language={editData.language_preference || profile.language_preference || "en"}
              isEditing={editingSection === "personal"}
              isSaving={updateLoading}
              onEdit={() => handleEdit("personal")}
              onSave={() => handleSave("personal")}
              onCancel={handleCancel}
              onNameChange={(value) => handleFieldChange("name", value)}
              onEmailChange={(value) => handleFieldChange("email", value)}
              onPhoneChange={(value) => handleFieldChange("phone", value)}
              // onAddressChange={(value) => handleFieldChange("address", value)}
              onLanguageChange={(value) => handleFieldChange("language_preference", value)}
            />

            {/* Church Information Section */}
            <ChurchInfoSection
              role={profile.role || ""}
              institution={profile.institution_name || ""}
              church={editData.church_id || profile.church_id || ""}
              churchName={profile.church_name || ""}
              availableChurches={availableChurches}
              isEditing={editingSection === "church"}
              isSaving={updateLoading}
              onEdit={() => handleEdit("church")}
              onSave={() => handleSave("church")}
              onCancel={handleCancel}
              onChurchChange={(value) => handleFieldChange("church_id", value)}
            />

          </div>
        </div>
      </div>
    </AppLayout>
  )
}
