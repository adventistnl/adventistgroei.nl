/**
 * Example usage of Role Modals
 * 
 * This file demonstrates how to use the role modal components
 * in any page or component throughout the application.
 */

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateRoleModal, EditRoleModal, DeleteRoleModal } from "@/components/modals/role"
import { roles, users } from "@/data/accessData"
import type { Role } from "@/data/accessData"

export function ExampleRoleModalUsage() {
  // Modal state management
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  // Success handlers
  const handleCreateSuccess = (roleData: any) => {
    console.log('Role created:', roleData)
    // Here you would typically:
    // 1. Add the new role to your state/cache
    // 2. Refetch roles data
    // 3. Show success notification
    // 4. Navigate to role details page
  }

  const handleEditSuccess = (roleData: any) => {
    console.log('Role updated:', roleData)
    // Here you would typically:
    // 1. Update the role in your state/cache
    // 2. Refetch roles data
    // 3. Show success notification
  }

  const handleDeleteSuccess = (deletedRole: Role, reassignmentRoleId?: string) => {
    console.log('Role deleted:', deletedRole.name)
    if (reassignmentRoleId) {
      console.log('Users reassigned to role:', reassignmentRoleId)
    }
    // Here you would typically:
    // 1. Remove the role from your state/cache
    // 2. Update affected users if reassignment occurred
    // 3. Refetch data
    // 4. Show success notification
  }

  const handleEditPermissions = (role: Role) => {
    // Navigate to permissions page
    window.location.href = `/access/permissions/${role.id}`
  }

  const openEditModal = (role: Role) => {
    setSelectedRole(role)
    setIsEditOpen(true)
  }

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Role Modal Examples</h2>
      
      <div className="flex gap-4">
        <Button onClick={() => setIsCreateOpen(true)}>
          Create New Role
        </Button>
        
        <Button 
          onClick={() => openEditModal(roles[0])}
          variant="outline"
        >
          Edit First Role
        </Button>
        
        <Button 
          onClick={() => openDeleteModal(roles[0])}
          variant="destructive"
        >
          Delete First Role
        </Button>
      </div>

      {/* Modal Components */}
      <CreateRoleModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditRoleModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        role={selectedRole}
        users={users}
        onSuccess={handleEditSuccess}
        onEditPermissions={handleEditPermissions}
      />

      <DeleteRoleModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        role={selectedRole}
        users={users}
        availableRoles={roles}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

/**
 * Usage in other components:
 * 
 * 1. Import the modals you need:
 *    import { CreateRoleModal, EditRoleModal, DeleteRoleModal } from "@/components/modals/role"
 * 
 * 2. Add state for modal visibility and selected role:
 *    const [isCreateOpen, setIsCreateOpen] = useState(false)
 *    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
 * 
 * 3. Add success handlers:
 *    const handleSuccess = (data) => { /* your logic */ }
 * 
 * 4. Use the modals in your JSX:
 *    <CreateRoleModal 
 *      isOpen={isCreateOpen} 
 *      onOpenChange={setIsCreateOpen}
 *      onSuccess={handleSuccess}
 *    />
 * 
 * 5. Trigger modals with buttons or actions:
 *    <Button onClick={() => setIsCreateOpen(true)}>Create Role</Button>
 */
