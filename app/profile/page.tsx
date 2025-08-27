"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Shield,
  Bell,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Download,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
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
  timezone: string
  joinDate: string
  lastLogin: string
  avatar?: string
}

interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  language: string
  timezone: string
  theme: string
  autoSave: boolean
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Mock user data - replace with actual API calls
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "current-user-id",
    name: "Maria Silva Santos",
    email: "maria.santos@email.com",
    phone: "+55 11 98765-4321",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    role: "Church Leader",
    status: "Active",
    institution: "South American Division",
    church: "Central Adventist Church",
    language: "PT",
    timezone: "America/Sao_Paulo",
    joinDate: "2022-03-15",
    lastLogin: "2024-01-25T09:30:00Z",
  })

  const [editData, setEditData] = useState<Partial<UserProfile>>(userProfile)

  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    language: "PT",
    timezone: "America/Sao_Paulo",
    theme: "light",
    autoSave: true,
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setUserProfile({ ...userProfile, ...editData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(userProfile)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: keyof UserPreferences, value: boolean | string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600 text-white"
      case "Inactive":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Meu Perfil</h2>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
          </div>

          {/* Profile Header */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-900 text-white text-2xl">
                    {userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground">{userProfile.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={getStatusBadgeColor(userProfile.role)}>{userProfile.role}</Badge>
                    <Badge className={getStatusBadgeColor(userProfile.status)}>{userProfile.status}</Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Membro desde {new Date(userProfile.joinDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Último acesso: {new Date(userProfile.lastLogin).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={handleEdit} className="bg-gray-900 hover:bg-gray-800 text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="personal" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Informações Pessoais
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <Bell className="w-4 h-4 mr-2" />
                Preferências
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                <Activity className="w-4 h-4 mr-2" />
                Atividade
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
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium">{userProfile.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">E-mail</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          {userProfile.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Telefone</Label>
                      {isEditing ? (
                        <Input
                          value={editData.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          {userProfile.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Endereço</Label>
                      {isEditing ? (
                        <Input
                          value={editData.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-foreground font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {userProfile.address}
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
                      <p className="text-foreground font-medium">{userProfile.role}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Instituição</Label>
                      <p className="text-foreground font-medium">{userProfile.institution}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Igreja</Label>
                      <p className="text-foreground font-medium">{userProfile.church}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Idioma Preferido</Label>
                      <p className="text-foreground font-medium flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                        {getLanguageName(userProfile.language)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Notificações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground">Notificações por E-mail</Label>
                        <p className="text-sm text-muted-foreground">Receber atualizações por e-mail</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground">Notificações Push</Label>
                        <p className="text-sm text-muted-foreground">Receber notificações no navegador</p>
                      </div>
                      <Switch
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-foreground">Salvamento Automático</Label>
                        <p className="text-sm text-muted-foreground">Salvar alterações automaticamente</p>
                      </div>
                      <Switch
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => handlePreferenceChange("autoSave", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Configurações Regionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Idioma</Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => handlePreferenceChange("language", value)}
                      >
                        <SelectTrigger className="bg-background border-border">
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
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Fuso Horário</Label>
                      <Select
                        value={preferences.timezone}
                        onValueChange={(value) => handlePreferenceChange("timezone", value)}
                      >
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                          <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Tema</Label>
                      <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange("theme", value)}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Alterar Senha</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-background border-border pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Nova Senha</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Confirmar Nova Senha</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <Button className="bg-gray-900 hover:bg-gray-800 text-white w-full">Alterar Senha</Button>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Dados da Conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Exportar Dados</Label>
                      <p className="text-sm text-muted-foreground">Baixe uma cópia de todos os seus dados pessoais</p>
                      <Button
                        variant="outline"
                        className="border-border text-foreground hover:bg-muted bg-transparent w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Dados
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Informações da Conta</Label>
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          ID da Conta: <span className="text-foreground font-mono">{userProfile.id}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Criada em:{" "}
                          <span className="text-foreground">
                            {new Date(userProfile.joinDate).toLocaleDateString("pt-BR")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Resumo de Atividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">12</div>
                      <p className="text-muted-foreground">Eventos Participados</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">5</div>
                      <p className="text-muted-foreground">Subsídios Aprovados</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">8</div>
                      <p className="text-muted-foreground">Cursos Concluídos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
