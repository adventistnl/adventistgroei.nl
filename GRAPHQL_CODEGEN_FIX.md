# GraphQL Codegen Fix - CHURCH_QUERY

## Problem
GraphQL codegen was failing with error:
```
Cannot query field "__typename" on type "undefined"
GraphQLError: Cannot query field "__typename" on type "undefined"
```

## Root Cause
The `GET_CHURCHES_QUERY` in `/graphql/queries/CHURCH_QUERY.ts` had:
1. Incomplete field set - missing `type` field
2. Attempted to query `region` nested object which is NOT exposed in the GraphQL schema
3. Schema only exposes `region_id` scalar field (not `region` object)

## Solution
Updated `CHURCH_QUERY.ts` to only include fields available in the `ChurchModel` schema:

### Before
```typescript
export const GET_CHURCHES_QUERY = gql`
  query Churches {
      churches {
          id
          institution_id
          name
          region_id
          contact_id
          created_at
          updated_at
          created_by
          updated_by
          is_deleted
          deleted_at
          deleted_by
      }
  }
`
```

### After
```typescript
export const GET_CHURCHES_QUERY = gql`
  query Churches {
    churches {
      id
      institution_id
      name
      region_id
      contact_id
      type
      created_at
      updated_at
      created_by
      updated_by
      is_deleted
      deleted_at
      deleted_by
    }
  }
`
```

## Key Changes
✅ Added `type` field (ChurchType enum)
✅ Removed `region` nested object (not exposed in schema)
✅ Kept `region_id` for identifying which region a church belongs to
✅ Query now aligns with actual GraphQL schema definition

## Verification
```bash
pnpm generate:codegen  # ✓ SUCCESS
pnpm build             # ✓ Compiled successfully
```

## Build Results
- 36 routes compiled
- Churches route: 23.2 kB
- Zero TypeScript errors
- Middleware: 33.5 kB

## Frontend Implementation
The churches listing page (`/app/churches/page.tsx`) already handles:
- Null region_id (orphaned churches)
- Display of region name via `region` object fetched separately
- Type-safe region display with fallback badge

## Note on Schema Design
The GraphQL backend currently:
- Exposes `region_id` as scalar (to identify region)
- Does NOT expose `region` object directly on ChurchModel
- This is likely a design choice to avoid N+1 queries

If backend needs to expose `region` object, coordinate with backend team to update the schema definition.
