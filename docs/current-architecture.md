# Current Architecture — Front-end (`adventistgroei.nl`)

> Written as ground-truth reference for building the new preacher-scheduling module. All facts below were confirmed by reading the actual source, not assumed. Paired API-side doc: `../api-adventistgroei.nl/docs/current-architecture.md`.

## 1. Router

- **App Router** (Next.js `app/` directory), confirmed by `app/layout.tsx` and route folders like `app/churches`, `app/dashboard`, `app/events`.
- **No `(authenticated)` route group.** Pages live directly at the top level of `app/` (e.g. `app/churches/page.tsx`, not `app/(authenticated)/churches/page.tsx`). Auth gating is NOT done via a route group segment — it's done in `middleware.ts`.
- `middleware.ts`: reads the `auth-token` cookie (JWT), validates expiry client-side via `utils/validateToken.ts`. A `whitelist` array (`/login`, `/register`, `/forgot-password*`, `/unauthorized`) skips auth. Every other route requires a valid token or redirects to `/login`.
- Route-level permission gating is a separate step: a `routePermissions: Record<string, { resolvers: PermissionResolverName[] }>` map in `middleware.ts` lists required resolver permissions per pathname (currently most entries have an empty `resolvers: []`, i.e. gating happens mostly client-side via `useHasPermission`, not centrally enforced in middleware yet — worth being consistent with, not necessarily copying). Permissions are read from an `auth-permissions` cookie (JSON array of `PermissionResolverName` strings) set at login. Failing the check redirects to `/unauthorized`.
- **New module implication**: schedule pages go directly under `app/schedule/...` and `app/communities`-equivalent is `app/churches/[id]/...` (see §7). If route-level enforcement is desired, add entries to `routePermissions` in `middleware.ts` using the real `PermissionResolverName` enum values (generated from the backend, see API doc §1) — this enum must gain new values for the new module's resolvers before the front-end can reference them.

## 2. GraphQL client & codegen

Two separate codegen tools are in play, plus one fully hand-written layer:

1. **Legacy Apollo CLI** (`apollo.config.js` + `pnpm generate:types` → `apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --tagName=gql --outputFlat types`) generates **plain TypeScript interfaces only** (no hooks) into a flat `types/` folder, one file per operation (e.g. `types/CreateChurch.ts` has `CreateChurch`, `CreateChurchVariables`, and per-field nested interfaces like `CreateChurch_createChurch_leader`). `graphql-schema.json` is downloaded via `pnpm generate:schema` (`apollo schema:download`).
2. **graphql-code-generator** (`codegen.yml` → `pnpm generate:codegen`) only outputs `types/graphql-global-types.ts` — global enums and input types (e.g. `PermissionResolverName`, `LanguagePreference`, `ChurchType`). It does **not** generate hooks despite `typescript-react-apollo` being listed as a plugin.
3. **Hand-written GraphQL documents**: `.graphql` operations are NOT used — instead, `gql` tagged template literals live in `graphql/queries/<DOMAIN>_QUERY.ts` and `graphql/mutations/<DOMAIN>_MUTATIONS.ts` (e.g. `graphql/queries/CHURCH_QUERY.ts` exports `GET_CHURCHES_QUERY`, `graphql/mutations/CHURCH_MUTATIONS.ts` exports `CREATE_CHURCH_MUTATION` etc.).
4. **Hand-written typed hook wrappers**: `hooks/graphql/use-<domain>.ts` wraps each operation with `useQuery<T>`/`useMutation<T,V>` from `@apollo/client/react`, importing the gql doc from step 3 and the TS types from step 1/2. Example (`hooks/graphql/use-churches.ts`):
   ```ts
   export function useGetChurchesQuery(options?: useQuery.Options<Churches>): useQuery.Result<Churches> {
     return useQuery<Churches>(GET_CHURCHES_QUERY, options);
   }
   ```
5. **Hand-written domain hook**: `hooks/use-<domain>.ts` composes the low-level hooks from step 4 into a single ergonomic hook returning `{ data, loading, error, createX, updateX, deleteX }`, doing `useMemo` filtering/shaping.

**There is no generated-hooks-in-one-folder pattern.** Building the new module means replicating all 5 layers by hand for each new operation: `.graphql`-shaped `gql` doc → run `apollo codegen:generate` for types → hand-write the typed hook wrapper → hand-write the domain hook.

Apollo Client itself is configured in `lib/apollo/graphql-provider.tsx` / `lib/apollo/` (auth header injection reading the `auth-token` cookie, error link, etc.) — wired once in `app/layout.tsx` via `<GraphQLProvider>`.

## 3. i18n library

- **`i18next` + `react-i18next`**, NOT `next-intl` or `next-i18next`. Confirmed via `lib/i18n.ts` (`import i18n from 'i18next'`, `initReactI18next`) and `lib/i18n/i18n-provider.tsx` (wraps children in `<I18nextProvider>`, restores `localStorage['preferred-language']` on mount).
- **Translations are TypeScript modules, not JSON files.** Each domain has its own file under `lib/translations/<domain>.ts` exporting an object keyed by locale, e.g. `lib/translations/churches.ts` exports `churchTranslations = { en: {...}, nl: {...}, pt: {...} }`. `lib/i18n.ts` imports every domain file and merges them into one flat `resources` object per locale (`resources.en.translation`, `resources.nl.translation`, `resources.pt.translation` — all namespaces flattened under i18next's single default `translation` namespace, not separate i18next namespaces).
- **Three locales are actually active in the UI: `en`, `nl`, `pt`** (confirmed in `components/language-selector.tsx`: `[{code:'pt', name:'Português'}, {code:'en'}, {code:'nl', name:'Nederlands'}]`). Default/fallback language is `en` (`lng: 'en'`, `fallbackLng: 'en'` in `lib/i18n.ts`).
- **Important asymmetry**: the backend's `LanguagePreference` enum (used for the user's/institution's stored language, which drives which language an email is sent in) only has `en`/`nl` — no `pt` (confirmed via `hooks/use-language-preferences.ts`, which reads `LanguagePreference.en`/`.nl` only, and via the API's Prisma schema). `pt` is a **UI-display-only locale** stored in `localStorage`, unrelated to the backend's per-user email language.
- **Correction vs. a naive design**: a blueprint assuming `/locales/pt-BR/schedule.json` JSON files is wrong on three counts — wrong file format (TS module, not JSON), wrong locale set for the UI (`en`/`nl`/`pt`, not `pt-BR` alone), and wrong locale set for backend-driven content like emails (`en`/`nl` only, no `pt`). The new module should add a `lib/translations/schedule.ts` (and similar for `notifications`/`nav` additions merged into existing `lib/translations/common.ts`-style files, or a new file per screen following the existing one-file-per-domain convention) exporting `{ en: {...}, nl: {...}, pt: {...} }`, and register it in `lib/i18n.ts`'s `resources` merge. Any string that reaches an **email** must stay within `en`/`nl` only, mirroring the backend's `locales/en/emails.json` / `locales/nl/emails.json`.

## 4. Sidebar / navigation config

- Config lives in `config/navigation.ts`, exporting `navSections: NavSection[]`.
- Shapes:
  ```ts
  interface NavItem {
    title: string
    url: string
    icon?: any               // a lucide-react icon component reference
    isActive?: boolean
    items?: NavItem[]        // sub-items
    permissions: PermissionResolverName[]   // required; [] = no permission gate
    translationKey?: string  // i18n key resolved at render time
  }
  interface NavSection {
    label: string
    translationKey?: string
    items: NavItem[]
  }
  ```
- Example real section:
  ```ts
  {
    label: "Structure",
    translationKey: "sidebar.structure",
    items: [
      { title: "Institutions", url: "/institutions", icon: Building, permissions: [PermissionResolverName.Institutions], translationKey: "sidebar.institutions" },
      { title: "Regions", url: "/regions", icon: Map, permissions: [...], translationKey: "sidebar.regions" },
    ]
  }
  ```
- Visibility is enforced by whatever component consumes `navSections` (`components/app-sidebar.tsx` / `components/nav-main.tsx`) filtering items whose `permissions` aren't satisfied by `useHasPermission` (see §6). An item with `permissions: []` is always visible to any authenticated user.
- **New module implication**: add a new `NavSection` (e.g. `label: "Schedule"`, `translationKey: "sidebar.schedule"`) to `navSections` in `config/navigation.ts`, using real `lucide-react` icons already imported at the top of that file (`Calendar`, `Clock` equivalents — `Calendar` is already imported and used elsewhere, so a second distinct icon per item should be chosen to avoid visual collision, e.g. `Clock`, `Inbox`, `AlertTriangle` from `lucide-react`, all available in the package). Each item's `permissions` must reference real `PermissionResolverName` enum values, which must exist on the backend first (generated types are downstream of the backend schema — see API doc, contract-first workflow in blueprint §9 still holds).

## 5. Design system

- **shadcn/ui**, `"style": "new-york"`, Tailwind with CSS variables, `baseColor: "neutral"`, icon library `lucide-react` (`components.json`). Aliases: `@/components/ui` for primitives.
- **A working month/week calendar component already exists and is in production use**: `react-big-calendar` (`^1.19.4`, plus `@types/react-big-calendar`) is installed and actively used in `app/events/page.tsx`, styled via `styles/shadcn-big-calendar.css` (Tailwind-based override of `.rbc-*` classes to match the shadcn theme). It's driven by `momentLocalizer` from `moment` (`moment/locale/pt-br` is already imported there for pt-BR date formatting — note this is a **date-formatting locale for moment**, unrelated to the `en`/`nl`/`pt` i18n locale set in §3; a `moment/locale/nl` import would need to be added/verified for the Dutch-first nature of this system).
- `date-fns` (`4.1.0`) is also a dependency, used elsewhere for date math outside the calendar component.
- **New module implication**: the availability calendar (Fase 1) and the general schedule grid (Fase 3) should reuse `react-big-calendar` + `styles/shadcn-big-calendar.css` rather than building a custom calendar grid from scratch — this directly satisfies UX rule 6.1.3 ("monthly calendar as default view") with an already-styled, already-integrated component. The "grid by church" / "grid by preacher" views from the reference product are a custom table layout (not a calendar view) and will need a bespoke component (`components/schedule/assignment-grid.tsx` per the blueprint's own proposed path), but individual-preacher availability marking maps naturally onto `react-big-calendar`'s month view with custom event rendering per day cell.

## 6. Permission/RBAC on the client

- `useHasPermission(requiredPermissions: PermissionResolverName[], requiredRoles: RoleModel['key_code'][], partialPermissionCheck = false, partialRoleCheck = false): boolean` (`hooks/use-has-permission.ts`) reads `permissions` and `roles` arrays off `useAuth()` (`contexts/auth-context.tsx`), which are populated at login from the JWT/permissions cookie. Default is **AND** semantics (all listed permissions/roles required); pass `partial*Check = true` for **OR** semantics.
- `hooks/use-permissions.ts` and `hocs/with-permission.tsx` provide a HOC variant for gating whole components/pages.
- A **second, independent** system exists: `config/privacy-roles.config.ts` + `contexts/privacy-context.tsx`, defining `PrivacyLevel` (`public`/`internal`/`confidential`/`restricted`) per role (`PRIVACY_ROLES.ADMIN.accessLevels = [...]`). This is a content-sensitivity layer (e.g. hiding financial figures), separate from the `PermissionResolverName` RBAC system. It is unlikely to be relevant to the scheduling module unless a field (e.g. a preacher's personal notes) needs sensitivity-based masking — flagged here so it isn't confused with the main RBAC system when implementing R11 (edit scope).
- **No existing "own resource" ownership-scoping pattern was found on the client** (e.g. nothing like "only show edit button if `record.leader_id === currentUser.id`") in the screens sampled — ownership-based UI gating, if needed for R11 (e.g. hiding another preacher's edit controls), will be a new but straightforward pattern: compare `currentUser.id` from `useAuth()` against the record's owner field, mirroring whatever ownership check the API resolver enforces server-side (see API doc — this must never be a client-only check).

## 7. Existing patterns worth reusing

- **`app/events/page.tsx`** (1034 lines) is the closest existing analogue to "assign people to time slots" — it already combines: a `react-big-calendar` month view, a list/table view toggle, a create/edit `Dialog` with `react-hook-form`-driven fields (`Select`, `Checkbox`, `Textarea`), status `Badge`s, and a `DropdownMenu` for row actions — all built from `components/ui/*` shadcn primitives plus `components/layouts/app-layout.tsx` (`<AppLayout>` wrapper used by essentially every authenticated page — the new schedule pages should use the same wrapper for consistent header/sidebar/breadcrumbs).
- `app/church-departments` and `app/institutional-departments` are good structural references for a "list scoped to a parent entity" pattern (a department belongs to a church or institution) — relevant for how `ChurchServiceCalendar` (belongs to a `Church`) and `Availability` (belongs to a `User`) screens should fetch/scope their data using the already-established `useInstitution()` context for the current tenant.
- **Breadcrumbs**: `hooks/use-breadcrumbs.ts` + `components/responsive-breadcrumbs.tsx` are used across pages — new schedule pages should register breadcrumb labels the same way rather than inventing a separate pattern.

---

### Summary of corrections this doc forces on a naive blueprint

1. i18n is `i18next`/`react-i18next` with **TypeScript-module** translation files (`lib/translations/*.ts`), not JSON files under `/locales/<lang>/*.json`.
2. Active UI locales are **`en`, `nl`, `pt`** — not `pt-BR` alone. Backend-driven content (emails) is **`en`/`nl` only**, no `pt`.
3. GraphQL codegen produces **plain types only, no hooks** — every hook is hand-written in a consistent 2-layer pattern (`hooks/graphql/use-*.ts` thin wrapper + `hooks/use-*.ts` domain hook).
4. There is **no `(authenticated)` route group** — pages sit directly under `app/`, and auth/permission gating is centralized in `middleware.ts` plus per-component `useHasPermission` checks.
5. Sidebar config is `NavSection[]`/`NavItem[]` in `config/navigation.ts`, gated by `permissions: PermissionResolverName[]`, not a hypothetical simpler shape.
6. A production-ready `react-big-calendar` setup already exists and should be reused for the availability/schedule calendar screens instead of building a new calendar component.
