"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to verification step with email
      router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
    }, 1500)
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Reset Form */}
      <div className="w-full md:w-5/6 flex items-center justify-center bg-background px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a verification code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 border-b border-muted-foreground bg-transparent rounded-none px-0 pb-2 focus:border-foreground focus:ring-0"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a5f] hover:bg-[#152d47] text-white py-3 rounded-md font-medium"
            >
              {isLoading ? "Sending Code..." : "Send Verification Code"}
            </Button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
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
