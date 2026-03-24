/**
 * Email validation constants + utility
 *
 * Alag file mein kyun:
 * - Register.tsx, future forgot-password, settings sab use kar sakte hain
 * - Test karna easy — pure functions
 * - Domains update karna easy — ek jagah
 */

// ── Allowed domains ────────────────────────────────────────
export const VALID_DOMAINS = new Set([
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'hotmail.in',
  // Yahoo
  'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'yahoo.co.uk', 'ymail.com',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Privacy
  'protonmail.com', 'proton.me', 'tutanota.com', 'pm.me',
  // India
  'rediffmail.com',
  // Others
  'zoho.com', 'fastmail.com', 'hey.com',
])

// ── Blocked disposable domains ─────────────────────────────
export const BLOCKED_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com',
  'guerrillamail.com', 'throwaway.email', 'trashmail.com',
  'yopmail.com', 'sharklasers.com', 'fakeinbox.com',
  'dispostable.com', 'maildrop.cc', 'spamgourmet.com',
  'getairmail.com', 'mailnull.com', 'spamcorner.com',
  'tempinbox.com', 'tempr.email', 'discard.email',
])

// ── Common typo map ────────────────────────────────────────
export const EMAIL_TYPOS: Record<string, string> = {
  // Gmail typos
  'gmai.com':    'gmail.com',
  'gmial.com':   'gmail.com',
  'gmail.co':    'gmail.com',
  'gmail.cm':    'gmail.com',
  'gmail.con':   'gmail.com',
  'gmaill.com':  'gmail.com',
  'gnail.com':   'gmail.com',
  // Yahoo typos
  'yahooo.com':  'yahoo.com',
  'yaho.com':    'yahoo.com',
  'yahoo.co':    'yahoo.com',
  'yhoo.com':    'yahoo.com',
  // Outlook typos
  'outloo.com':  'outlook.com',
  'outlok.com':  'outlook.com',
  'outlook.co':  'outlook.com',
  // Hotmail typos
  'hotmai.com':  'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.co':  'hotmail.com',
  // iCloud typos
  'iclod.com':   'icloud.com',
  'icoud.com':   'icloud.com',
}

// ── Main validator ─────────────────────────────────────────
export function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required'

  const parts = email.toLowerCase().trim().split('@')
  if (parts.length !== 2) return 'Enter a valid email address'

  const [local, domain] = parts
  if (!local)              return 'Enter a valid email address'
  if (!domain?.includes('.')) return 'Enter a valid email address'

  // Blocked disposable
  if (BLOCKED_DOMAINS.has(domain)) return 'Disposable emails are not allowed'

  // Typo suggestion
  if (EMAIL_TYPOS[domain]) return `Did you mean @${EMAIL_TYPOS[domain]}?`

  return '' // valid
}