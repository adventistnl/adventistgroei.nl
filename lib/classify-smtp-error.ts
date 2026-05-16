/**
 * Translated messages for each SMTP error category.
 * All fields must be provided by the caller using the appropriate i18n translations.
 */
export interface SmtpErrorMessages {
  /** SMTP auth failure: wrong credentials, 535, bad credentials */
  smtpAuthFailed: string
  /** Cannot reach the server: timeout, ECONNREFUSED, ECONNRESET */
  smtpConnectionFailed: string
  /** Recipient address rejected, invalid email format */
  smtpInvalidAddress: string
  /** Rate limit or daily quota exceeded */
  smtpRateLimited: string
  /** TLS / SSL / certificate errors */
  smtpTlsFailed: string
  /** Generic fallback when no specific category matches */
  fallback: string
}

/**
 * Classifies a raw SMTP/nodemailer error string and returns the matching
 * translated message — never exposes technical details, URLs, or hash codes.
 */
export function classifySmtpError(rawError: string, messages: SmtpErrorMessages): string {
  if (!rawError) return messages.fallback

  const lower = rawError.toLowerCase()

  // SMTP authentication failures (535, bad credentials, invalid login)
  if (
    lower.includes('535') ||
    lower.includes('bad credentials') ||
    lower.includes('username and password') ||
    lower.includes('invalid login') ||
    lower.includes('authentication failed') ||
    lower.includes('authentication credentials') ||
    lower.includes('not accepted')
  ) {
    return messages.smtpAuthFailed
  }

  // Network / connectivity failures
  if (
    lower.includes('timeout') ||
    lower.includes('timed out') ||
    lower.includes('econnrefused') ||
    lower.includes('econnreset') ||
    lower.includes('etimedout') ||
    lower.includes('connection refused')
  ) {
    return messages.smtpConnectionFailed
  }

  // Recipient / address rejected
  if (
    lower.includes('invalid email') ||
    lower.includes('bad email address') ||
    lower.includes('malformed') ||
    lower.includes('recipient address rejected') ||
    lower.includes('no such user')
  ) {
    return messages.smtpInvalidAddress
  }

  // Rate limit / sending quota
  if (
    lower.includes('rate limit') ||
    lower.includes('too many') ||
    lower.includes('quota') ||
    lower.includes('daily sending limit')
  ) {
    return messages.smtpRateLimited
  }

  // TLS / certificate issues
  if (lower.includes('tls') || lower.includes('certificate') || lower.includes('ssl')) {
    return messages.smtpTlsFailed
  }

  // Generic fallback — never expose raw SMTP output
  return messages.fallback
}
