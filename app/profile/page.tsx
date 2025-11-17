"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useAuth } from "@/contexts/auth-context"
import { ProfileHeader } from "@/components/profile/profile-header"
import { PersonalInfoSection } from "@/components/profile/personal-info-section"
import { ChurchInfoSection } from "@/components/profile/church-info-section"
import { ProfileStatusAlert } from "@/components/profile/profile-status-alert"
import { useProfileEditor } from "@/hooks/use-profile-editor"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { AdventistLogo } from "@/components/ui/adventist-logo"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Debug: Log user data
  useEffect(() => {
    console.group("🔍 Profile Page - User Data Debug")
    console.log("User object:", user)
    console.log("Is Authenticated:", isAuthenticated)
    console.log("Is Loading:", isLoading)
    console.log("User ID:", user?.id)
    console.log("User Name:", user?.name)
    console.log("User Email:", user?.email)
    console.log("User Roles:", user?.user_roles)
    console.log("User Institution ID:", user?.institution_id)
    console.log("User Church ID:", user?.church_id)
    console.log("User Language Preference:", user?.language_preference)
    console.log("User Contact ID:", user?.contact_id)
    console.groupEnd()
  }, [user, isAuthenticated, isLoading])

  // Create profile from auth user data
  const userProfile = useMemo(() => {
    if (!user) {
      console.log("⚠️ userProfile: No user data yet (still loading or not authenticated)")
      return null
    }
    
    const profile = {
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      phone: "", // TODO: Get from contact data when available
      address: "", // TODO: Get from contact data when available
      role: user.user_roles?.[0]?.name || "Member",
      institution: user.institution_id || "",
      church: user.church_id || "",
      language: user.language_preference || "PT",
    }

    console.log("✅ Profile constructed with user data:", profile)
    return profile
  }, [user])

  // Debug when userProfile changes
  useEffect(() => {
    if (userProfile) {
      console.log("🎯 userProfile updated, passing to useProfileEditor:", userProfile)
    }
  }, [userProfile])

  const {
    editingSection,
    profile,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
  } = useProfileEditor(userProfile || {
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    institution: "",
    church: "",
    language: "PT",
  })

  // Show loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-8 max-w-md mx-auto px-8">
            {/* Logo centralizada */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Animação de loading */}
                <div className="absolute inset-0 w-24 h-24 border-2 border-transparent border-t-primary/30 border-r-primary/20 rounded-full animate-spin"></div>
                
                {/* Logo */}
                <div className="w-24 h-24 flex items-center justify-center">
                  <AdventistLogo className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground font-medium">Carregando perfil...</p>
              
              {/* Indicador de carregamento */}
              <div className="flex items-center justify-center space-x-1 pt-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
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
      incompleteFields.push({ key: "name", label: "Nome", section: "personal" as const })
    }
    if (!userProfile.email) {
      incompleteFields.push({ key: "email", label: "Email", section: "personal" as const })
    }
    if (!userProfile.phone) {
      incompleteFields.push({ key: "phone", label: "Telefone", section: "personal" as const })
    }
    if (!userProfile.address) {
      incompleteFields.push({ key: "address", label: "Endereço", section: "personal" as const })
    }
    
    // Church fields
    if (!userProfile.institution) {
      incompleteFields.push({ key: "institution", label: "Instituição", section: "church" as const })
    }
    if (!userProfile.church) {
      incompleteFields.push({ key: "church", label: "Igreja", section: "church" as const })
    }
    
    console.log("📊 Incomplete fields detected:", incompleteFields)
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
            name={profile.name}
            email={profile.email}
          />

          {/* Profile Status Alert */}
          <ProfileStatusAlert
            incompleteFields={incompleteFields}
            onFieldClick={handleFieldClick}
          />

          {/* Profile Sections Stack */}
          <div className="space-y-6">
            
            {/* 1. Dados Pessoais */}
            <PersonalInfoSection
              name={editData.name || profile.name}
              email={editData.email || profile.email}
              phone={editData.phone || profile.phone}
              address={editData.address || profile.address}
              isEditing={editingSection === "personal"}
              onEdit={() => handleEdit("personal")}
              onSave={() => handleSave("personal")}
              onCancel={handleCancel}
              onNameChange={(value) => handleFieldChange("name", value)}
              onEmailChange={(value) => handleFieldChange("email", value)}
              onPhoneChange={(value) => handleFieldChange("phone", value)}
              onAddressChange={(value) => handleFieldChange("address", value)}
            />

            {/* 2. Informações da Igreja */}
            <ChurchInfoSection
              role={editData.role || profile.role}
              institution={editData.institution || profile.institution}
              church={editData.church || profile.church}
              language={profile.language}
              isEditing={editingSection === "church"}
              onEdit={() => handleEdit("church")}
              onSave={() => handleSave("church")}
              onCancel={handleCancel}
              onRoleChange={(value) => handleFieldChange("role", value)}
              onInstitutionChange={(value) => handleFieldChange("institution", value)}
              onChurchChange={(value) => handleFieldChange("church", value)}
            />

          </div>
        </div>
      </div>
    </AppLayout>
  )
}
