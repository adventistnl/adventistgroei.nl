"use client"

import React from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Lock } from "lucide-react"

export default function AccessManagementPageSimple() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Access Management
            </h2>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions
            </p>
          </div>
        </div>

        {/* Simple KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                Active system users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                System roles configured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-xs text-muted-foreground">
                Granular permissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Simple Content */}
        <Card>
          <CardHeader>
            <CardTitle>Access Management</CardTitle>
            <CardDescription>
              This is a simplified version of the access management page for testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Roles
                </Button>
                <Button variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  View Permissions
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✅ Page loads successfully
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ Components render correctly
                </p>
                <p className="text-sm text-muted-foreground">
                  ✅ No 404 errors on this simplified version
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
