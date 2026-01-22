"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, useParams } from "next/navigation"

import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, CheckCircle, X, Shield, Crown, Settings, ChevronDown, ChevronRight, Save, Circle, Search, Tag, Lock, Building } from "lucide-react"
import { CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"
import { twMerge } from "tailwind-merge"
import { Variables } from "@/hooks/graphql/use-get-roles-query"
import { useMutation, useQuery } from "@apollo/client/react"
import { UpdateRole, UpdateRoleVariables } from "@/types/UpdateRole"
import { UPDATE_ROLE_MUTATION } from "@/graphql/mutations/ROLE_MUTATIONS"
import { GET_ROLE_BY_ID_QUERY } from "@/graphql/queries/GET_ROLES_QUERY"
import { Role } from "@/types/Role"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { accessTranslations } from "@/lib/translations/access"
import { useInstitution } from "@/contexts/institution-context"

function RolePermissionsPage({ roleId }: { roleId: string }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const { data: currentRoleData, loading: currentRoleLoading, error: currentRoleError, refetch: refetchCurrentRole } = useQuery<Role, Variables>(GET_ROLE_BY_ID_QUERY, {
    variables: { id: roleId },
    skip: !roleId,
    fetchPolicy: 'no-cache',
  });
  
  const [useUpdateRoleMutate] = useMutation<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE_MUTATION);


  const currentRole = useMemo(() => currentRoleData ? currentRoleData.role : null, [currentRoleData]);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [addPermissions, setAddPermissions] = useState<string[]>([]);
  const [removePermissions, setRemovePermissions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [crudFilter, setCrudFilter] = useState<string>('all')
  const { currentInstitutionData, loading: institutionLoading } = useInstitution()
  

  const updateRole = async (variables: UpdateRoleVariables) => {
    await useUpdateRoleMutate({ variables });
    setHasUnsavedChanges(false);
    setAddPermissions([]);
    setRemovePermissions([]);
    await refetchCurrentRole();
  }

  const permissionGroups = useMemo(() => {
    if (!currentRole?.permissions) return [];

    return currentRole.permissions.map((group) => {
      const groupPermissions = group.data.map((permission) => ({
        ...permission,
        is_selected: selectedPermissions.includes(permission.id),
      }));

      return {
        group: group.group, // This is the category name (USER, ROLE, PERMISSION, etc.)
        name: group.group,
        label: group.group,
        permissions: groupPermissions,
        data: group.data || []
      };
    });
  }, [currentRole, selectedPermissions]);

  const permissions = useMemo(() => {
    return permissionGroups.flatMap((group) => group.permissions);
  }, [permissionGroups]);

  // Extract unique tags from all permissions
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    permissions.forEach(p => {
      // Extract tags from permission name or key_code
      const words = p.name.toLowerCase().split(/[\s_-]+/);
      words.forEach(word => {
        if (word.length > 3) tags.add(word);
      });
    });
    return Array.from(tags).sort();
  }, [permissions]);

  // Filter permissions based on search, selected tags, and CRUD type
  const filteredPermissionGroups = useMemo(() => {
    if (!searchQuery && selectedTags.length === 0 && crudFilter === 'all') return permissionGroups;

    return permissionGroups.map(group => ({
      ...group,
      data: group.data || [], // Ensure data exists
      permissions: group.permissions.filter(permission => {
        const matchesSearch = !searchQuery || 
          permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.key_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag =>
          permission.name.toLowerCase().includes(tag.toLowerCase()) ||
          permission.key_code.toLowerCase().includes(tag.toLowerCase())
        );

        const matchesCrud = crudFilter === 'all' || 
          (crudFilter === 'create' && (permission.name.toLowerCase().includes('create') || permission.key_code.toLowerCase().includes('create'))) ||
          (crudFilter === 'read' && (permission.name.toLowerCase().includes('read') || permission.name.toLowerCase().includes('view') || permission.key_code.toLowerCase().includes('read') || permission.key_code.toLowerCase().includes('view'))) ||
          (crudFilter === 'update' && (permission.name.toLowerCase().includes('update') || permission.name.toLowerCase().includes('edit') || permission.key_code.toLowerCase().includes('update') || permission.key_code.toLowerCase().includes('edit'))) ||
          (crudFilter === 'delete' && (permission.name.toLowerCase().includes('delete') || permission.key_code.toLowerCase().includes('delete')));

        return matchesSearch && matchesTags && matchesCrud;
      })
    })).filter(group => group.permissions.length > 0);
  }, [permissionGroups, searchQuery, selectedTags, crudFilter]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const coverage = useMemo(() => {
    if (permissions.length === 0) return 0;
    return Math.round((selectedPermissions.length / permissions.length) * 100);
  }, [permissions, selectedPermissions]);

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tAccess = accessTranslations[currentLanguage as keyof typeof accessTranslations] || accessTranslations.en

  const pageTitle = useMemo(() => (
    <span className="flex items-center gap-2">
      {tAccess.breadcrumb.access_management}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      {tAccess.breadcrumb.role_permissions}
    </span>
  ), [tAccess])

  usePageTitle({
    title: pageTitle,
    showBreadcrumbsInHeader: true
  })

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

  const handlePermissionToggle = (permissionId: string, permissionName: string, isEssential: boolean, checked: boolean) => {
    if (isEssential) {
      toast.error(tAccess.messages.essential_cannot_remove);
      return;
    }
    const isCurrentlySelected = selectedPermissions.includes(permissionId)
    const newSelected = isCurrentlySelected
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId]
    setSelectedPermissions(newSelected)
    if (checked) {
      setAddPermissions(prev => [...new Set([...prev.filter(id => id !== permissionId), permissionId])])
      setRemovePermissions(prev => [...new Set([...prev.filter(id => id !== permissionId)])])
    } else {
      setRemovePermissions(prev => [...new Set([...prev.filter(id => id !== permissionId), permissionId])])
      setAddPermissions(prev => [...new Set([...prev.filter(id => id !== permissionId)])])
    }
    setHasUnsavedChanges(true)
    toast.success(
      isCurrentlySelected 
        ? `${tAccess.toasts.permission_removed}: ${permissionName}`
        : `${tAccess.toasts.permission_added}: ${permissionName}`,
      { duration: 2000 }
    )
  }

  const handleSelectAll = () => {
    const allNonEssentialPermissions = permissions.filter(p => !p.is_essential);
    if (allNonEssentialPermissions.length === 0) {
      toast.error(tAccess.confirmation.all_essential_error, { duration: 2500 });
      return;
    }
    const allPermissionIds = allNonEssentialPermissions.map(p => p.id);
    setSelectedPermissions(allPermissionIds);
    setAddPermissions(allPermissionIds); // Atualiza o estado de permissões a serem adicionadas
    setRemovePermissions([]); // Limpa as permissões a serem removidas
    setHasUnsavedChanges(true);
    toast.success(tAccess.toasts.all_selected, { duration: 3000 });
  };

  const handleClearAll = () => {
    const essentialIds = permissions.filter(p => p.is_essential).map(p => p.id);
    const removableIds = permissions.filter(p => !p.is_essential).map(p => p.id);
    
    if (removableIds.length === 0) {
      toast.error(tAccess.confirmation.all_essential_remove_error, { duration: 2500 });
      return;
    }
    
    setSelectedPermissions(essentialIds); // Mantém apenas permissões essenciais
    setRemovePermissions(removableIds); // Atualiza permissões a serem removidas
    setAddPermissions([]); // Limpa as permissões a serem adicionadas
    setHasUnsavedChanges(true);
    if (essentialIds.length > 0) {
      toast.success(`${tAccess.toasts.all_cleared} — ${essentialIds.length} ${tAccess.confirmation.preserved_essential}`, { duration: 2500 });
    } else {
      toast.success(tAccess.toasts.all_cleared, { duration: 2000 });
    }
  }

  const handleGroupSelect = (groupPermissionIds: string[], groupName: string) => {
    const nonEssentialGroupIds = groupPermissionIds.filter(id => !permissions.find(p => p.id === id)?.is_essential); // Ignora permissões essenciais
    const newSelected = [...new Set([...selectedPermissions, ...nonEssentialGroupIds])];
    setSelectedPermissions(newSelected);
    setAddPermissions(prev => [...new Set([...prev, ...nonEssentialGroupIds])]); // Atualiza permissões a serem adicionadas
    setRemovePermissions(prev => prev.filter(id => !nonEssentialGroupIds.includes(id))); // Remove do estado de remoção
    setHasUnsavedChanges(true);
    toast.success(`${groupName}: ${tAccess.toasts.all_selected}`);
  }

  const handleGroupClear = (groupPermissionIds: string[], groupName: string) => {
    const essentialIds = permissions.filter(p => p.is_essential).map(p => p.id);
    const removable = groupPermissionIds.filter(id => !essentialIds.includes(id)); // Ignora permissões essenciais
    const newSelected = selectedPermissions.filter(id => !removable.includes(id));
    setSelectedPermissions(newSelected);
    setRemovePermissions(prev => [...new Set([...prev, ...removable])]); // Atualiza permissões a serem removidas
    setAddPermissions(prev => prev.filter(id => !removable.includes(id))); // Remove do estado de adição
    setHasUnsavedChanges(true);
    if (removable.length === 0) {
      toast.success(`${groupName}: ${tAccess.toasts.all_cleared}`);
    } else {
      toast.success(`${groupName}: ${tAccess.toasts.all_cleared}`);
    }
  }

  const handleSave = async (roleId: string) => {
    try {
      const essentialPermissionIds: string[] = permissions.filter(p => p.is_essential).map(p => p.id) || [];
      const filteredRemovePermissionIds = removePermissions.filter(id => !essentialPermissionIds.includes(id));
      const preventedRemovals = removePermissions.length - filteredRemovePermissionIds.length;
      if (preventedRemovals > 0) {
        toast.error(`${preventedRemovals} ${tAccess.messages.essential_cannot_remove}`);
      }

      await updateRole({
        id: roleId,
        addPermissionIds: addPermissions,
        removePermissionIds: filteredRemovePermissionIds,
      });
      toast.success(tAccess.toasts.permissions_updated, {
        duration: 4000,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error(tAccess.toasts.permissions_update_failed);
    }
  };


  const handleToggleAllGroups = () => {
    const allGroupNames = filteredPermissionGroups.map(group => group.group);
    const hasExpandedGroups = expandedGroups.length > 0;
    
    if (hasExpandedGroups) {
      // Close all groups
      setExpandedGroups([]);
      toast.success(tAccess.toasts.all_closed || 'All groups closed', { duration: 2000 });
    } else {
      // Open all groups
      setExpandedGroups(allGroupNames);
      toast.success(tAccess.toasts.all_opened || 'All groups opened', { duration: 2000 });
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm(tAccess.confirmation.unsaved_changes_message)) {
        router.push('/access')
      }
    } else {
      router.push('/access')
    }
  }

  useEffect(() => {
    const groupKeys = (currentRole?.permissions
      .flatMap(p => p.data.filter(d => d.is_selected).map(d => d.group)) || [])
      .filter((g): g is string => typeof g === 'string' && g !== null);
    const permissionsId = (currentRole?.permissions
      .flatMap(p => p.data.filter(d => d.is_selected).map(d => d.id)) || [])
      .filter((id): id is string => typeof id === 'string' && id !== null);
    setExpandedGroups(groupKeys);
    setSelectedPermissions(permissionsId);
  }, [currentRole]);

  if (currentRoleLoading) {
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

  if (!currentRole || currentRoleError) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="!p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{tAccess.messages.role_not_found}</h2>
              <p className="text-muted-foreground mb-4">
                {tAccess.messages.role_not_found}
              </p>
              <Button onClick={() => router.push('/access')} variant="outline">
                {tAccess.actions.back}
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
        <div className="flex flex-1 flex-col gap-4 p-3 sm:p-6 pt-3 sm:pt-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.push('/access')}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {tAccess.buttons.back}
          </Button>

          {/* Header */}
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {tAccess.role_permissions}
            </h2>
            {currentInstitutionData && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Shield className="w-3 h-3 mr-1" />
                  {currentRole.name}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Building className="w-3 h-3 mr-1" />
                  {currentInstitutionData.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentInstitutionData.denomination}
                </Badge>
              </div>
            )}
          </div>

          {/* Role Information Card - Minimalist */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base">{currentRole.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {currentRole.key_code}
                      </Badge>
                      {currentRole.key_code === 'ADMIN' && (
                        <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{currentRole.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-around sm:justify-end">
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-bold">{selectedPermissions.length}</div>
                    <div className="text-xs text-muted-foreground">{tAccess.permissions.selected}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-bold">{permissions.length}</div>
                    <div className="text-xs text-muted-foreground">{tAccess.permissions.available}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-bold">
                      {permissions.length > 0 ? Math.round((selectedPermissions.length / permissions.length) * 100) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">{tAccess.permissions.coverage}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter - New Section */}
          <div className="flex-col bg-card text-card-foreground rounded-xl border p-3 shadow-sm  sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">

            {/* Search bar and CRUD filter */}
            <div className="flex sm:flex-row flex-1 sm:flex-nowrap gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={tAccess.search.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border shadow-sm "
                />
              </div>
              <Select value={crudFilter} onValueChange={setCrudFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder={tAccess.search.crud_type} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tAccess.search.all_types}</SelectItem>
                  <SelectItem value="create">{tAccess.search.create}</SelectItem>
                  <SelectItem value="read">{tAccess.search.read_view}</SelectItem>
                  <SelectItem value="update">{tAccess.search.update_edit}</SelectItem>
                  <SelectItem value="delete">{tAccess.search.delete}</SelectItem>
                </SelectContent>
              </Select>

              {/* Action buttons - Above search */}
              <Button 
                variant="outline"
                onClick={handleSelectAll}
                disabled={permissions.filter(p => !p.is_essential).length === 0 || selectedPermissions.length === permissions.filter(p => !p.is_essential).length}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <CheckCircle className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{tAccess.permissions.select_all}</span>
                <span className="sm:hidden">{tAccess.buttons.select}</span>
              </Button>
              <Button 
                variant="outline"
                onClick={handleClearAll}
                disabled={permissions.filter(p => !p.is_essential).length === 0 || selectedPermissions.filter(id => !permissions.find(p => p.id === id)?.is_essential).length === 0}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <X className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{tAccess.permissions.clear_all}</span>
                <span className="sm:hidden">{tAccess.buttons.clear}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleAllGroups}
                disabled={filteredPermissionGroups.length === 0}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                {expandedGroups.length > 0 ? (
                  <>
                    <ChevronDown className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{tAccess.buttons.close_all}</span>
                    <span className="sm:hidden">{tAccess.buttons.close}</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{tAccess.buttons.open_all}</span>
                    <span className="sm:hidden">{tAccess.buttons.open}</span>
                  </>
                )}
              </Button>

          </div>

            {/* Quick Tags - Scrollable container */}
            {allTags.length > 0 && (
              <div className="flex items-start gap-2 pt-4 border-t mt-4">
                <Tag className="w-4 h-4 text-muted-foreground mt-1.5 flex-shrink-0" />
                <div className="flex-1 overflow-x-auto pb-2 -mb-2">
                  <div className="flex gap-1.5 min-w-max">
                    {allTags.slice(0, 12).map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs hover:bg-accent whitespace-nowrap"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
     

          </div>

          {/* Permission Groups */}
          <div className="space-y-6">
            {filteredPermissionGroups.map((group) => {
              const isExpanded = expandedGroups.includes(group.group)
              const groupPermissionIds = (group.data || group.permissions || []).map((p: any) => p.id)
              const selectedInGroup = selectedPermissions.filter(id => groupPermissionIds.includes(id)).length
              const allGroupSelected = groupPermissionIds.length > 0 && selectedInGroup === groupPermissionIds.length
              const someGroupSelected = selectedInGroup > 0 && selectedInGroup < groupPermissionIds.length
              
              // Get section title based on the actual group category
              const getCategoryTitle = (groupName: string) => {
                if (!groupName || typeof groupName !== 'string') return tAccess.permissions.title
                
                // The group name IS the category (USER, ROLE, PERMISSION, etc.)
                const category = groupName.trim().toUpperCase()
                
                // Map categories to translated titles
                const categoryTitles: Record<string, string> = {
                  'USER': tAccess.groups.user_management,
                  'USERS': tAccess.groups.user_management,
                  'ROLE': tAccess.groups.role_management,
                  'ROLES': tAccess.groups.role_management,
                  'PERMISSION': tAccess.groups.permission_management,
                  'PERMISSIONS': tAccess.groups.permission_management,
                  'INSTITUTION': tAccess.groups.institution_management,
                  'INSTITUTIONS': tAccess.groups.institution_management,
                  'REGION': tAccess.groups.region_management,
                  'REGIONS': tAccess.groups.region_management,
                  'CHURCH': tAccess.groups.church_management,
                  'CHURCHES': tAccess.groups.church_management,
                  'DEPARTMENT': tAccess.groups.department_management,
                  'DEPARTMENTS': tAccess.groups.department_management,
                }
                
                return categoryTitles[category] || groupName
              }
              
              return (
                <div key={group.group} className="space-y-3">
               
                  {/* Container with card background */}
                  <Card className="border-none shadow-none">
                       {/* Section Title - Only once above container */}
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {getCategoryTitle(group.group)}
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        {selectedInGroup}/{groupPermissionIds.length}
                      </span>
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0 ${
                        allGroupSelected 
                          ? 'bg-green-500 border-green-500' 
                          : someGroupSelected 
                            ? 'bg-gradient-to-r from-green-500 via-green-500 to-transparent border-muted' 
                            : 'border-muted bg-transparent'
                      }`} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGroup(group.group)}
                        className="h-7 px-2 sm:px-3 text-xs"
                      >
                        {isExpanded ? tAccess.groups.close_permissions : tAccess.groups.open_permissions}
                      </Button>
                    </div>
                  </div>
                    <CardContent className="p-0">
                      <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(group.group)}>
                      <CollapsibleTrigger className="w-full sr-only">
                        Toggle
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-3 sm:p-4">
                          <div className="space-y-2">
                            {group.permissions.map((permission) => {
                              const isChecked = selectedPermissions.includes(permission.id)
                              const originallyChecked = currentRole.permissions
                                .find(p => p.group === group.group)?.data
                                .some(p => p.id === permission.id && p.is_selected) || false
                              const isModified = isChecked !== originallyChecked
                              const isEssential = !!permission.is_essential
                              
                              // Check if permission was created in the last 15 days
                              const createdAt = permission.created_at ? new Date(permission.created_at) : null
                              const now = new Date()
                              const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
                              const isNew = createdAt && createdAt > fifteenDaysAgo && !originallyChecked && isChecked
                              
                              return (
                                <div 
                                  key={permission.id} 
                                  className={twMerge(
                                    "relative flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all",
                                    isEssential
                                      ? "cursor-not-allowed bg-muted/30"
                                      : "cursor-pointer hover:bg-muted/50",
                                    isChecked && "bg-muted/50"
                                  )}
                                  onClick={() => !isEssential && handlePermissionToggle(permission.id, permission.name, isEssential, !isChecked)}
                                >
                                  {/* Lock icon - Top Right */}
                                  {isEssential && (
                                    <div 
                                      className="absolute top-2 right-2 group z-10"
                                      title={tAccess.messages.essential_cannot_remove}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-dashed rounded-full flex items-center justify-center border-foreground bg-foreground">
                                        <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-background" />
                                      </div>
                                      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {tAccess.messages.essential_cannot_remove}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="relative mt-0.5 flex-shrink-0">
                                    <Checkbox 
                                      id={permission.id}
                                      checked={isChecked}
                                      className="w-4 h-4"
                                      disabled={isEssential}
                                      onCheckedChange={() => {}}
                                    />
                                    {isModified && !isEssential && (
                                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <Label className={`text-xs sm:text-sm font-medium ${isEssential ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                        {permission.name}
                                      </Label>
                                      {isChecked && !isEssential && (
                                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                                      <Badge variant="outline" className="text-xs font-mono">
                                        {permission.key_code}
                                      </Badge>
                                      {isNew && (
                                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                                          {tAccess.status.new}
                                        </Badge>
                                      )}
                                      {originallyChecked && !isChecked && (
                                        <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                                          {tAccess.status.removed}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {permission.description}
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* Action Buttons - Minimalist */}
          <Card className={`sticky bottom-4 ${hasUnsavedChanges ? 'border-yellow-500' : ''}`}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    hasUnsavedChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">
                      {selectedPermissions.length} / {permissions.length} {tAccess.permissions.selected}
                    </p>
                    {hasUnsavedChanges && (
                      <p className="text-xs text-yellow-600">
                        {tAccess.messages.unsaved_changes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    size="sm"
                    className="flex-1 sm:flex-initial"
                  >
                    {tAccess.actions.cancel}
                  </Button>
                  <Button 
                    onClick={handleSave.bind(null, roleId)} 
                    disabled={!hasUnsavedChanges}
                    size="sm"
                    className="flex-1 sm:flex-initial"
                  >
                    <Save className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{tAccess.actions.save_changes}</span>
                    <span className="sm:hidden">{tAccess.buttons.save}</span>
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

export default RolePermissionsPage;