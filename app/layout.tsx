import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { GraphQLProvider } from "@/lib/apollo/graphql-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { PageProvider } from "@/contexts/page-context"
import { InstitutionProvider } from "@/contexts/institution-context"
import { NavigationLoadingProvider } from "@/contexts/navigation-loading-context"
import { I18nProvider } from "@/lib/i18n/i18n-provider"
import { PrivacyProviderWithAuth } from "@/components/shared/privacy-provider-with-auth"
import { PrivacyDebugPanel } from "@/components/shared/privacy-debug-panel"
import { PrivacyButtonDebugPanel } from "@/components/shared/privacy-button-debug"
import { ToastProvider } from "@/components/ui/toast-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "SDA Church Management System",
  description: "Comprehensive church management platform for Seventh-day Adventist churches",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
      <body className="antialiased font-sans h-full overflow-hidden">
        <I18nProvider>
          <GraphQLProvider>
            <AuthProvider>
              <PrivacyProviderWithAuth>
                <InstitutionProvider>
                  <PageProvider>
                    <NavigationLoadingProvider>
                      {children}
                      <ToastProvider />
                      <PrivacyDebugPanel />
                      <PrivacyButtonDebugPanel />
                    </NavigationLoadingProvider>
                  </PageProvider>
                </InstitutionProvider>
              </PrivacyProviderWithAuth>
            </AuthProvider>
          </GraphQLProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
