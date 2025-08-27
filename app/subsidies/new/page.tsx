import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import { AppLayout } from "@/components/layouts/app-layout"
import Link from "next/link"

export default function NewSubsidyRequestPage() {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/subsidies">
              <Button variant="outline" size="sm" className="border-[#e1e2e2] bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subsidies
              </Button>
            </Link>
          </div>
          <h2 className="text-2xl font-semibold text-[#000000] mb-2">New Subsidy Request</h2>
          <p className="text-[#717182]">Submit a new evangelism subsidy request with detailed budget breakdown</p>
        </div>

        <div className="max-w-4xl">
          <Card className="bg-[#ffffff] border-[#e1e2e2]">
            <CardHeader>
              <CardTitle className="text-[#000000]">Project Information</CardTitle>
              <CardDescription className="text-[#717182]">
                Provide detailed information about your evangelism project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectTitle" className="text-[#000000]">
                    Project Title *
                  </Label>
                  <Input
                    id="projectTitle"
                    placeholder="Enter project title"
                    className="bg-[#ffffff] border-[#e1e2e2]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-[#000000]">
                    Project Type *
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-[#ffffff] border-[#e1e2e2]">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#ffffff] border-[#e1e2e2]">
                      <SelectItem value="evangelism">Evangelism Campaign</SelectItem>
                      <SelectItem value="mission">Mission Trip</SelectItem>
                      <SelectItem value="community">Community Outreach</SelectItem>
                      <SelectItem value="training">Training Program</SelectItem>
                      <SelectItem value="materials">Educational Materials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#000000]">
                  Project Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your project, its objectives, and expected outcomes"
                  className="bg-[#ffffff] border-[#e1e2e2] min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-[#000000]">
                    Start Date *
                  </Label>
                  <Input type="date" id="startDate" className="bg-[#ffffff] border-[#e1e2e2]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-[#000000]">
                    End Date *
                  </Label>
                  <Input type="date" id="endDate" className="bg-[#ffffff] border-[#e1e2e2]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[#000000]">
                    Location *
                  </Label>
                  <Input id="location" placeholder="Project location" className="bg-[#ffffff] border-[#e1e2e2]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ffffff] border-[#e1e2e2] mt-6">
            <CardHeader>
              <CardTitle className="text-[#000000]">Budget Breakdown</CardTitle>
              <CardDescription className="text-[#717182]">
                Provide detailed budget for each activity in your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Activity 1 */}
                <div className="border border-[#e1e2e2] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-[#000000]">Activity 1</h4>
                    <Button variant="ghost" size="sm" className="text-[#ff7c7c] hover:bg-[#fafafa]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#000000]">Activity Name *</Label>
                      <Input placeholder="e.g., Promotional Materials" className="bg-[#ffffff] border-[#e1e2e2]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#000000]">Budget Amount *</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-[#ffffff] border-[#e1e2e2]"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label className="text-[#000000]">Activity Description</Label>
                    <Textarea
                      placeholder="Describe this activity and justify the budget request"
                      className="bg-[#ffffff] border-[#e1e2e2]"
                    />
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="border border-[#e1e2e2] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-[#000000]">Activity 2</h4>
                    <Button variant="ghost" size="sm" className="text-[#ff7c7c] hover:bg-[#fafafa]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#000000]">Activity Name *</Label>
                      <Input placeholder="e.g., Venue Rental" className="bg-[#ffffff] border-[#e1e2e2]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#000000]">Budget Amount *</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-[#ffffff] border-[#e1e2e2]"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label className="text-[#000000]">Activity Description</Label>
                    <Textarea
                      placeholder="Describe this activity and justify the budget request"
                      className="bg-[#ffffff] border-[#e1e2e2]"
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-[#e1e2e2] text-[#000000] hover:bg-[#fafafa] bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Activity
              </Button>

              <Separator className="bg-[#e1e2e2]" />

              <div className="bg-[#fafafa] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-[#000000]">Total Requested Amount:</span>
                  <span className="text-2xl font-bold text-[#2b7fff]">$0.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ffffff] border-[#e1e2e2] mt-6">
            <CardHeader>
              <CardTitle className="text-[#000000]">Additional Information</CardTitle>
              <CardDescription className="text-[#717182]">
                Provide any additional context or requirements for your request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expectedOutcomes" className="text-[#000000]">
                  Expected Outcomes
                </Label>
                <Textarea
                  id="expectedOutcomes"
                  placeholder="Describe the expected outcomes and impact of this project"
                  className="bg-[#ffffff] border-[#e1e2e2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-[#000000]">
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="Who will benefit from this project?"
                  className="bg-[#ffffff] border-[#e1e2e2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="estimatedParticipants" className="text-[#000000]">
                    Estimated Participants
                  </Label>
                  <Input
                    id="estimatedParticipants"
                    type="number"
                    placeholder="Number of expected participants"
                    className="bg-[#ffffff] border-[#e1e2e2]"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency" className="text-[#000000]">
                    Urgency Level
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-[#ffffff] border-[#e1e2e2]">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#ffffff] border-[#e1e2e2]">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-8">
            <Link href="/subsidies">
              <Button variant="outline" className="border-[#e1e2e2] text-[#000000] hover:bg-[#fafafa] bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button className="bg-[#2b7fff] hover:bg-[#1e5fd9] text-white">
              <Save className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
