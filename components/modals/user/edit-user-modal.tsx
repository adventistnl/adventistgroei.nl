"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Edit, 
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronsUpDown,
  Layers,
  Building2,
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { InstitutionById_institution_churches, InstitutionById_institution_departments, InstitutionById_institution_users as User } from "@/types/InstitutionById"
import { Institutions_institutions } from "@/types/Institutions"
import { Role_role } from "@/types/Role"
import { GenderType } from "@/types/graphql-global-types"
import { useUser } from '@/hooks/use-user';
import { useLanguageOptions } from '@/hooks/use-language-preferences';
import { useInstitution } from "@/contexts/institution-context"
import { LanguageSelectorInput } from "@/components/shared/language-selector-input"
import { FilterTags, FilterTag } from "@/components/shared/filter-tags"
import { RoleSelector } from "@/components/shared/role-selector"

export interface EditUserModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  institutions: Institutions_institutions[]
  churches: InstitutionById_institution_churches[]
  departments: InstitutionById_institution_departments[]
  roles: Role_role[]
  onSuccess?: (userData: EditUserFormData) => void
}

export interface EditUserFormData {
  id: string
  name: string
  email: string
  language_preference: string
  institution_id: string
  church_id: string
  department_id?: string
  role_ids: string[]
  is_active: boolean
  has_department: boolean
  is_institutional_department: boolean
  gender?: 'male' | 'female' | null
}

// Role categories based on key_code patterns
type RoleCategory = "all" | "administration" | "church" | "institutional" | "leadership" | "member"

const getRoleCategory = (keyCode: string): RoleCategory[] => {
  const code = keyCode.toUpperCase()
  const categories: RoleCategory[] = []
  
  if (code.includes("ADMIN") || code.includes("SYSTEM")) categories.push("administration")
  if (code.includes("CHURCH")) categories.push("church")
  if (code.includes("INSTITUTIONAL") || code.includes("INSTITUTION")) categories.push("institutional")
  if (code.includes("LEADER") || code.includes("DIRECTOR") || code.includes("COORDINATOR")) categories.push("leadership")
  if (code.includes("MEMBER") || code.includes("VOLUNTEER")) categories.push("member")
  
  return categories.length > 0 ? categories : ["member"]
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  user,
  institutions,
  churches,
  departments,
  roles,
  onSuccess
}: EditUserModalProps) {
  const { t } = useTranslation()
  const { updateUserById } = useUser({}); // Corrigido para usar o hook useUser
  const { refetchInstitutionById, currentInstitutionData } = useInstitution(); // Hook para refetch
  const languageOptions = useLanguageOptions(); // Usando o novo hook

  // Get all departments from institution data (same as tables)
  const allInstitutionDepartments = currentInstitutionData?.departments || [];
  const allChurchesData = currentInstitutionData?.churches || [];

  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [userForm, setUserForm] = useState<EditUserFormData>({
    id: '',
    name: '',
    email: '',
    language_preference: 'en',
    institution_id: '',
    church_id: '',
    department_id: '',
    role_ids: [],
    is_active: true,
    has_department: false,
    is_institutional_department: false
  })

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [unselectedRoles, setUnselectedRoles] = useState<string[]>([]);
  const [openInstitution, setOpenInstitution] = useState(false);
  const [openChurch, setOpenChurch] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departmentTab, setDepartmentTab] = useState<'church' | 'institutional'>('church');
  const [selectedCategory, setSelectedCategory] = useState<RoleCategory>("all");

  // Filter roles by selected category
  const filteredRoles = useMemo(() => {
    if (selectedCategory === "all") return roles;
    return roles.filter(role => {
      const categories = getRoleCategory(role.key_code);
      return categories.includes(selectedCategory);
    });
  }, [roles, selectedCategory]);

  // Category filters configuration
  const categoryFilters: FilterTag[] = [
    { key: "all", label: t('users.modals.edit_user.categories.all') },
    { key: "administration", label: t('users.modals.edit_user.categories.administration') },
    { key: "church", label: t('users.modals.edit_user.categories.church') },
    { key: "institutional", label: t('users.modals.edit_user.categories.institutional') },
    { key: "leadership", label: t('users.modals.edit_user.categories.leadership') },
    { key: "member", label: t('users.modals.edit_user.categories.member') },
  ];

  const totalSteps = 4; // Basic Info, Organizational Info, Roles, Review

  // Update form when user changes
  useEffect(() => {
    if (user && isOpen) {
      // Convert GenderType enum to lowercase string for form
      let genderValue: 'male' | 'female' | null = null;
      if (user.gender === GenderType.Male || user.gender === 'MALE') {
        genderValue = 'male';
      } else if (user.gender === GenderType.Female || user.gender === 'FEMALE') {
        genderValue = 'female';
      }

      // Detect if user belongs to a department (same logic as getDepartmentInfo in users page)
      let userDepartmentId = '';
      let hasUserDepartment = false;
      let isInstitutionalDept = false;
      let departmentTabValue: 'church' | 'institutional' = 'church';

      // Check church departments
      const churchDepartment = allChurchesData
        .flatMap(church => church.departments || [])
        .find(dept => dept.users?.some(u => u.id === user.id));

      if (churchDepartment) {
        userDepartmentId = churchDepartment.id;
        hasUserDepartment = true;
        isInstitutionalDept = false;
        departmentTabValue = 'church';
      } else {
        // Check institutional departments
        const institutionalDepartment = allInstitutionDepartments.find(dept =>
          dept.users?.some(u => u.id === user.id)
        );

        if (institutionalDepartment) {
          userDepartmentId = institutionalDepartment.id;
          hasUserDepartment = true;
          isInstitutionalDept = true;
          departmentTabValue = 'institutional';
        }
      }

      setUserForm({
        id: user.id,
        name: user.name,
        email: user.email,
        language_preference: user.language_preference,
        institution_id: user.institution_id,
        church_id: user.church?.id || '',
        department_id: userDepartmentId,
        role_ids: user.user_roles?.map((role) => role.role.id) || [],
        is_active: !user.is_deleted,
        has_department: hasUserDepartment,
        is_institutional_department: isInstitutionalDept,
        gender: genderValue
      });

      setDepartmentTab(departmentTabValue);

      const userRoleIds = user.user_roles?.map((role) => role.role.id) || [];
      setSelectedRoles(userRoleIds);
      setUnselectedRoles(roles.map((role) => role.id).filter((id) => !userRoleIds.includes(id)));
      setCurrentStep(1);
      setErrors({});
    }
  }, [user, roles, isOpen, allChurchesData, allInstitutionDepartments])

  // Filter churches and departments based on selected institution
  const filteredChurches = useMemo(() => 
    churches.filter(church => church.institution_id === userForm.institution_id),
    [churches, userForm.institution_id]
  );
  
  // Church Departments - Same logic as church-departments page
  const churchDepartments = useMemo(() => {
    if (!userForm.has_department || !userForm.church_id) return [];
    
    // Get church departments from all churches (like in church-departments page)
    const selectedChurch = allChurchesData.find(c => c.id === userForm.church_id);
    return selectedChurch?.departments || [];
  }, [allChurchesData, userForm.church_id, userForm.has_department]);

  // Institutional Departments - Same logic as institutional-departments page
  const institutionalDepartments = useMemo(() => {
    if (!userForm.has_department) return [];
    
    // Filter institutional departments (where church_id === institution_id)
    return allInstitutionDepartments.filter(dept => 
      dept.institution_id === userForm.institution_id && 
      dept.church_id === dept.institution_id
    );
  }, [allInstitutionDepartments, userForm.institution_id, userForm.has_department]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!userForm.name?.trim()) {
        newErrors.name = t('users.modals.edit_user.errors.name_required');
      }
      if (!userForm.email?.trim()) {
        newErrors.email = t('users.modals.edit_user.errors.email_required');
      }
      if (!userForm.language_preference) {
        newErrors.language_preference = t('users.modals.edit_user.errors.language_required');
      }
    }

    if (step === 2) {
      if (!userForm.institution_id) {
        newErrors.institution_id = t('users.modals.edit_user.errors.institution_required');
      }
      // Church is now optional
      if (userForm.has_department && !userForm.department_id) {
        newErrors.department_id = t('users.modals.edit_user.errors.department_required');
      }
    }

    if (step === 3) {
      if (selectedRoles.length === 0) {
        newErrors.roles = t('users.modals.edit_user.errors.roles_required');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(t('users.modals.edit_user.errors.fill_all_fields'));
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(t('users.modals.edit_user.toasts.updating_user'));

    try {
      const addedRoles = selectedRoles.filter(
        (roleId) => !user?.user_roles?.some((role) => role.role.id === roleId)
      );

      const removedRoles = unselectedRoles.filter((roleId) =>
        user?.user_roles?.some((role) => role.role.id === roleId)
      );

      // Convert gender to GenderType enum for backend
      const genderForBackend = userForm.gender === 'male' ? GenderType.Male : 
                              userForm.gender === 'female' ? GenderType.Female : null;

      await updateUserById(
        userForm.id,
        {
          is_deleted: !userForm.is_active,
          name: userForm.name,
          email: userForm.email,
          language_preference: userForm.language_preference,
          institution_id: userForm.institution_id,
          church_id: userForm.church_id,
          department_id: userForm.has_department ? (userForm.department_id || "") : "",
          gender: genderForBackend,
        },
        { add: addedRoles, remove: removedRoles }
      );

      refetchInstitutionById(); // Refetch após sucesso

      toast.dismiss(loadingToast);
      toast.success(t('users.modals.edit_user.toasts.user_updated'), {
        duration: 3000
      });

      if (onSuccess) {
        const formDataToSend = {
          ...userForm,
          department_id: userForm.department_id === 'none' ? undefined : userForm.department_id
        };
        onSuccess(formDataToSend);
      }

      onOpenChange(false);

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(t('users.modals.edit_user.toasts.user_update_failed'));
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
    }
  }

  const handleRoleSelect = (roleId: string) => {
    // Allow multiple roles to be selected
    setSelectedRoles((prev) => {
      const isSelected = prev.includes(roleId);
      if (isSelected) {
        // Remove role if already selected
        return prev.filter((id) => id !== roleId);
      } else {
        // Add role if not selected
        return [...prev, roleId];
      }
    });

    setUnselectedRoles((prev) => prev.filter((id) => id !== roleId));
    
    if (errors.roles) {
      setErrors(prev => ({ ...prev, roles: '' }));
    }
  }

  const handleInstitutionChange = (institutionId: string) => {
    setUserForm(prev => ({
      ...prev,
      institution_id: institutionId,
      church_id: '',
      department_id: '',
      has_department: false,
      is_institutional_department: false
    }));
    if (errors.institution_id) {
      setErrors(prev => ({ ...prev, institution_id: '' }));
    }
  };

  const handleInputChange = (field: keyof EditUserFormData, value: any) => {
    setUserForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic Information
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t('users.modals.edit_user.steps.personal_info')}</h3>
              <p className="text-sm text-muted-foreground">{t('users.modals.edit_user.steps.personal_info_description')}</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t('users.modals.edit_user.fields.name')} *
                </Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  disabled={isLoading}
                  className={cn(errors.name && 'border-red-500')}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('users.modals.edit_user.fields.email')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="user@example.com"
                  disabled={isLoading}
                  className={cn(errors.email && 'border-red-500')}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <LanguageSelectorInput
                value={userForm.language_preference || ''}
                onValueChange={(value: string) => handleInputChange('language_preference', value)}
                label={t('users.modals.edit_user.fields.language_preference')}
                placeholder={t('users.modals.edit_user.placeholders.select_language')}
                variant="combobox"
                disabled={isLoading}
                error={errors.language_preference}
                required
              />

              {/* Gender Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('users.modals.edit_user.fields.gender')}</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gender-male"
                      checked={userForm.gender === 'male'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('gender', 'male');
                        } else if (userForm.gender === 'male') {
                          handleInputChange('gender', null);
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label htmlFor="gender-male" className="text-sm font-normal cursor-pointer">
                      {t('users.modals.edit_user.fields.male')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gender-female"
                      checked={userForm.gender === 'female'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('gender', 'female');
                        } else if (userForm.gender === 'female') {
                          handleInputChange('gender', null);
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label htmlFor="gender-female" className="text-sm font-normal cursor-pointer">
                      {t('users.modals.edit_user.fields.female')}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="user-status" className="text-sm font-medium">
                    {t('users.modals.edit_user.fields.status')}: {userForm.is_active ? t('users.modals.edit_user.fields.active') : t('users.modals.edit_user.fields.inactive')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {userForm.is_active
                      ? t('users.modals.edit_user.status.active_description')
                      : t('users.modals.edit_user.status.inactive_description')}
                  </p>
                </div>
                <Switch
                  id="user-status"
                  checked={userForm.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        // Step 2: Organizational Information
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t('users.modals.edit_user.steps.organizational_info')}</h3>
              <p className="text-sm text-muted-foreground">{t('users.modals.edit_user.steps.organizational_info_description')}</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-sm font-medium">
                  {t('users.modals.edit_user.fields.institution')} *
                </Label>
                <Popover open={openInstitution} onOpenChange={setOpenInstitution}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openInstitution}
                      className={cn(
                        "w-full justify-between font-normal",
                        !userForm.institution_id && "text-muted-foreground",
                        errors.institution_id && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      {userForm.institution_id
                        ? institutions.find(inst => inst.id === userForm.institution_id)?.name
                        : t('users.modals.edit_user.placeholders.select_institution')}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search institution..." />
                      <CommandList>
                        <CommandEmpty>No institution found</CommandEmpty>
                        <CommandGroup>
                          {institutions.map((inst) => (
                            <CommandItem
                              key={inst.id}
                              value={inst.name}
                              onSelect={() => {
                                handleInstitutionChange(inst.id);
                                setOpenInstitution(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  userForm.institution_id === inst.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {inst.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.institution_id && (
                  <p className="text-xs text-red-600">{errors.institution_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="church" className="text-sm font-medium">
                  {t('users.modals.edit_user.fields.church')}
                </Label>
                <Popover open={openChurch} onOpenChange={setOpenChurch}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openChurch}
                      className={cn(
                        "w-full justify-between font-normal",
                        !userForm.church_id && "text-muted-foreground",
                        errors.church_id && "border-red-500"
                      )}
                      disabled={isLoading || !userForm.institution_id}
                    >
                      {userForm.church_id
                        ? filteredChurches.find(church => church.id === userForm.church_id)?.name
                        : t('users.modals.edit_user.placeholders.select_church')}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search church..." />
                      <CommandList>
                        <CommandEmpty>No church found</CommandEmpty>
                        <CommandGroup>
                          {filteredChurches.map((church) => (
                            <CommandItem
                              key={church.id}
                              value={church.name}
                              onSelect={() => {
                                handleInputChange('church_id', church.id);
                                setOpenChurch(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  userForm.church_id === church.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {church.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.church_id && (
                  <p className="text-xs text-red-600">{errors.church_id}</p>
                )}
              </div>

              {/* Has Department Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="has-department" className="text-sm font-medium">
                    {t('users.modals.edit_user.status.part_of_department')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('users.modals.edit_user.status.part_of_department_description')}
                  </p>
                </div>
                <Switch
                  id="has-department"
                  checked={userForm.has_department}
                  onCheckedChange={(checked) => {
                    handleInputChange('has_department', checked);
                    if (!checked) {
                      handleInputChange('department_id', '');
                    }
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Department Selection with Tabs */}
              {userForm.has_department && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t('users.modals.edit_user.fields.department')} *</Label>
                  <Tabs value={departmentTab} onValueChange={(value) => {
                    setDepartmentTab(value as 'church' | 'institutional');
                    handleInputChange('department_id', '');
                  }}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="church">{t('users.modals.edit_user.departments.church_departments')}</TabsTrigger>
                      <TabsTrigger value="institutional">{t('users.modals.edit_user.departments.institutional_departments')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="church" className="mt-4">
                      <div className="space-y-2 max-h-[250px] overflow-y-auto border border-border rounded-lg p-3">
                        {churchDepartments.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            {t('users.modals.edit_user.status.no_church_departments')}
                          </p>
                        ) : (
                          churchDepartments.map((dept) => {
                            // Get department data (same as table)
                            const members_count = dept.users?.length || 0;
                            const projects = (dept as any).projects || [];
                            const openProjects = projects.filter((p: any) => 
                              p.status !== 'COMPLETED' && !p.is_completed
                            ).length;
                            const isActive = !dept.is_deleted;

                            return (
                              <div
                                key={dept.id}
                                className={cn(
                                  "flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors border",
                                  userForm.department_id === dept.id
                                    ? "bg-primary/10 border-primary"
                                    : "hover:bg-muted/50 border-border"
                                )}
                                onClick={() => {
                                  handleInputChange('department_id', dept.id);
                                  handleInputChange('is_institutional_department', false);
                                }}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                                  userForm.department_id === dept.id
                                    ? "border-primary"
                                    : "border-muted-foreground"
                                )}>
                                  {userForm.department_id === dept.id && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Layers className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                    <span className="font-medium text-sm">{dept.name}</span>
                                  </div>
                                  {dept.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {dept.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <UserIcon className="w-3 h-3" />
                                      {members_count} members
                                    </span>
                                    {openProjects > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {openProjects} projects
                                      </span>
                                    )}
                                    <Badge 
                                      variant={isActive ? "default" : "secondary"} 
                                      className="text-xs h-5"
                                    >
                                      {isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="institutional" className="mt-4">
                      <div className="space-y-2 max-h-[250px] overflow-y-auto border border-border rounded-lg p-3">
                        {institutionalDepartments.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            {t('users.modals.edit_user.status.no_institutional_departments')}
                          </p>
                        ) : (
                          institutionalDepartments.map((dept) => {
                            // Get department data (same as institutional-departments table)
                            const members_count = dept.users?.length || 0;
                            const latestBudget = dept.annual_budgets?.[0];
                            const totalBudget = latestBudget?.planned_budget || 0;
                            const usedBudget = latestBudget?.total_expenses || 0;
                            const usagePercentage = totalBudget > 0 ? Math.round((usedBudget / totalBudget) * 100) : 0;
                            const hasBudget = totalBudget > 0;
                            const isActive = !dept.is_deleted;

                            return (
                              <div
                                key={dept.id}
                                className={cn(
                                  "flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors border",
                                  userForm.department_id === dept.id
                                    ? "bg-primary/10 border-primary"
                                    : "hover:bg-muted/50 border-border"
                                )}
                                onClick={() => {
                                  handleInputChange('department_id', dept.id);
                                  handleInputChange('is_institutional_department', true);
                                }}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                                  userForm.department_id === dept.id
                                    ? "border-primary"
                                    : "border-muted-foreground"
                                )}>
                                  {userForm.department_id === dept.id && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Layers className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                    <span className="font-medium text-sm">{dept.name}</span>
                                  </div>
                                  {dept.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {dept.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <UserIcon className="w-3 h-3" />
                                      {members_count} members
                                    </span>
                                    {hasBudget && (
                                      <>
                                        <span className="flex items-center gap-1">
                                          €{(totalBudget / 1000).toFixed(0)}K
                                        </span>
                                        <Badge 
                                          variant="outline" 
                                          className={cn(
                                            "text-xs h-5",
                                            usagePercentage > 90 ? "border-red-500 text-red-700" :
                                            usagePercentage > 70 ? "border-yellow-500 text-yellow-700" :
                                            "border-green-500 text-green-700"
                                          )}
                                        >
                                          {usagePercentage}% used
                                        </Badge>
                                      </>
                                    )}
                                    <Badge 
                                      variant={isActive ? "default" : "secondary"} 
                                      className="text-xs h-5"
                                    >
                                      {isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  {errors.department_id && (
                    <p className="text-xs text-red-600">{errors.department_id}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        // Step 3: Assign Roles (Multiple Selection)
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t('users.modals.edit_user.steps.assign_roles')}</h3>
              <p className="text-sm text-muted-foreground">{t('users.modals.edit_user.steps.assign_roles_description')}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* Category Filter */}
              <FilterTags
                tags={categoryFilters}
                selectedTag={selectedCategory}
                onTagSelect={(tag) => setSelectedCategory(tag as RoleCategory)}
                title={t('users.modals.edit_user.filters.filter_by_category')}
                showTitle={false}
                size="sm"
                variant="default"
              />

              {/* Role Selection with Cards - Custom Implementation without FormField */}
              <div className="space-y-2">
                <div className="space-y-3">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {filteredRoles.map((role) => {
                      const isSelected = selectedRoles.includes(role.id);
                      const permissionCount = role.permissions?.reduce((sum, group) => sum + group.data.length, 0) || 0;
                      
                      return (
                        <div
                          key={role.id}
                          onClick={() => handleRoleSelect(role.id)}
                          className={cn(
                            "relative flex-shrink-0 w-72 cursor-pointer transition-all duration-300 p-4 rounded-xl border-2 group min-h-[100px]",
                            isSelected 
                              ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02]" 
                              : "border-muted-foreground/20 bg-muted/5 hover:border-foreground/50 hover:bg-muted/20 hover:shadow-md"
                          )}
                        >
                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-background border-2 border-foreground rounded-full flex items-center justify-center z-10">
                              <Check className="w-3 h-3 text-foreground" />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="text-left h-full flex flex-col justify-center relative">
                            <div className={cn(
                              "font-semibold text-sm leading-tight mb-2",
                              isSelected ? "text-background" : "text-foreground"
                            )}>
                              {role.name}
                            </div>
                            {role.description && (
                              <div className={cn(
                                "text-xs leading-relaxed mb-3 line-clamp-2",
                                isSelected ? "text-background/80" : "text-muted-foreground"
                              )}>
                                {role.description}
                              </div>
                            )}
                            <div className={cn(
                              "flex items-center gap-2 text-xs",
                              isSelected ? "text-background/70" : "text-muted-foreground"
                            )}>
                              <span>{permissionCount} permissions</span>
                            </div>
                          </div>
                          
                          {/* Hover Effect */}
                          <div className={cn(
                            "absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100",
                            !isSelected && "bg-gradient-to-br from-foreground/5 to-foreground/10"
                          )} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {errors.roles && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{errors.roles}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        // Step 4: Review
        const selectedInstitution = institutions.find(i => i.id === userForm.institution_id);
        const selectedChurch = filteredChurches.find(c => c.id === userForm.church_id);
        const allDepartments = [...churchDepartments, ...institutionalDepartments];
        const selectedDepartment = allDepartments.find(d => d.id === userForm.department_id);
        const selectedLanguage = languageOptions.find(l => l.value === userForm.language_preference);
        const assignedRoles = roles.filter(r => selectedRoles.includes(r.id));

        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Review & Confirm</h3>
              <p className="text-sm text-muted-foreground">Please review the information before updating the user</p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Basic Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{userForm.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium">{userForm.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="text-sm font-medium">{selectedLanguage?.label}</span>
                  </div>
                  {userForm.gender && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Gender</span>
                      <span className="text-sm font-medium capitalize">{userForm.gender}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={userForm.is_active ? "default" : "secondary"} className="text-xs">
                      {userForm.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Organizational Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Organizational Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Institution</span>
                    <span className="text-sm font-medium">{selectedInstitution?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Church</span>
                    <span className="text-sm font-medium">{selectedChurch?.name}</span>
                  </div>
                  {userForm.has_department && (
                    <>
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Department Type</span>
                        <Badge variant="outline" className="text-xs">
                          {userForm.is_institutional_department ? "Institutional" : "Church"}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Department</span>
                        <span className="text-sm font-medium">{selectedDepartment?.name || "-"}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Assigned Roles */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Assigned Roles ({assignedRoles.length})
                </h4>
                {assignedRoles.length > 0 ? (
                  <div className="space-y-2">
                    {assignedRoles.map((role) => (
                      <div key={role.id} className="p-3 bg-muted/50 rounded-lg border">
                        <div className="font-medium text-sm">{role.name}</div>
                        {role.description && (
                          <div className="text-xs text-muted-foreground mt-1">{role.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('users.modals.edit_user.status.no_roles_assigned')}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Edit className="w-5 h-5 text-muted-foreground" />
            {t('users.modals.edit_user.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('users.modals.edit_user.description')}
          </DialogDescription>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('users.modals.edit_user.buttons.back')}
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
                size="sm"
              >
                {t('users.modals.edit_user.buttons.cancel')}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {t('users.modals.edit_user.buttons.continue')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      {t('users.modals.edit_user.buttons.updating')}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t('users.modals.edit_user.buttons.update_user')}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
