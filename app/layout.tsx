import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { GraphQLProvider } from "@/lib/apollo/graphql-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { PageProvider } from "@/contexts/page-context"
import { InstitutionProvider } from "@/contexts/institution-context"
import { NavigationLoadingProvider } from "@/contexts/navigation-loading-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { I18nProvider } from "@/lib/i18n/i18n-provider"
import { PrivacyProviderWithAuth } from "@/components/shared/privacy-provider-with-auth"
import { DynamicFavicon } from "@/components/shared/dynamic-favicon"
import { ToastProvider } from "@/components/ui/toast-provider"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "CGMS",
  description: "Comprehensive church management platform for Seventh-day Adventist churches",
  generator: "v1.app",
  // Favicons serão gerenciados dinamicamente pelo componente DynamicFavicon
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full`} suppressHydrationWarning>
      <body className="antialiased font-sans h-full overflow-hidden">
        <DynamicFavicon />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <GraphQLProvider>
              <AuthProvider>
                <PrivacyProviderWithAuth>
                  <InstitutionProvider>
                    <CurrencyProvider>
                      <PageProvider>
                        <NavigationLoadingProvider>
                          {children}
                          <ToastProvider />
                        </NavigationLoadingProvider>
                      </PageProvider>
                    </CurrencyProvider>
                  </InstitutionProvider>
                </PrivacyProviderWithAuth>
              </AuthProvider>
            </GraphQLProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
