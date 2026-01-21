// Exemplos Práticos - ConfirmationModal
// Copie e adapte estes exemplos para seu caso de uso

import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { Trash2, Lock, Unlock, CheckCircle, Download, Upload } from "lucide-react"

// ===========================================
// EXEMPLO 1: Delete com múltiplos impactos
// ===========================================
export function DeleteUserExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.deleteUser(userId)
      toast.success("User deleted successfully")
      setIsOpen(false)
      router.push("/users")
    } catch (error) {
      toast.error("Failed to delete user")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete User
      </Button>

      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDelete}
        variant="danger"
        icon={Trash2}
        title="Delete User Account"
        description="This action cannot be undone. This will permanently delete the user account."
        impacts={[
          "All user data will be permanently deleted",
          "User will lose access immediately",
          "Action cannot be reversed"
        ]}
        confirmText="Delete User"
        cancelText="Cancel"
        isLoading={isDeleting}
        size="default"
      />
    </>
  )
}

// ===========================================
// EXEMPLO 2: Lock/Unlock Budget (Warning)
// ===========================================
export function LockBudgetExample() {
  const [isLockModalOpen, setIsLockModalOpen] = useState(false)
  const [isLocking, setIsLocking] = useState(false)

  const handleLock = async () => {
    setIsLocking(true)
    try {
      await lockBudget(budgetId)
      await refetchData()
      toast.success("Budget locked successfully")
      // Note: closeOnConfirm={false}, então fechamos manualmente
      setIsLockModalOpen(false)
    } catch (error) {
      toast.error("Failed to lock budget")
    } finally {
      setIsLocking(false)
    }
  }

  return (
    <ConfirmationModal
      isOpen={isLockModalOpen}
      onOpenChange={setIsLockModalOpen}
      onConfirm={handleLock}
      variant="warning"
      icon={Lock}
      title="Lock Institution Budget"
      description="This will prevent any further modifications to the budget."
      impacts={[
        "All existing department budgets will be locked",
        "No new budgets can be created",
        "Requires admin approval to unlock"
      ]}
      confirmText="Yes, Lock Budget"
      cancelText="Cancel"
      isLoading={isLocking}
      closeOnConfirm={false} // Controlar fechamento manualmente
    >
      <p className="text-sm text-muted-foreground">
        Are you sure you want to proceed? This affects {departmentCount} departments.
      </p>
    </ConfirmationModal>
  )
}

// ===========================================
// EXEMPLO 3: Approve Request (Success)
// ===========================================
export function ApproveRequestExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={async () => {
        setIsApproving(true)
        await approveRequest(requestId)
        setIsApproving(false)
      }}
      variant="success"
      icon={CheckCircle}
      title="Approve Budget Request"
      description="Approve this budget allocation request."
      confirmText="Approve Request"
      cancelText="Review Later"
      isLoading={isApproving}
    >
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-900">
          <strong>Request Details:</strong>
        </p>
        <ul className="text-sm text-green-800 mt-2 space-y-1">
          <li>• Amount: €25,000</li>
          <li>• Department: Marketing</li>
          <li>• Period: Q1 2025</li>
        </ul>
      </div>
    </ConfirmationModal>
  )
}

// ===========================================
// EXEMPLO 4: Export Data com Preview
// ===========================================
export function ExportDataExample() {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  return (
    <>
      <Button onClick={() => setIsExportOpen(true)}>
        <Download className="w-4 h-4 mr-2" />
        Export Data
      </Button>

      <ConfirmationModal
        isOpen={isExportOpen}
        onOpenChange={setIsExportOpen}
        onConfirm={async () => {
          setIsExporting(true)
          await exportData()
          setIsExporting(false)
        }}
        variant="info"
        icon={Download}
        title="Export Data to CSV"
        description="Download all data in CSV format."
        confirmText="Download CSV"
        cancelText="Cancel"
        isLoading={isExporting}
        size="lg"
      >
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Export will include:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ User profiles (1,234 records)</li>
              <li>✓ Transactions (5,678 records)</li>
              <li>✓ Activity logs (12,345 records)</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            This process may take a few minutes. You'll receive a notification when ready.
          </p>
        </div>
      </ConfirmationModal>
    </>
  )
}

// ===========================================
// EXEMPLO 5: Simple Confirmation (Default)
// ===========================================
export function SimpleConfirmExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={() => {
        // Ação simples síncrona
        markAsRead()
        setIsOpen(false)
      }}
      title="Mark as Read"
      description="Mark all notifications as read?"
      confirmText="Mark as Read"
      cancelText="Cancel"
    />
  )
}

// ===========================================
// EXEMPLO 6: Sem botão Cancel (Forçar decisão)
// ===========================================
export function ForceDecisionExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={handleAcceptTerms}
      variant="info"
      title="Terms & Conditions"
      description="You must accept the terms to continue."
      confirmText="I Accept"
      showCancel={false} // Sem botão de cancelar
    >
      <div className="max-h-48 overflow-y-auto bg-muted p-3 rounded text-xs">
        [Terms and conditions content here...]
      </div>
    </ConfirmationModal>
  )
}

// ===========================================
// EXEMPLO 7: Modal Pequeno (size="sm")
// ===========================================
export function SmallModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={handleLogout}
      variant="default"
      title="Logout"
      description="Are you sure you want to logout?"
      confirmText="Logout"
      size="sm" // Modal menor
    />
  )
}

// ===========================================
// EXEMPLO 8: Sem ícone
// ===========================================
export function NoIconExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={handleSave}
      title="Save Changes"
      description="Save changes before leaving?"
      confirmText="Save"
      showIcon={false} // Sem ícone
    />
  )
}

// ===========================================
// EXEMPLO 9: Ícone Customizado
// ===========================================
export function CustomIconExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={handleUpload}
      variant="success"
      icon={Upload} // Ícone customizado
      title="Upload Files"
      description="Upload 5 files to the server?"
      confirmText="Upload"
    />
  )
}

// ===========================================
// EXEMPLO 10: Com Tradução (i18n)
// ===========================================
export function TranslatedExample() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={handleDelete}
      variant="danger"
      title={t('modals.delete.title')}
      description={t('modals.delete.description')}
      impacts={[
        t('modals.delete.impact_1'),
        t('modals.delete.impact_2'),
        t('modals.delete.impact_3')
      ]}
      confirmText={t('common.delete')}
      cancelText={t('common.cancel')}
    />
  )
}
