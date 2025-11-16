# 📚 Forgot Password - Guia de Referência Rápida

## 🎯 Quick Reference

### **Arquivos Principais**

```
✅ graphql/mutations/FORGOT_PASSWORD_MUTATIONS.ts
   - SEND_FORGOT_PASSWORD_CODE
   - VERIFY_FORGOT_PASSWORD_CODE
   - RESET_PASSWORD

✅ hooks/graphql/use-forgot-password-mutation.ts
   - useSendForgotPasswordCodeMutation()
   - useVerifyForgotPasswordCodeMutation()
   - useResetPasswordMutation()

✅ app/forgot-password/page.tsx
   - Página 1: Inserir Email

✅ app/forgot-password/verify/page.tsx
   - Página 2: Verificar Código

✅ app/forgot-password/reset/page.tsx
   - Página 3: Definir Nova Senha
```

---

## 💻 Exemplos de Código

### **Exemplo 1: Usar em Novo Componente**

```typescript
import { useSendForgotPasswordCodeMutation } from '@/hooks/graphql/use-forgot-password-mutation'

export function MyComponent() {
  const [sendCode, { loading }] = useSendForgotPasswordCodeMutation()

  const handleSend = async () => {
    try {
      const response = await sendCode({
        variables: { email: "user@example.com" }
      })

      const result = response.data?.sendForgotPasswordCode

      if (result?.success) {
        console.log("✅ Email sent:", result?.message)
      } else {
        console.error("❌ Error:", result?.error)
      }
    } catch (error) {
      console.error("❌ Exception:", error)
    }
  }

  return (
    <button onClick={handleSend} disabled={loading}>
      {loading ? "Sending..." : "Send Code"}
    </button>
  )
}
```

---

### **Exemplo 2: Integração Completa com Form**

```typescript
import { useState } from 'react'
import toast from "react-hot-toast"
import { useSendForgotPasswordCodeMutation } from '@/hooks/graphql/use-forgot-password-mutation'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sendCode, { loading }] = useSendForgotPasswordCodeMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required')
      return
    }

    try {
      const { data, errors } = await sendCode({
        variables: { email }
      })

      // ✅ Trata erro GraphQL
      if (errors && errors.length > 0) {
        const errorMsg = errors[0].message
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }

      // ✅ Trata sucesso/erro do servidor
      const result = data?.sendForgotPasswordCode

      if (result?.success) {
        toast.success(result?.message || "Code sent to your email")
        setEmail('')
        // Redirecionar, etc...
      } else {
        const errorMsg = result?.error || 'Unknown error'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error'
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={loading}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Code'}
      </button>
    </form>
  )
}
```

---

### **Exemplo 3: Usar Todas as 3 Mutations (Fluxo Completo)**

```typescript
import { useRouter } from 'next/navigation'
import {
  useSendForgotPasswordCodeMutation,
  useVerifyForgotPasswordCodeMutation,
  useResetPasswordMutation,
} from '@/hooks/graphql/use-forgot-password-mutation'

export function ForgotPasswordFlow() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const router = useRouter()

  // ✅ Mutation 1: Send Code
  const [sendCode] = useSendForgotPasswordCodeMutation()

  // ✅ Mutation 2: Verify Code
  const [verifyCode] = useVerifyForgotPasswordCodeMutation()

  // ✅ Mutation 3: Reset Password
  const [resetPassword] = useResetPasswordMutation()

  // Step 1: Send email
  const handleSendCode = async () => {
    const response = await sendCode({ variables: { email } })
    if (response.data?.sendForgotPasswordCode?.success) {
      setStep(2)
    }
  }

  // Step 2: Verify code
  const handleVerifyCode = async () => {
    const response = await verifyCode({ 
      variables: { email, code } 
    })
    const result = response.data?.verifyForgotPasswordCode
    
    if (result?.success && result?.resetToken) {
      setResetToken(result.resetToken)
      setStep(3)
    }
  }

  // Step 3: Reset password
  const handleResetPassword = async () => {
    const response = await resetPassword({
      variables: {
        email,
        code,
        newPassword: password,
        resetToken,
      }
    })
    
    if (response.data?.resetPassword?.success) {
      router.push('/login')
    }
  }

  return (
    <div>
      {step === 1 && (
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button onClick={handleSendCode}>Send Code</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            maxLength={6}
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  )
}
```

---

## 🔗 Integração com Contexto de Autenticação

```typescript
// Usar dentro de um contexto de autenticação
import { useAuth } from '@/context/AuthContext'
import { useSendForgotPasswordCodeMutation } from '@/hooks/graphql/use-forgot-password-mutation'

export function MyAuthComponent() {
  const { user, logout } = useAuth()
  const [sendCode] = useSendForgotPasswordCodeMutation()

  const handleForgotPassword = async (email: string) => {
    const response = await sendCode({ variables: { email } })
    return response.data?.sendForgotPasswordCode?.success
  }

  return (
    <div>
      {user ? (
        <p>Logged in as {user.email}</p>
      ) : (
        <button onClick={() => handleForgotPassword('test@example.com')}>
          Forgot Password
        </button>
      )}
    </div>
  )
}
```

---

## 📊 Tratamento de Erro Robusto

```typescript
interface ErrorResponse {
  field?: string
  message: string
}

async function safeMutation(
  mutation: any,
  variables: any
): Promise<{ success: boolean; error?: ErrorResponse }> {
  try {
    const { data, errors } = await mutation({ variables })

    // ✅ Erro GraphQL
    if (errors && errors.length > 0) {
      return {
        success: false,
        error: {
          message: errors[0].message,
          field: errors[0].extensions?.field,
        }
      }
    }

    // ✅ Erro do servidor (success: false)
    const result = data?.mutation
    if (!result?.success) {
      return {
        success: false,
        error: { message: result?.error || 'Unknown error' }
      }
    }

    // ✅ Sucesso
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Uso:
const { success, error } = await safeMutation(sendCode, { email })
if (!success) {
  console.error(`❌ Error: ${error?.message}`)
}
```

---

## 🧪 Testes Unitários (Jest)

```typescript
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSendForgotPasswordCodeMutation } from '@/hooks/graphql/use-forgot-password-mutation'
import { MockedProvider } from '@apollo/client/testing'

describe('useSendForgotPasswordCodeMutation', () => {
  it('should send code successfully', async () => {
    const mocks = [
      {
        request: {
          query: SEND_FORGOT_PASSWORD_CODE,
          variables: { email: 'test@example.com' }
        },
        result: {
          data: {
            sendForgotPasswordCode: {
              success: true,
              message: 'Code sent',
              error: null
            }
          }
        }
      }
    ]

    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={mocks}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useSendForgotPasswordCodeMutation(), { wrapper })
    const [sendCode] = result.current

    let response: any
    await act(async () => {
      response = await sendCode({ variables: { email: 'test@example.com' } })
    })

    expect(response.data?.sendForgotPasswordCode?.success).toBe(true)
  })
})
```

---

## 🔍 Debug Tips

### **Ver resposta GraphQL no Console:**

```typescript
const response = await sendCode({ variables: { email } })
console.log('📊 Response:', response)
console.log('📊 Data:', response.data)
console.log('📊 Errors:', response.errors)
```

### **Verificar Network Tab:**

1. Abrir DevTools → Network
2. Filtrar por "graphql" ou "POST"
3. Clicar na requisição
4. Ver:
   - **Request**: Mutation + Variables
   - **Response**: Data + Errors

### **Apollo DevTools:**

```typescript
// Instalar: apollo-client-devtools (Chrome extension)
// Ver: Apollo → Queries → sendForgotPasswordCode
```

---

## ⚠️ Erros Comuns

### **Erro: "Cannot read property 'data' of undefined"**
```typescript
// ❌ Errado
const result = response.data.sendForgotPasswordCode

// ✅ Correto
const result = response.data?.sendForgotPasswordCode
```

### **Erro: "loading is undefined"**
```typescript
// ❌ Errado
const [sendCode] = useSendForgotPasswordCodeMutation()

// ✅ Correto
const [sendCode, { loading }] = useSendForgotPasswordCodeMutation()
```

### **Erro: "resetToken is null"**
```typescript
// ❌ Não verificar sucesso
const token = response.data?.verifyCode?.resetToken

// ✅ Verificar sucesso primeiro
if (response.data?.verifyCode?.success) {
  const token = response.data.verifyCode.resetToken
}
```

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique a documentação em `FORGOT_PASSWORD_GRAPHQL_INTEGRATION.md`
2. Veja exemplos em `FORGOT_PASSWORD_IMPLEMENTATION_SUMMARY.md`
3. Consulte o código em `/app/forgot-password/*.tsx`
4. Verifique logs do backend nos eventos do GraphQL

---

**Última atualização: 16 de Novembro de 2025** ✅
