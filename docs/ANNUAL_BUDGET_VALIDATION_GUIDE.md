# Annual Budget Modal - Validation Implementation Guide

## Overview
The Annual Budget Modal now includes validation to protect allocated amounts in departments and automatic registrations. This prevents users from reducing budget values below what has already been committed to departments.

## New Properties

### `allocatedExpenses?: number`
- **Purpose**: Minimum total expenses already allocated to departments
- **Default**: 0
- **Usage**: Pass the sum of all expenses already allocated to sub-departments or committed in the system

### `allocatedReserved?: number`  
- **Purpose**: Minimum reserved amount already allocated/committed
- **Default**: 0
- **Usage**: Pass the sum of all reserved amounts already committed to specific programs or activities

## Validation Logic

### Total Expenses Validation
- Users cannot enter values less than `allocatedExpenses`
- If field is empty but `allocatedExpenses > 0`, the field becomes required with minimum validation
- Error message shows the allocated amount: "Cannot be less than allocated amount: €50,000"

### Reserved Amount Validation
- Users cannot enter values less than `allocatedReserved`
- If field is empty but `allocatedReserved > 0`, the field becomes required with minimum validation
- Error message shows the allocated amount: "Cannot be less than allocated amount: €10,000"

## Visual Indicators

### Below Input Fields
When allocated values exist, an amber indicator shows:
```
🟡 Already allocated to departments: €50,000
```

### In Preview Sections
The budget preview shows minimum values:
```
Total Expenses: €75,000
                Min: €50,000

Reserved Amount: €15,000
                 Min: €10,000
```

## Implementation Examples

### For Institution Budgets
```tsx
<AnnualBudgetViewEditModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  budget={institutionBudget}
  entityName="Central Institution"
  entityType="Institution"
  allocatedExpenses={sumOfDepartmentExpenses}
  allocatedReserved={sumOfReservedCommitments}
  onSave={handleSave}
/>
```

### For Department Budgets
```tsx
<AnnualBudgetViewEditModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  budget={departmentBudget}
  entityName="Youth Department"
  entityType="Department"
  availableBudget={availableFromInstitution}
  allocatedExpenses={allocatedToPrograms}
  allocatedReserved={reservedForEvents}
  onSave={handleDepartmentSave}
/>
```

## Data Requirements

### Backend API Requirements
Ensure your API provides:

1. **For Institution Budgets**:
   ```json
   {
     "allocatedExpenses": 125000, // Sum of all department allocations
     "allocatedReserved": 25000   // Sum of all reserved commitments
   }
   ```

2. **For Department Budgets**:
   ```json
   {
     "allocatedExpenses": 45000,  // Sum of program allocations
     "allocatedReserved": 8000    // Sum of activity reservations
   }
   ```

### Database Calculations
```sql
-- Calculate allocated expenses for institution
SELECT 
    SUM(department_budgets.total_expenses) as allocated_expenses,
    SUM(department_budgets.reserved_amount) as allocated_reserved
FROM department_budgets 
WHERE institution_id = ? 
AND budget_year = ?;

-- Calculate allocated expenses for department
SELECT 
    SUM(program_allocations.amount) as allocated_expenses,
    SUM(event_reservations.amount) as allocated_reserved
FROM program_allocations 
LEFT JOIN event_reservations ON program_allocations.department_id = event_reservations.department_id
WHERE department_id = ? 
AND budget_year = ?;
```

## Translation Keys

Added to `lib/translations/budget.ts`:

### English
```typescript
validation: {
  total_expenses_below_allocated: "Cannot be less than allocated amount: {{allocated}}",
  total_expenses_required_allocated: "Minimum required (already allocated): {{allocated}}",
  reserved_below_allocated: "Cannot be less than allocated amount: {{allocated}}",
  reserved_required_allocated: "Minimum required (already allocated): {{allocated}}"
},
fields: {
  already_allocated: "Already allocated to departments"
}
```

### Dutch
```typescript
validation: {
  total_expenses_below_allocated: "Mag niet lager zijn dan toegewezen bedrag: {{allocated}}",
  total_expenses_required_allocated: "Minimum vereist (reeds toegewezen): {{allocated}}",
  reserved_below_allocated: "Mag niet lager zijn dan toegewezen bedrag: {{allocated}}",
  reserved_required_allocated: "Minimum vereist (reeds toegewezen): {{allocated}}"
},
fields: {
  already_allocated: "Reeds toegewezen aan afdelingen"
}
```

### Portuguese
```typescript
validation: {
  total_expenses_below_allocated: "Não pode ser menor que o valor alocado: {{allocated}}",
  total_expenses_required_allocated: "Mínimo requerido (já alocado): {{allocated}}",
  reserved_below_allocated: "Não pode ser menor que o valor alocado: {{allocated}}",
  reserved_required_allocated: "Mínimo requerido (já alocado): {{allocated}}"
},
fields: {
  already_allocated: "Já alocado para departamentos"
}
```

## Testing Scenarios

### Test Cases
1. **Normal Edit**: Values above allocated amounts should work
2. **Below Allocated**: Values below allocated amounts should show validation error
3. **Empty Required**: Empty fields with allocated amounts should show minimum requirement
4. **Zero Allocated**: When no allocations exist, normal validation applies
5. **Currency Display**: Allocated amounts should display in user's selected currency

### Test Data
```typescript
const testScenarios = [
  {
    name: "Institution with allocated expenses",
    budget: { total_expenses: 100000, reserved: 20000 },
    allocatedExpenses: 75000,
    allocatedReserved: 15000,
    expectation: "Should allow values >= allocated amounts"
  },
  {
    name: "Department with no allocations", 
    budget: { total_expenses: 50000, reserved: 10000 },
    allocatedExpenses: 0,
    allocatedReserved: 0,
    expectation: "Should behave like normal validation"
  }
];
```

## Error Handling

The component handles validation errors gracefully:
- Shows specific error messages with allocated amounts
- Prevents form submission when validation fails
- Highlights fields with validation errors in red
- Provides visual feedback about protected amounts

## Browser Compatibility

The validation works with all modern browsers and includes:
- HTML5 `min` attribute for native browser validation
- Custom JavaScript validation for complex scenarios
- Fallback error messages for translation failures
- Currency formatting respects user locale
