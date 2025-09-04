import { AppLayout } from "./app-layout"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AppLayout>{children}</AppLayout>
}

export default DashboardLayout
