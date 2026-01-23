"use client"

import React, { useState } from "react"
import { useLazyQuery } from "@apollo/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ZipCodeInput } from "@/components/shared/zip-code-input"
import { GET_ZIP_INFO } from "@/graphql/queries/get-zip-info"
import { MapPin, Search, CheckCircle, XCircle, Loader2, Code } from "lucide-react"

export default function ZipTestPage() {
  // Component test
  const [zipValue, setZipValue] = useState("")
  const [cityValue, setCityValue] = useState("")
  const [provinceValue, setProvinceValue] = useState("")

  // Manual test
  const [manualZip, setManualZip] = useState("")
  const [manualHouseNumber, setManualHouseNumber] = useState("1")
  const [testResult, setTestResult] = useState<any>(null)
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  const [fetchZipInfo, { loading }] = useLazyQuery(GET_ZIP_INFO, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setTestResult({
        success: true,
        data: data.getZipInfo,
        timestamp: new Date().toISOString()
      })
      setIsSuccess(true)
    },
    onError: (error) => {
      setTestResult({
        success: false,
        error: {
          message: error.message,
          extensions: error.graphQLErrors[0]?.extensions || {}
        },
        timestamp: new Date().toISOString()
      })
      setIsSuccess(false)
    },
  })

  const handleManualTest = () => {
    if (!manualZip.trim()) return
    
    setTestResult(null)
    setIsSuccess(null)
    
    const cleanZip = manualZip.replace(/\s/g, '').toUpperCase()
    fetchZipInfo({
      variables: {
        zip: cleanZip,
        houseNumber: parseInt(manualHouseNumber) || 1,
      },
    })
  }

  // Preset test cases
  const presetTests = [
    { zip: "6545CA", houseNumber: 29, label: "Nijmegen", expected: "Gelderland" },
    { zip: "1012JS", houseNumber: 1, label: "Amsterdam", expected: "Noord-Holland" },
    { zip: "3011AD", houseNumber: 100, label: "Rotterdam", expected: "Zuid-Holland" },
    { zip: "3511LX", houseNumber: 5, label: "Utrecht", expected: "Utrecht" },
    { zip: "9999ZZ", houseNumber: 1, label: "Invalid ZIP", expected: "Error" },
  ]

  const runPresetTest = (zip: string, houseNumber: number) => {
    setManualZip(zip)
    setManualHouseNumber(houseNumber.toString())
    
    setTestResult(null)
    setIsSuccess(null)
    
    fetchZipInfo({
      variables: { zip, houseNumber },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ZIP Code API Test
          </h1>
          <p className="text-muted-foreground">
            Test the Dutch ZIP code validation and lookup system
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Component Test */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                ZipCodeInput Component Test
              </CardTitle>
              <CardDescription>
                Test the reusable ZipCodeInput component with auto-fill functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ZipCodeInput
                zipValue={zipValue}
                onZipChange={setZipValue}
                cityValue={cityValue}
                onCityChange={setCityValue}
                provinceValue={provinceValue}
                onProvinceChange={setProvinceValue}
                houseNumber={1}
                required
              />

              {/* Component State Display */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Current State:</p>
                <div className="font-mono text-sm space-y-1">
                  <p>ZIP: <span className="text-primary">{zipValue || '(empty)'}</span></p>
                  <p>City: <span className="text-primary">{cityValue || '(empty)'}</span></p>
                  <p>Province: <span className="text-primary">{provinceValue || '(empty)'}</span></p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setZipValue("")
                  setCityValue("")
                  setProvinceValue("")
                }}
              >
                Clear Form
              </Button>
            </CardContent>
          </Card>

          {/* Manual GraphQL Test */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Manual GraphQL Query Test
              </CardTitle>
              <CardDescription>
                Test the API directly with custom ZIP codes and house numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-zip">ZIP Code</Label>
                <Input
                  id="manual-zip"
                  value={manualZip}
                  onChange={(e) => setManualZip(e.target.value.toUpperCase())}
                  placeholder="e.g., 1012AB"
                  maxLength={7}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="house-number">House Number</Label>
                <Input
                  id="house-number"
                  type="number"
                  value={manualHouseNumber}
                  onChange={(e) => setManualHouseNumber(e.target.value)}
                  placeholder="1"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleManualTest}
                disabled={loading || !manualZip.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Test Query
                  </>
                )}
              </Button>

              {/* Test Result */}
              {testResult && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(testResult.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Code className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground">Response:</span>
                    </div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preset Test Cases */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Preset Test Cases
            </CardTitle>
            <CardDescription>
              Quick test with known ZIP codes from different provinces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {presetTests.map((test, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col items-start p-4 space-y-1"
                  onClick={() => runPresetTest(test.zip, test.houseNumber)}
                  disabled={loading}
                >
                  <span className="font-semibold text-sm">{test.label}</span>
                  <span className="text-xs text-muted-foreground">{test.zip}</span>
                  <span className="text-xs text-muted-foreground">#{test.houseNumber}</span>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {test.expected}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              API Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">GraphQL Query</h3>
              <pre className="p-4 bg-muted/50 rounded-lg text-xs font-mono overflow-x-auto">
{`query GetZipInfo($zip: String!, $houseNumber: Int!) {
  getZipInfo(zip: $zip, houseNumber: $houseNumber) {
    city
    province
  }
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">ZIP Code Format</h3>
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm">Dutch ZIP code format: <code className="text-primary font-mono">1234AB</code> or <code className="text-primary font-mono">1234 AB</code></p>
                <p className="text-xs text-muted-foreground">Regex: <code className="font-mono">/^[0-9]{'{4}'}\s?[A-Za-z]{'{2}'}$/</code></p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Success Response</h3>
              <pre className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "data": {
    "getZipInfo": {
      "city": "Nijmegen",
      "province": "Gelderland"
    }
  }
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Error Response</h3>
              <pre className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "errors": [{
    "message": "ZIP code 9999ZZ not found",
    "extensions": {
      "code": "NOT_FOUND",
      "statusCode": 404
    }
  }]
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
