# Calendar Heatmap - Micro Componentização

Sistema de calendário tipo heatmap (estilo GitHub) com componentes modulares para máxima flexibilidade e responsividade.

## 🧩 Componentes

### 1. **CalendarHeatmap** (Principal)
Componente base do calendário com suporte a dados ponderados.

```tsx
<CalendarHeatmap
  variantClassnames={[
    "bg-teal-400", 
    "bg-teal-600", 
    "bg-teal-800"
  ]}
  weightedDates={[
    { date: new Date('2024-01-15'), weight: 5 },
    { date: new Date('2024-01-20'), weight: 12 }
  ]}
  compactMode={false}
  hideNavigation={false}
/>
```

**Props:**
- `variantClassnames` - Array de classes CSS para diferentes intensidades
- `weightedDates` - Array de objetos `{date, weight}` 
- `datesPerVariant` - Alternativa: array de arrays de datas por categoria
- `compactMode` - Modo compacto (células menores, textos menores)
- `hideNavigation` - Esconde botões de navegação de mês
- Todas as props de `DayPicker` do react-day-picker

### 2. **CalendarLegend**
Componente de legenda visual separado.

```tsx
<CalendarLegend
  variantClassnames={["bg-teal-400", "bg-teal-600", "bg-teal-800"]}
  labels={{ less: "Menos", more: "Mais" }}
  compactMode={false}
/>
```

**Props:**
- `variantClassnames` - Mesmo array usado no CalendarHeatmap
- `labels` - Objeto com `less` e `more` para i18n
- `compactMode` - Ajusta tamanho dos quadrados
- `className` - Classes CSS customizadas

### 3. **CalendarGrid**
Wrapper do grid com suporte a modo compacto.

```tsx
<CalendarGrid compactMode={true}>
  {/* Conteúdo do calendário */}
</CalendarGrid>
```

**Props:**
- `compactMode` - Aplica scale(0.9) para reduzir tamanho
- `className` - Classes CSS customizadas

### 4. **CalendarHeader**
Header customizável com navegação (não usado atualmente, mas disponível).

```tsx
<CalendarHeader
  currentMonth={new Date()}
  onPreviousMonth={() => {}}
  onNextMonth={() => {}}
/>
```

## 📱 Responsividade

### Breakpoints

**Desktop (sm+):**
- Células: 9x9 (w-9 h-9)
- Texto caption: text-sm
- Texto days: text-[0.8rem]
- Padding: p-3

**Mobile (< sm):**
- Células: 8x8 (w-8 h-8)
- Texto caption: text-xs
- Texto days: text-[0.7rem]
- Padding: p-2

**Compact Mode:**
- Células: 7x7 (w-7 h-7)
- Texto: text-[0.65rem]
- Scale: 90% do tamanho original

### Classes Adaptativas

```tsx
// Head cells
compactMode ? "w-7 h-7 text-[0.65rem]" : "w-8 h-8 sm:w-9 sm:h-9 text-[0.7rem] sm:text-[0.8rem]"

// Day cells
compactMode ? "h-7 w-7 text-[0.7rem]" : "h-8 w-8 sm:h-9 sm:w-9"
```

## 🎨 Customização de Cores

### Variantes Padrão (Teal)
```tsx
const variantClassnames = [
  "text-white hover:text-white bg-teal-400 hover:bg-teal-400 dark:bg-teal-500",
  "text-white hover:text-white bg-teal-600 hover:bg-teal-600",
  "text-white hover:text-white bg-teal-800 hover:bg-teal-800 dark:bg-teal-700",
]
```

### Customizar Cores
```tsx
const customColors = [
  "bg-blue-400 dark:bg-blue-500",
  "bg-blue-600",
  "bg-blue-800 dark:bg-blue-700",
]
```

## 💡 Uso em Cards

### Exemplo Completo (ActivityHeatmapCard)

```tsx
<Card className="h-full flex flex-col">
  <CardHeader className={compactMode ? "pb-3" : ""}>
    <CardTitle className={cn(
      "flex items-center gap-2",
      compactMode ? "text-xs" : "text-sm"
    )}>
      <Activity className={compactMode ? "w-3 h-3" : "w-4 h-4"} />
      Activity Heatmap
    </CardTitle>
  </CardHeader>
  
  <CardContent className="overflow-x-auto overflow-y-hidden flex-1">
    <div className="max-w-full">
      <CalendarHeatmap
        variantClassnames={variantClassnames}
        weightedDates={activityData}
        compactMode={compactMode}
      />
    </div>
    
    <div className="mt-4 flex justify-between">
      <CalendarLegend
        variantClassnames={variantClassnames}
        labels={{ less: "Less", more: "More" }}
        compactMode={compactMode}
      />
      <div className="text-xs text-muted-foreground">
        {activityData.length} days with activity
      </div>
    </div>
  </CardContent>
</Card>
```

## 🔧 Features

### ✅ Implementadas
- [x] Modo compacto para espaços reduzidos
- [x] Responsividade mobile/desktop
- [x] Dark mode completo
- [x] Legenda separada e reutilizável
- [x] Suporte a dados ponderados
- [x] Validação de datas
- [x] Fallbacks de tradução
- [x] Overflow protegido (x-auto, y-hidden)
- [x] Hoje destacado
- [x] Navegação de mês integrada

### 🚀 Possíveis Melhorias Futuras
- [ ] Tooltip com detalhes ao hover
- [ ] Click handler para dias específicos
- [ ] Range de meses customizável
- [ ] Animações de transição
- [ ] Exportar como imagem
- [ ] Seleção de range de datas

## 📦 Dependências

```json
{
  "react-day-picker": "^8.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x"
}
```

## 🎯 Casos de Uso

1. **Activity Tracking** - Rastrear atividades diárias (projetos, commits, etc)
2. **Attendance Heatmap** - Presença em eventos/aulas
3. **Habit Tracking** - Tracking de hábitos diários
4. **Performance Metrics** - Métricas de performance ao longo do tempo
5. **Engagement Calendar** - Engajamento de usuários por dia

---

**Nota**: Este sistema foi projetado para ser modular e extensível. Cada componente pode ser usado independentemente ou combinado conforme necessário.
