# 🏗️ Forgot Password - Arquitetura GraphQL

## 🎯 Fluxo Visual Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FORGOT PASSWORD FLOW - VISUAL                     │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: SEND VERIFICATION CODE
═══════════════════════════════════════════════════════════════════════

   User Browser                    Frontend App                Backend API
   ─────────────                   ────────────                ───────────

      │                                 │                            │
      │  1. Click "Forgot Password"     │                            │
      ├────────────────────────────────→│                            │
      │                                 │                            │
      │  2. Enter email & click submit  │                            │
      ├────────────────────────────────→│                            │
      │                                 │                            │
      │                    3. Call useSendForgotPasswordCodeMutation()│
      │                                 │                            │
      │                    4. Send GraphQL Mutation                  │
      │                                 │    with { email: "..." }   │
      │                                 ├───────────────────────────→│
      │                                 │                            │
      │                                 │    5. Process on backend:  │
      │                                 │    - Validate email exists │
      │                                 │    - Generate 6-digit code │
      │                                 │    - Save with TTL (15min) │
      │                                 │    - Send email via SMTP   │
      │                                 │                            │
      │                                 │    6. Return response:     │
      │                                 │    {                       │
      │                                 │      success: true,        │
      │                                 │      message: "Sent",      │
      │                                 │      error: null           │
      │                                 │    }                       │
      │                                 │←───────────────────────────┤
      │                                 │                            │
      │  7. Toast: "Code sent"          │                            │
      │  8. Redirect to /verify page    │                            │
      │←────────────────────────────────┤                            │


STEP 2: VERIFY CODE & GET RESET TOKEN
═══════════════════════════════════════════════════════════════════════

   User Browser                    Frontend App                Backend API
   ─────────────                   ────────────                ───────────

      │                                 │                            │
      │  1. Enter 6-digit code          │                            │
      ├────────────────────────────────→│                            │
      │                                 │                            │
      │  2. Click "Verify Code"         │                            │
      ├────────────────────────────────→│                            │
      │                                 │                            │
      │                    3. Call useVerifyForgotPasswordCodeMutation()
      │                                 │                            │
      │                    4. Send GraphQL Mutation                  │
      │                                 │  { email, code: "123456" } │
      │                                 ├───────────────────────────→│
      │                                 │                            │
      │                                 │    5. Process on backend:  │
      │                                 │    - Find code in DB       │
      │                                 │    - Check not expired     │
      │                                 │    - Validate matches user │
      │                                 │    - Generate JWT token    │
      │                                 │    - Delete code from DB   │
      │                                 │                            │
      │                                 │    6. Return response:     │
      │                                 │    {                       │
      │                                 │      success: true,        │
      │                                 │      message: "Verified",  │
      │                                 │      error: null,          │
      │  ◄────── resetToken ◄───────────│  resetToken: "eyJ..."  ◄──┤
      │                                 │    }                       │
      │                                 │                            │
      │  7. Toast: "Code verified"      │                            │
      │  8. Extract resetToken from URL │                            │
      │  9. Redirect to /reset page     │                            │
      │←────────────────────────────────┤                            │


STEP 3: RESET PASSWORD WITH TOKEN
═══════════════════════════════════════════════════════════════════════

   User Browser                    Frontend App                Backend API
   ─────────────                   ────────────                ───────────

      │                                 │                            │
      │  1. Enter new password (min 8)  │                            │
      ├────────────────────────────────→│                            │
      │                                 │                            │
      │  2. Confirm password            │                            │
      ├────────────────────────────────→│                            │
      │                                 │                            │
      │  3. Click "Reset Password"      │                            │
      ├────────────────────────────────→│                            │
      │                                 │                            │
      │                    4. Call useResetPasswordMutation()        │
      │                                 │                            │
      │                    5. Send GraphQL Mutation                  │
      │                                 │  {                         │
      │                                 │    email,                  │
      │                                 │    code,                   │
      │                                 │    newPassword,            │
      │                                 │    resetToken              │
      │                                 │  }                         │
      │                                 ├───────────────────────────→│
      │                                 │                            │
      │                                 │    6. Process on backend:  │
      │                                 │    - Validate JWT token    │
      │                                 │    - Check token not exp.  │
      │                                 │    - Validate email & code │
      │                                 │    - Validate password len │
      │                                 │    - Hash password (bcrypt)│
      │                                 │    - Update in DB          │
      │                                 │    - Logout all sessions   │
      │                                 │    - Delete token from DB  │
      │                                 │                            │
      │                                 │    7. Return response:     │
      │                                 │    {                       │
      │                                 │      success: true,        │
      │                                 │      message: "Done",      │
      │                                 │      error: null           │
      │                                 │    }                       │
      │                                 │←───────────────────────────┤
      │                                 │                            │
      │  8. Toast: "Password reset"     │                            │
      │  9. Auto-redirect to /login     │                            │
      │←────────────────────────────────┤                            │
      │                                 │                            │
      │  ✅ User can login with new pw  │                            │
      │                                 │                            │
```

---

## 🏛️ Camadas da Aplicação

```
┌────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                          │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  forgot-pwd/    │  │  forgot-pwd/     │  │ forgot-pwd/     │  │
│  │  page.tsx       │  │  verify/page.tsx │  │ reset/page.tsx  │  │
│  │                 │  │                  │  │                 │  │
│  │ Send Email      │  │ Verify Code      │  │ Reset Password  │  │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬────────┘  │
│           │                    │                     │             │
│           └────────┬───────────┴─────────────────────┘             │
│                    │                                               │
└────────────────────┼───────────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                         HOOKS LAYER                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  hooks/graphql/use-forgot-password-mutation.ts             │  │
│  │                                                             │  │
│  │  useSendForgotPasswordCodeMutation()                        │  │
│  │  useVerifyForgotPasswordCodeMutation()                      │  │
│  │  useResetPasswordMutation()                                 │  │
│  │                                                             │  │
│  │  ✨ Tipagem forte com TypeScript                            │  │
│  │  ✨ Encapsula logic de mutations                            │  │
│  │  ✨ Retorna { loading, error, data }                        │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│                      GRAPHQL LAYER (Apollo)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  graphql/mutations/FORGOT_PASSWORD_MUTATIONS.ts            │  │
│  │                                                             │  │
│  │  mutation SendForgotPasswordCode($email: String!) { ... }  │  │
│  │  mutation VerifyForgotPasswordCode($email, $code) { ... }  │  │
│  │  mutation ResetPassword($email, $code, ...) { ... }        │  │
│  │                                                             │  │
│  │  ✨ Queries GraphQL definidas com gql``                     │  │
│  │  ✨ Gerenciadas pelo Apollo Client                          │  │
│  │  ✨ Cache automático                                        │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│                      HTTP LAYER (Network)                          │
│                                                                    │
│  POST /graphql HTTP/1.1                                           │
│  Authorization: Bearer <jwt_token>                                │
│  Content-Type: application/json                                   │
│                                                                    │
│  {                                                                │
│    "operationName": "SendForgotPasswordCode",                     │
│    "query": "mutation SendForgotPasswordCode(...) { ... }",       │
│    "variables": { "email": "user@example.com" }                  │
│  }                                                                │
│                                                                    │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                      API LAYER (Backend)                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  GraphQL Resolvers                                          │  │
│  │  - sendForgotPasswordCode(email)                            │  │
│  │  - verifyForgotPasswordCode(email, code)                    │  │
│  │  - resetPassword(email, code, password, token)             │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                        │
│  ┌────────────────────┴─────────────────────────────────────┐  │
│  │  Services                                                 │  │
│  │  - PasswordResetService                                   │  │
│  │  - EmailService                                           │  │
│  │  - TokenService                                           │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                        │
│  ┌────────────────────┴─────────────────────────────────────┐  │
│  │  Database                                                 │  │
│  │  - users table                                            │  │
│  │  - password_reset_codes table                             │  │
│  │  - sessions table                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Componentes GraphQL

```
MUTATION LAYER
══════════════

┌─ SEND_FORGOT_PASSWORD_CODE
│  Input:  { email: String! }
│  Output: { success, message, error }
│  Action: Gera código + envia email
│
├─ VERIFY_FORGOT_PASSWORD_CODE
│  Input:  { email: String!, code: String! }
│  Output: { success, message, error, resetToken }
│  Action: Valida código + gera token
│
└─ RESET_PASSWORD
   Input:  { email, code, newPassword, resetToken }
   Output: { success, message, error }
   Action: Reseta senha com token


DATA FLOW
═════════

User Input (email)
      ↓
Frontend Validation
      ↓
useSendForgotPasswordCodeMutation()
      ↓
SEND_FORGOT_PASSWORD_CODE GraphQL Mutation
      ↓
Apollo Client (cache + network)
      ↓
HTTP POST /graphql
      ↓
Backend GraphQL Server
      ↓
Resolver: sendForgotPasswordCode()
      ↓
Service: GenerateCode() + SendEmail()
      ↓
Database: Save code with TTL
      ↓
SMTP: Send verification email
      ↓
Response: { success, message }
      ↓
Apollo Client (cache update)
      ↓
Frontend: Handle response
      ↓
Toast notification
      ↓
Redirect to next step
```

---

## 🔐 Segurança - Token Flow

```
FRONTEND                          BACKEND                    EMAIL SERVICE
────────────────────────────────────────────────────────────────────────

Step 1: Send Code
─────────────────
User input "user@example.com"
         ↓
Send GraphQL mutation
         ├──────────────────→ Validate email exists
         │                    Generate code: "123456"
         │                    Save: code + TTL(15min)
         │                    ├──────────────────────→ Send email
         │                    │                        "Your code: 123456"
         │←──────────────────  Return { success: true }


Step 2: Verify Code
───────────────────
User input code "123456"
         ↓
Send GraphQL mutation
         ├──────────────────→ Fetch code from DB
         │                    Verify not expired
         │                    Validate matches email
         │                    Generate JWT token
         │                    resetToken = JWT(payload, 1h)
         │                    Delete code from DB
         │←──────────────────  Return { resetToken }


Step 3: Reset Password
──────────────────────
User input password
         ↓
Extract resetToken from URL
         ↓
Send GraphQL mutation with resetToken
         ├──────────────────→ Validate JWT token
         │                    Extract email from JWT
         │                    Hash new password (bcrypt)
         │                    Update user.password in DB
         │                    Invalidate all user sessions
         │                    Delete JWT token
         │←──────────────────  Return { success: true }
         ↓
Auto-redirect to /login
         ↓
User login com nova senha


SECURITY POINTS
───────────────

1️⃣  JWT Validation on every request
2️⃣  Code expiration (15 minutes)
3️⃣  Token expiration (1 hour)
4️⃣  Rate limiting (60s between resend)
5️⃣  Password hashing (bcrypt)
6️⃣  HTTPS only
7️⃣  Session invalidation
```

---

## 📊 Estado & Props

```
FORGOT PASSWORD PAGE
═════════════════════

State:
  - email: string
  - error: string
  - (isSubmitting: managed by Apollo loading)

Props from URL:
  (none)

Props from Mutation:
  - loading: boolean (isSubmitting equivalent)
  - data?: { sendForgotPasswordCode: {...} }
  - error?: ApolloError


VERIFY CODE PAGE
════════════════

State:
  - code: string
  - email: string (from URL)
  - error: string
  - resendCooldown: number (60 → 0)

Props from URL:
  - email: string

Props from Mutations:
  - verifyCode loading/data/error
  - resendCode loading/data/error


RESET PASSWORD PAGE
═══════════════════

State:
  - password: string
  - confirmPassword: string
  - showPassword: boolean
  - email: string (from URL)
  - code: string (from URL)
  - resetToken: string (from URL)
  - error: string

Props from URL:
  - email: string
  - code: string
  - resetToken: string (JWT)

Props from Mutation:
  - loading: boolean
  - data?: { resetPassword: {...} }
```

---

## ✅ Checklist de Implementação

```
GRAPHQL LAYER
┌─ SEND_FORGOT_PASSWORD_CODE    ✅
├─ VERIFY_FORGOT_PASSWORD_CODE  ✅
└─ RESET_PASSWORD               ✅

HOOKS LAYER
┌─ useSendForgotPasswordCodeMutation       ✅
├─ useVerifyForgotPasswordCodeMutation     ✅
└─ useResetPasswordMutation                ✅

PAGES
┌─ /forgot-password (send email)           ✅
├─ /forgot-password/verify (verify code)   ✅
└─ /forgot-password/reset (reset password) ✅

FEATURES
┌─ Email validation                        ✅
├─ Code generation & expiration            ✅
├─ JWT reset token                         ✅
├─ Error handling                          ✅
├─ Loading states                          ✅
├─ Toast notifications                     ✅
├─ Auto-redirect                           ✅
├─ Rate limiting (frontend)                ✅
└─ TypeScript types                        ✅
```

---

*Última atualização: 16 de Novembro de 2025* ✅
