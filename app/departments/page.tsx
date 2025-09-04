"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Briefcase,
  DollarSign,
  Target,
  FolderOpen,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DepartmentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // Mock data for departments
  const [departments, setDepartments] = useState([
    {
      id: "1",
      name: "Youth Ministry",
      description: "Programs and activities for young people",
      annualBudget: 15000,
      objectives: ["Increase youth participation by 25%", "Launch mentorship program"],
      projects: ["Summer Camp 2024", "Youth Leadership Training"],
      memberCount: 45,
      activeProjects: 2,
      budgetUsed: 8500,
    },
    {
      id: "2",
      name: "Music Ministry",
      description: "Worship music and choir coordination",
      annualBudget: 12000,
      objectives: ["Form new worship team", "Purchase new sound equipment"],
      projects: ["Christmas Concert", "New Hymnal Project"],
      memberCount: 28,
      activeProjects: 2,
      budgetUsed: 6200,
    },
    {
      id: "3",
      name: "Community Outreach",
      description: "Local community service and evangelism",
      annualBudget: 20000,
      objectives: ["Serve 500 families", "Open new food pantry location"],
      projects: ["Food Distribution Program", "Health Fair 2024"],
      memberCount: 32,
      activeProjects: 3,
      budgetUsed: 12800,
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    annualBudget: "",
    objectives: "",
    projects: "",
  })

  const handleCreateDepartment = () => {
    const newDepartment = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      annualBudget: Number.parseFloat(formData.annualBudget) || 0,
      objectives: formData.objectives.split("\n").filter((obj) => obj.trim()),
      projects: formData.projects.split("\n").filter((proj) => proj.trim()),
      memberCount: 0,
      activeProjects: 0,
      budgetUsed: 0,
    }
    setDepartments([...departments, newDepartment])
    setFormData({ name: "", description: "", annualBudget: "", objectives: "", projects: "" })
    setIsCreateModalOpen(false)
  }

  const handleEditDepartment = () => {
    const updatedDepartments = departments.map((dept) =>
      dept.id === selectedDepartment.id
        ? {
          ...dept,
          name: formData.name,
          description: formData.description,
          annualBudget: Number.parseFloat(formData.annualBudget) || 0,
          objectives: formData.objectives.split("\n").filter((obj) => obj.trim()),
          projects: formData.projects.split("\n").filter((proj) => proj.trim()),
        }
        : dept,
    )
    setDepartments(updatedDepartments)
    setIsEditModalOpen(false)
    setSelectedDepartment(null)
  }

  const openEditModal = (department: any) => {
    setSelectedDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      annualBudget: department.annualBudget.toString(),
      objectives: department.objectives.join("\n"),
      projects: department.projects.join("\n"),
    })
    setIsEditModalOpen(true)
  }

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter((dept) => dept.id !== id))
  }

  const viewDepartment = (id: string) => {
    router.push(`/departments/${id}`)
  }

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">


        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Department Management</h2>
            <p className="text-muted-foreground">Manage church departments, budgets, and objectives</p>
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-card border-border"
                />
              </div>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl">Create New Department</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Set up a new department with budget and objectives
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        Department Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background border-border"
                        placeholder="e.g., Youth Ministry"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-foreground">
                        Annual Budget *
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.annualBudget}
                        onChange={(e) => setFormData({ ...formData, annualBudget: e.target.value })}
                        className="bg-background border-border"
                        placeholder="15000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-background border-border"
                      placeholder="Brief description of the department's purpose"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives" className="text-foreground">
                      Annual Objectives (Optional)
                    </Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      className="bg-background border-border"
                      placeholder="Enter each objective on a new line"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projects" className="text-foreground">
                      Projects (Optional)
                    </Label>
                    <Textarea
                      id="projects"
                      value={formData.projects}
                      onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                      className="bg-background border-border"
                      placeholder="Enter each project on a new line"
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDepartment} className="bg-gray-900 hover:bg-gray-800 text-white">
                    Create Department
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((department) => (
              <div key={department.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{department.name}</h3>
                      <p className="text-sm text-muted-foreground">{department.memberCount} members</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem
                        onClick={() => viewDepartment(department.id)}
                        className="text-foreground hover:bg-muted"
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        View Department
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openEditModal(department)}
                        className="text-foreground hover:bg-muted"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteDepartment(department.id)}
                        className="text-red-600 hover:bg-muted"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-muted-foreground text-sm mb-4">{department.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Budget</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        ${department.budgetUsed.toLocaleString()} / ${department.annualBudget.toLocaleString()}
                      </p>
                      <div className="w-20 bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-gray-900 h-2 rounded-full"
                          style={{ width: `${Math.min((department.budgetUsed / department.annualBudget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {department.objectives.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm text-muted-foreground">Objectives</span>
                        <p className="text-sm text-foreground">{department.objectives.length} active</p>
                      </div>
                    </div>
                  )}

                  {department.projects.length > 0 && (
                    <div className="flex items-start gap-2">
                      <FolderOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm text-muted-foreground">Projects</span>
                        <p className="text-sm text-foreground">{department.activeProjects} active</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground text-xl">Edit Department</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Update department information and settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-foreground">
                      Department Name *
                    </Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-budget" className="text-foreground">
                      Annual Budget *
                    </Label>
                    <Input
                      id="edit-budget"
                      type="number"
                      value={formData.annualBudget}
                      onChange={(e) => setFormData({ ...formData, annualBudget: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background border-border"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-objectives" className="text-foreground">
                    Annual Objectives
                  </Label>
                  <Textarea
                    id="edit-objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    className="bg-background border-border"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-projects" className="text-foreground">
                    Projects
                  </Label>
                  <Textarea
                    id="edit-projects"
                    value={formData.projects}
                    onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                    className="bg-background border-border"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleEditDepartment} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  )
}
