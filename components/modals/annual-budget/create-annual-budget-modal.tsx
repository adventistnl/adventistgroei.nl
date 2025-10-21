import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EntityType } from "@/types/graphql-global-types"
import { useState } from "react"
import toast from "react-hot-toast"
import { useInstitution } from "@/contexts/institution-context"
import { useAnnualBudget } from "@/hooks/use-annual-budget"
import { CreateAnnualBudgetVariables } from "@/types/CreateAnnualBudget"

interface CreateAnnualBudgetModalProps {
  isCreateRequestModalOpen: boolean;
  setIsCreateRequestModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateAnnualBudgetModal = ({ 
  isCreateRequestModalOpen,
  setIsCreateRequestModalOpen
}: CreateAnnualBudgetModalProps) => {
  const { currentInstitutionData, institutions, refetchInstitutionById } = useInstitution();
  const { createAnnualBudget } = useAnnualBudget();
  const entitiesList = [
    {value: EntityType.Institution, label: 'Instituição'},
    {value: EntityType.InstitutionDepartment, label: 'Departamento da Instituição'},
    {value: EntityType.Church, label: 'Igreja'},
    {value: EntityType.ChurchDepartment, label: 'Departamento da Igreja'},
  ]

  const [requestFormData, setRequestFormData] = useState<CreateAnnualBudgetVariables>({
    entity_type: '' as const,
    entity_id: '',
    year: new Date().getFullYear(),
    planned_budget: 0,
    description: '',
    justification: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedChurch, setSelectedChurch] = useState<string | null>(null)

  const resetRequestForm = () => {
    setRequestFormData({
      entity_type: '',
      entity_id: '',
      year: new Date().getFullYear(),
      planned_budget: 0,
      description: '',
      justification: ''
    })
    setErrors({})
    setSelectedChurch(null)
  }

  // Atualizando a validação para diferenciar os erros de Church e Entity Name
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!requestFormData.entity_type) {
      newErrors.entity_type = 'Entity type is required.'
    }

    if (requestFormData.entity_type === EntityType.ChurchDepartment && !selectedChurch) {
      newErrors.selectedChurch = 'Church is required.'
    }

    if (!requestFormData.entity_id) {
      newErrors.entity_id = 'Entity name is required.'
    }

    if (!requestFormData.planned_budget || isNaN(Number(requestFormData.planned_budget))) {
      newErrors.planned_budget = 'Requested amount must be a valid number.'
    }

    if (!requestFormData.description) {
      newErrors.description = 'Description is required.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // Corrigindo o tipo de tratamento para resetar entity_id ao alterar entity_type ou selectedChurch
  const handleInputChange = (field: keyof typeof requestFormData | 'selectedChurch', value: string | number) => {
    setRequestFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))

    // Resetar entity_id ao alterar entity_type ou selectedChurch
    if (field === 'entity_type' || field === 'selectedChurch') {
      setRequestFormData((prev) => ({ ...prev, entity_id: '' }))
    }
  }

  const getEntityOptions = () => {
    switch (requestFormData.entity_type) {
      case EntityType.Institution:
        return institutions || [];
      case EntityType.Church:
        return currentInstitutionData?.churches || [];
      case EntityType.ChurchDepartment:
        return selectedChurch
          ? currentInstitutionData?.churches?.find(church => church.id === selectedChurch)?.departments || []
          : [];
      case EntityType.InstitutionDepartment:
        return currentInstitutionData?.departments || [];
      default:
        return [];
    }
  }

  const handleCreateRequest = async () => {
    try {
      if (!validateForm()) {
        toast.error('Please fix the errors in the form.');
        return;
      }

      const variables: CreateAnnualBudgetVariables = {
        entity_type: requestFormData.entity_type!,
        entity_id: requestFormData.entity_id!,
        year: requestFormData.year!,
        planned_budget: Number(requestFormData.planned_budget),
        description: requestFormData.description!,
        justification: requestFormData.justification || '',
      };
      await createAnnualBudget({ variables });

      setIsCreateRequestModalOpen(false);
      resetRequestForm();
      toast.success('Budget request submitted successfully.');
      refetchInstitutionById();
    } catch (error: any) {
      if (error.message.includes('An annual budget already exists')) {
        toast.error(error.message);
      } else if (error?.networkError) {
        toast.error('A network error occurred. Please check your connection.');
      } else {
        toast.error(`An unexpected erro occured. The Budget was not created.`);
      }
    }
  }

  return (
    <Dialog open={isCreateRequestModalOpen} onOpenChange={setIsCreateRequestModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Budget Request</DialogTitle>
          <DialogDescription>
            Submit a new budget request for organizational review and approval
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="entity-type">Entity Type *</Label>
              <Select 
                value={requestFormData.entity_type || ''} // Ensure default value
                onValueChange={(value: any) => {
                  handleInputChange('entity_type', value);
                  if (value !== EntityType.ChurchDepartment) {
                    setSelectedChurch(null);
                  }
                }}
              >
                <SelectTrigger className={errors.entity_type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entitiesList.map((entity) => (
                    <SelectItem key={entity.value} value={entity.value}>{entity.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.entity_type && <p className="text-red-500 text-sm">{errors.entity_type}</p>}
            </div>

            {requestFormData.entity_type === EntityType.ChurchDepartment && (
              <div className="grid gap-2">
                <Label htmlFor="church-name">Church *</Label>
                <Select 
                  value={selectedChurch || ''} // Ensure default value
                  onValueChange={(value: any) => {
                    setSelectedChurch(value);
                    handleInputChange('selectedChurch', value);
                  }}
                >
                  <SelectTrigger className={errors.selectedChurch ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select church" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentInstitutionData?.churches?.map((church) => (
                      <SelectItem key={church.id} value={church.id}>{church.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedChurch && <p className="text-red-500 text-sm">{errors.selectedChurch}</p>}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="entity-name">Entity Name *</Label>
              <Select 
                value={requestFormData.entity_id || ''} // Ensure default value
                onValueChange={(value: any) => handleInputChange('entity_id', value)}
              >
                <SelectTrigger className={errors.entity_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {getEntityOptions().map((entity: any) => (
                    <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.entity_id && <p className="text-red-500 text-sm">{errors.entity_id}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Budget Year *</Label>
              <Input
                id="year"
                type="number"
                value={requestFormData.year || new Date().getFullYear()} // Ensure default value
                onChange={(e) => handleInputChange('year', Number(e.target.value))}
                min="2024"
                max="2030"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Requested Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                value={requestFormData.planned_budget || 0} // Ensure default value
                onChange={(e) => handleInputChange('planned_budget', e.target.value)}
                placeholder="e.g., 125000"
                min="0"
                className={errors.planned_budget ? 'border-red-500' : ''}
              />
              {errors.planned_budget && <p className="text-red-500 text-sm">{errors.planned_budget}</p>}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={requestFormData.description || ''} // Ensure default value
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the budget request"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="justification">Justification</Label>
            <Textarea
              id="justification"
              value={requestFormData.justification || ''} // Ensure default value
              onChange={(e) => handleInputChange('justification', e.target.value)}
              placeholder="Detailed justification for this budget request"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateRequestModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateRequest}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}