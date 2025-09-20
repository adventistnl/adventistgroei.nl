"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { Institution, Church, Region, Department, Role } from "@/data/usersData"

export interface CreateUserModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutions: Institution[]
  churches: Church[]
  regions: Region[]
  departments: Department[]
  roles: Role[]
  onSuccess?: (userData: UserFormData) => void
}

export interface UserFormData {
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

export function CreateUserModal({
  isOpen,
  onOpenChange,
  institutions,
  churches,
  regions,
  departments,
  roles,
  onSuccess
}: CreateUserModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [userForm, setUserForm] = useState<UserFormData>({
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

  const resetForm = () => {
    setUserForm({
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
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!userForm.name || !userForm.email || !userForm.institution_id || !userForm.church_id) {
      toast.error("Please fill in all required fields")
      return
    }

    if (userForm.role_ids.length === 0) {
      toast.error("Please assign at least one role")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t('users.toasts.creating_user'))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.dismiss(loadingToast)
      toast.success(t('users.toasts.user_created'), {
        duration: 3000,
        icon: '🎉'
      })
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(userForm)
      }
      
      // Close modal and reset form
      onOpenChange(false)
      resetForm()
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('users.toasts.user_create_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      resetForm()
    }
  }

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    setUserForm(prev => ({
      ...prev,
      role_ids: checked 
        ? [...prev.role_ids, roleId]
        : prev.role_ids.filter(id => id !== roleId)
    }))
  }

  const handleInstitutionChange = (institutionId: string) => {
    setUserForm(prev => ({
      ...prev,
      institution_id: institutionId,
      church_id: '', // Reset dependent fields
      region_id: '',
      department_id: ''
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t('users.modals.create_user.title')}
          </DialogTitle>
          <DialogDescription>
            {t('users.modals.create_user.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">{t('users.modals.create_user.name')} *</Label>
                <Input
                  id="user-name"
                  placeholder={t('users.modals.create_user.name_placeholder')}
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-email">{t('users.modals.create_user.email')} *</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder={t('users.modals.create_user.email_placeholder')}
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-language">{t('users.modals.create_user.language')}</Label>
              <Select 
                value={userForm.language_preference} 
                onValueChange={(value) => setUserForm(prev => ({ ...prev, language_preference: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Organizational Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organizational Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-institution">{t('users.modals.create_user.institution')} *</Label>
                <Select 
                  value={userForm.institution_id} 
                  onValueChange={handleInstitutionChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution" />
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
                <Label htmlFor="user-region">{t('users.modals.create_user.region')}</Label>
                <Select 
                  value={userForm.region_id} 
                  onValueChange={(value) => setUserForm(prev => ({ ...prev, region_id: value }))}
                  disabled={isLoading || !userForm.institution_id}
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
                <Label htmlFor="user-church">{t('users.modals.create_user.church')} *</Label>
                <Select 
                  value={userForm.church_id} 
                  onValueChange={(value) => setUserForm(prev => ({ ...prev, church_id: value }))}
                  disabled={isLoading || !userForm.institution_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select church" />
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
                <Label htmlFor="user-department">{t('users.modals.create_user.department')}</Label>
                <Select 
                  value={userForm.department_id || 'none'} 
                  onValueChange={(value) => setUserForm(prev => ({ ...prev, department_id: value === 'none' ? undefined : value }))}
                  disabled={isLoading || !userForm.institution_id}
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
                    id={`role-${role.id}`}
                    checked={userForm.role_ids.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
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
              <Label htmlFor="user-active">{t('users.modals.create_user.status')}</Label>
              <p className="text-sm text-muted-foreground">User will be created as active by default</p>
            </div>
            <Switch
              id="user-active"
              checked={userForm.is_active}
              onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, is_active: checked }))}
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              {t('users.modals.create_user.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !userForm.name || !userForm.email || !userForm.institution_id || !userForm.church_id || userForm.role_ids.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('users.modals.create_user.create')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
