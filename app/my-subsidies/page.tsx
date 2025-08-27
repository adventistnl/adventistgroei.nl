"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/layouts/app-layout"
import { Search, Filter, Eye, Edit, Trash2, Plus, Calendar, DollarSign, Building, MapPin } from "lucide-react"

export default function MySubsidiesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const myRequests = [
    {
      id: "REQ-001",
      description: "Youth Ministry Outreach Program",
      institution: "North American Division",
      church: "Adventist Community Church",
      totalBudget: 5000,
      status: "approved",
      requestDate: "2024-01-15",
      activities: 3,
    },
    {
      id: "REQ-002",
      description: "Community Health Fair",
      institution: "Inter-American Division",
      church: "Central SDA Church",
      totalBudget: 3500,
      status: "pending",
      requestDate: "2024-01-20",
      activities: 2,
    },
    {
      id: "REQ-003",
      description: "Evangelism Campaign",
      institution: "South American Division",
      church: "Metropolitan SDA Church",
      totalBudget: 7500,
      status: "under_review",
      requestDate: "2024-01-25",
      activities: 5,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "pending":
        return "Pending"
      case "under_review":
        return "Under Review"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Subsidy Requests</h1>
              <p className="text-muted-foreground">
                Track and manage your personal subsidy requests and their approval status.
              </p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button variant="outline" className="border-border bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{request.description}</h3>
                      <p className="text-sm text-muted-foreground">ID: {request.id}</p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span>{request.institution}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{request.church}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">${request.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">{request.activities} activities</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {myRequests.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No subsidy requests yet</h3>
                <p className="text-muted-foreground mb-4">Create your first subsidy request to get started.</p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
