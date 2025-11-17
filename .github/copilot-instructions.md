# Copilot Instructions - adventistgroei.nl

## 🎯 Project Overview

**Adventist GROEI** is a Next.js 15 web platform for managing Seventh-day Adventist Church entities (institutions, regions, churches, departments, users). Core features: access control with granular permissions, institutional management, budget planning, projects, events, subsidies, and volunteer management. International (EN/NL) with mock data for development.

## 🏗️ Architecture Patterns

### App Structure
- **`app/`**: Route groups by domain (churches, institutions, regions, access, dashboard, etc.) using Next.js App Router
- **`components/`**: Organized by context (ui/, modals/, layouts/, charts/, institutions/, etc.) - reuse first
- **`graphql/`**: Queries/mutations in `queries/` and `mutations/` subdirs using `gql` template literals
- **`hooks/`**: Custom hooks split between data fetching (`hooks/graphql/use-*.ts`) and UI logic (`hooks/use-*.ts`)
- **`lib/`**: Utilities: `apollo/`, `i18n/`, `chart-colors.ts`, translation helpers
- **`types/`**: Auto-generated GraphQL types from `codegen.yml` + manual domain types

### Authentication Flow
1. User logs in via `useLoginMutation` (GraphQL) with email/password
2. API returns JWT token → saved to `localStorage` as `auth-token`
3. `AuthContext` wraps app and injects token via Apollo's `SetContextLink` header: `Authorization: Bearer <token>`
4. Permissions/roles stored in `auth-permissions` cookie; managed by `AuthProvider`

### Data Fetching Pattern
```tsx
// graphql/queries/get-churches.ts
export const GET_CHURCHES = gql`query GetChurches { churches { id name } }`

// hooks/graphql/use-churches.ts
export function useChurches() {
  return useQuery(GET_CHURCHES)
}

// components use the hook
const { data, loading } = useChurches()
```
**Never fetch directly in components** — always wrap in custom hooks in `hooks/graphql/`.

### Form Pattern (Modals)
- Use **React Hook Form + Zod** for validation
- Multi-step modals: maintain `currentStep`, `formData` state + `validateStep()` function
- Always translate field labels using i18n: `t.fieldLabel` from `lib/translations/`
- Example: `AnnualBudgetModal`, `EditInstitutionModal` showcase multi-step + i18n + GraphQL mutations

### i18n Integration
- **Library**: `i18next` with language files in `lib/i18n/translations/`
- **Usage**: `const { i18n, t } = useTranslation()` then `t("key.nested.path")`
- **Supported**: Portuguese (pt), English (en), Dutch (nl)
- **Store**: Language preference in user entity + localStorage

## 🛠️ Essential Commands

```bash
pnpm dev            # Start dev server (Next.js 15, port 3000)
pnpm build          # Build for production
pnpm generate       # Regenerate GraphQL types (MUST run after schema changes)
pnpm generate:types # Generate Apollo types from schema
pnpm generate:codegen # Generate codegen types from operations
```

**Critical**: After modifying GraphQL operations, **always run `pnpm generate`** to sync types.

## ⛔ DO NOT Execute These Commands

- **NO** `pnpm build` — Build verification is handled externally
- **NO** `pnpm test` / test runners — Testing is out of scope
- **NO** type checking commands (tsc, typecheck) — TypeScript validation runs externally
- **NO** linting commands (eslint, prettier) — Code formatting is automated
- **NO** database migrations or setup scripts — Only code changes
- **NO** `git commit`, `git push`, or version control commands — User manages Git

## 📄 Documentation Rules

- **NO unnecessary markdown files** — Only create docs if explicitly requested
- **NO change logs, CHANGELOG.md, or similar** — Git history is the source of truth
- **NO README updates** unless specifically asked — Docs stay in `.github/copilot-instructions.md`
- **NO implementation guides or HOW-TO files** — Keep focus on code, not documentation
- **Communication style**: Provide direct summaries of what was done (no fluff), answer questions concisely

## 📋 Key Files & Patterns

| File/Pattern | Purpose | Example |
|---|---|---|
| `components/modals/*/` | Reusable modal dialogs | `EditUserModal`, `DeleteBudgetModal` |
| `components/shared/with-permission.tsx` | Role-based access wrapper | Wraps UI requiring specific permissions |
| `hooks/use-has-permission.ts` | Check if user has permission | `const canEdit = useHasPermission(PermissionName.EditRole)` |
| `lib/translations/*/` | i18n translation objects | Keys for each domain (projects, budgets, etc.) |
| `components/charts/` | Recharts components | `BudgetDistributionChart`, `RoleDistributionChart` |
| `components/shared/use-table.tsx` | TanStack Table wrapper | Advanced table with sorting, filtering, pagination |

## ⚙️ Configuration Notes

- **TypeScript**: `strict: true` in `tsconfig.json` — no `any` type allowed
- **Path alias**: `@/*` maps to project root
- **Apollo Client**: Configured in `lib/apollo/apollo-client.ts` with automatic auth header injection
- **Tailwind + shadcn/ui**: Use existing component library (`Button`, `Dialog`, `Form`, etc.)
- **Date locale**: Default to `ptBR` via `date-fns`; adjust for user's language preference

## 🎨 UI & Style Conventions

- **Components**: Use shadcn/ui (Button, Dialog, Form, Input, Select, Badge, etc.)
- **Icons**: Import from `lucide-react`
- **Spacing**: Use Tailwind gap/p/m utilities consistently
- **Responsive**: Mobile-first with adaptive grids
- **Loading states**: Use `Skeleton` components or spinner UI patterns from existing modals

## 🔒 Permissions System

- **Structure**: 30+ permissions organized in 6 groups: USER, ROLE, PERMISSION, INSTITUTION, REGION, CHURCH
- **Check access**: `useHasPermission(permissionName)` hook + `<WithPermission>` component wrapper
- **Role hierarchy**: Permissions attached to roles; stored in `AuthContext.permissions` array
- **Example**: Only users with `PermissionResolverName.EditRole` can access role editors

## ⚡ Common Pitfalls

1. **Forgetting to generate types**: After adding GraphQL queries, run `pnpm generate`
2. **Hardcoding strings**: Use i18n keys, not raw strings
3. **No permission checks**: Wrap sensitive UI with `<WithPermission>` component
4. **Rewriting components**: Check `components/modals/` and `components/shared/` first — likely already exists
5. **Direct fetch calls**: Always use custom hooks from `hooks/graphql/`, never `useQuery` directly in components

## 🚀 Quick Start for New Features

1. **Create API operation**: Add query/mutation to `graphql/queries/` or `graphql/mutations/`
2. **Generate types**: Run `pnpm generate`
3. **Wrap in hook**: Create `hooks/graphql/use-feature.ts`
4. **Use in component**: Import hook, call it, handle `loading`/`error`/`data`
5. **Add i18n**: Reference translations in `lib/translations/feature.ts`
6. **Test with mock data**: Reference entities from `data/mockData.ts`

## 📚 Key References

- **Next.js 15 App Router**: https://nextjs.org/docs
- **React Hook Form**: https://react-hook-form.com/
- **Zod validation**: https://zod.dev/
- **Apollo Client**: https://www.apollographql.com/docs/react/
- **i18next**: https://www.i18next.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **TanStack Table**: https://tanstack.com/table/latest
