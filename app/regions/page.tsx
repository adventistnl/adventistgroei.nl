"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MapPin,
  Building,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Church,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  Globe,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"

// Schema de validação para registro de região
const regionSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  institution_id: z.string().min(1, "Instituição é obrigatória"),
  parent_region_id: z.string().optional().transform(val => val === "none" ? undefined : val),
  contact_name: z.string().min(2, "Nome do contato é obrigatório"),
  contact_phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  contact_email: z.string().email("Email inválido"),
  contact_address: z.string().optional(),
  contact_city: z.string().min(2, "Cidade é obrigatória"),
  contact_postal_code: z.string().optional(),
  notes: z.string().optional(),
})

type RegionForm = z.infer<typeof regionSchema>

// Mock data baseado na estrutura ERD
const MOCK_INSTITUTIONS = [
  { id: "usp", name: "União Sul-Paulista", denomination: "SDA" },
  { id: "ucb", name: "União Central Brasileira", denomination: "SDA" },
  { id: "uan", name: "União Amazônica", denomination: "SDA" },
  { id: "une", name: "União Nordeste Brasileira", denomination: "SDA" },
  { id: "uso", name: "União Sul-Oeste", denomination: "SDA" },
  { id: "unb", name: "União Norte Brasileira", denomination: "SDA" },
  { id: "ues", name: "União Este Brasileira", denomination: "SDA" },
  { id: "ueb", name: "União Extremo Oeste Brasileira", denomination: "SDA" },
]

const MOCK_REGIONS = [
  {
    id: "sp-capital",
    name: "São Paulo Capital",
    institution: "União Sul-Paulista",
    parent_region: null,
    churches_count: 45,
    members_count: 12500,
    contact: {
      name: "Pastor João Silva",
      phone: "(11) 99999-9999",
      email: "joao@usp.org.br",
      city: "São Paulo"
    },
    created_at: "2024-01-15",
    status: "active"
  },
  {
    id: "sp-interior",
    name: "São Paulo Interior",
    institution: "União Sul-Paulista",
    parent_region: null,
    churches_count: 78,
    members_count: 18900,
    contact: {
      name: "Pastor Maria Santos",
      phone: "(19) 88888-8888",
      email: "maria@usp.org.br",
      city: "Campinas"
    },
    created_at: "2024-01-10",
    status: "active"
  },
  {
    id: "rj-capital",
    name: "Rio de Janeiro Capital",
    institution: "União Sul-Paulista",
    parent_region: null,
    churches_count: 32,
    members_count: 9800,
    contact: {
      name: "Pastor Carlos Lima",
      phone: "(21) 77777-7777",
      email: "carlos@usp.org.br",
      city: "Rio de Janeiro"
    },
    created_at: "2024-01-20",
    status: "active"
  },
  {
    id: "df-central",
    name: "Distrito Federal",
    institution: "União Central Brasileira",
    parent_region: null,
    churches_count: 28,
    members_count: 8500,
    contact: {
      name: "Pastor Ana Costa",
      phone: "(61) 66666-6666",
      email: "ana@ucb.org.br",
      city: "Brasília"
    },
    created_at: "2024-01-12",
    status: "active"
  },
  {
    id: "ba-salvador",
    name: "Bahia - Salvador",
    institution: "União Nordeste Brasileira",
    parent_region: null,
    churches_count: 41,
    members_count: 11200,
    contact: {
      name: "Pastor Roberto Oliveira",
      phone: "(71) 55555-5555",
      email: "roberto@une.org.br",
      city: "Salvador"
    },
    created_at: "2024-01-08",
    status: "active"
  },
]

// Sugestões rápidas para campos com Popover
const REGION_NAME_SUGGESTIONS = [
  "Capital", "Interior", "Metropolitana", "Norte", "Sul", "Leste", "Oeste", 
  "Central", "Litoral", "Serra", "Vale", "Grande", "Zona Norte", "Zona Sul"
]

const CITY_SUGGESTIONS = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Brasília",
  "Fortaleza", "Recife", "Curitiba", "Porto Alegre", "Manaus", "Belém",
  "Goiânia", "Campinas", "Santos", "Sorocaba", "Ribeirão Preto"
]

export default function RegionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all")

  const breadcrumbs = useMemo(() => [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Institutions & Structures" },
    { name: "Regions" }
  ], [])

  usePageTitle({
    title: "Regions Management",
    breadcrumbs
  })

  const form = useForm<RegionForm>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: "",
      institution_id: "",
      parent_region_id: "none",
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      contact_address: "",
      contact_city: "",
      contact_postal_code: "",
      notes: "",
    },
  })

  // Filtrar regiões baseado na busca e instituição selecionada
  const filteredRegions = useMemo(() => {
    return MOCK_REGIONS.filter(region => {
      const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           region.institution.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesInstitution = selectedInstitution === "all" || 
                                 region.institution.includes(selectedInstitution)
      return matchesSearch && matchesInstitution
    })
  }, [searchTerm, selectedInstitution])

  // Estatísticas para os cards
  const stats = useMemo(() => {
    const totalRegions = filteredRegions.length
    const totalChurches = filteredRegions.reduce((sum, region) => sum + region.churches_count, 0)
    const totalMembers = filteredRegions.reduce((sum, region) => sum + region.members_count, 0)
    const avgMembersPerRegion = totalRegions > 0 ? Math.round(totalMembers / totalRegions) : 0

    return {
      totalRegions,
      totalChurches,
      totalMembers,
      avgMembersPerRegion
    }
  }, [filteredRegions])

  const onSubmit = async (data: RegionForm) => {
    setIsSubmitting(true)
    
    try {
      // Validação adicional
      if (!data.institution_id) {
        toast.error("⚠️ Selecione uma instituição")
        setIsSubmitting(false)
        return
      }

      // Toast de loading
      const loadingToast = toast.loading("Criando nova região...")
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const regionData = {
        ...data,
        id: `region_${Date.now()}`,
        created_at: new Date().toISOString(),
        created_by: "current-user-id",
        is_deleted: false
      }
      
      console.log("Region data:", regionData)
      
      toast.dismiss(loadingToast)
      toast.success(
        `🎉 Região "${data.name}" criada com sucesso!\n📍 Instituição: ${MOCK_INSTITUTIONS.find(i => i.id === data.institution_id)?.name}`,
        {
          duration: 5000,
          style: { minWidth: '350px' }
        }
      )
      
      setIsModalOpen(false)
      setCurrentStep(1)
      form.reset()
      
    } catch (error) {
      toast.error("❌ Erro ao criar região. Tente novamente.", {
        duration: 4000
      })
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (currentStep >= 3) return

    let fieldsToValidate: (keyof RegionForm)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'institution_id']
    } else if (currentStep === 2) {
      fieldsToValidate = ['contact_name', 'contact_phone', 'contact_email', 'contact_city']
    }

    const isValid = await form.trigger(fieldsToValidate)
    
    if (!isValid) {
      toast.error("⚠️ Preencha todos os campos obrigatórios antes de continuar.", {
        duration: 4000
      })
      return
    }

    toast.success("✅ Etapa concluída!", { duration: 2000 })
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const progress = (currentStep / 3) * 100

  // Componente para sugestões rápidas
  const QuickSuggestions = ({ suggestions, onSelect }: { suggestions: string[], onSelect: (value: string) => void }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <HelpCircle className="w-3 h-3 mr-1" />
          Sugestões
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Sugestões rápidas:</h4>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onSelect(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Regions Management</h2>
            <p className="text-muted-foreground">
              Gerencie regiões geográficas e territórios do Church Growth International MVP
            </p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Região
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Registrar Nova Região
                </DialogTitle>
                <DialogDescription>
                  Processo de registro em 3 etapas - Church Growth International MVP
                </DialogDescription>
                
                {/* Progress */}
                <div className="space-y-2 pt-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Etapa {currentStep} de 3
                  </p>
                </div>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Etapa 1: Informações Básicas */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <Alert>
                        <Building className="h-4 w-4" />
                        <AlertTitle>Informações Básicas da Região</AlertTitle>
                        <AlertDescription>
                          Configure o nome e hierarquia da nova região
                        </AlertDescription>
                      </Alert>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <MapPin className="w-5 h-5" />
                              Nome da Região
                            </FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input 
                                  placeholder="Ex: São Paulo Capital, Rio Interior..." 
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <QuickSuggestions 
                                suggestions={REGION_NAME_SUGGESTIONS}
                                onSelect={(value) => form.setValue("name", value)}
                              />
                            </div>
                            <FormDescription>
                              Nome único que identifica esta região geográfica
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="institution_id"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <Building className="w-5 h-5" />
                              Instituição
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Selecione a instituição" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {MOCK_INSTITUTIONS.map((institution) => (
                                  <SelectItem key={institution.id} value={institution.id}>
                                    <div className="py-2">
                                      <span className="font-medium">{institution.name}</span>
                                      <p className="text-xs text-muted-foreground">{institution.denomination}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Instituição à qual esta região pertence
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parent_region_id"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-base font-medium">
                              Região Pai (Opcional)
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Selecione uma região pai (opcional)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">Nenhuma (Região Principal)</SelectItem>
                                {MOCK_REGIONS.map((region) => (
                                  <SelectItem key={region.id} value={region.id}>
                                    <div className="py-1">
                                      <span className="font-medium">{region.name}</span>
                                      <p className="text-xs text-muted-foreground">{region.institution}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Para criar sub-regiões dentro de uma região maior
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Etapa 2: Dados de Contato */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <Alert>
                        <Phone className="h-4 w-4" />
                        <AlertTitle>Informações de Contato</AlertTitle>
                        <AlertDescription>
                          Dados do responsável pela região
                        </AlertDescription>
                      </Alert>

                      <FormField
                        control={form.control}
                        name="contact_name"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-base font-medium">
                              <Users className="w-5 h-5" />
                              Nome do Responsável
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nome completo do responsável pela região" 
                                className="h-12 text-base"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contact_phone"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <Phone className="w-5 h-5" />
                                Telefone
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="(11) 99999-9999" 
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact_email"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <Mail className="w-5 h-5" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="email@instituicao.org.br" 
                                  type="email"
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contact_city"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <MapPin className="w-5 h-5" />
                                Cidade
                              </FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input 
                                    placeholder="Cidade principal da região" 
                                    className="h-12 text-base"
                                    {...field} 
                                  />
                                </FormControl>
                                <QuickSuggestions 
                                  suggestions={CITY_SUGGESTIONS}
                                  onSelect={(value) => form.setValue("contact_city", value)}
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact_postal_code"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">
                                CEP (Opcional)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="00000-000" 
                                  className="h-12 text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="contact_address"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-base font-medium">
                              Endereço Completo (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Endereço completo do escritório regional..."
                                rows={3}
                                className="text-base resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Etapa 3: Revisão e Confirmação */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Revisão Final</AlertTitle>
                        <AlertDescription>
                          Verifique se todas as informações estão corretas antes de criar a região.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informações da Região */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Dados da Região
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Nome:</span>
                              <p className="font-medium">{form.getValues("name")}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Instituição:</span>
                              <p className="font-medium">
                                {MOCK_INSTITUTIONS.find(i => i.id === form.getValues("institution_id"))?.name}
                              </p>
                            </div>
                            {form.getValues("parent_region_id") && form.getValues("parent_region_id") !== "none" && (
                              <div>
                                <span className="text-muted-foreground">Região Pai:</span>
                                <p className="font-medium">
                                  {MOCK_REGIONS.find(r => r.id === form.getValues("parent_region_id"))?.name}
                                </p>
                              </div>
                            )}
                            {(!form.getValues("parent_region_id") || form.getValues("parent_region_id") === "none") && (
                              <div>
                                <span className="text-muted-foreground">Tipo:</span>
                                <p className="font-medium">Região Principal</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Dados de Contato */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Contato Responsável
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Nome:</span>
                              <p className="font-medium">{form.getValues("contact_name")}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Telefone:</span>
                              <p className="font-medium">{form.getValues("contact_phone")}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Email:</span>
                              <p className="font-medium">{form.getValues("contact_email")}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cidade:</span>
                              <p className="font-medium">{form.getValues("contact_city")}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {form.getValues("notes") && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Observações</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{form.getValues("notes")}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center justify-center gap-2 h-12 text-base"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Anterior
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center justify-center gap-2 h-12 text-base"
                      >
                        Próximo
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 h-12 text-base min-w-48"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Criando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Criar Região
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Regiões</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegions}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Igrejas</CardTitle>
              <Church className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChurches}</div>
              <p className="text-xs text-muted-foreground">
                Distribuídas nas regiões
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Membros ativos nas regiões
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Região</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgMembersPerRegion}</div>
              <p className="text-xs text-muted-foreground">
                Membros por região
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome da região ou instituição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                <SelectTrigger className="w-full sm:w-64 h-12 text-base">
                  <SelectValue placeholder="Filtrar por instituição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Instituições</SelectItem>
                  {MOCK_INSTITUTIONS.map((institution) => (
                    <SelectItem key={institution.id} value={institution.name}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Regions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Regiões Cadastradas
            </CardTitle>
            <CardDescription>
              Lista completa das regiões e suas informações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Região</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Igrejas</TableHead>
                    <TableHead>Membros</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegions.map((region) => (
                    <TableRow key={region.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{region.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Criada em {new Date(region.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{region.institution}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{region.contact.name}</div>
                          <div className="text-sm text-muted-foreground">{region.contact.city}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{region.contact.phone}</div>
                          <div className="text-sm text-muted-foreground">{region.contact.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Church className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{region.churches_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{region.members_count.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={region.status === "active" ? "default" : "secondary"}>
                          {region.status === "active" ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48">
                            <div className="space-y-1">
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Eye className="w-4 h-4 mr-2" />
                                Visualizar
                              </Button>
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </Button>
                              <Button variant="ghost" size="sm" className="w-full justify-start text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRegions.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma região encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedInstitution !== "all" 
                    ? "Tente ajustar os filtros de busca" 
                    : "Comece criando sua primeira região"
                  }
                </p>
                {(!searchTerm && selectedInstitution === "all") && (
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Região
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
