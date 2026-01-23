"use client"

import React, { useState } from "react"
import { useLazyQuery } from "@apollo/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Home, Map, AlertCircle, Loader2 } from "lucide-react"
import { GET_ZIP_INFO } from "@/graphql/queries/get-zip-info"

export interface ZipCodeInputProps {
  zipValue: string
  onZipChange: (value: string) => void
  cityValue: string
  onCityChange: (value: string) => void
  provinceValue: string
  onProvinceChange: (value: string) => void
  houseNumber?: number
  isLoading?: boolean
  zipError?: string
  onValidationError?: (error: string) => void
  required?: boolean
}

export function ZipCodeInput({
  zipValue,
  onZipChange,
  cityValue,
  onCityChange,
  provinceValue,
  onProvinceChange,
  houseNumber = 1,
  isLoading = false,
  zipError,
  onValidationError,
  required = true,
}: ZipCodeInputProps) {
  const [localError, setLocalError] = useState<string>("")
  const [isFetching, setIsFetching] = useState(false)

  // Regex para validar formato ZIP code holandês: 1234AB ou 1234 AB
  const ZIP_REGEX = /^[0-9]{4}\s?[A-Za-z]{2}$/

  const [fetchZipInfo] = useLazyQuery(GET_ZIP_INFO, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setIsFetching(false)
      if (data?.getZipInfo) {
        const { city, province } = data.getZipInfo
        onCityChange(city)
        onProvinceChange(province)
        setLocalError("")
        if (onValidationError) {
          onValidationError("")
        }
      }
    },
    onError: (error) => {
      setIsFetching(false)
      const errorMessage = error.message || "Failed to fetch ZIP code information"
      
      // Parse error type
      let displayMessage = "ZIP code not found"
      if (errorMessage.includes("Invalid ZIP code format")) {
        displayMessage = "Invalid ZIP code format (expected: 1234AB)"
      } else if (errorMessage.includes("not found")) {
        displayMessage = "ZIP code not found in database"
      }
      
      setLocalError(displayMessage)
      if (onValidationError) {
        onValidationError(displayMessage)
      }
      
      // Clear city and province on error
      onCityChange("")
      onProvinceChange("")
    },
  })

  const validateAndFetchZipInfo = async (zip: string) => {
    const trimmedZip = zip.trim().toUpperCase()
    
    // Clear previous errors
    setLocalError("")
    if (onValidationError) {
      onValidationError("")
    }

    // Skip if empty
    if (!trimmedZip) {
      onCityChange("")
      onProvinceChange("")
      return
    }

    // Validate format
    if (!ZIP_REGEX.test(trimmedZip)) {
      const errorMsg = "Invalid ZIP code format (expected: 1234AB)"
      setLocalError(errorMsg)
      if (onValidationError) {
        onValidationError(errorMsg)
      }
      onCityChange("")
      onProvinceChange("")
      return
    }

    // Remove space if exists for API call
    const cleanZip = trimmedZip.replace(/\s/g, '')

    // Fetch ZIP info from API
    setIsFetching(true)
    try {
      await fetchZipInfo({
        variables: {
          zip: cleanZip,
          houseNumber: houseNumber,
        },
      })
    } catch (err) {
      // Error handled in onError callback
      setIsFetching(false)
    }
  }

  const handleZipBlur = () => {
    validateAndFetchZipInfo(zipValue)
  }

  const handleZipChange = (value: string) => {
    // Auto-format: add space after 4 digits if user types 6 characters without space
    let formattedValue = value.toUpperCase()
    
    // Remove existing spaces for processing
    const noSpaces = formattedValue.replace(/\s/g, '')
    
    // Add space after 4 digits if we have more than 4 characters
    if (noSpaces.length > 4) {
      formattedValue = noSpaces.slice(0, 4) + ' ' + noSpaces.slice(4, 6)
    } else {
      formattedValue = noSpaces
    }

    onZipChange(formattedValue)
  }

  const displayError = zipError || localError
  const isFieldLoading = isLoading || isFetching

  return (
    <div className="space-y-4">
      {/* ZIP Code Input */}
      <div className="space-y-2">
        <Label htmlFor="zip_code" className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          ZIP Code {required && "*"}
        </Label>
        <div className="relative">
          <Input
            id="zip_code"
            value={zipValue}
            onChange={(e) => handleZipChange(e.target.value)}
            onBlur={handleZipBlur}
            placeholder="e.g., 1012 AB"
            disabled={isFieldLoading}
            className={`h-10 ${displayError ? 'border-red-500' : ''}`}
            maxLength={7}
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {displayError && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span>{displayError}</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Enter ZIP code and house number to auto-fill city and province
        </p>
      </div>

      {/* City Input - Disabled (auto-filled) */}
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2 text-sm">
          <Home className="w-4 h-4 text-muted-foreground" />
          City {required && "*"}
        </Label>
        <Input
          id="city"
          value={cityValue}
          disabled
          placeholder="Auto-filled from ZIP code"
          className="h-10 bg-muted/50"
        />
      </div>

      {/* Province Input - Disabled (auto-filled) */}
      <div className="space-y-2">
        <Label htmlFor="province" className="flex items-center gap-2 text-sm">
          <Map className="w-4 h-4 text-muted-foreground" />
          Province {required && "*"}
        </Label>
        <Input
          id="province"
          value={provinceValue}
          disabled
          placeholder="Auto-filled from ZIP code"
          className="h-10 bg-muted/50"
        />
      </div>
    </div>
  )
}
