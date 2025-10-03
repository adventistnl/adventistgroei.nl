"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save } from "lucide-react"
import toast from "react-hot-toast"
import { InstitutionById_institution_churches, InstitutionById_institution_departments, InstitutionById_institution_regions, InstitutionById_institution_users as User } from "@/types/InstitutionById"
import { Institutions_institutions } from "@/types/Institutions"
import { Role_role } from "@/types/Role"
import { useUser } from '@/hooks/use-user';
import { useLanguagePreferences } from '@/hooks/use-language-preferences';
import { useInstitution } from "@/contexts/institution-context"

export interface EditUserModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  institutions: Institutions_institutions[]
  churches: InstitutionById_institution_churches[]
  regions: InstitutionById_institution_regions[]
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
  region_id: string
  department_id?: string
  role_ids: string[]
  is_active: boolean
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  user,
  institutions,
  churches,
  regions,
  departments,
  roles,
  onSuccess
}: EditUserModalProps) {
  const { t } = useTranslation()
  const { updateUserById } = useUser({}); // Corrigido para usar o hook useUser
  const { refetchInstitutionById } = useInstitution(); // Hook para refetch
  const languageOptions = useLanguagePreferences(); // Usando o novo hook

  const [isLoading, setIsLoading] = useState(false)
  const [userForm, setUserForm] = useState<EditUserFormData>({
    id: '',
    name: '',
    email: '',
    language_preference: 'en',
    institution_id: '',
    church_id: '',
    region_id: '',
    department_id: '',
    role_ids: [],
    is_active: true
  })

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [unselectedRoles, setUnselectedRoles] = useState<string[]>([]);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setUserForm((prev) => ({
        ...prev,
        id: user.id,
        name: user.name,
        email: user.email,
        language_preference: user.language_preference,
        institution_id: user.institution_id,
        church_id: user.church.id,
        region_id: '',
        department_id: '',
        role_ids: user.user_roles?.map((role) => role.role.id) || [], // Garantir que as roles sejam preselecionadas
        is_active: !user.is_deleted,
      }));

      const userRoleIds = user.user_roles?.map((role) => role.role.id) || [];
      setSelectedRoles(userRoleIds);
      setUnselectedRoles(roles.map((role) => role.id).filter((id) => !userRoleIds.includes(id)));
    }
  }, [user, roles])

  // Filter churches and regions based on selected institution
  const filteredChurches = churches.filter(church => 
    church.institution_id === userForm.institution_id
  )
  
  const filteredRegions = regions.filter(region => 
    region.institution_id === userForm.institution_id
  )

  const filteredDepartments = departments.filter(dept => 
    dept.institution_id === userForm.institution_id
  )

  const handleSubmit = async () => {
    if (!userForm.name || !userForm.email || !userForm.institution_id || !userForm.church_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error("Please assign at least one role");
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
          department_id: userForm.department_id || "",
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

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles((prev) => [...prev, roleId]);
      setUnselectedRoles((prev) => prev.filter((id) => id !== roleId));
    } else {
      setUnselectedRoles((prev) => [...prev, roleId]);
      setSelectedRoles((prev) => prev.filter((id) => id !== roleId));
    }
  }

  const handleInstitutionChange = (institutionId: string) => {
    setUserForm(prev => ({
      ...prev,
      institution_id: institutionId,
      church_id: '', // Reset dependent fields
      region_id: '',
      department_id: undefined // Reset to undefined
    }))
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            {t('users.modals.edit_user.title')}
          </DialogTitle>
          <DialogDescription>
            {t('users.modals.edit_user.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-name">{t('users.modals.create_user.name')} *</Label>
                <Input
                  id="edit-user-name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-user-email">{t('users.modals.create_user.email')} *</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-user-language">{t('users.modals.create_user.language')}</Label>
              <Select 
                value={userForm.language_preference} 
                onValueChange={(value) => setUserForm(prev => ({ ...prev, language_preference: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Organizational Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organizational Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-institution">{t('users.modals.create_user.institution')} *</Label>
                <Select 
                  value={userForm.institution_id} 
                  onValueChange={handleInstitutionChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-user-region">{t('users.modals.create_user.region')}</Label>
                <Select 
                  value={userForm.region_id} 
                  onValueChange={(value) => setUserForm(prev => ({ ...prev, region_id: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRegions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-church">{t('users.modals.create_user.church')} *</Label>
                <Select 
                  value={userForm.church_id} 
                  onValueChange={(value) => setUserForm(prev => ({ ...prev, church_id: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredChurches.map((church) => (
                      <SelectItem key={church.id} value={church.id}>
                        {church.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-user-department">{t('users.modals.create_user.department')}</Label>
                <Select 
                  value={userForm.department_id || 'none'} 
                  onValueChange={(value) => setUserForm(prev => ({ ...prev, department_id: value === 'none' ? undefined : value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Department</SelectItem>
                    {filteredDepartments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('users.modals.create_user.roles')} *</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto border rounded-lg p-4">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`edit-role-${role.id}`}
                    checked={selectedRoles.includes(role.id)} // Ensure the checkbox reflects the selectedRoles state
                    onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)} // Correctly update state on change
                    disabled={isLoading}
                  />
                  <Label htmlFor={`edit-role-${role.id}`} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* User Status */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="edit-user-active">{t('users.modals.create_user.status')}</Label>
              <p className="text-sm text-muted-foreground">
                {userForm.is_active ? 'User is active' : 'User is inactive'}
              </p>
            </div>
            <Switch
              id="edit-user-active"
              checked={userForm.is_active}
              onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, is_active: checked }))}
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !userForm.name || !userForm.email || !userForm.institution_id || !userForm.church_id || userForm.role_ids.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              {t('users.modals.edit_user.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
