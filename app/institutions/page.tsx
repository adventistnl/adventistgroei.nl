"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  Church,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  MapPin,
  Mail,
  Phone,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function InstitutionsPage() {
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false)
  const [isChurchModalOpen, setIsChurchModalOpen] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<any>(null)
  const [editingChurch, setEditingChurch] = useState<any>(null)

  const router = useRouter()

  // Mock data
  const institutions = [
    {
      id: "1",
      name: "South American Division",
      denomination: "Seventh-day Adventist",
      country: "Brazil",
      address: "Brasília, DF, Brazil",
      contact_email: "contact@sad.org.br",
      churches_count: 15,
      members_count: 2500,
      created_at: "2023-01-15",
    },
    {
      id: "2",
      name: "North American Division",
      denomination: "Seventh-day Adventist",
      country: "United States",
      address: "Silver Spring, MD, USA",
      contact_email: "info@nad.org",
      churches_count: 8,
      members_count: 1800,
      created_at: "2023-02-20",
    },
  ]

  const churches = [
    {
      id: "1",
      name: "Central Adventist Church",
      institution_id: "1",
      institution_name: "South American Division",
      address: "São Paulo, SP, Brazil",
      pastor: "Pastor Silva",
      contact_email: "central@church.org",
      phone: "+55 11 99999-9999",
      members_count: 450,
      created_at: "2023-03-10",
    },
    {
      id: "2",
      name: "Community SDA Church",
      institution_id: "1",
      institution_name: "South American Division",
      address: "Rio de Janeiro, RJ, Brazil",
      pastor: "Pastor Santos",
      contact_email: "community@church.org",
      phone: "+55 21 88888-8888",
      members_count: 320,
      created_at: "2023-04-05",
    },
  ]

  const handleCreateInstitution = () => {
    setEditingInstitution(null)
    setIsInstitutionModalOpen(true)
  }

  const handleEditInstitution = (institution: any) => {
    setEditingInstitution(institution)
    setIsInstitutionModalOpen(true)
  }

  const handleCreateChurch = () => {
    setEditingChurch(null)
    setIsChurchModalOpen(true)
  }

  const handleEditChurch = (church: any) => {
    setEditingChurch(church)
    setIsChurchModalOpen(true)
  }

  const handleViewReports = (institutionId: string) => {
    router.push(`/institutions/${institutionId}`)
  }

  return (
    <div className="flex h-screen bg-background">
      

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Institutions & Churches Management</h2>
          <p className="text-muted-foreground">Manage institutions, churches, and their relationships</p>
        </div>

        <Tabs defaultValue="institutions" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="institutions" className="data-[state=active]:bg-background">
              <Building className="w-4 h-4 mr-2" />
              Institutions
            </TabsTrigger>
            <TabsTrigger value="churches" className="data-[state=active]:bg-background">
              <Church className="w-4 h-4 mr-2" />
              Churches
            </TabsTrigger>
          </TabsList>

          {/* Institutions Tab */}
          <TabsContent value="institutions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search institutions..." className="pl-10 w-80 bg-background border-border" />
                </div>
              </div>
              <Button onClick={handleCreateInstitution} className="bg-gray-900 hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Institution
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institutions.map((institution) => (
                <div key={institution.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{institution.name}</h3>
                        <p className="text-sm text-muted-foreground">{institution.denomination}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem
                          onClick={() => handleViewReports(institution.id)}
                          className="text-foreground hover:bg-muted"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Reports
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditInstitution(institution)}
                          className="text-foreground hover:bg-muted"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-muted">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{institution.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{institution.contact_email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Churches: {institution.churches_count}</span>
                      <span className="text-muted-foreground">Members: {institution.members_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Churches Tab */}
          <TabsContent value="churches" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search churches..." className="pl-10 w-80 bg-background border-border" />
                </div>
              </div>
              <Button onClick={handleCreateChurch} className="bg-gray-900 hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Church
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {churches.map((church) => (
                <div key={church.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Church className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{church.name}</h3>
                        <p className="text-sm text-muted-foreground">{church.institution_name}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem
                          onClick={() => handleEditChurch(church)}
                          className="text-foreground hover:bg-muted"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-muted">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{church.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Pastor: {church.pastor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{church.phone}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Members: {church.members_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Institution Modal */}
        <Dialog open={isInstitutionModalOpen} onOpenChange={setIsInstitutionModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingInstitution ? "Edit Institution" : "Add New Institution"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Institution Name *
                  </Label>
                  <Input id="name" placeholder="Enter institution name" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="denomination" className="text-foreground">
                    Denomination *
                  </Label>
                  <Input id="denomination" placeholder="Enter denomination" className="bg-background border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-foreground">
                    Country *
                  </Label>
                  <Input id="country" placeholder="Enter country" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Contact Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter contact email"
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground">
                  Address
                </Label>
                <Textarea id="address" placeholder="Enter full address" className="bg-background border-border" />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsInstitutionModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  {editingInstitution ? "Update Institution" : "Create Institution"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Church Modal */}
        <Dialog open={isChurchModalOpen} onOpenChange={setIsChurchModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">{editingChurch ? "Edit Church" : "Add New Church"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="church-name" className="text-foreground">
                    Church Name *
                  </Label>
                  <Input id="church-name" placeholder="Enter church name" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-foreground">
                    Institution *
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {institutions.map((institution) => (
                        <SelectItem
                          key={institution.id}
                          value={institution.id}
                          className="text-foreground hover:bg-muted"
                        >
                          {institution.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pastor" className="text-foreground">
                    Pastor
                  </Label>
                  <Input id="pastor" placeholder="Enter pastor name" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Phone
                  </Label>
                  <Input id="phone" placeholder="Enter phone number" className="bg-background border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="church-email" className="text-foreground">
                  Contact Email
                </Label>
                <Input
                  id="church-email"
                  type="email"
                  placeholder="Enter contact email"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="church-address" className="text-foreground">
                  Address
                </Label>
                <Textarea
                  id="church-address"
                  placeholder="Enter church address"
                  className="bg-background border-border"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsChurchModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  {editingChurch ? "Update Church" : "Create Church"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
