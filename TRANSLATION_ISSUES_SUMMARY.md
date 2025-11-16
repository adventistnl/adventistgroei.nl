# 🔍 Problemas de Tradução - Institutional Departments

## ❌ Chaves Faltando em i18n.ts (16)

### `common.*`
- `common.loading` 
- `common.data_loaded`
- `common.data_refreshed`
- `common.refreshing`
- `common.error_refreshing`
- `common.name`
- `common.members`
- `common.spent_amount`
- `common.usage_percentage`
- `common.annual_budget`
- `common.trend.vs_previous_month`
- `common.trend.vs_previous_year`

### `departments.*`
- `departments.entity_name`
- `departments.table_title`
- `departments.table_description`
- `departments.detail.title_suffix`
- `departments.detail.no_description`
- `departments.filters.institutional`

## ⚠️ Problemas Principais

1. **Mistura de namespaces**: Página usa `structureTranslations` + `departmentTranslations`
2. **Fallbacks hardcoded**: ~20 valores em inglês espalhados no código
3. **Namespace vazio**: `useTranslation()` sem 'departments' específico
4. **Inconsistência**: Budget keys em 3 arquivos diferentes

## ✅ O que Está Bom

- `departments.ts`: 100% estruturado (en, nl, pt)
- Modais: Traduções completas
- Cobertura de idiomas: Excelente

## 🔧 Solução Rápida

Usar `departmentTranslations` como já fazem os modais (simples!)

