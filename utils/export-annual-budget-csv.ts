/**
 * Utilitário de exportação CSV para a página Annual Budget.
 * Gera um arquivo CSV organizado em seções com nomenclatura padronizada.
 */

export interface AnnualBudgetExportData {
  institutionName: string
  year: number
  // KPIs
  kpi: {
    totalBudget: number
    totalAllocated: number
    totalSpent: number
    budgetRemaining: number
    budgetUtilization: number
    activeDepartments: number
  }
  // Tabela de departamentos
  departmentBudgets: Array<{
    departmentName: string
    departmentDescription?: string
    plannedBudget: number
    allocatedAmount: number
    spentAmount: number
    remainingAmount: number
    usagePercentage: number
    balanceStatus: string
    lockStatus: string
    budgetStatus: string
  }>
  // Distribuição do orçamento
  budgetDistribution: {
    total: number
    spent: number
    allocated: number
    available: number
    percentageUsed: number
  }
  // Gasto por departamento (charts)
  departmentSpending: Array<{
    name: string
    planned: number
    spent: number
    reserved: number
    available: number
  }>
}

export interface ExportTranslations {
  // Seções
  section_summary: string
  section_department_budgets: string
  section_budget_distribution: string
  section_department_spending: string
  // Campos Summary
  institution: string
  year: string
  total_budget: string
  total_allocated: string
  total_spent: string
  budget_remaining: string
  budget_utilization: string
  active_departments: string
  // Campos Department Budgets
  department_name: string
  description: string
  planned_budget: string
  allocated_amount: string
  spent_amount: string
  remaining_amount: string
  usage_percentage: string
  balance_status: string
  lock_status: string
  budget_status: string
  // Campos Budget Distribution
  total: string
  spent: string
  allocated: string
  available: string
  percentage_used: string
  // Campos Department Spending
  reserved: string
  // Status labels
  locked: string
  unlocked: string
  completed: string
  missing: string
}

/**
 * Escapa um valor para uso seguro em CSV (RFC 4180)
 */
function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  // Se contém vírgula, aspas ou quebra de linha, envolve em aspas
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Formata um valor monetário sem símbolo de moeda (apenas número)
 */
function formatAmount(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

/**
 * Gera o conteúdo CSV completo do Annual Budget
 */
export function generateAnnualBudgetCsv(
  data: AnnualBudgetExportData,
  translations: ExportTranslations,
  currencyCode: string = 'EUR'
): string {
  const rows: string[] = []

  const row = (...cols: (string | number | null | undefined)[]) =>
    rows.push(cols.map(escapeCsvValue).join(','))

  const separator = () => rows.push('')

  // ── SEÇÃO 1: RESUMO ────────────────────────────────────────────────────────
  row(`[${translations.section_summary}]`)
  row(translations.institution, data.institutionName)
  row(translations.year, data.year)
  row(`${translations.total_budget} (${currencyCode})`, formatAmount(data.kpi.totalBudget))
  row(`${translations.total_allocated} (${currencyCode})`, formatAmount(data.kpi.totalAllocated))
  row(`${translations.total_spent} (${currencyCode})`, formatAmount(data.kpi.totalSpent))
  row(`${translations.budget_remaining} (${currencyCode})`, formatAmount(data.kpi.budgetRemaining))
  row(`${translations.budget_utilization} (%)`, data.kpi.budgetUtilization)
  row(translations.active_departments, data.kpi.activeDepartments)

  separator()

  // ── SEÇÃO 2: ORÇAMENTOS POR DEPARTAMENTO ───────────────────────────────────
  row(`[${translations.section_department_budgets}]`)
  row(
    translations.department_name,
    translations.description,
    `${translations.planned_budget} (${currencyCode})`,
    `${translations.allocated_amount} (${currencyCode})`,
    `${translations.spent_amount} (${currencyCode})`,
    `${translations.remaining_amount} (${currencyCode})`,
    `${translations.usage_percentage} (%)`,
    translations.balance_status,
    translations.lock_status,
    translations.budget_status,
  )

  for (const dept of data.departmentBudgets) {
    row(
      dept.departmentName,
      dept.departmentDescription ?? '',
      formatAmount(dept.plannedBudget),
      formatAmount(dept.allocatedAmount),
      formatAmount(dept.spentAmount),
      formatAmount(dept.remainingAmount),
      dept.usagePercentage,
      dept.balanceStatus,
      dept.lockStatus,
      dept.budgetStatus,
    )
  }

  separator()

  // ── SEÇÃO 3: DISTRIBUIÇÃO DO ORÇAMENTO ─────────────────────────────────────
  row(`[${translations.section_budget_distribution}]`)
  row(
    `${translations.total} (${currencyCode})`,
    `${translations.spent} (${currencyCode})`,
    `${translations.allocated} (${currencyCode})`,
    `${translations.available} (${currencyCode})`,
    `${translations.percentage_used} (%)`,
  )
  row(
    formatAmount(data.budgetDistribution.total),
    formatAmount(data.budgetDistribution.spent),
    formatAmount(data.budgetDistribution.allocated),
    formatAmount(data.budgetDistribution.available),
    data.budgetDistribution.percentageUsed,
  )

  separator()

  // ── SEÇÃO 4: GASTO POR DEPARTAMENTO ───────────────────────────────────────
  row(`[${translations.section_department_spending}]`)
  row(
    translations.department_name,
    `${translations.planned_budget} (${currencyCode})`,
    `${translations.spent} (${currencyCode})`,
    `${translations.reserved} (${currencyCode})`,
    `${translations.available} (${currencyCode})`,
  )

  for (const dept of data.departmentSpending) {
    row(
      dept.name,
      formatAmount(dept.planned),
      formatAmount(dept.spent),
      formatAmount(dept.reserved),
      formatAmount(dept.available),
    )
  }

  return rows.join('\n')
}

/**
 * Faz o download do CSV no browser
 */
export function downloadCsv(content: string, filename: string): void {
  // BOM UTF-8 para compatibilidade com Excel
  const bom = '\uFEFF'
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Gera o nome do arquivo CSV padronizado
 */
export function generateCsvFilename(institutionName: string, year: number): string {
  const sanitized = institutionName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40)

  return `annual-budget-${sanitized}-${year}.csv`
}
