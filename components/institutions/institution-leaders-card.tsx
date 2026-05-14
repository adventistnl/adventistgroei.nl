"use client"

import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { Crown, AlertCircle, UserPlus, Trash2, Eye, RefreshCw, MoreVertical, UserCheck, Wallet, ChevronDown } from "lucide-react"
import { institutionTranslations } from "@/lib/translations/institutions"
import { Button } from "@/components/ui/button"
import { PermissionResolverName } from "@/types/graphql-global-types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ContactViewEditModal } from "@/components/modals/contact/contact-view-edit-modal"
import { useUpdateUserMutation } from "@/hooks/graphql/use-user-mutation"
import { useHasPermission } from "@/hooks/use-has-permission"
import {
  useGetInstitutionPositionsQuery,
  useCreateInstitutionPositionMutation,
  useUpdateInstitutionPositionMutation,
  useDeleteInstitutionPositionMutation,
} from "@/hooks/graphql/use-institution-positions"
import { InstitutionPositionType } from "@/types/globalTypes"
import { toast } from "sonner"

interface InstitutionUser {
  id: string
  name: string
  email: string
}

export interface InstitutionLeadersCardProps {
  institutionId: string
  institutionName: string
  institutionUsers?: InstitutionUser[]
  loading?: boolean
}

const MANAGER_ROLES = ["INSTITUTION_MANAGER", "ADMIN", "DEV"]

const ALL_POSITIONS: InstitutionPositionType[] = [
  InstitutionPositionType.PRESIDENT,
  InstitutionPositionType.SECRETARY,
  InstitutionPositionType.FINANCE_MANAGER,
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getPositionIcon(positionType: InstitutionPositionType) {
  switch (positionType) {
    case InstitutionPositionType.PRESIDENT:
      return Crown
    case InstitutionPositionType.SECRETARY:
      return UserCheck
    case InstitutionPositionType.FINANCE_MANAGER:
      return Wallet
    default:
      return Crown
  }
}

interface UserSelectorProps {
  users: InstitutionUser[]
  onSelect: (userId: string) => void
  placeholder: string
  searchPlaceholder: string
  emptyLabel: string
}

function UserSelector({ users, onSelect, placeholder, searchPlaceholder, emptyLabel }: UserSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between text-xs">
          {placeholder}
          <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-8 text-xs" />
          <CommandList>
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              {emptyLabel}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.email}`}
                  onSelect={() => {
                    onSelect(user.id)
                    setOpen(false)
                  }}
                  className="text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="w-5 h-5 flex-shrink-0">
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function InstitutionLeadersCard({ 
  institutionId,
  institutionName,
  institutionUsers = [],
  loading: externalLoading = false,
}: InstitutionLeadersCardProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || "en"
  const t = institutionTranslations[currentLanguage as keyof typeof institutionTranslations] || institutionTranslations.en
  const leadershipCard = t.leadershipCard as any
  const { data, loading: positionsLoading, refetch } = useGetInstitutionPositionsQuery(
    { institution_id: institutionId },
    { skip: !institutionId }
  )
  
  const [selectedUserForContact, setSelectedUserForContact] = useState<InstitutionUser | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [assigningFor, setAssigningFor] = useState<InstitutionPositionType | null>(null)
  const [replacingFor, setReplacingFor] = useState<InstitutionPositionType | null>(null)
  
  const [createPosition, { loading: creating }] = useCreateInstitutionPositionMutation()
  const [updatePosition, { loading: updating }] = useUpdateInstitutionPositionMutation()
  const [deletePosition, { loading: deleting }] = useDeleteInstitutionPositionMutation()
  const [updateUserMutation] = useUpdateUserMutation()

  const canListPositions = useHasPermission([PermissionResolverName.InstitutionPositions])
  const canViewPosition = useHasPermission([PermissionResolverName.InstitutionPosition])
  const canCreatePosition = useHasPermission(
    [PermissionResolverName.CreateInstitutionPosition],
    MANAGER_ROLES,
    false,
    true
  )
  const canUpdatePosition = useHasPermission(
    [PermissionResolverName.UpdateInstitutionPosition],
    MANAGER_ROLES,
    false,
    true
  )
  const canDeletePosition = useHasPermission(
    [PermissionResolverName.DeleteInstitutionPosition],
    MANAGER_ROLES,
    false,
    true
  )

  const isLoading = externalLoading || positionsLoading
  const isMutating = creating || updating || deleting

  const positionsMap = useMemo(() => {
    const positions = data?.institutionPositions ?? []
    const map: Record<string, (typeof positions)[number] | undefined> = {}
    for (const position of positions) {
      map[position.position_type] = position
    }
    return map
  }, [data])

  const assignedUserIds = useMemo(() => {
    return new Set(Object.values(positionsMap).filter(Boolean).map((position) => position!.user_id))
  }, [positionsMap])

  const availableUsers = useMemo(() => {
    return institutionUsers.filter((user) => !assignedUserIds.has(user.id))
  }, [institutionUsers, assignedUserIds])

  const assignedCount = useMemo(() => {
    return ALL_POSITIONS.filter((positionType) => positionsMap[positionType]).length
  }, [positionsMap])

  const canManageRecord = canViewPosition || canUpdatePosition || canDeletePosition

  async function handleAssign(positionType: InstitutionPositionType, userId: string) {
    if (!institutionId) {
      toast.error(leadershipCard?.toasts?.error_assign || "Erro ao atribuir cargo")
      return
    }

    setAssigningFor(null)
    try {
      const result = await createPosition({
        variables: {
          data: {
            institution_id: institutionId,
            position_type: positionType,
            user_id: userId,
          },
        },
        awaitRefetchQueries: true,
      })

      if (!result.data?.createInstitutionPosition?.id) {
        throw new Error(leadershipCard?.toasts?.error_assign || "Erro ao atribuir cargo")
      }

      await refetch()
      const positionLabel = leadershipCard?.positions?.[positionType] ?? positionType
      toast.success(`${positionLabel}: ${leadershipCard?.toasts?.assigned || "Cargo atribuído com sucesso"}`)
    } catch (error: any) {
      toast.error(error?.message ?? (leadershipCard?.toasts?.error_assign || "Erro ao atribuir cargo"))
    }
  }

  async function handleReplace(positionId: string, positionType: InstitutionPositionType, userId: string) {
    setReplacingFor(null)
    try {
      const result = await updatePosition({
        variables: {
          id: positionId,
          data: { user_id: userId },
        },
        awaitRefetchQueries: true,
      })

      if (!result.data?.updateInstitutionPosition?.id) {
        throw new Error(leadershipCard?.toasts?.error_update || "Erro ao atualizar cargo")
      }

      await refetch()
      const positionLabel = leadershipCard?.positions?.[positionType] ?? positionType
      toast.success(`${positionLabel}: ${leadershipCard?.toasts?.updated || "Cargo atualizado com sucesso"}`)
    } catch (error: any) {
      toast.error(error?.message ?? (leadershipCard?.toasts?.error_update || "Erro ao atualizar cargo"))
    }
  }

  async function handleRemove(positionId: string, positionType: InstitutionPositionType) {
    try {
      const result = await deletePosition({ variables: { id: positionId }, awaitRefetchQueries: true })

      if (!result.data?.deleteInstitutionPosition?.id) {
        throw new Error(leadershipCard?.toasts?.error_remove || "Erro ao remover cargo")
      }

      await refetch()
      const positionLabel = leadershipCard?.positions?.[positionType] ?? positionType
      toast.success(`${positionLabel}: ${leadershipCard?.toasts?.removed || "Cargo removido com sucesso"}`)
    } catch (error: any) {
      toast.error(error?.message ?? (leadershipCard?.toasts?.error_remove || "Erro ao remover cargo"))
    }
  }

  const handleViewContact = (user: InstitutionUser) => {
    setSelectedUserForContact(user)
    setIsContactModalOpen(true)
  }

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-5 bg-muted rounded w-8 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-2">
          {ALL_POSITIONS.map((positionType) => (
            <div key={positionType} className="flex items-center gap-3 p-3 rounded border animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!canListPositions) {
    return (
      <Card className="h-full flex flex-col bg-card/50">
        <CardHeader className="pb-3 space-y-1 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4 text-muted-foreground" />
                {leadershipCard?.title || "Institution Leaders"}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {leadershipCard?.description || "Formal positions assigned to this institution"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {leadershipCard?.no_permission || "You don't have permission to view this content"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="h-full flex flex-col bg-card/50">
        <CardHeader className="pb-3 space-y-1 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4 text-muted-foreground" />
                {leadershipCard?.title || "Institution Leaders"}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {leadershipCard?.description || "Formal positions assigned to this institution"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge label={`${assignedCount} / ${ALL_POSITIONS.length}`} variant="neutral" size="sm" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => refetch()}
                disabled={isMutating}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${positionsLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2 pt-3 pr-2">
          {ALL_POSITIONS.map((positionType) => {
            const record = positionsMap[positionType]
            const positionLabel = leadershipCard?.positions?.[positionType] ?? positionType
            const isAssigning = assigningFor === positionType
            const isReplacing = replacingFor === positionType
            const PositionIcon = getPositionIcon(positionType)

            return (
              <div
                key={positionType}
                className="border border-border/50 rounded-lg bg-card overflow-hidden hover:border-border transition-colors"
              >
                <div className="flex items-center justify-between px-3 py-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <PositionIcon className="w-3.5 h-3.5 text-primary/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
                        {positionLabel}
                      </p>
                      {record ? (
                        <>
                          <p className="text-sm font-medium truncate">{record.user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{record.user.email}</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          {leadershipCard?.unassigned || "Not assigned"}
                        </p>
                      )}
                    </div>
                  </div>

                  {record ? (
                    canManageRecord ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" disabled={isMutating}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          {canViewPosition ? (
                            <DropdownMenuItem className="text-xs" onClick={() => handleViewContact(record.user)}>
                              <Eye className="w-3.5 h-3.5 mr-2" />
                              {leadershipCard?.view_contact || "View Contact"}
                            </DropdownMenuItem>
                          ) : null}
                          {canUpdatePosition ? (
                            <DropdownMenuItem
                              className="text-xs"
                              onClick={() => {
                                setAssigningFor(null)
                                setReplacingFor(positionType)
                              }}
                            >
                              <UserPlus className="w-3.5 h-3.5 mr-2" />
                              {leadershipCard?.replace || "Replace"}
                            </DropdownMenuItem>
                          ) : null}
                          {canDeletePosition ? (
                            <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-xs text-destructive focus:text-destructive"
                              onClick={() => handleRemove(record.id, positionType)}
                              disabled={isMutating}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              {leadershipCard?.remove || "Remove"}
                            </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null
                  ) : (
                    canCreatePosition ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2 flex-shrink-0"
                        onClick={() => {
                          setReplacingFor(null)
                          setAssigningFor(positionType)
                        }}
                        disabled={isMutating}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        {leadershipCard?.assign || "Assign"}
                      </Button>
                    ) : null
                  )}
                </div>

                {isAssigning && (
                  canCreatePosition ? (
                    <div className="px-3 pb-3 pt-1 border-t bg-muted/20 space-y-1.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        {leadershipCard?.select_user || "Select user..."}
                      </p>
                      <UserSelector
                        users={availableUsers}
                        onSelect={(userId) => handleAssign(positionType, userId)}
                        placeholder={leadershipCard?.select_user || "Select user..."}
                        searchPlaceholder={leadershipCard?.search_user || "Search user..."}
                        emptyLabel={leadershipCard?.no_users_available || "No users available"}
                      />
                      <Button variant="ghost" size="sm" className="text-xs h-7 w-full" onClick={() => setAssigningFor(null)}>
                        {t.cancel || "Cancel"}
                      </Button>
                    </div>
                  ) : null
                )}

                {isReplacing && record && (
                  canUpdatePosition ? (
                    <div className="px-3 pb-3 pt-1 border-t bg-muted/20 space-y-1.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        {leadershipCard?.select_user || "Select user..."}
                      </p>
                      <UserSelector
                        users={availableUsers}
                        onSelect={(userId) => handleReplace(record.id, positionType, userId)}
                        placeholder={leadershipCard?.select_user || "Select user..."}
                        searchPlaceholder={leadershipCard?.search_user || "Search user..."}
                        emptyLabel={leadershipCard?.no_users_available || "No users available"}
                      />
                      <Button variant="ghost" size="sm" className="text-xs h-7 w-full" onClick={() => setReplacingFor(null)}>
                        {t.cancel || "Cancel"}
                      </Button>
                    </div>
                  ) : null
                )}
              </div>
            )
          })}

          {assignedCount === 0 && !positionsLoading && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <AlertCircle className="w-6 h-6 text-muted-foreground/30 mb-1" />
              <p className="text-xs text-muted-foreground">
                {leadershipCard?.no_leaders || "No institutional leaders found"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Contact Modal */}
      {selectedUserForContact && (
        <ContactViewEditModal
          isOpen={isContactModalOpen}
          onOpenChange={setIsContactModalOpen}
          contact={{
            id: selectedUserForContact.id,
            name: selectedUserForContact.name,
            email: selectedUserForContact.email,
            phone: null,
            mobile: null,
            address: null,
            city: null,
            country: null,
            postal_code: null,
            full_address: null,
            website: null,
            notes: null,
            is_primary: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'system',
            updated_by: 'system',
            is_deleted: false,
            _count: {
              Church: 0,
              Department: 0,
              Event: 0,
              User: 0
            }
          }}
          userData={selectedUserForContact}
          entityName={selectedUserForContact.name}
          entityType="User"
          readonly={true}
          updateMutation={updateUserMutation}
          entityId={selectedUserForContact.id}
        />
      )}
    </>
  )
}
