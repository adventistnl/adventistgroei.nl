"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useMemo } from "react"
import { usePageTitle } from "@/hooks/use-page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Calendar, DollarSign, UserCheck, MessageSquare, FileText, Building, ChevronRight } from "lucide-react"

export default function DashboardPage() {
  const breadcrumbs = useMemo(() => [
    { name: "Dashboard" }
  ], []);
  usePageTitle({
    title: "Dashboard",
    breadcrumbs
  })

  const stats = [
    {
      title: "Total Members",
      value: "2,847",
      change: "+12% from last month",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Volunteers",
      value: "347",
      change: "+3% from last month",
      icon: UserCheck,
      color: "bg-green-500"
    },
    {
      title: "Monthly Events",
      value: "28",
      change: "+8% from last month",
      icon: Calendar,
      color: "bg-purple-500"
    },
    {
      title: "Subsidies Approved",
      value: "$24,847",
      change: "+15% from last month",
      icon: DollarSign,
      color: "bg-orange-500"
    }
  ]

  const recentActivities = [
    { type: "member", action: "New member registered", name: "Maria Silva", time: "2 hours ago" },
    { type: "event", action: "Event created", name: "Sunday Service", time: "4 hours ago" },
    { type: "subsidy", action: "Subsidy approved", name: "Youth Program", time: "6 hours ago" },
    { type: "volunteer", action: "Volunteer enrolled", name: "João Santos", time: "8 hours ago" },
  ]

  const quickActions = [
    { title: "Add New Member", icon: Users, href: "/members", color: "bg-blue-500" },
    { title: "Create Event", icon: Calendar, href: "/events", color: "bg-purple-500" },
    { title: "Request Subsidy", icon: DollarSign, href: "/subsidies/new", color: "bg-orange-500" },
    { title: "Send Communication", icon: MessageSquare, href: "/communications", color: "bg-green-500" },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your church today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-md ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activities */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from your church management system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${activity.type === 'member' ? 'bg-blue-100' :
                        activity.type === 'event' ? 'bg-purple-100' :
                          activity.type === 'subsidy' ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                      {activity.type === 'member' && <Users className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'event' && <Calendar className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'subsidy' && <DollarSign className="h-4 w-4 text-orange-600" />}
                      {activity.type === 'volunteer' && <UserCheck className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.name}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{activity.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-12"
                      asChild
                    >
                      <a href={action.href}>
                        <div className={`p-2 rounded-md ${action.color} mr-3`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {action.title}
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </a>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Institutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Active institutions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-sm text-muted-foreground">Generated this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+18%</div>
              <p className="text-sm text-muted-foreground">Member growth this year</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}