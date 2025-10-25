"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, useParams } from "next/navigation"

import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, CheckCircle, X, Shield, Crown, Settings, ChevronDown, ChevronRight, Save, Circle } from "lucide-react"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { useRoles } from "@/hooks/use-roles"
import { usePermissions } from "@/hooks/use-permissions"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"

export default function RolePermissionsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const roleId = params.roleId as string;

  const { currentRole: selectedRole, currentRoleLoading, currentRoleError, rolesError, rolesLoading, updateRole } = useRoles({ id: roleId });
  const { permissions: rawPermissions, permissionsError, permissionsLoading } = usePermissions();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['USER', 'ROLE']);
  const [initialPermissions, setInitialPermissions] = useState<string[]>([]);

  // Normaliza os dados de permissões em grupos
  const permissionGroups = useMemo(() => {
    if (!rawPermissions) return [];
    return rawPermissions.map((group) => ({
      name: group.group,
      label: group.group,
      description: '',
      permissions: group.data
    }));
  }, [rawPermissions]);

  // Lista de todas as permissões disponíveis (flat)
  const permissions = useMemo(() => {
    if (!permissionGroups) return [];
    return permissionGroups.flatMap((g) => g.permissions);
  }, [permissionGroups]);

  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users & Access" },
    { name: "Access Management", href: "/access" },
    { name: selectedRole?.name || "Role Permissions" }
  ], [selectedRole?.name]);

  usePageTitle({
    title: `${selectedRole?.name || 'Role'} Permissions`,
    breadcrumbs
  });

  // Initialize permissions when role is loaded
  useEffect(() => {
    if (selectedRole) {
      const currentPermissionIds: string[] = [];
      selectedRole.permissions.forEach((group) => {
        group.data.forEach((permission) => {
          currentPermissionIds.push(permission.id);
        });
      });
      setSelectedPermissions(currentPermissionIds);
      setInitialPermissions(currentPermissionIds);
      setIsLoading(false);
    } else if (roleId) {
      setIsLoading(false);
    }
  }, [selectedRole, roleId]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

  const handlePermissionToggle = (permissionId: string, permissionName: string, isEssential: boolean) => {
    if (isEssential) {
      toast.error(`Essential permissions cannot be removed`);
      return;
    }
    const isCurrentlySelected = selectedPermissions.includes(permissionId)
    const newSelected = isCurrentlySelected 
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId]
    setSelectedPermissions(newSelected)
    setHasUnsavedChanges(true)
    toast.success(
      isCurrentlySelected 
        ? `Permission removed: ${permissionName}`
        : `Permission added: ${permissionName}`,
      { duration: 2000 }
    )
  }

  const handleSelectAll = () => {
    const allPermissionIds = permissions.map(p => p.id)
    setSelectedPermissions(allPermissionIds)
    setHasUnsavedChanges(true)
    toast.success(`All ${permissions.length} permissions selected`, { duration: 3000 })
  }

  const handleClearAll = () => {
    setSelectedPermissions([])
    setHasUnsavedChanges(true)
    toast.success('All permissions cleared', { duration: 2000 })
  }

  const handleGroupSelect = (groupPermissionIds: string[], groupName: string) => {
    const newSelected = [...new Set([...selectedPermissions, ...groupPermissionIds])]
    setSelectedPermissions(newSelected)
    setHasUnsavedChanges(true)
    toast.success(`All ${groupName} permissions selected`)
  }

  const handleGroupClear = (groupPermissionIds: string[], groupName: string) => {
    const newSelected = selectedPermissions.filter(id => !groupPermissionIds.includes(id))
    setSelectedPermissions(newSelected)
    setHasUnsavedChanges(true)
    toast.success(`${groupName} permissions cleared`)
  }

  const handleSave = async () => {
    if (!selectedRole) return;
    try {
      const addPermissionIds = selectedPermissions.filter(id => !initialPermissions.includes(id));
      const removePermissionIds = initialPermissions.filter(id => !selectedPermissions.includes(id) && !selectedRole.permissions.some(group => group.data.some(p => p.id === id && p.is_essential)));

      await updateRole({
        id: selectedRole.id,
        addPermissionIds,
        removePermissionIds,
      });
      toast.success(t('access.toasts.permissions_updated', 'Permissões atualizadas com sucesso!'), {
        duration: 4000,
        icon: '🎉'
      });
      setHasUnsavedChanges(false);
      setInitialPermissions(selectedPermissions); // Update initial permissions after save
    } catch (error) {
      toast.error(t('access.toasts.permissions_update_failed', 'Erro ao atualizar permissões.'));
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/access')
      }
    } else {
      router.push('/access')
    }
  }

  if (currentRoleLoading || isLoading || permissionsLoading || rolesLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!selectedRole || currentRoleError || permissionsError || rolesError) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Role Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The requested role could not be found.
              </p>
              <Button onClick={() => router.push('/access')} variant="outline">
                Back to Access Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <WithPermission requiredPermissions={[ PermissionResolverName.Roles, PermissionResolverName.Permissions, PermissionResolverName.UpdateRole ]} fallback={<AccessDenied/>}>
      
      <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push('/access')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Permission Configuration
              </h2>
              <p className="text-muted-foreground">
                Configure detailed permissions for the selected role
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
        </div>

        {/* Role Information Card */}
        <Card className="border-2">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center shadow-sm">
                    <Shield className="w-8 h-8 text-foreground" />
                  </div>
                  {selectedRole.key_code === 'ADMIN' && (
                    <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {selectedRole.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-sm font-mono px-3 py-1">
                        {selectedRole.key_code}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    {selectedRole.description}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Status
                </div>
                <div className={`flex items-center gap-2 ${
                  hasUnsavedChanges ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    hasUnsavedChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                  }`} />
                  <span className="text-sm font-medium">
                    {hasUnsavedChanges ? 'Modified' : 'Saved'}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg border">
                <div className="text-lg font-bold text-foreground">
                  {selectedPermissions.length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Selected Permissions
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg border">
                <div className="text-lg font-bold text-foreground">
                  {permissions.length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Total Available
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg border">
                <div className="text-lg font-bold text-foreground">
                  {permissionGroups.length}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Permission Groups
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg border">
                <div className="text-lg font-bold text-foreground">
                  {Math.round((selectedPermissions.length / permissions.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Coverage
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-foreground" />
                  Permission Matrix
                </h4>
                <p className="text-sm text-muted-foreground max-w-md">
                  Select permissions to grant this role access to specific system functions
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Selected: {selectedPermissions.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    Available: {permissions.length}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleSelectAll}
                  disabled={selectedPermissions.length === permissions.length}
                  className="hover:bg-muted"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Select All
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearAll}
                  disabled={selectedPermissions.length === 0}
                  className="hover:bg-muted"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permission Groups */}
        <div className="space-y-6">
          {rawPermissions.map((group) => {
            const isExpanded = expandedGroups.includes(group.group)
            const groupPermissionIds = group.data.map(p => p.id)
            const selectedInGroup = selectedPermissions.filter(id => groupPermissionIds.includes(id)).length
            const allGroupSelected = selectedInGroup === group.data.length
            const someGroupSelected = selectedInGroup > 0 && selectedInGroup < group.data.length
            return (
              <Card key={group.group} className="border-2">
                <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(group.group)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                            {isExpanded ? (
                              <ChevronDown className="w-6 h-6 text-foreground" /> 
                            ) : (
                              <ChevronRight className="w-6 h-6 text-foreground" />
                            )}
                          </div>
                          <div className="text-left space-y-1">
                            <CardTitle className="text-lg flex items-center gap-3">
                              <span className="text-foreground">
                                {t(`access.roles.permissions.groups.${group.group}`, { defaultValue: group.group })}
                              </span>
                              <div className="flex gap-1">
                                {!allGroupSelected && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-3 text-xs hover:bg-muted"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleGroupSelect(groupPermissionIds, group.group)
                                    }}
                                  >
                                    Select All
                                  </Button>
                                )}
                                {selectedInGroup > 0 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-3 text-xs hover:bg-muted"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleGroupClear(groupPermissionIds, group.group)
                                    }}
                                  >
                                    Clear
                                  </Button>
                                )}
                              </div>
                            </CardTitle>
                            {/* <CardDescription className="text-sm">
                              {t(`access.roles.permissions.group_descriptions.${group.group}`, { 
                                defaultValue: group.description 
                              })}
                            </CardDescription> */}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline"
                            className="text-sm px-4 py-2 font-bold border-2"
                          >
                            {selectedInGroup}/{group.data.length}
                          </Badge>
                          {allGroupSelected && (
                            <Badge className="bg-green-500 text-white">
                              Complete
                            </Badge>
                          )}
                          {someGroupSelected && !allGroupSelected && (
                            <Badge className="bg-yellow-500 text-white">
                              Partial
                            </Badge>
                          )}
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-muted stroke-current"
                                fill="none"
                                strokeWidth="3"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={`stroke-current transition-all duration-500 ${
                                  allGroupSelected 
                                    ? 'text-green-500' 
                                    : someGroupSelected 
                                      ? 'text-yellow-500' 
                                      : 'text-muted-foreground'
                                }`}
                                fill="none"
                                strokeWidth="3"
                                strokeDasharray={`${(selectedInGroup / group.data.length) * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              {allGroupSelected ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : someGroupSelected ? (
                                <Circle className="w-5 h-5 text-yellow-500 fill-current" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {group.data.map((permission) => {
                          const isChecked = selectedPermissions.includes(permission.id)
                          const originallyChecked = selectedRole.permissions
                            .find(p => p.group === group.group)?.data
                            .some(p => p.id === permission.id) || false
                          const isModified = isChecked !== originallyChecked
                          const currentPermission = selectedRole.permissions.find(p => p.group === group.group)?.data
                            .find(p => p.id === permission.id)
                          const isEssential = selectedRole.permissions.some(group => 
                            group.data.some(p => p.id === permission.id && p.is_essential)
                          )
                          return (
                            <div 
                              key={permission.id} 
                              className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${isEssential ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'} ${
                                isChecked 
                                  ? 'bg-muted/50 border-foreground/20' 
                                  : isEssential ? 'bg-muted/30 border-border' : 'hover:bg-muted/30 border-border'
                              }`}
                              
                              onClick={() => handlePermissionToggle(permission.id, permission.name, isEssential)}
                            >
                              <div className="relative mt-1">
                                <Checkbox 
                                  id={permission.id}
                                  checked={isChecked}
                                  className="w-5 h-5"
                                  disabled={isEssential}
                                  onCheckedChange={() => {}} // Handled by parent click
                                />
                                {isModified && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <Label 
                                      htmlFor={permission.id} 
                                      className={`text-sm font-semibold ${isEssential ? 'cursor-not-allowed' : 'cursor-pointer'} leading-tight text-foreground`}
                                    >
                                      {permission.name}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs font-mono bg-muted/50">
                                        {permission.key_code}
                                      </Badge>
                                      {isEssential && (
                                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                                          Essential
                                        </Badge>
                                      )}
                                      {isChecked && (
                                        <Badge className="text-xs bg-green-500 text-white">
                                          Active
                                        </Badge>
                                      )}
                                      {!originallyChecked && isChecked && (
                                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                                          New
                                        </Badge>
                                      )}
                                      {originallyChecked && !isChecked && (
                                        <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                                          Removed
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <Card className={`sticky bottom-4 border-2 ${hasUnsavedChanges ? 'border-yellow-200' : 'border-border'}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    hasUnsavedChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedPermissions.length > 0 
                        ? `${selectedPermissions.length} permissions selected`
                        : 'No permissions selected'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((selectedPermissions.length / permissions.length) * 100)}% of total permissions
                    </p>
                  </div>
                </div>
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                      You have unsaved changes
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {permissionGroups.map((group) => {
                    const groupPermissionIds = group.permissions.map(p => p.id)
                    const selectedInGroup = selectedPermissions.filter(id => groupPermissionIds.includes(id)).length
                    const percentage = Math.round((selectedInGroup / group.permissions.length) * 100)
                    return (
                      <Badge 
                        key={group.name}
                        variant={selectedInGroup > 0 ? "default" : "outline"}
                        className="text-xs"
                      >
                        {group.name}: {selectedInGroup}/{group.permissions.length} ({percentage}%)
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="px-6 h-11 hover:bg-muted"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className={`px-6 h-11 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-200 ${
                    hasUnsavedChanges ? 'shadow-lg' : ''
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                  {hasUnsavedChanges && (
                    <div className="ml-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </WithPermission>
    </AppLayout>
  );
}
