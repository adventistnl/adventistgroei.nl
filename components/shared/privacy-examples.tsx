/**
 * Privacy System Usage Examples
 * 
 * This file contains practical examples of how to use the Privacy System
 * in different scenarios throughout the application.
 */

import React from 'react'
import { PrivacyWrapper, InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'
import { useComponentPrivacy } from '@/contexts/privacy-context'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/* ============================================
   EXAMPLE 1: Simple Inline Toggle
   ============================================
   Use case: Add privacy toggle to existing component header
   Complexity: ⭐ (Easiest)
*/

export function Example1_SimpleInlineToggle() {
  const PRIVACY_CONFIG = {
    id: 'simple-budget-card',
    level: 'internal' as const,
    allowedRoles: ['admin', 'finance_manager', 'user'],
  }

  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Monthly Budget</CardTitle>
          {/* Just add this one line! */}
          <InlinePrivacyToggle config={PRIVACY_CONFIG} />
        </div>
      </CardHeader>
      
      <CardContent>
        {isHidden ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="text-2xl font-bold">$125,000</div>
        )}
      </CardContent>
    </Card>
  )
}

/* ============================================
   EXAMPLE 2: Full PrivacyWrapper
   ============================================
   Use case: Wrap entire component with privacy functionality
   Complexity: ⭐⭐ (Easy)
*/

export function Example2_FullWrapper() {
  return (
    <PrivacyWrapper
      config={{
        id: 'full-budget-overview',
        level: 'confidential',
        allowedRoles: ['admin', 'finance_manager'],
        blurIntensity: 'high',
        persistent: true, // Remember state in localStorage
      }}
      showToggle={true}
      togglePosition="top-right"
      hiddenMessage="Financial data hidden"
    >
      {/* Your sensitive content here */}
      <div className="p-6">
        <h2 className="text-2xl font-bold">Annual Budget Overview</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>Total: $1,500,000</div>
          <div>Spent: $877,500</div>
          <div>Remaining: $622,500</div>
        </div>
      </div>
    </PrivacyWrapper>
  )
}

/* ============================================
   EXAMPLE 3: Custom Skeleton
   ============================================
   Use case: Match skeleton to actual content layout
   Complexity: ⭐⭐ (Easy)
*/

export function Example3_CustomSkeleton() {
  const customSkeleton = (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" /> {/* Title */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" /> {/* Card 1 */}
        <Skeleton className="h-24 w-full" /> {/* Card 2 */}
        <Skeleton className="h-24 w-full" /> {/* Card 3 */}
      </div>
      <Skeleton className="h-64 w-full" /> {/* Chart */}
    </div>
  )

  return (
    <PrivacyWrapper
      config={{
        id: 'dashboard-with-custom-skeleton',
        level: 'confidential',
      }}
      skeleton={customSkeleton}
    >
      <div className="space-y-4 p-6">
        <h2 className="text-2xl font-bold">Financial Dashboard</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card>Revenue: $500K</Card>
          <Card>Expenses: $300K</Card>
          <Card>Profit: $200K</Card>
        </div>
        <div className="h-64 bg-gray-100">Chart Here</div>
      </div>
    </PrivacyWrapper>
  )
}

/* ============================================
   EXAMPLE 4: Auto-hide with Timer
   ============================================
   Use case: Automatically hide sensitive data after inactivity
   Complexity: ⭐⭐ (Easy)
*/

export function Example4_AutoHide() {
  return (
    <PrivacyWrapper
      config={{
        id: 'auto-hide-salaries',
        level: 'restricted',
        autoHideDelay: 30000, // Auto-hide after 30 seconds of inactivity
        persistent: false, // Don't persist auto-hide state
      }}
      hiddenMessage="Salary data auto-hidden for security"
      onPrivacyChange={(hidden) => {
        if (hidden) {
          console.log('⚠️ Sensitive data was auto-hidden')
        }
      }}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold">Employee Salaries</h2>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Manager</td>
              <td>$85,000</td>
            </tr>
            {/* More rows... */}
          </tbody>
        </table>
      </div>
    </PrivacyWrapper>
  )
}

/* ============================================
   EXAMPLE 5: Custom Toggle Button
   ============================================
   Use case: Brand-specific toggle design
   Complexity: ⭐⭐⭐ (Medium)
*/

export function Example5_CustomToggle() {
  const customToggle = ({ isHidden, toggle, canToggle }: any) => {
    if (!canToggle) return null
    
    return (
      <button
        onClick={toggle}
        className="px-4 py-2 rounded-lg font-medium transition-all"
        style={{
          background: isHidden ? '#10b981' : '#ef4444',
          color: 'white',
        }}
      >
        {isHidden ? '🔓 Show Data' : '🔒 Hide Data'}
      </button>
    )
  }

  return (
    <PrivacyWrapper
      config={{
        id: 'custom-toggle-example',
        level: 'internal',
      }}
      customToggle={customToggle}
      showToggle={false} // Disable default toggle
    >
      <div className="p-6">
        <h2>Custom Toggle Example</h2>
        <p>This uses a completely custom toggle button!</p>
      </div>
    </PrivacyWrapper>
  )
}

/* ============================================
   EXAMPLE 6: Multiple Components, Different Levels
   ============================================
   Use case: Dashboard with varying sensitivity levels
   Complexity: ⭐⭐⭐ (Medium)
*/

export function Example6_MultiLevel() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Public - Everyone can see, no toggle needed */}
      <Card>
        <CardHeader>
          <CardTitle>Public Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Users: 1,250</p>
          <p>Active Projects: 42</p>
        </CardContent>
      </Card>

      {/* Internal - Employees only */}
      <PrivacyWrapper
        config={{
          id: 'internal-metrics',
          level: 'internal',
          allowedRoles: ['user', 'department_head', 'finance_manager', 'admin'],
        }}
        togglePosition="top-right"
      >
        <Card>
          <CardHeader>
            <CardTitle>Internal Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Revenue: $450,000</p>
            <p>Growth: +15%</p>
          </CardContent>
        </Card>
      </PrivacyWrapper>

      {/* Confidential - Managers only */}
      <PrivacyWrapper
        config={{
          id: 'confidential-budget',
          level: 'confidential',
          allowedRoles: ['finance_manager', 'admin'],
          blurIntensity: 'high',
        }}
        togglePosition="top-right"
      >
        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Budget: $1,500,000</p>
            <p>Allocated: $1,200,000</p>
            <p>Available: $300,000</p>
          </CardContent>
        </Card>
      </PrivacyWrapper>

      {/* Restricted - Admin only */}
      <PrivacyWrapper
        config={{
          id: 'restricted-salaries',
          level: 'restricted',
          allowedRoles: ['admin'],
          blurIntensity: 'high',
        }}
        togglePosition="top-right"
      >
        <Card>
          <CardHeader>
            <CardTitle>Salary Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Average Salary: $65,000</p>
            <p>Total Payroll: $780,000</p>
          </CardContent>
        </Card>
      </PrivacyWrapper>
    </div>
  )
}

/* ============================================
   EXAMPLE 7: Dynamic Privacy Level
   ============================================
   Use case: Privacy level based on data value
   Complexity: ⭐⭐⭐ (Medium)
*/

interface TransactionData {
  id: string
  amount: number
  description: string
}

export function Example7_DynamicLevel({ transaction }: { transaction: TransactionData }) {
  // Determine privacy level based on transaction amount
  const getPrivacyLevel = (amount: number) => {
    if (amount > 100000) return 'restricted'
    if (amount > 50000) return 'confidential'
    if (amount > 10000) return 'internal'
    return 'public'
  }

  const privacyLevel = getPrivacyLevel(transaction.amount)

  return (
    <PrivacyWrapper
      config={{
        id: `transaction-${transaction.id}`,
        level: privacyLevel,
        blurIntensity: privacyLevel === 'restricted' ? 'high' : 'medium',
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Transaction #{transaction.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${transaction.amount.toLocaleString()}</p>
          <p className="text-gray-600">{transaction.description}</p>
        </CardContent>
        <CardFooter>
          <span className={`px-2 py-1 rounded text-xs ${
            privacyLevel === 'restricted' ? 'bg-red-100 text-red-800' :
            privacyLevel === 'confidential' ? 'bg-orange-100 text-orange-800' :
            privacyLevel === 'internal' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {privacyLevel.toUpperCase()}
          </span>
        </CardFooter>
      </Card>
    </PrivacyWrapper>
  )
}

/* ============================================
   EXAMPLE 8: With Analytics Tracking
   ============================================
   Use case: Track when users toggle privacy
   Complexity: ⭐⭐⭐ (Medium)
*/

export function Example8_WithAnalytics() {
  return (
    <PrivacyWrapper
      config={{
        id: 'tracked-financial-report',
        level: 'confidential',
      }}
      onPrivacyChange={(hidden) => {
        // Track privacy toggle events
        const event = {
          action: hidden ? 'privacy_hidden' : 'privacy_shown',
          component: 'financial-report',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }
        
        // analytics.track(event.action, event)
      }}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold">Financial Report Q4 2024</h2>
        <div className="mt-4">
          <p>Revenue: $2,500,000</p>
          <p>Profit: $850,000</p>
          <p>Margin: 34%</p>
        </div>
      </div>
    </PrivacyWrapper>
  )
}

/* ============================================
   EXAMPLE 9: Multiple Components Sharing State
   ============================================
   Use case: Toggle privacy for related components together
   Complexity: ⭐⭐⭐⭐ (Advanced)
*/

const SHARED_FINANCIAL_CONFIG = {
  id: 'shared-financial-section',
  level: 'confidential' as const,
  persistent: true,
}

export function Example9_SharedState() {
  const { isHidden } = useComponentPrivacy(SHARED_FINANCIAL_CONFIG)

  return (
    <div className="space-y-4 p-4">
      {/* Single toggle controls all sections */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Overview</h1>
        <InlinePrivacyToggle config={SHARED_FINANCIAL_CONFIG} />
      </div>

      {/* All sections share the same privacy state */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            {isHidden ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div>Total: $1,500,000</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isHidden ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div>Total: $2,250,000</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isHidden ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div>Total: $1,100,000</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit</CardTitle>
          </CardHeader>
          <CardContent>
            {isHidden ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div>Total: $1,150,000</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ============================================
   EXAMPLE 10: Nested Privacy Levels
   ============================================
   Use case: Parent and child components with different privacy levels
   Complexity: ⭐⭐⭐⭐ (Advanced)
*/

export function Example10_NestedPrivacy() {
  return (
    // Parent: Internal level
    <PrivacyWrapper
      config={{
        id: 'parent-department-overview',
        level: 'internal',
      }}
      togglePosition="top-right"
    >
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Department Overview</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Child: Confidential level (more restrictive) */}
          <PrivacyWrapper
            config={{
              id: 'child-budget-details',
              level: 'confidential',
            }}
            togglePosition="top-right"
          >
            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Personnel: $500K</p>
                <p>Operations: $300K</p>
                <p>Projects: $200K</p>
              </CardContent>
            </Card>
          </PrivacyWrapper>

          {/* Another child: Restricted level (most restrictive) */}
          <PrivacyWrapper
            config={{
              id: 'child-salary-details',
              level: 'restricted',
              blurIntensity: 'high',
            }}
            togglePosition="top-right"
          >
            <Card>
              <CardHeader>
                <CardTitle>Salary Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Director: $120K</p>
                <p>Managers: $85K avg</p>
                <p>Staff: $55K avg</p>
              </CardContent>
            </Card>
          </PrivacyWrapper>
        </div>
      </div>
    </PrivacyWrapper>
  )
}

/* ============================================
   EXAMPLE 11: Global Privacy Control Panel
   ============================================
   Use case: Admin panel to control all privacy states
   Complexity: ⭐⭐⭐⭐⭐ (Expert)
*/

import { usePrivacy } from '@/contexts/privacy-context'

export function Example11_GlobalControl() {
  const { 
    toggleGlobalPrivacy, 
    getRegisteredComponents,
    privacyState,
  } = usePrivacy()

  const components = getRegisteredComponents()

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Privacy Control Panel</h2>
        <button
          onClick={toggleGlobalPrivacy}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Toggle All Privacy
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Protected Components:</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Component ID</th>
              <th className="text-left p-2">Level</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Persistent</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id} className="border-b">
                <td className="p-2 font-mono text-sm">{comp.id}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    comp.level === 'restricted' ? 'bg-red-100 text-red-800' :
                    comp.level === 'confidential' ? 'bg-orange-100 text-orange-800' :
                    comp.level === 'internal' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {comp.level}
                  </span>
                </td>
                <td className="p-2">
                  {privacyState[comp.id] ? (
                    <span className="text-red-600">🔒 Hidden</span>
                  ) : (
                    <span className="text-green-600">👁️ Visible</span>
                  )}
                </td>
                <td className="p-2">
                  {comp.persistent ? '✅ Yes' : '❌ No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* ============================================
   EXAMPLE 12: Chart Component (Real World)
   ============================================
   Use case: Actual implementation in a chart component
   Complexity: ⭐⭐⭐ (Medium)
*/

export function Example12_ChartComponent({ data }: any) {
  const PRIVACY_CONFIG = {
    id: 'revenue-chart',
    level: 'confidential' as const,
    allowedRoles: ['admin', 'finance_manager'],
    persistent: true,
    blurIntensity: 'high' as const,
  }

  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Revenue Trends 2024</CardTitle>
            <p className="text-sm text-gray-600">Monthly revenue breakdown</p>
          </div>
          <InlinePrivacyToggle config={PRIVACY_CONFIG} />
        </div>
      </CardHeader>

      <CardContent>
        {isHidden ? (
          // Custom skeleton matching chart layout
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full" />
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-3xl font-bold mb-4">$2.5M</div>
            <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-50 rounded flex items-center justify-center">
              [Actual Chart Component Here]
            </div>
            <div className="flex gap-4 justify-center mt-4 text-sm">
              <div>Q1: $550K</div>
              <div>Q2: $625K</div>
              <div>Q3: $680K</div>
              <div>Q4: $645K</div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="text-xs text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </CardFooter>
    </Card>
  )
}

/* ============================================
   Usage Instructions:
   ============================================
   
   1. Import the example you need
   2. Copy and adapt to your use case
   3. Configure privacy levels based on your needs
   4. Test with different user roles
   
   Start with Example 1 for simplest implementation,
   progress to advanced examples as needed.
*/
