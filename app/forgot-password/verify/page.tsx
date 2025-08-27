"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyCodePage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate code verification
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to reset password step
      router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&code=${code}`)
    }, 1000)
  }

  const handleBackToEmail = () => {
    router.push("/forgot-password")
  }

  const handleResendCode = () => {
    // Simulate resending code
    alert("Verification code resent to your email")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Verification Form */}
      <div className="w-full md:w-5/6 flex items-center justify-center bg-background px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Verify Code</h1>
            <p className="text-sm text-muted-foreground">Enter the 6-digit verification code sent to</p>
            <p className="text-sm font-medium text-foreground">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Verification Code Field */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm text-muted-foreground">
                Verification Code
              </Label>
              <div className="relative">
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="border-0 border-b border-muted-foreground bg-transparent rounded-none px-0 pb-2 focus:border-foreground focus:ring-0 text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Didn't receive the code? Resend
              </button>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-[#1e3a5f] hover:bg-[#152d47] text-white py-3 rounded-md font-medium"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full flex items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Email</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Dark Panel */}
      <div className="w-1/6 bg-black flex items-center justify-center">
        <div className="text-center">{/* Empty for now */}</div>
      </div>
    </div>
  )
}
