# Kanban Move Rules — Project Status Transitions

## Visão geral

O sistema de regras de transição de status do Kanban é declarativo e centralizado em um único arquivo:

```
lib/project-kanban-rules.ts
```

Cada regra é um objeto no array `STATUS_TRANSITION_RULES`. A lógica de validação (bloqueio visual, bloqueio funcional, mensagem de erro) é derivada automaticamente desse array — **sem precisar modificar nenhum outro arquivo**.

---

## Como adicionar uma nova regra

Abra `lib/project-kanban-rules.ts` e adicione uma entrada ao array `STATUS_TRANSITION_RULES`:

```ts
{
  blocksGroup: "IN_REVIEW",        // ID da coluna de destino que deve ser bloqueada
  reason: "missingDocuments",      // chave camelCase usada para mapear a mensagem de erro
  isBlocked: (proj) => (proj.documents ?? 0) === 0,  // predicado puro
},
```

### Campos

| Campo        | Tipo                              | Descrição |
|---|---|---|
| `blocksGroup` | `string`                         | ID da coluna de destino bloqueada (ex: `"WAITING_REFUND"`) |
| `reason`      | `string`                         | Chave camelCase — usada para resolver a tradução de erro |
| `isBlocked`   | `(proj: ProjectTableData) => boolean` | Predicado puro — recebe o projeto, retorna `true` para bloquear |

> **Regra de ouro:** `isBlocked` **nunca** faz chamadas de rede. Usa apenas dados já carregados em `localProjects`.

---

## Como adicionar a mensagem de erro traduzida

Ao criar uma nova regra com `reason: "minhaRegra"`, adicione a tradução em
`components/projects/project-kanban-view.tsx` dentro de `errorMessages`:

```ts
const errorMessages: Record<string, string | undefined> = {
  noSubsidiesForRefund: t.statusTransitions?.noSubsidiesError ?? "...",
  incompleteActivities: t.status?.incompleteActivities ?? "...",
  noRegressionPastOpenRequest: t.status?.cannotGoBackToDraft ?? "...",

  // Nova regra:
  minhaRegra: t.status?.minhaRegra ?? "Mensagem de fallback em inglês.",
}
```

E adicione a chave `minhaRegra` em `lib/translations/projects.ts` nos 3 idiomas (en, nl, pt).

---

## Como remover ou desativar uma regra

Comente ou remova a entrada do array:

```ts
// {
//   blocksGroup: "WAITING_REFUND",
//   reason: "noSubsidiesForRefund",
//   isBlocked: (proj) => (proj.subsidyRequests ?? 0) === 0,
// },
```

---

## Regras atuais

| `blocksGroup`    | `reason`                      | Condição de bloqueio |
|---|---|---|
| `DRAFT`          | `noRegressionPastOpenRequest` | Projeto já passou de `OPEN_REQUEST` |
| `WAITING_REFUND` | `noSubsidiesForRefund`        | Projeto não tem nenhuma solicitação de subsídio |
| `CONCLUDED`      | `incompleteActivities`        | Alguma atividade ainda não está com status `COMPLETED` |

---

## Arquitetura — fluxo completo

```
drag start
  └── KanbanBoard.handleDragStart
        └── moveRules.getDisabledGroupsForItem(item)
              └── getProjectInvalidGroups(proj)          ← aplica STATUS_TRANSITION_RULES
                    → ["WAITING_REFUND", ...]
        → colunas inválidas ficam opacity-40 instantaneamente

drop em coluna inválida
  └── KanbanBoard.handleDrop → isMoveAllowed() → false
        └── moveRules.getCanMoveErrorMessage(itemId, from, to, item)
              └── getProjectBlockedRule(proj, toGroupId)  ← retorna a regra que bloqueou
                    → rule.reason → errorMessages[rule.reason]
        → toast.error com mensagem traduzida

drop em coluna válida
  └── KanbanBoard.handleDrop → onItemMove → handleSaveChanges / modal de confirmação
```

---

## Funções exportadas

### `getProjectInvalidGroups(proj)`

Retorna **todos** os group IDs que o projeto não pode receber.

```ts
const invalid = getProjectInvalidGroups(project)
// ex: ["DRAFT", "CONCLUDED"]
```

### `getProjectBlockedRule(proj, toGroupId)`

Retorna **a primeira regra** que bloqueia o projeto de ir para `toGroupId`, ou `undefined` se a movimentação é permitida. Útil para resolver a mensagem de erro tipada.

```ts
const rule = getProjectBlockedRule(project, "WAITING_REFUND")
if (rule) toast.error(t.statusTransitions[rule.reason])
```

### `STATUS_TRANSITION_RULES`

Array exportado — pode ser inspecionado em testes ou visualizado em ferramentas de debug.

```ts
import { STATUS_TRANSITION_RULES } from "@/lib/project-kanban-rules"
console.log(STATUS_TRANSITION_RULES.map(r => r.blocksGroup))
// ["DRAFT", "WAITING_REFUND", "CONCLUDED"]
```

---

## Dados necessários no projeto

Para que as regras funcionem, os seguintes campos devem estar presentes em `ProjectTableData`:

| Campo            | Usado pela regra              | Origem no GraphQL |
|---|---|---|
| `status`         | `noRegressionPastOpenRequest` | `project.status` — sempre presente |
| `subsidyRequests`| `noSubsidiesForRefund`        | `project.subsidies { id }` → `.length` |
| `activitiesData` | `incompleteActivities`        | `project.activities { id name status }` |

Esses campos são populados em `app/projects/page.tsx` → `transformProjectsData()`.
