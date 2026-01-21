/**
 * Example usage of the refactored AddRegionModal
 * 
 * This modal follows the same pattern as RegisterInstitutionModal:
 * - Uses children as trigger element
 * - 3-step wizard with progress bar  
 * - Simplified contact information (only essentials)
 * - No parent region or annual budget selection
 * - Institution ID passed as prop
 */

"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddRegionModal, type AddRegionFormData } from "@/components/modals/region"
import { MapPin, Plus } from "lucide-react"
import toast from "react-hot-toast"

export function RegionModalExample() {
  // In a real app, you'd get this from context or props
  const institutionId = "institution-123"

  const handleRegionSuccess = (data: AddRegionFormData) => {
    // Show success feedback
    toast.success(`Region "${data.name}" created successfully!`)
    
    // Refetch regions list, update cache, etc.
    // refetchRegions()
    // router.refresh()
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Refactored Add Region Modal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Key Changes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Follows RegisterInstitutionModal pattern exactly</li>
              <li>Uses children as trigger element (no isOpen/onOpenChange props)</li>
              <li>3-step wizard: Basic Info → Contact → Additional Details</li>
              <li>Removed region preview card and complex contact form</li>
              <li>Only essential contact fields: email (required), phone, website</li>
              <li>Country selection with searchable dropdown</li>
              <li>No parent region selection (as requested)</li>
              <li>No annual budget association</li>
              <li>Institution ID passed as prop</li>
              <li>Green color theme for regions</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Try the Modal:</h4>
            
            {/* Example 1: Primary button trigger */}
            <div className="flex flex-wrap gap-2">
              <AddRegionModal
                institutionId={institutionId}
                onSuccess={handleRegionSuccess}
              >
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Region
                </Button>
              </AddRegionModal>

              {/* Example 2: Outline button trigger */}
              <AddRegionModal
                institutionId={institutionId}
                onSuccess={handleRegionSuccess}
              >
                <Button variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Create Region
                </Button>
              </AddRegionModal>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>Note:</strong> This modal creates regions with basic information only. 
            Parent region assignment and annual budget linking would be handled separately 
            through dedicated management interfaces.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Form Data Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`interface AddRegionFormData {
  name: string           // Required - Region name
  description?: string   // Optional - Region description  
  email: string         // Required - Contact email
  phone?: string        // Optional - Contact phone
  website?: string      // Optional - Contact website
  country: string       // Required - Country code
}

// Usage:
<AddRegionModal
  institutionId="institution-123"
  onSuccess={(data: AddRegionFormData) => {
    console.log('Region created:', data)
  }}
>
  <Button>Add Region</Button>
</AddRegionModal>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Integration with existing pages:
 * 
 * 1. Institution Profile Header:
 *    - Add region management to dropdown actions
 *    - Use AddRegionModal as trigger wrapper
 * 
 * 2. Regions List Page:
 *    - Add region button in toolbar
 *    - Pass current institution ID from context
 * 
 * 3. Dashboard Cards:
 *    - Quick add region action
 *    - Integrate with KPI updates
 */