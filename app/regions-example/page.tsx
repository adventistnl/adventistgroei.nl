"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddRegionModal, type AddRegionFormData } from "@/components/modals/region"
import { MapPin, Plus, Building, Users, Globe } from "lucide-react"
import toast from "react-hot-toast"

/**
 * EXEMPLO SIMPLES DE INTEGRAÇÃO DO MODAL AddRegionModal
 * 
 * Este componente demonstra como usar o modal refatorado seguindo
 * o padrão do RegisterInstitutionModal
 */
export default function RegionsExamplePage() {
  // Em uma aplicação real, você obteria este ID do contexto ou props
  const institutionId = "1580c125-edfd-43e6-a169-cecd4b19e2e8"

  const handleRegionSuccess = (data: AddRegionFormData) => {
    // Handle successful region creation
    console.log('New region created:', data)
    
    // Show success feedback
    toast.success(`🗺️ Region "${data.name}" created successfully!`)
    
    // Aqui você faria:
    // - Refetch da lista de regiões
    // - Atualizar cache/estado global
    // - Redirecionar se necessário
    // refetchRegions()
    // queryClient.invalidateQueries(['regions'])
  }

  // Mock data para demonstração
  const mockRegions = [
    { id: "1", name: "São Paulo Central", country: "Brazil", churches: 15, members: 2400 },
    { id: "2", name: "Rio de Janeiro", country: "Brazil", churches: 8, members: 1200 },
    { id: "3", name: "Minas Gerais", country: "Brazil", churches: 12, members: 1800 },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="w-8 h-8 text-green-600" />
            Regions Management (Modal Example)
          </h1>
          <p className="text-muted-foreground mt-2">
            Demonstração da integração com o modal AddRegionModal refatorado
          </p>
        </div>

        {/* INTEGRAÇÃO PRINCIPAL - Botão para criar região */}
        <AddRegionModal
          institutionId={institutionId}
          onSuccess={handleRegionSuccess}
        >
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Region
          </Button>
        </AddRegionModal>
      </div>

      {/* Exemplos de diferentes tipos de botão */}
      <Card>
        <CardHeader>
          <CardTitle>Diferentes Implementações do Modal</CardTitle>
          <CardDescription>
            O modal pode ser usado com qualquer elemento como trigger
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Botão padrão */}
            <AddRegionModal
              institutionId={institutionId}
              onSuccess={handleRegionSuccess}
            >
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Standard Button
              </Button>
            </AddRegionModal>

            {/* Botão outline */}
            <AddRegionModal
              institutionId={institutionId}
              onSuccess={handleRegionSuccess}
            >
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Outline Button
              </Button>
            </AddRegionModal>

            {/* Botão com tema da região (verde) */}
            <AddRegionModal
              institutionId={institutionId}
              onSuccess={handleRegionSuccess}
            >
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Green Theme
              </Button>
            </AddRegionModal>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Card com Ação:</h4>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No regions yet?</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Create your first region to start organizing churches and managing members.
                </p>
                
                <AddRegionModal
                  institutionId={institutionId}
                  onSuccess={handleRegionSuccess}
                >
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Region
                  </Button>
                </AddRegionModal>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Lista de regiões existentes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Existing Regions</CardTitle>
              <CardDescription>
                Regiões já criadas na instituição
              </CardDescription>
            </div>

            {/* Botão adicional na lista */}
            <AddRegionModal
              institutionId={institutionId}
              onSuccess={handleRegionSuccess}
            >
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </AddRegionModal>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRegions.map((region) => (
              <div 
                key={region.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{region.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {region.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="font-medium text-foreground">{region.churches}</div>
                    <div>Churches</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground">{region.members.toLocaleString()}</div>
                    <div>Members</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instruções de implementação */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Como Implementar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p><strong>1. Importe o modal:</strong></p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
{`import { AddRegionModal } from '@/components/modals/region'`}
            </pre>

            <p><strong>2. Use como wrapper:</strong></p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
{`<AddRegionModal
  institutionId="your-institution-id"
  onSuccess={(data) => console.log('Region created:', data)}
>
  <Button>Create Region</Button>
</AddRegionModal>`}
            </pre>

            <p><strong>3. Dados retornados:</strong></p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
{`interface AddRegionFormData {
  name: string           // Nome da região
  description?: string   // Descrição opcional
  email: string         // Email de contato  
  phone?: string        // Telefone opcional
  website?: string      // Website opcional
  country: string       // Código do país
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}