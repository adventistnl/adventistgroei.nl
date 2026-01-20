/**
 * Global Privacy Toggle - Usage Examples
 * 
 * Componente reutilizável para toggle global de privacidade
 */

import { GlobalPrivacyToggle } from '@/components/shared/global-privacy-toggle'

/**
 * EXEMPLO 1: Uso Básico (Apenas Ícone)
 */
export function Example1_IconOnly() {
  return (
    <div className="flex gap-2">
      <GlobalPrivacyToggle />
    </div>
  )
}

/**
 * EXEMPLO 2: Com Texto
 */
export function Example2_WithText() {
  return (
    <div className="flex gap-2">
      <GlobalPrivacyToggle 
        variant="text" 
        size="default"
      />
    </div>
  )
}

/**
 * EXEMPLO 3: Com Labels Customizados
 */
export function Example3_CustomLabels() {
  return (
    <div className="flex gap-2">
      <GlobalPrivacyToggle 
        labels={{
          showAll: 'Mostrar Tudo',
          hideAll: 'Ocultar Tudo',
          someHidden: 'Alguns itens ocultos',
        }}
      />
    </div>
  )
}

/**
 * EXEMPLO 4: Em Header de Página
 */
export function Example4_InPageHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="flex items-center gap-3">
        <GlobalPrivacyToggle 
          labels={{
            showAll: 'Show All Data',
            hideAll: 'Hide Sensitive Data',
            someHidden: 'Some data hidden',
          }}
        />
        <button className="btn-primary">Refresh</button>
      </div>
    </div>
  )
}

/**
 * EXEMPLO 5: Em Toolbar
 */
export function Example5_InToolbar() {
  return (
    <div className="border-b p-4 flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Tools:</span>
      
      <GlobalPrivacyToggle size="sm" />
      
      <button className="btn-sm">Export</button>
      <button className="btn-sm">Print</button>
    </div>
  )
}

/**
 * EXEMPLO 6: Com Tamanho Grande
 */
export function Example6_LargeSize() {
  return (
    <div className="flex gap-2">
      <GlobalPrivacyToggle 
        variant="text"
        size="lg"
        labels={{
          showAll: 'Reveal All Information',
          hideAll: 'Protect Sensitive Data',
          someHidden: 'Protected content',
        }}
      />
    </div>
  )
}

/**
 * EXEMPLO 7: Com Estilo Customizado
 */
export function Example7_CustomStyle() {
  return (
    <div className="flex gap-2">
      <GlobalPrivacyToggle 
        className="shadow-lg hover:shadow-xl"
        size="default"
      />
    </div>
  )
}

/**
 * EXEMPLO 8: Integração com Annual Budget (Real)
 */
export function Example8_AnnualBudgetIntegration() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Annual Budget</h2>
          <p className="text-muted-foreground">Manage your budget</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Global Privacy Toggle */}
          <GlobalPrivacyToggle 
            labels={{
              showAll: 'Show All KPIs',
              hideAll: 'Hide All KPIs',
              someHidden: 'Some KPIs hidden',
            }}
          />
          
          {/* Refresh Button */}
          <button className="btn-icon">
            <RefreshIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * CARACTERÍSTICAS DO COMPONENTE:
 * 
 * ✅ Detecta automaticamente componentes ocultos
 * ✅ Mostra contador de itens ocultos
 * ✅ Toggle global de todos os componentes
 * ✅ Feedback visual (destaque quando há itens ocultos)
 * ✅ Tooltip informativo
 * ✅ Totalmente integrado com PrivacyContext
 * ✅ Reutilizável em qualquer página
 * ✅ Suporta variantes (icon/text)
 * ✅ Tamanhos customizáveis
 * ✅ Labels traduzíveis
 * 
 * QUANDO USAR:
 * - Em headers de páginas com múltiplos componentes privados
 * - Em dashboards com vários KPIs sensíveis
 * - Em toolbars de páginas financeiras
 * - Onde você precisa controle rápido de privacidade global
 */

function RefreshIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}
