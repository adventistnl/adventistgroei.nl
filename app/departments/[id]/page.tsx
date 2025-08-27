"use client"

import type React from "react"

import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Building,
  Church,
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  Clock,
  Building2,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DepartmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    annualBudget: "",
    leader: "",
    institution: "",
    church: "",
  })

  // Mock department data - in real app, fetch based on params.id
  const department = {
    id: params.id,
    name: "Youth Ministry",
    description: "Programs and activities for young people aged 12-25",
    institution: {
      name: "Central Seventh-day Adventist Church",
      denomination: "Seventh-day Adventist",
      country: "United States",
    },
    church: {
      name: "Downtown SDA Church",
      address: "123 Main Street, Downtown",
    },
    leader: {
      name: "Pastor John Smith",
      email: "john.smith@church.org",
      phone: "+1 (555) 123-4567",
      avatar: "/pastor-in-church.png",
    },
    annualBudget: 15000,
    budgetUsed: 8500,
    members: [
      {
        id: "1",
        name: "Sarah Johnson",
        role: "Assistant Leader",
        email: "sarah.j@email.com",
        joinDate: "2023-01-15",
        avatar: "/diverse-woman-portrait.png",
      },
      {
        id: "2",
        name: "Michael Brown",
        role: "Event Coordinator",
        email: "michael.b@email.com",
        joinDate: "2023-03-20",
        avatar: "/thoughtful-man.png",
      },
      {
        id: "3",
        name: "Emily Davis",
        role: "Music Director",
        email: "emily.d@email.com",
        joinDate: "2023-02-10",
        avatar: "/diverse-woman-portrait.png",
      },
      {
        id: "4",
        name: "David Wilson",
        role: "Volunteer",
        email: "david.w@email.com",
        joinDate: "2023-04-05",
        avatar: "/thoughtful-man.png",
      },
    ],
    objectives: [
      {
        id: "1",
        title: "Increase youth participation by 25%",
        status: "in-progress",
        deadline: "2024-12-31",
        progress: 65,
      },
      {
        id: "2",
        title: "Launch mentorship program",
        status: "completed",
        deadline: "2024-06-30",
        progress: 100,
      },
      {
        id: "3",
        title: "Organize quarterly youth retreats",
        status: "pending",
        deadline: "2024-09-30",
        progress: 20,
      },
    ],
    projects: [
      {
        id: "1",
        name: "Summer Camp 2024",
        status: "active",
        budget: 5000,
        spent: 2800,
        startDate: "2024-01-15",
        endDate: "2024-07-30",
      },
      {
        id: "2",
        name: "Youth Leadership Training",
        status: "planning",
        budget: 2000,
        spent: 500,
        startDate: "2024-03-01",
        endDate: "2024-05-31",
      },
      {
        id: "3",
        name: "Community Service Initiative",
        status: "completed",
        budget: 1500,
        spent: 1450,
        startDate: "2023-09-01",
        endDate: "2024-02-28",
      },
    ],
    announcements: [
      {
        id: "1",
        title: "Youth Camp Registration Open",
        content: "Registration for our annual summer camp is now open. Early bird pricing available until March 31st.",
        date: "2024-02-15",
        priority: "high",
      },
      {
        id: "2",
        title: "Monthly Youth Meeting",
        content: "Join us for our monthly planning meeting this Saturday at 2 PM in the youth room.",
        date: "2024-02-10",
        priority: "medium",
      },
      {
        id: "3",
        title: "Volunteer Appreciation Dinner",
        content: "Thank you to all our volunteers! Join us for a special appreciation dinner next Friday.",
        date: "2024-02-05",
        priority: "low",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
      case "planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle edit submission here
    console.log("[v0] Edit form submitted:", editForm)
    setIsEditModalOpen(false)
  }

  const openEditModal = () => {
    setEditForm({
      name: department.name,
      description: department.description,
      annualBudget: department.annualBudget.toString(),
      leader: department.leader.name,
      institution: department.institution.name,
      church: department.church.name,
    })
    setIsEditModalOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Unified Department Header */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Department Icon */}
                <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>

                {/* Department Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{department.name}</h1>
                    <Badge variant="secondary" className="bg-muted text-foreground">
                      {department.members.length} members
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{department.description}</p>

                  {/* Organization Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground">Institution: </span>
                        <span className="text-sm font-medium text-foreground">{department.institution.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Church className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground">Church: </span>
                        <span className="text-sm font-medium text-foreground">{department.church.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem className="text-foreground hover:bg-muted cursor-pointer" onClick={openEditModal}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Department
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Department
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">Edit Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-foreground">
                    Department Name *
                  </Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-background border-border text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget" className="text-foreground">
                    Annual Budget *
                  </Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={editForm.annualBudget}
                    onChange={(e) => setEditForm({ ...editForm, annualBudget: e.target.value })}
                    className="bg-background border-border text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="bg-background border-border text-foreground"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-institution" className="text-foreground">
                    Institution *
                  </Label>
                  <Select
                    value={editForm.institution}
                    onValueChange={(value) => setEditForm({ ...editForm, institution: value })}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Central Seventh-day Adventist Church">
                        Central Seventh-day Adventist Church
                      </SelectItem>
                      <SelectItem value="North Regional SDA Conference">North Regional SDA Conference</SelectItem>
                      <SelectItem value="South District SDA Union">South District SDA Union</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-church" className="text-foreground">
                    Church *
                  </Label>
                  <Select
                    value={editForm.church}
                    onValueChange={(value) => setEditForm({ ...editForm, church: value })}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select church" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Downtown SDA Church">Downtown SDA Church</SelectItem>
                      <SelectItem value="Riverside SDA Church">Riverside SDA Church</SelectItem>
                      <SelectItem value="Mountain View SDA Church">Mountain View SDA Church</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-leader" className="text-foreground">
                  Department Leader
                </Label>
                <Select value={editForm.leader} onValueChange={(value) => setEditForm({ ...editForm, leader: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select leader" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Pastor John Smith">Pastor John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted bg-transparent"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Leader */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Department Leader</h2>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={department.leader.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {department.leader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{department.leader.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{department.leader.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{department.leader.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Department Members</h2>
                <Badge variant="secondary" className="bg-muted text-foreground">
                  {department.members.length} members
                </Badge>
              </div>
              <div className="space-y-3">
                {department.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Annual Objectives</h2>
              <div className="space-y-4">
                {department.objectives.map((objective) => (
                  <div key={objective.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{objective.title}</h3>
                      <Badge className={getStatusColor(objective.status)}>
                        {objective.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {objective.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                        {objective.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(objective.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-background rounded-full h-2">
                          <div
                            className="bg-gray-900 h-2 rounded-full"
                            style={{ width: `${objective.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{objective.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Projects</h2>
              <div className="space-y-4">
                {department.projects.map((project) => (
                  <div key={project.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-foreground">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="text-foreground">
                          ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Timeline</p>
                        <p className="text-foreground">
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Budget & Announcements */}
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Budget Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Annual Budget</span>
                  <span className="font-medium text-foreground">${department.annualBudget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium text-foreground">${department.budgetUsed.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-foreground">
                    ${(department.annualBudget - department.budgetUsed).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gray-900 h-3 rounded-full"
                    style={{ width: `${(department.budgetUsed / department.annualBudget) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {Math.round((department.budgetUsed / department.annualBudget) * 100)}% used
                </p>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Announcements</h2>
              <div className="space-y-4">
                {department.announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground text-sm">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
