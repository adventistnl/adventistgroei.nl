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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Edit, 
  Save, 
  User as UserIcon,
  Mail,
  Globe,
  Building2,
  Home,
  Layers,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronsUpDown,
  Shield,
  Lock,
  DollarSign
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { InstitutionById_institution_churches, InstitutionById_institution_departments, InstitutionById_institution_users as User } from "@/types/InstitutionById"
import { Institutions_institutions } from "@/types/Institutions"
import { Role_role } from "@/types/Role"
import { useUser } from '@/hooks/use-user';
import { useLanguageOptions } from '@/hooks/use-language-preferences';
import { useInstitution } from "@/contexts/institution-context"
import { LanguageSelectorInput } from "@/components/shared/language-selector-input"

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

  const totalSteps = 4; // Basic Info, Organizational Info, Roles, Review

  // Update form when user changes
  useEffect(() => {
    if (user && isOpen) {
      setUserForm({
        id: user.id,
        name: user.name,
        email: user.email,
        language_preference: user.language_preference,
        institution_id: user.institution_id,
        church_id: user.church.id,
        department_id: '',
        role_ids: user.user_roles?.map((role) => role.role.id) || [],
        is_active: !user.is_deleted,
        has_department: false,
        is_institutional_department: false,
        gender: user.gender as 'male' | 'female' | null
      });

      setDepartmentTab('church');

      const userRoleIds = user.user_roles?.map((role) => role.role.id) || [];
      setSelectedRoles(userRoleIds);
      setUnselectedRoles(roles.map((role) => role.id).filter((id) => !userRoleIds.includes(id)));
      setCurrentStep(1);
      setErrors({});
    }
  }, [user, roles, isOpen])

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
        newErrors.name = "Name is required";
      }
      if (!userForm.email?.trim()) {
        newErrors.email = "Email is required";
      }
      if (!userForm.language_preference) {
        newErrors.language_preference = "Language is required";
      }
    }

    if (step === 2) {
      if (!userForm.institution_id) {
        newErrors.institution_id = "Institution is required";
      }
      if (!userForm.church_id) {
        newErrors.church_id = "Church is required";
      }
      if (userForm.has_department && !userForm.department_id) {
        newErrors.department_id = "Please select a department";
      }
    }

    if (step === 3) {
      if (selectedRoles.length === 0) {
        newErrors.roles = "Please assign at least one role";
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
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(t('users.toasts.updating_user'));

    try {
      const addedRoles = selectedRoles.filter(
        (roleId) => !user?.user_roles?.some((role) => role.role.id === roleId)
      );

      const removedRoles = unselectedRoles.filter((roleId) =>
        user?.user_roles?.some((role) => role.role.id === roleId)
      );

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
        },
        { add: addedRoles, remove: removedRoles }
      );

      refetchInstitutionById(); // Refetch após sucesso

      toast.dismiss(loadingToast);
      toast.success(t('users.toasts.user_updated'), {
        duration: 3000,
        icon: '✅'
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
      toast.error(t('users.toasts.user_update_failed'));
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
    // Only one role can be selected at a time
    const previousRole = selectedRoles[0];
    
    setSelectedRoles([roleId]);
    
    if (previousRole && previousRole !== roleId) {
      setUnselectedRoles((prev) => [...prev, previousRole]);
    }
    
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
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Enter user name, email and language preference</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name *
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
                  Email *
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
                label="Language Preference"
                placeholder="Select language"
                variant="combobox"
                disabled={isLoading}
                error={errors.language_preference}
                required
              />

              {/* Gender Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Gender</Label>
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
                      Male
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
                      Female
                    </Label>
                  </div>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="user-status" className="text-sm font-medium">
                    Status: {userForm.is_active ? "Active" : "Inactive"}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {userForm.is_active 
                      ? "User has access to the system" 
                      : "User loses access to the system"}
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
              <h3 className="text-lg font-semibold text-foreground">Organizational Information</h3>
              <p className="text-sm text-muted-foreground">Select institution, church and department (optional)</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-sm font-medium">
                  Institution *
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
                        : "Select institution"}
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
                  Church *
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
                        : "Select church"}
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
                    Part of a Department?
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Is this user part of any department?
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
                  <Label className="text-sm font-medium">Select Department *</Label>
                  <Tabs value={departmentTab} onValueChange={(value) => {
                    setDepartmentTab(value as 'church' | 'institutional');
                    handleInputChange('department_id', '');
                  }}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="church">Church Departments</TabsTrigger>
                      <TabsTrigger value="institutional">Institutional Departments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="church" className="mt-4">
                      <div className="space-y-2 max-h-[250px] overflow-y-auto border border-border rounded-lg p-3">
                        {churchDepartments.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No church departments available
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
                            No institutional departments available
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
        // Step 3: Assign Role (Single Selection)
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Assign Role</h3>
              <p className="text-sm text-muted-foreground">Select one role for this user</p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-4">
              <RadioGroup value={selectedRoles[0] || ''} onValueChange={handleRoleSelect}>
                <div className="space-y-2 max-h-[400px] overflow-y-auto border border-border rounded-lg p-3">
                  {roles.map((role) => {
                    // Get role data (same as access page table)
                    const permissionCount = role.permissions?.reduce((sum, group) => sum + group.data.length, 0) || 0;
                    const userCount = role.users?.length || 0;
                    const isSelected = selectedRoles.includes(role.id);

                    return (
                      <div
                        key={role.id}
                        className={cn(
                          "flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors border",
                          isSelected
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted/50 border-border"
                        )}
                        onClick={() => handleRoleSelect(role.id)}
                      >
                        <RadioGroupItem 
                          value={role.id} 
                          id={`role-${role.id}`} 
                          className="mt-0.5 flex-shrink-0"
                        />
                        <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer min-w-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium text-sm">{role.name}</span>
                              <Badge 
                                variant={role.key_code === 'ADMIN' ? 'default' : 'secondary'}
                                className="text-xs font-mono h-5"
                              >
                                {role.key_code}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {role.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {permissionCount} permissions
                              </span>
                              {userCount > 0 && (
                                <span className="flex items-center gap-1">
                                  <UserIcon className="w-3 h-3" />
                                  {userCount} users
                                </span>
                              )}
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
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
        const assignedRole = roles.find(r => r.id === selectedRoles[0]);

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

              {/* Assigned Role */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Assigned Role
                </h4>
                {assignedRole ? (
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <div className="font-medium text-sm">{assignedRole.name}</div>
                    {assignedRole.description && (
                      <div className="text-xs text-muted-foreground mt-1">{assignedRole.description}</div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No role assigned</p>
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
                  Back
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={handleClose} 
                disabled={isLoading}
                size="sm"
              >
                Cancel
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
                  Continue
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Update User
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
