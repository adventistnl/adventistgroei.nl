"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarIcon,
  Globe,
  Building,
  DollarSign,
  Settings,
  CheckCircle,
  Save,
  Check,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react"
import { format } from "date-fns"
import { ptBR, enUS, nl } from "date-fns/locale"
import { useMutation, useQuery } from "@apollo/client"
import toast from "react-hot-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { ProjectTableData } from "@/components/projects/projects-table"
import { UPDATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { ADD_ROLE_TO_USER } from "@/graphql/mutations/USER_MUTATIONS"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_PROJECTS_QUERY, GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { GET_ALL_ROLES_QUERY } from "@/graphql/queries/GET_ROLES_QUERY"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { UserMultiSelector, User } from "@/components/shared/user-multi-selector"
import { useInstitution } from "@/contexts/institution-context"
import { useAuth } from "@/contexts/auth-context"

export interface EditProjectFormData {
  title: string
  description: string
  department_id: string
  budget: number
  start_at: Date
  end_at: Date
  language_preference: string
  is_private: boolean
  required_volunteers: boolean
  is_event: boolean
  type: "Local" | "Global"
  owner_id: string
  co_owner_id: string
}

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  project?: ProjectTableData
}

export function EditProjectModal({ isOpen, onClose, onSuccess, project }: EditProjectModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  
  const dateLocale = React.useMemo(() => {
    switch (i18n.language) {
      case 'pt': return ptBR
      case 'nl': return nl
      default: return enUS
    }
  }, [i18n.language])
  
  const { currentInstitutionData, refetchInstitutionById } = useInstitution()
  const { user: currentUser } = useAuth()

  const institutionId = currentInstitutionData?.id


  // Fetch project details directly from API when modal opens — ensures co_owner, owner and all fields are correct
  const { data: projectDetailData, loading: projectDetailLoading } = useQuery(GET_PROJECT_BY_ID_QUERY, {
    variables: { id: project?.id },
    skip: !isOpen || !project?.id,
    fetchPolicy: 'network-only',
  })
  const projectDetail = projectDetailData?.project

  // Permission flags: only the project owner can change the owner field;
  // only the co-owner can change the co-owner field.
  const isOwner = !!currentUser?.id && currentUser.id === (projectDetail?.owner?.id ?? projectDetail?.owner_id)
  const isCoOwner = !!currentUser?.id && currentUser.id === (projectDetail?.co_owner?.id ?? projectDetail?.co_owner_id)

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  // Get users from institution context (already includes user_roles)
  const institutionUsers = currentInstitutionData?.users || []

  // Fetch all roles to find PROJECT_OWNER role
  const { data: rolesData } = useQuery(GET_ALL_ROLES_QUERY)

  const availableUsers = React.useMemo((): User[] => {
    const users: User[] = institutionUsers.map((user: any): User => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'User'
    }))

    // Garante que o owner do projeto (da API) esteja na lista
    const apiOwner = projectDetail?.owner
    if (apiOwner && !users.find(u => u.id === apiOwner.id)) {
      users.push({ id: apiOwner.id, name: apiOwner.name, email: apiOwner.email, role: 'User' })
    }

    // Garante que o co_owner do projeto (da API) esteja na lista
    const apiCoOwner = projectDetail?.co_owner
    if (apiCoOwner && !users.find(u => u.id === apiCoOwner.id)) {
      users.push({ id: apiCoOwner.id, name: apiCoOwner.name, email: apiCoOwner.email, role: 'User' })
    }

    return users
  }, [institutionUsers, projectDetail])

  // Filter departments: only show those with locked annual budget for current year
  const currentYear = new Date().getFullYear()
  const departments = (departmentsData?.departments || []).filter((dept: any) => 
    dept.annual_budgets?.some((budget: any) => budget.year === currentYear && budget.is_locked === true)
  )

  // Update project mutation
  const [updateProject, { loading: updateLoading }] = useMutation(UPDATE_PROJECT_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECTS_QUERY },
      ...(project?.id ? [{ query: GET_PROJECT_BY_ID_QUERY, variables: { id: project.id } }] : [])
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success(t.toasts.projectUpdated, { duration: 3000 })
      handleClose()
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      toast.error(`${t.errors.updateError}: ${error.message}`)
      console.error("Error updating project:", error)
    }
  })

  // Mutation to add role to user
  const [addRoleToUser] = useMutation(ADD_ROLE_TO_USER, {
    onCompleted: () => {
      // Refetch institution data to update users list with new roles
      refetchInstitutionById()
    }
  })

  const [formData, setFormData] = useState<EditProjectFormData>({
    title: "",
    description: "",
    department_id: "",
    budget: 0,
    start_at: new Date(),
    end_at: new Date(),
    language_preference: "pt",
    is_private: false,
    required_volunteers: false,
    is_event: false,
    type: "Local",
    owner_id: "",
    co_owner_id: "",
  })

  const [errors, setErrors] = useState<Partial<EditProjectFormData>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [openDepartment, setOpenDepartment] = useState(false)
  const [openLanguage, setOpenLanguage] = useState(false)
  const [openType, setOpenType] = useState(false)
  
  const totalSteps = 2

  // Populate form when API data loads — uses projectDetail (from GET_PROJECT_BY_ID_QUERY) for accuracy
  useEffect(() => {
    if (projectDetail) {
      setFormData({
        title: projectDetail.title ?? "",
        description: projectDetail.description ?? "",
        department_id: projectDetail.department_id ?? "",
        budget: Number(projectDetail.budget) || 0,
        start_at: new Date(projectDetail.start_at),
        end_at: new Date(projectDetail.end_at),
        language_preference: projectDetail.language_preference ?? "pt",
        is_private: projectDetail.is_private ?? false,
        required_volunteers: projectDetail.required_volunteers ?? false,
        is_event: !!projectDetail.event_id,
        type: projectDetail.type ?? "Local",
        owner_id: projectDetail.owner?.id ?? projectDetail.owner_id ?? "",
        co_owner_id: projectDetail.co_owner?.id ?? projectDetail.co_owner_id ?? "",
      })

      setCurrentStep(1)
      setErrors({})
    }
  }, [projectDetail])

  const getDepartmentName = (id: string) => {
    const dept = departments.find((d: any) => d.id === id)
    return dept?.name || t.errors.departmentNotFound
  }

  const handleInputChange = React.useCallback((field: keyof EditProjectFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      }
      return prev
    })
  }, [])

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<EditProjectFormData> = {}

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = t.errors.titleRequired
      }

      if (!formData.description.trim()) {
        newErrors.description = t.errors.descriptionRequired
      }

      if (!formData.department_id) {
        newErrors.department_id = t.errors.departmentRequired
      }

      if (!formData.owner_id) {
        newErrors.owner_id = t.errors.ownerRequired || "Owner is required" as any
      }
    }

    if (step === 2) {
      if (formData.start_at >= formData.end_at) {
        newErrors.end_at = t.errors.endDateAfterStart as any
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EditProjectFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = t.errors.titleRequired
    }

    if (!formData.description.trim()) {
      newErrors.description = t.errors.descriptionRequired
    }

    if (!formData.department_id) {
      newErrors.department_id = t.errors.departmentRequired
    }

    if (!formData.owner_id) {
      newErrors.owner_id = t.errors.ownerRequired || "Owner is required" as any
    }

    if (formData.budget <= 0) {
      newErrors.budget = t.errors.budgetPositive as any
    }

    if (formData.start_at >= formData.end_at) {
      newErrors.end_at = t.errors.endDateAfterStart as any
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !project) {
      return
    }

    try {
      const updateVariables = {
        id: project.id,
        title: formData.title,
        description: formData.description,
        department_id: formData.department_id,
        budget: parseFloat(String(formData.budget)),
        type: formData.type,
        start_at: formData.start_at.toISOString(),
        end_at: formData.end_at.toISOString(),
        language_preference: formData.language_preference,
        is_private: formData.is_private,
        required_volunteers: formData.required_volunteers,
        owner_id: formData.owner_id,
        co_owner_id: formData.co_owner_id || null,
      }

      if (!formData.owner_id || formData.owner_id.trim() === '') {
        toast.error(t.errors.ownerRequired)
        return
      }

      // Update project first
      await updateProject({
        variables: updateVariables
      })

      // Assign PROJECT_OWNER role to the selected owner if they don't have it yet
      if (formData.owner_id && rolesData?.roles) {
        // Find PROJECT_OWNER role by key_code
        const projectOwnerRole = rolesData.roles.find(
          (role: any) => role.key_code === 'PROJECT_OWNER'
        )

        if (projectOwnerRole) {
          // Find the selected owner user to check their current roles
          const ownerUser = institutionUsers.find((u: any) => u.id === formData.owner_id)
          
          if (ownerUser) {
            // Check if user already has PROJECT_OWNER role
            const hasProjectOwnerRole = ownerUser.user_roles?.some(
              (userRole: any) => userRole.role.key_code === 'PROJECT_OWNER'
            )

            // Only add role if user doesn't have it
            if (!hasProjectOwnerRole) {
              try {
                await addRoleToUser({
                  variables: {
                    userId: formData.owner_id,
                    roleId: projectOwnerRole.id
                  }
                })
                toast.success(`Project Owner role assigned to ${ownerUser.name}`, {
                  duration: 3000
                })
              } catch (roleError) {
                console.error('Error assigning PROJECT_OWNER role:', roleError)
                // Don't block the project update if role assignment fails
                toast.error('Project updated, but failed to assign Project Owner role')
              }
            }
          }
        } else {
          console.warn('PROJECT_OWNER role not found in system')
        }
      }

      setErrors({})
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleClose = () => {
    setErrors({})
    setCurrentStep(1)
    onClose()
  }

  const languageOptions = [
    { value: "pt", label: "Português" },
    { value: "en", label: "English" },
    { value: "nl", label: "Nederlands" }
  ]

  const typeOptions = [
    { value: "Local", label: "Local" },
    { value: "Global", label: "Global" }
  ]

  if (!project) {
    return null
  }

  // Show loading overlay while fetching project details from API
  const isLoadingDetails = projectDetailLoading && !projectDetail

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t.basicInformation}</h3>
              <p className="text-sm text-muted-foreground">{t.basicInformationDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {t.projectTitle} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder={t.enterProjectTitle}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={cn("h-12 text-base", errors.title ? "border-red-500" : "")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {t.projectDescription} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t.describeProject}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={cn("min-h-[120px] text-base resize-none", errors.description ? "border-red-500" : "")}
                  rows={5}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  {t.department} <span className="text-red-500">*</span>
                </Label>
                <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDepartment}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal",
                        !formData.department_id && "text-muted-foreground",
                        errors.department_id && "border-red-500"
                      )}
                      disabled={updateLoading}
                    >
                      {formData.department_id
                        ? getDepartmentName(formData.department_id)
                        : t.selectDepartment}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t.searchDepartment} />
                      <CommandList>
                        <CommandEmpty>{t.noDepartmentFound}</CommandEmpty>
                        <CommandGroup>
                          {departments.map((dept: any) => (
                            <CommandItem
                              key={dept.id}
                              value={dept.id}
                              onSelect={(currentValue) => {
                                handleInputChange('department_id', currentValue === formData.department_id ? "" : currentValue)
                                setOpenDepartment(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.department_id === dept.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                              {dept.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.department_id && (
                  <p className="text-sm text-red-500">{errors.department_id}</p>
                )}
              </div>

              {/* Owner Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  {t.errors.currentOwner} <span className="text-red-500">*</span>
                </Label>
                
                {/* Clickable only for the project owner */}
                <div 
                  className={cn(
                    "p-3 border rounded-lg bg-muted/30 transition-all",
                    isOwner
                      ? "cursor-pointer hover:bg-muted/50 hover:border-primary/50"
                      : "cursor-not-allowed opacity-70",
                    !formData.owner_id && "border-dashed"
                  )}
                  onClick={() => {
                    if (!isOwner) return
                    const selectorButton = document.querySelector('[data-owner-selector-button]') as HTMLButtonElement
                    if (selectorButton) selectorButton.click()
                  }}
                  role="button"
                  tabIndex={isOwner ? 0 : -1}
                  onKeyDown={(e) => {
                    if (!isOwner) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      const selectorButton = document.querySelector('[data-owner-selector-button]') as HTMLButtonElement
                      if (selectorButton) selectorButton.click()
                    }
                  }}
                >
                  {formData.owner_id ? (
                    <div className="space-y-1">
                      <UsersAvatarGroup
                        users={availableUsers
                          .filter((user: User) => user.id === formData.owner_id)
                          .map((user: User): UserAvatarData => ({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                          }))}
                        maxDisplay={1}
                        size="md"
                        showLabel={true}
                        labelText={t.errors.currentOwner}
                        showAddButton={false}
                      />
                     { isOwner && 
                     <p className="text-xs text-muted-foreground mt-1">
                        {t.errors.clickToChange}
                      </p>}
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground">
                        {isOwner ? t.errors.clickToChange : "—"}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Hidden owner selector — only rendered/active for the owner */}
                <div className="hidden">
                  <UserMultiSelector
                    availableUsers={availableUsers}
                    selectedUsers={availableUsers.filter((user: User) => user.id === formData.owner_id)}
                    onUsersChange={(users: User[]) => {
                      const ownerId = users.length > 0 ? users[0].id : ""
                      handleInputChange('owner_id', ownerId)
                    }}
                    buttonLabel={formData.owner_id ? "Change Owner" : "Select Owner"}
                    dialogTitle="Select Project Owner"
                    searchPlaceholder="Search users..."
                    disabled={updateLoading || !isOwner}
                    maxSelections={1}
                    activityName={formData.title}
                    activityType="Project"
                    buttonDataAttribute="data-owner-selector-button"
                  />
                </div>
                
              {/* Co-Owner Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  {"Co-Owner"}
                  <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                </Label>
                
                {/* Clickable for the co-owner OR for the owner (when no co-owner exists or to manage it) */}
                <div 
                  className={cn(
                    "p-3 border rounded-lg bg-muted/30 transition-all",
                    (isCoOwner || isOwner)
                      ? "cursor-pointer hover:bg-muted/50 hover:border-primary/50"
                      : "cursor-not-allowed opacity-70",
                    !formData.co_owner_id && "border-dashed"
                  )}
                  onClick={() => {
                    if (!isCoOwner && !isOwner) return
                    const selectorButton = document.querySelector('[data-co-owner-selector-button]') as HTMLButtonElement
                    if (selectorButton) selectorButton.click()
                  }}
                  role="button"
                  tabIndex={(isCoOwner || isOwner) ? 0 : -1}
                  onKeyDown={(e) => {
                    if (!isCoOwner && !isOwner) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      const selectorButton = document.querySelector('[data-co-owner-selector-button]') as HTMLButtonElement
                      if (selectorButton) selectorButton.click()
                    }
                  }}
                >
                  {formData.co_owner_id ? (
                    <div className="space-y-1">
                      <UsersAvatarGroup
                        users={availableUsers
                          .filter((user: User) => user.id === formData.co_owner_id)
                          .map((user: User): UserAvatarData => ({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                          }))}
                        maxDisplay={1}
                        size="md"
                        showLabel={true}
                        labelText={"Co-Owner"}
                        showAddButton={false}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{t.errors.clickToChange}</p>
                        {(isCoOwner || isOwner) && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleInputChange('co_owner_id', '') }}
                            className="text-xs text-destructive hover:underline"
                          >
                            {"Remover"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground">
                        {(isCoOwner || isOwner) ? "Click to select co-owner (optional)" : "—"}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="hidden">
                  <UserMultiSelector
                    availableUsers={availableUsers.filter((u: User) => u.id !== formData.owner_id)}
                    selectedUsers={availableUsers.filter((user: User) => user.id === formData.co_owner_id)}
                    onUsersChange={(users: User[]) => {
                      handleInputChange('co_owner_id', users.length > 0 ? users[0].id : "")
                    }}
                    buttonLabel={formData.co_owner_id ? "Change Co-Owner" : "Select Co-Owner"}
                    dialogTitle="Select Project Co-Owner"
                    searchPlaceholder="Search users..."
                    disabled={updateLoading || (!isCoOwner && !isOwner)}
                    maxSelections={1}
                    activityName={formData.title}
                    activityType="Project"
                    buttonDataAttribute="data-co-owner-selector-button"
                  />
                </div>
              </div>

              {errors.owner_id && (
                <p className="text-sm text-red-500">{String(errors.owner_id)}</p>
              )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t.projectPeriod}</h3>
              <p className="text-sm text-muted-foreground">{t.projectPeriodDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    {t.startDate} <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 text-base justify-start text-left font-normal",
                          !formData.start_at && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_at ? (
                          format(formData.start_at, "PPP", { locale: dateLocale })
                        ) : (
                          <span>{t.selectDate}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.start_at}
                        onSelect={(date) => date && handleInputChange('start_at', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    {t.endDate} <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 text-base justify-start text-left font-normal",
                          !formData.end_at && "text-muted-foreground",
                          errors.end_at && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_at ? (
                          format(formData.end_at, "PPP", { locale: dateLocale })
                        ) : (
                          <span>{t.selectDate}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.end_at}
                        onSelect={(date) => date && handleInputChange('end_at', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.end_at && (
                    <p className="text-sm text-red-500">{String(errors.end_at)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {t.languagePreference}
                  </Label>
                  <Popover open={openLanguage} onOpenChange={setOpenLanguage}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openLanguage}
                        className="w-full h-12 text-base justify-between font-normal"
                        disabled={updateLoading}
                      >
                        {formData.language_preference
                          ? languageOptions.find(lang => lang.value === formData.language_preference)?.label
                          : t.selectLanguage}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder={t.searchLanguage} />
                        <CommandList>
                          <CommandEmpty>{t.noLanguageFound}</CommandEmpty>
                          <CommandGroup>
                            {languageOptions.map((lang) => (
                              <CommandItem
                                key={lang.value}
                                value={lang.value}
                                onSelect={(currentValue) => {
                                  handleInputChange('language_preference', currentValue)
                                  setOpenLanguage(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.language_preference === lang.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                                {lang.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            {t.editModalTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.editProjectInfo}: {projectDetail?.title || project.title}
          </DialogDescription>
          
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t.step} {currentStep} {t.of} {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
          </div>
        </DialogHeader>

        {/* Conteúdo dos Steps - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Carregando dados do projeto...</p>
            </div>
          ) : (
            <div className="space-y-6 p-1">
              {renderStepContent()}
            </div>
          )}
        </div>

        {/* Botões de Navegação - Fixos no rodapé */}
        <form onSubmit={handleSubmit} className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handlePrevious} 
                  disabled={updateLoading || isLoadingDetails}
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {t.previous}
                </Button>
              )}
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClose} 
                disabled={updateLoading}
                size="sm"
                className="text-xs"
              >
                {t.cancel}
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button 
                  type="button"
                  onClick={handleNext} 
                  disabled={updateLoading || isLoadingDetails}
                  size="sm"
                  className="flex items-center gap-1 text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {t.next}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={updateLoading || isLoadingDetails}
                  size="sm"
                  className="min-w-[100px] text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {updateLoading ? (
                    <>
                      <Save className="w-3 h-3 animate-spin mr-1" />
                      {t.saving}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      {t.saveChanges}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
