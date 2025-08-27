"use client"

import { useRouter } from "next/navigation" // Fixed router import
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { AppLayout } from "@/components/layouts/app-layout"

interface Member {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  joinDate: string
  address: string
  institution: string
  church: string
  language: string
  createdAt: string
  updatedAt: string
}

const members: Member[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    role: "Church Leader",
    status: "Active",
    joinDate: "2020-03-15",
    address: "123 Main St, City, State",
    institution: "Seventh-day Adventist Church - USA",
    church: "New York Central Church",
    language: "EN",
    createdAt: "2020-03-15T10:30:00Z",
    updatedAt: "2024-01-15T14:22:00Z",
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    email: "maria.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    role: "Evangelism Leader",
    status: "Active",
    joinDate: "2019-08-22",
    address: "456 Oak Ave, City, State",
    institution: "Iglesia Adventista del Séptimo Día - España",
    church: "Iglesia Central Madrid",
    language: "ES",
    createdAt: "2019-08-22T09:15:00Z",
    updatedAt: "2024-01-10T11:45:00Z",
  },
  {
    id: 3,
    name: "David Johnson",
    email: "david.johnson@email.com",
    phone: "+1 (555) 345-6789",
    role: "Member",
    status: "Active",
    joinDate: "2021-11-10",
    address: "789 Pine St, City, State",
    institution: "Seventh-day Adventist Church - USA",
    church: "Los Angeles Church",
    language: "EN",
    createdAt: "2021-11-10T16:20:00Z",
    updatedAt: "2023-12-20T08:30:00Z",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "+1 (555) 456-7890",
    role: "Financial Officer",
    status: "Active",
    joinDate: "2018-05-03",
    address: "321 Elm St, City, State",
    institution: "Seventh-day Adventist Church - USA",
    church: "Chicago Church",
    language: "EN",
    createdAt: "2018-05-03T12:00:00Z",
    updatedAt: "2024-01-08T15:10:00Z",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 567-8901",
    role: "Member",
    status: "Inactive",
    joinDate: "2022-01-18",
    address: "654 Maple Ave, City, State",
    institution: "Igreja Adventista do Sétimo Dia - Brasil",
    church: "Igreja Central de São Paulo",
    language: "PT",
    createdAt: "2022-01-18T14:45:00Z",
    updatedAt: "2023-11-15T10:20:00Z",
  },
]

interface FormData {
  name: string
  email: string
  password: string
  institution_id: string
  church_id: string
  language_preference: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  institution_id?: string
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-purple-600 text-white"
    case "Church Leader":
      return "bg-blue-600 text-white"
    case "Evangelism Leader":
      return "bg-green-600 text-white"
    case "Financial Officer":
      return "bg-yellow-600 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusBadgeColor = (status: string) => {
  return status === "Active" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"
}

const membersByChurch = [
  { name: "New York Central", members: 45, active: 42 },
  { name: "Los Angeles", members: 38, active: 35 },
  { name: "Chicago", members: 32, active: 30 },
  { name: "Madrid Central", members: 28, active: 26 },
  { name: "São Paulo Central", members: 25, active: 22 },
]

const membersByRole = [
  { name: "Members", value: 65, color: "#6b7280" },
  { name: "Church Leaders", value: 15, color: "#1f2937" },
  { name: "Evangelism Leaders", value: 12, color: "#059669" },
  { name: "Financial Officers", value: 8, color: "#d97706" },
]

const memberGrowth = [
  { month: "Jan", members: 120 },
  { month: "Feb", members: 125 },
  { month: "Mar", members: 132 },
  { month: "Apr", members: 138 },
  { month: "May", members: 145 },
  { month: "Jun", members: 153 },
]

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const router = useRouter()

  const institutions = [
    { id: "1", name: "Igreja Adventista do Sétimo Dia - Brasil" },
    { id: "2", name: "Seventh-day Adventist Church - USA" },
    { id: "3", name: "Iglesia Adventista del Séptimo Día - España" },
    { id: "4", name: "Église Adventiste du Septième Jour - France" },
  ]

  const churches = {
    "1": [
      { id: "1-1", name: "Igreja Central de São Paulo" },
      { id: "1-2", name: "Igreja do Rio de Janeiro" },
      { id: "1-3", name: "Igreja de Brasília" },
    ],
    "2": [
      { id: "2-1", name: "New York Central Church" },
      { id: "2-2", name: "Los Angeles Church" },
      { id: "2-3", name: "Chicago Church" },
    ],
    "3": [
      { id: "3-1", name: "Iglesia Central Madrid" },
      { id: "3-2", name: "Iglesia Barcelona" },
    ],
    "4": [
      { id: "4-1", name: "Église Paris Centre" },
      { id: "4-2", name: "Église Lyon" },
    ],
  }

  const handleViewProfile = (member: Member) => {
    router.push(`/members/${member.id}`)
  }

  const handleEditMember = (member: Member) => {
    router.push(`/members/${member.id}/edit`)
  }

  const handleDeleteMember = async (id: number) => {
    if (window.confirm("Tem certeza que deseja remover este membro? Esta ação não pode ser desfeita.")) {
      try {
        // Simulate API call to delete member
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("[v0] Member deleted:", id)

        alert("Membro removido com sucesso!")
      } catch (error) {
        console.error("[v0] Error deleting member:", error)
        alert("Erro ao remover membro. Tente novamente.")
      }
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

  return (
    <AppLayout>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Member Management</h2>
          <p className="text-muted-foreground">Manage church members, roles, and contact information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Member Statistics */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{members.length}</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {members.filter((m) => m.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((members.filter((m) => m.status === "Active").length / members.length) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Churches</CardTitle>
                <CardDescription className="text-muted-foreground">Across 4 institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">8</div>
                <p className="text-xs text-muted-foreground">Across 4 institutions</p>
              </CardContent>
            </Card>
          </div>

          {/* Members by Church Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Members by Church</CardTitle>
              <CardDescription className="text-muted-foreground">Distribution across churches</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={membersByChurch}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="members" fill="#1f2937" />
                  <Bar dataKey="active" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Member Roles Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Role Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">Members by role type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={membersByRole}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {membersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Member Growth Trend */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Member Growth Trend</CardTitle>
            <CardDescription className="text-muted-foreground">
              Monthly member growth over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memberGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#1f2937" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search members..." className="pl-10 w-80 bg-card border-border" />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground text-xl">Registrar Novo Membro</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Sistema Church Growth International - Processo de registro em 3 etapas
                </DialogDescription>
              </DialogHeader>

              {/* Step Indicator */}
              <div className="flex items-center justify-center space-x-4 py-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === 1 ? "bg-gray-900 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && <div className={`w-12 h-0.5 mx-2 bg-muted`} />}
                  </div>
                ))}
              </div>

              {/* Step Labels */}
              <div className="flex justify-between text-xs text-muted-foreground mb-6">
                <span className="text-foreground font-medium">Informações Pessoais</span>
                <span className="text-foreground font-medium">Instituição & Igreja</span>
                <span className="text-foreground font-medium">Preferências & Revisão</span>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {/* Placeholder for form content */}
                <p className="text-muted-foreground">Form content goes here</p>
              </div>

              {/* Form Navigation */}
              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Members Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Church Members</CardTitle>
            <CardDescription className="text-muted-foreground">
              Total of {members.length} members registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Join Date</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {member.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                          {member.email}
                        </div>
                        <div className="text-sm text-foreground flex items-center">
                          <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(member.status)}>{member.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                        {new Date(member.joinDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(member)}
                            className="hover:bg-muted cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditMember(member)}
                            className="hover:bg-muted cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteMember(member.id)}
                            className="hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </AppLayout>
  )
}
