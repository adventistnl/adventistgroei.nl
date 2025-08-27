"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      // setEmail(emailParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      // Show success and redirect to login
      alert("Password reset successfully!")
      router.push("/login")
    }, 1500)
  }

  const passwordsMatch = password === confirmPassword && password.length > 0
  const passwordValid = password.length >= 8

  return (
    <div className="min-h-screen flex">
      {/* Left side - Reset Form */}
      <div className="w-full md:w-5/6 flex items-center justify-center bg-background px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Set New Password</h1>
            <p className="text-sm text-muted-foreground">Create a new password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-0 border-b border-muted-foreground bg-transparent rounded-none px-0 pb-2 pr-10 focus:border-foreground focus:ring-0"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {passwordValid && <CheckCircle className="absolute right-8 top-0 h-full w-4 h-4 text-green-500" />}
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-0 border-b border-muted-foreground bg-transparent rounded-none px-0 pb-2 pr-10 focus:border-foreground focus:ring-0"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {passwordsMatch && <CheckCircle className="absolute right-8 top-0 h-full w-4 h-4 text-green-500" />}
              </div>
            </div>

            {/* Reset Button */}
            <Button
              type="submit"
              disabled={isLoading || !passwordValid || !passwordsMatch}
              className="w-full bg-[#1e3a5f] hover:bg-[#152d47] text-white py-3 rounded-md font-medium"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
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
