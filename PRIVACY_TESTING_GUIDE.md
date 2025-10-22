# 🧪 Privacy System - Guia de Teste

## 🚀 Como Testar o Sistema

Guia rápido para validar que o sistema de privacy está funcionando corretamente.

---

## ✅ Teste 1: Componente Visível por Padrão

### O que testar:
- Componente deve aparecer visível na primeira visita
- Botão de privacy deve estar presente (se usuário tiver permissão)

### Como testar:

1. **Limpar localStorage** (simular primeira visita):
```javascript
// Cole no console do navegador
localStorage.removeItem('privacy-state')
location.reload()
```

2. **Verificar estado inicial**:
```javascript
// Cole no console
window.__PRIVACY_DEBUG__
```

**Resultado esperado:**
```javascript
{
  'department-spending-chart': {
    configId: 'department-spending-chart',
    level: 'confidential',
    allowedRoles: ['DEV', 'ADMIN', 'FINANCE_MANAGER', ...],
    canToggle: true,  // ✅ Se você for DEV, ADMIN ou FINANCE
    isHidden: false,  // ✅ DEVE SER FALSE (visível)
    timestamp: '...'
  }
}
```

---

## ✅ Teste 2: Botão Aparece para Roles Corretas

### O que testar:
- Botão aparece para: DEV, ADMIN, FINANCE_MANAGER
- Botão NÃO aparece para: USER, GUEST

### Como testar:

1. **Verificar sua role**:
```javascript
// Cole no console
const auth = JSON.parse(localStorage.getItem('auth') || '{}')
console.log('Minha role:', auth?.roles)
```

2. **Verificar se botão deve aparecer**:
```javascript
const myRole = auth?.roles?.[0] || 'user'
const allowedRoles = ['DEV', 'ADMIN', 'FINANCE_MANAGER', 'FINANCE_ADMIN', 'CFO']
const shouldShowButton = allowedRoles.some(r => myRole.includes(r))

console.log('Deve mostrar botão?', shouldShowButton)
```

**Resultado esperado:**
- ✅ `true` se você for DEV, ADMIN ou FINANCE
- ❌ `false` se você for USER ou GUEST

---

## ✅ Teste 3: Toggle Esconde e Mostra

### O que testar:
- Clicar no botão esconde o componente
- Clicar novamente mostra o componente
- Ícone muda (Eye → EyeOff)

### Como testar:

1. **Localizar botão**:
```javascript
// Cole no console
const button = document.querySelector('.privacy-toggle-button-header')
console.log('Botão encontrado:', button ? '✅ SIM' : '❌ NÃO')
```

2. **Clicar programaticamente**:
```javascript
// Cole no console (simula clique)
button?.click()

// Verificar estado após clique
setTimeout(() => {
  const state = window.__PRIVACY_DEBUG__['department-spending-chart']
  console.log('Estado após clique:', state.isHidden) // Deve ser true
}, 100)
```

3. **Clicar novamente**:
```javascript
button?.click()

setTimeout(() => {
  const state = window.__PRIVACY_DEBUG__['department-spending-chart']
  console.log('Estado após 2º clique:', state.isHidden) // Deve ser false
}, 100)
```

**Resultado esperado:**
```
1º clique → isHidden = true (componente esconde)
2º clique → isHidden = false (componente mostra)
```

---

## ✅ Teste 4: Persistência no localStorage

### O que testar:
- Estado é salvo no localStorage
- Reload preserva o estado

### Como testar:

1. **Esconder componente**:
```javascript
// Clicar no botão para esconder
const button = document.querySelector('.privacy-toggle-button-header')
button?.click()
```

2. **Verificar localStorage**:
```javascript
const saved = localStorage.getItem('privacy-state')
console.log('Estado salvo:', JSON.parse(saved))
```

**Resultado esperado:**
```javascript
{
  "department-spending-chart": true // true = escondido
}
```

3. **Recarregar página**:
```javascript
location.reload()
```

4. **Verificar após reload**:
```javascript
// Após reload, verificar
const state = window.__PRIVACY_DEBUG__['department-spending-chart']
console.log('Permaneceu escondido?', state.isHidden) // Deve ser true
```

---

## ✅ Teste 5: Debug Logs

### O que testar:
- Logs aparecem quando botão não renderiza
- Logs mostram role e allowedRoles

### Como testar (se botão NÃO aparece):

1. **Forçar role USER** (teste):
```javascript
// Temporário - só para teste
const mockAuth = {
  roles: ['USER'], // Role sem permissão
  user: { name: 'Test User' }
}
localStorage.setItem('test-auth', JSON.stringify(mockAuth))
location.reload()
```

2. **Verificar console**:

**Resultado esperado:**
```
⚠️ InlinePrivacyToggle NOT RENDERING
🔒 Reason: User role not in allowedRoles
💡 Check user permissions and allowedRoles
📋 Config: {id: 'department-spending-chart', ...}
👤 User Role: "user"
✅ Allowed Roles: ["DEV", "ADMIN", "FINANCE_MANAGER", ...]
```

3. **Limpar teste**:
```javascript
localStorage.removeItem('test-auth')
location.reload()
```

---

## 🧪 Script de Teste Completo

Cole este script no console para teste automático:

```javascript
// 🧪 Privacy System - Teste Completo
console.clear()
console.log('🧪 Iniciando testes do Privacy System...\n')

// Teste 1: Verificar estado inicial
console.log('📋 Teste 1: Estado Inicial')
const debugData = window.__PRIVACY_DEBUG__
if (debugData && debugData['department-spending-chart']) {
  const state = debugData['department-spending-chart']
  console.log('✅ Componente registrado')
  console.log('  - isHidden:', state.isHidden, state.isHidden === false ? '✅ VISÍVEL' : '❌ ESCONDIDO')
  console.log('  - canToggle:', state.canToggle, state.canToggle ? '✅ PODE CONTROLAR' : '❌ SEM PERMISSÃO')
} else {
  console.log('❌ Componente não encontrado no debug')
}

// Teste 2: Verificar botão no DOM
console.log('\n📋 Teste 2: Botão no DOM')
const button = document.querySelector('.privacy-toggle-button-header')
if (button) {
  console.log('✅ Botão encontrado no DOM')
  const rect = button.getBoundingClientRect()
  console.log('  - Posição:', { top: rect.top, left: rect.left })
  console.log('  - Visível:', rect.width > 0 && rect.height > 0 ? '✅ SIM' : '❌ NÃO')
} else {
  console.log('❌ Botão NÃO encontrado no DOM')
}

// Teste 3: Verificar localStorage
console.log('\n📋 Teste 3: localStorage')
const savedState = localStorage.getItem('privacy-state')
if (savedState) {
  console.log('✅ Estado salvo encontrado')
  console.log('  - Conteúdo:', JSON.parse(savedState))
} else {
  console.log('ℹ️ Nenhum estado salvo (primeira visita ou limpo)')
}

// Teste 4: Verificar auth
console.log('\n📋 Teste 4: Autenticação')
const auth = JSON.parse(localStorage.getItem('auth') || '{}')
if (auth.roles) {
  console.log('✅ Auth encontrado')
  console.log('  - Roles:', auth.roles)
  const hasPermission = ['DEV', 'ADMIN', 'FINANCE'].some(r => 
    auth.roles.some(role => role.includes(r))
  )
  console.log('  - Tem permissão?', hasPermission ? '✅ SIM' : '❌ NÃO')
} else {
  console.log('❌ Auth não encontrado')
}

// Resumo
console.log('\n📊 Resumo dos Testes')
console.log('─'.repeat(50))
console.log('Componente registrado:', debugData?.['department-spending-chart'] ? '✅' : '❌')
console.log('Botão no DOM:', button ? '✅' : '❌')
console.log('Estado inicial visível:', debugData?.['department-spending-chart']?.isHidden === false ? '✅' : '❌')
console.log('Pode controlar:', debugData?.['department-spending-chart']?.canToggle ? '✅' : '❌')
console.log('─'.repeat(50))
console.log('\n✅ Testes concluídos!')
```

---

## 🔧 Comandos Úteis

### Limpar Estado (Simular Primeira Visita)
```javascript
localStorage.removeItem('privacy-state')
location.reload()
```

### Ver Estado Atual
```javascript
window.__PRIVACY_DEBUG__
```

### Ver localStorage
```javascript
console.log(JSON.parse(localStorage.getItem('privacy-state') || '{}'))
```

### Ver Auth
```javascript
console.log(JSON.parse(localStorage.getItem('auth') || '{}'))
```

### Forçar Esconder
```javascript
localStorage.setItem('privacy-state', JSON.stringify({
  'department-spending-chart': true
}))
location.reload()
```

### Forçar Mostrar
```javascript
localStorage.setItem('privacy-state', JSON.stringify({
  'department-spending-chart': false
}))
location.reload()
```

### Encontrar Todos os Botões
```javascript
const buttons = document.querySelectorAll('[data-privacy-toggle]')
console.log('Botões encontrados:', buttons.length)
buttons.forEach((btn, i) => {
  console.log(`Botão ${i+1}:`, btn.getAttribute('data-privacy-toggle'))
})
```

---

## 📝 Checklist de Validação

Marque cada teste conforme valida:

### Estado Inicial
- [ ] Componente aparece visível na primeira visita
- [ ] Botão aparece para DEV, ADMIN, FINANCE
- [ ] Botão NÃO aparece para USER, GUEST
- [ ] Debug data está disponível em `window.__PRIVACY_DEBUG__`

### Funcionalidade
- [ ] Clicar no botão esconde o componente
- [ ] Clicar novamente mostra o componente
- [ ] Ícone muda (Eye ↔ EyeOff)
- [ ] Animação suave ao esconder/mostrar

### Persistência
- [ ] Estado é salvo no localStorage
- [ ] Reload preserva estado escondido
- [ ] Reload preserva estado visível
- [ ] Múltiplos componentes mantêm estados independentes

### Debug
- [ ] Logs aparecem quando botão não renderiza
- [ ] Logs mostram userRole
- [ ] Logs mostram allowedRoles
- [ ] Mensagens são claras e úteis

### Performance
- [ ] Sem lag ao clicar
- [ ] Sem re-renders desnecessários
- [ ] localStorage atualiza corretamente

---

## 🐛 Problemas Comuns

### Botão não aparece

**Causas possíveis:**
1. Usuário não tem permissão (correto)
2. Config sem allowedRoles definido
3. Role não mapeada corretamente

**Debug:**
```javascript
const state = window.__PRIVACY_DEBUG__['department-spending-chart']
console.log('canToggle:', state.canToggle)
console.log('allowedRoles:', state.allowedRoles)

const auth = JSON.parse(localStorage.getItem('auth') || '{}')
console.log('userRoles:', auth.roles)
```

### Componente começa escondido

**Causas possíveis:**
1. localStorage tem estado salvo como `true`
2. Config tem `defaultHidden: true`

**Debug:**
```javascript
// Ver localStorage
const saved = JSON.parse(localStorage.getItem('privacy-state') || '{}')
console.log('Estado salvo:', saved)

// Ver config
const state = window.__PRIVACY_DEBUG__['department-spending-chart']
console.log('defaultHidden:', state.config?.defaultHidden)
```

**Solução:**
```javascript
// Limpar localStorage
localStorage.removeItem('privacy-state')
location.reload()
```

### Toggle não funciona

**Causas possíveis:**
1. Clique não está sendo capturado
2. Estado não está atualizando

**Debug:**
```javascript
// Adicionar listener temporário
const button = document.querySelector('.privacy-toggle-button-header')
button.addEventListener('click', (e) => {
  console.log('Clique capturado!', e)
})
```

---

## ✅ Testes Passou?

Se todos os testes passaram:

```
✅ Componente visível por padrão
✅ Botão aparece para roles corretas
✅ Toggle esconde e mostra
✅ Estado persiste no localStorage
✅ Debug logs funcionam
✅ Sem erros no console

🎉 Sistema funcionando perfeitamente!
```

---

**Última Atualização**: 22 de outubro de 2025  
**Versão**: 3.1.0 - Default Visible Behavior
