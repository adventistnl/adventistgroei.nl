"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  User,
  Building,
  Calendar,
  DollarSign,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Globe,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppLayout } from "@/components/layouts/app-layout" // Using shared sidebar component

interface Member {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  status: string
  institution: string
  church: string
  language: string
  joinDate: string
  createdAt: string
  updatedAt: string
}

interface Subsidy {
  id: string
  title: string
  amount: number
  status: "Pending" | "Approved" | "Rejected" | "Completed"
  requestDate: string
  category: string
}

interface Course {
  id: string
  title: string
  progress: number
  status: "In Progress" | "Completed" | "Not Started"
  startDate: string
  category: string
}

interface Event {
  id: string
  title: string
  date: string
  status: "Registered" | "Attended" | "Missed"
  type: string
}

export default function MemberProfilePage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string

  const [member, setMember] = useState<Member | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Member>>({})
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({
    pending: false,
    approved: false,
    completed: false,
  })
  const [viewType, setViewType] = useState<"card" | "list" | "compact">("card")
  const [reviewModal, setReviewModal] = useState<{ open: boolean; subsidy: Subsidy | null }>({
    open: false,
    subsidy: null,
  })

  const [subsidies] = useState<Subsidy[]>([
    {
      id: "1",
      title: "Evangelism Campaign - Brazil",
      amount: 2500,
      status: "Approved",
      requestDate: "2024-01-15",
      category: "Evangelism",
    },
    {
      id: "2",
      title: "Youth Ministry Support",
      amount: 800,
      status: "Pending",
      requestDate: "2024-01-20",
      category: "Youth",
    },
    {
      id: "3",
      title: "Community Outreach Program",
      amount: 1200,
      status: "Completed",
      requestDate: "2023-12-10",
      category: "Community",
    },
  ])

  const [courses] = useState<Course[]>([
    {
      id: "1",
      title: "Leadership Development",
      progress: 85,
      status: "In Progress",
      startDate: "2024-01-10",
      category: "Leadership",
    },
    {
      id: "2",
      title: "Evangelism Strategies",
      progress: 100,
      status: "Completed",
      startDate: "2023-11-15",
      category: "Evangelism",
    },
    {
      id: "3",
      title: "Financial Management",
      progress: 45,
      status: "In Progress",
      startDate: "2024-01-25",
      category: "Finance",
    },
  ])

  const [events] = useState<Event[]>([
    { id: "1", title: "Annual Conference 2024", date: "2024-03-15", status: "Registered", type: "Conference" },
    { id: "2", title: "Youth Camp Summer 2023", date: "2023-07-20", status: "Attended", type: "Camp" },
    { id: "3", title: "Evangelism Workshop", date: "2024-02-10", status: "Attended", type: "Workshop" },
  ])

  useEffect(() => {
    // Mock member data - replace with actual API call
    const mockMember: Member = {
      id: memberId,
      name: "João Silva Santos",
      email: "joao.santos@email.com",
      phone: "+55 11 99999-9999",
      address: "Rua das Flores, 123 - São Paulo, SP",
      role: "Evangelism Leader",
      status: "Active",
      institution: "South American Division",
      church: "Central Adventist Church",
      language: "PT",
      joinDate: "2023-06-15",
      createdAt: "2023-06-15T10:30:00Z",
      updatedAt: "2024-01-20T14:45:00Z",
    }
    setMember(mockMember)
    setEditData(mockMember)
  }, [memberId])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (member && editData) {
      setMember({ ...member, ...editData })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditData(member || {})
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof Member, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600 text-white"
      case "Inactive":
        return "bg-muted text-muted-foreground"
      case "Approved":
        return "bg-green-600 text-white"
      case "Pending":
        return "bg-yellow-600 text-white"
      case "Rejected":
        return "bg-red-600 text-white"
      case "Completed":
        return "bg-gray-900 text-white"
      case "In Progress":
        return "bg-yellow-600 text-white"
      case "Not Started":
        return "bg-muted text-muted-foreground"
      case "Registered":
        return "bg-gray-900 text-white"
      case "Attended":
        return "bg-green-600 text-white"
      case "Missed":
        return "bg-red-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      EN: "English",
      PT: "Português",
      ES: "Español",
      FR: "Français",
      DE: "Deutsch",
    }
    return languages[code] || code
  }

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  const openReviewModal = (subsidy: Subsidy) => {
    setReviewModal({ open: true, subsidy })
  }

  const closeReviewModal = () => {
    setReviewModal({ open: false, subsidy: null })
  }

  const approveSubsidy = (subsidyId: string) => {
    // Here you would make an API call to approve the subsidy
    console.log("[v0] Approving subsidy:", subsidyId)
    closeReviewModal()
  }

  const rejectSubsidy = (subsidyId: string) => {
    // Here you would make an API call to reject the subsidy
    console.log("[v0] Rejecting subsidy:", subsidyId)
    closeReviewModal()
  }

  if (!member) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
       {/* Using shared sidebar component */}
      <div className="flex-1">
        {/* Back Button Bar */}
        <div className="bg-card border-b border-border p-4">
          <Button onClick={() => router.back()} variant="ghost" className="text-foreground hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>

        {/* Main Profile Header */}
        <div className="bg-card border-b border-border p-8">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="/professional-headshot-of-church-member.png"
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <Edit className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{member.name}</h1>
                  <p className="text-muted-foreground mb-4">{member.email}</p>

                  {/* Status and Details Grid */}
                  <div className="grid grid-cols-3 gap-8 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <p className="font-semibold text-foreground">{member.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Church Experience</p>
                      <p className="font-semibold text-foreground">
                        {Math.floor(
                          (new Date().getTime() - new Date(member.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365),
                        )}{" "}
                        + Years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Institution</p>
                      <p className="font-semibold text-foreground">{member.institution}</p>
                    </div>
                  </div>
                </div>

                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem onClick={handleEdit} className="hover:bg-muted cursor-pointer">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover Membro
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs Navigation */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="personal" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Informações Pessoais
              </TabsTrigger>
              <TabsTrigger value="subsidies" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Subsídios
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Cursos
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Details */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Nome Completo</Label>
                      {isEditing ? (
                        <Input
                          value={editData.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-card border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium">{member.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">E-mail</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-card border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          {member.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Telefone</Label>
                      {isEditing ? (
                        <Input
                          value={editData.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-card border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          {member.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Endereço</Label>
                      {isEditing ? (
                        <Input
                          value={editData.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="bg-card border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {member.address}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Church Information */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Informações da Igreja
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Função/Cargo</Label>
                      {isEditing ? (
                        <Select value={editData.role || ""} onValueChange={(value) => handleInputChange("role", value)}>
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Church Leader">Church Leader</SelectItem>
                            <SelectItem value="Evangelism Leader">Evangelism Leader</SelectItem>
                            <SelectItem value="Financial Officer">Financial Officer</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-foreground font-medium">{member.role}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Instituição</Label>
                      <p className="text-foreground font-medium">{member.institution}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Igreja</Label>
                      <p className="text-foreground font-medium">{member.church}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Idioma Preferido</Label>
                      {isEditing ? (
                        <Select
                          value={editData.language || ""}
                          onValueChange={(value) => handleInputChange("language", value)}
                        >
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="EN">English</SelectItem>
                            <SelectItem value="PT">Português</SelectItem>
                            <SelectItem value="ES">Español</SelectItem>
                            <SelectItem value="FR">Français</SelectItem>
                            <SelectItem value="DE">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-foreground font-medium flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                          {getLanguageName(member.language)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Subsidies Tab */}
            <TabsContent value="subsidies">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Histórico de Subsídios</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Visualização:</span>
                      <Select
                        value={viewType}
                        onValueChange={(value: "card" | "list" | "compact") => setViewType(value)}
                      >
                        <SelectTrigger className="w-32 bg-card border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="card">Cards</SelectItem>
                          <SelectItem value="list">Lista</SelectItem>
                          <SelectItem value="compact">Compacto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>
                        Total Aprovado: <strong className="text-green-600">R$ 3.700</strong>
                      </span>
                      <span>
                        Pendente: <strong className="text-yellow-600">R$ 800</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => toggleGroup("pending")} className="p-1 h-auto">
                          {collapsedGroups.pending ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-foreground">Pendentes de Aprovação</h4>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          {subsidies.filter((s) => s.status === "Pending").length}
                        </Badge>
                      </div>
                    </div>

                    {!collapsedGroups.pending && (
                      <div className={viewType === "card" ? "grid gap-4" : "space-y-2"}>
                        {subsidies
                          .filter((subsidy) => subsidy.status === "Pending")
                          .map((subsidy) => (
                            <Card
                              key={subsidy.id}
                              className={`bg-card border-border border-l-4 border-l-yellow-600 ${viewType === "compact" ? "p-2" : ""}`}
                            >
                              <CardContent className={viewType === "compact" ? "p-3" : "p-4"}>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h5
                                      className={`font-semibold text-foreground ${viewType === "compact" ? "text-sm" : ""}`}
                                    >
                                      {subsidy.title}
                                    </h5>
                                    <p
                                      className={`text-muted-foreground mt-1 ${viewType === "compact" ? "text-xs" : "text-sm"}`}
                                    >
                                      Categoria: {subsidy.category} • Solicitado em{" "}
                                      {new Date(subsidy.requestDate).toLocaleDateString("pt-BR")}
                                    </p>
                                    <p
                                      className={`text-red-600 mt-2 font-medium ${viewType === "compact" ? "text-xs" : "text-sm"}`}
                                    >
                                      📅 Prazo para aprovação:{" "}
                                      {new Date(
                                        new Date(subsidy.requestDate).getTime() + 30 * 24 * 60 * 60 * 1000,
                                      ).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                  <div className="text-right flex flex-col gap-2">
                                    <div>
                                      <p
                                        className={`font-bold text-foreground ${viewType === "compact" ? "text-sm" : "text-lg"}`}
                                      >
                                        R$ {subsidy.amount.toLocaleString()}
                                      </p>
                                      <Badge className={getStatusBadgeColor(subsidy.status)}>{subsidy.status}</Badge>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => openReviewModal(subsidy)}
                                      className="bg-gray-900 hover:bg-gray-800 text-white"
                                    >
                                      Revisar
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        {subsidies.filter((s) => s.status === "Pending").length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>Nenhum subsídio pendente</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGroup("approved")}
                          className="p-1 h-auto"
                        >
                          {collapsedGroups.approved ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-foreground">Aprovados</h4>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {subsidies.filter((s) => s.status === "Approved").length}
                        </Badge>
                      </div>
                    </div>

                    {!collapsedGroups.approved && (
                      <div className={viewType === "card" ? "grid gap-4" : "space-y-2"}>
                        {subsidies
                          .filter((subsidy) => subsidy.status === "Approved")
                          .map((subsidy) => (
                            <Card
                              key={subsidy.id}
                              className={`bg-card border-border border-l-4 border-l-green-600 ${viewType === "compact" ? "p-2" : ""}`}
                            >
                              <CardContent className={viewType === "compact" ? "p-3" : "p-4"}>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h5
                                      className={`font-semibold text-foreground ${viewType === "compact" ? "text-sm" : ""}`}
                                    >
                                      {subsidy.title}
                                    </h5>
                                    <p
                                      className={`text-muted-foreground mt-1 ${viewType === "compact" ? "text-xs" : "text-sm"}`}
                                    >
                                      Categoria: {subsidy.category} • Solicitado em{" "}
                                      {new Date(subsidy.requestDate).toLocaleDateString("pt-BR")}
                                    </p>
                                    <p
                                      className={`text-green-600 mt-2 font-medium ${viewType === "compact" ? "text-xs" : "text-sm"}`}
                                    >
                                      ✅ Aprovado em:{" "}
                                      {new Date(
                                        new Date(subsidy.requestDate).getTime() + 7 * 24 * 60 * 60 * 1000,
                                      ).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className={`font-bold text-foreground ${viewType === "compact" ? "text-sm" : "text-lg"}`}
                                    >
                                      R$ {subsidy.amount.toLocaleString()}
                                    </p>
                                    <Badge className={getStatusBadgeColor(subsidy.status)}>{subsidy.status}</Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        {subsidies.filter((s) => s.status === "Approved").length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>Nenhum subsídio aprovado</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGroup("completed")}
                          className="p-1 h-auto"
                        >
                          {collapsedGroups.completed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-foreground">Finalizados</h4>
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                          {subsidies.filter((s) => s.status === "Completed").length}
                        </Badge>
                      </div>
                    </div>

                    {!collapsedGroups.completed && (
                      <div className={viewType === "card" ? "grid gap-4" : "space-y-2"}>
                        {subsidies
                          .filter((subsidy) => subsidy.status === "Completed")
                          .map((subsidy) => (
                            <Card
                              key={subsidy.id}
                              className={`bg-card border-border border-l-4 border-l-gray-900 ${viewType === "compact" ? "p-2" : ""}`}
                            >
                              <CardContent className={viewType === "compact" ? "p-3" : "p-4"}>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h5
                                      className={`font-semibold text-foreground ${viewType === "compact" ? "text-sm" : ""}`}
                                    >
                                      {subsidy.title}
                                    </h5>
                                    <p
                                      className={`text-muted-foreground mt-1 ${viewType === "compact" ? "text-xs" : "text-sm"}`}
                                    >
                                      Categoria: {subsidy.category} • Solicitado em{" "}
                                      {new Date(subsidy.requestDate).toLocaleDateString("pt-BR")}
                                    </p>
                                    <p
                                      className={`text-gray-900 mt-2 font-medium ${viewType === "compact" ? "text-xs" : "text-sm"}`}
                                    >
                                      🏁 Finalizado em:{" "}
                                      {new Date(
                                        new Date(subsidy.requestDate).getTime() + 45 * 24 * 60 * 60 * 1000,
                                      ).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className={`font-bold text-foreground ${viewType === "compact" ? "text-sm" : "text-lg"}`}
                                    >
                                      R$ {subsidy.amount.toLocaleString()}
                                    </p>
                                    <Badge className={getStatusBadgeColor(subsidy.status)}>{subsidy.status}</Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        {subsidies.filter((s) => s.status === "Completed").length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>Nenhum subsídio finalizado</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Cursos e Treinamentos</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Concluídos: <strong className="text-green-600">1</strong>
                    </span>
                    <span>
                      Em Andamento: <strong className="text-yellow-600">2</strong>
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{course.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Categoria: {course.category} • Iniciado em{" "}
                              {new Date(course.startDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <Badge className={getStatusBadgeColor(course.status)}>{course.status}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="text-foreground font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Eventos e Atividades</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Participados: <strong className="text-green-600">2</strong>
                    </span>
                    <span>
                      Registrados: <strong className="text-gray-900">1</strong>
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {events.map((event) => (
                    <Card key={event.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Tipo: {event.type} • Data: {new Date(event.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <Badge className={getStatusBadgeColor(event.status)}>{event.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {reviewModal.open && reviewModal.subsidy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Revisar Solicitação de Subsídio</h3>
              <Button variant="ghost" onClick={closeReviewModal} className="p-1">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Subsidy Details */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-3">{reviewModal.subsidy.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Valor Solicitado:</span>
                    <p className="font-semibold text-foreground">R$ {reviewModal.subsidy.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoria:</span>
                    <p className="font-semibold text-foreground">{reviewModal.subsidy.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data da Solicitação:</span>
                    <p className="font-semibold text-foreground">
                      {new Date(reviewModal.subsidy.requestDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status Atual:</span>
                    <Badge className={getStatusBadgeColor(reviewModal.subsidy.status)}>
                      {reviewModal.subsidy.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Member Information */}
              <div className="bg-muted rounded-lg p-4">
                <h5 className="font-semibold text-foreground mb-3">Informações do Solicitante</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-semibold text-foreground">{member?.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Igreja:</span>
                    <p className="font-semibold text-foreground">{member?.church}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Função:</span>
                    <p className="font-semibold text-foreground">{member?.role}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Instituição:</span>
                    <p className="font-semibold text-foreground">{member?.institution}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={closeReviewModal}
                  className="border-border text-foreground hover:bg-muted bg-transparent"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => rejectSubsidy(reviewModal.subsidy!.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Rejeitar
                </Button>
                <Button
                  onClick={() => approveSubsidy(reviewModal.subsidy!.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Aprovar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
