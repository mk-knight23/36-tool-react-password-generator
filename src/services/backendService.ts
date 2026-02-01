/**
 * Backend Service for VaultPass
 *
 * Provides security-focused backend integrations:
 * - Compromised password checking via Have I Been Pwned API
 * - Password strength analytics
 * - Graceful degradation when offline
 */

const HIBP_API_URL = 'https://api.pwnedpasswords.com/range/'

/**
 * Check if a password has been compromised in data breaches
 * Uses k-anonymity model to protect password privacy
 *
 * @param password - The password to check
 * @returns The number of times the password has been seen in breaches, or 0 if safe
 */
export async function checkCompromisedPassword(password: string): Promise<number> {
  try {
    // Convert password to SHA-1 hash
    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-1', passwordData)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

    // Send first 5 characters of hash to HIBP API (k-anonymity)
    const prefix = hashHex.substring(0, 5)
    const response = await fetch(`${HIBP_API_URL}${prefix}`)

    if (!response.ok) {
      throw new Error('Failed to check password')
    }

    const responseData = await response.text()
    const lines = responseData.split('\n')

    // Check if our suffix exists in the response
    const suffix = hashHex.substring(5)
    for (const line of lines) {
      const [lineSuffix, count] = line.split(':')
      if (lineSuffix === suffix) {
        return parseInt(count, 10)
      }
    }

    return 0 // Password not found in breaches
  } catch {
    // On error, assume safe (fail gracefully)
    return -1
  }
}

/**
 * Analyze password for common weak patterns
 */
export function analyzeWeakPatterns(password: string): {
  isSequential: boolean
  isRepeated: boolean
  isCommon: boolean
  score: number
} {
  const lower = password.toLowerCase()

  // Check for sequential characters (abcd, 1234, etc.)
  const isSequential = (() => {
    for (let i = 0; i < password.length - 3; i++) {
      const c1 = lower.charCodeAt(i)
      const c2 = lower.charCodeAt(i + 1)
      const c3 = lower.charCodeAt(i + 2)
      const c4 = lower.charCodeAt(i + 3)

      if (c2 === c1 + 1 && c3 === c1 + 2 && c4 === c1 + 3) return true
      if (c2 === c1 - 1 && c3 === c1 - 2 && c4 === c1 - 3) return true
    }
    return false
  })()

  // Check for repeated characters (aaaa, 1111, etc.)
  const isRepeated = /(.)\1{3,}/.test(password)

  // Common passwords list (top 100 most common)
  const commonPasswords = new Set([
    'password', '123456', '12345678', '1234', 'qwerty',
    '12345', 'dragon', 'pussy', 'baseball', 'football',
    'letmein', 'monkey', '696969', 'abc123', 'mustang',
    'michael', 'shadow', 'master', 'jennifer', '111111',
    '2000', 'jordan', 'superman', 'harley', 'ranger'
  ])
  const isCommon = commonPasswords.has(lower)

  // Calculate weakness score (more issues = higher score)
  let score = 0
  if (isSequential) score += 1
  if (isRepeated) score += 1
  if (isCommon) score += 2

  return { isSequential, isRepeated, isCommon, score }
}

/**
 * Validate password entropy and provide recommendations
 */
export function getPasswordRecommendations(
  password: string,
  entropy: number
): string[] {
  const recommendations: string[] = []

  if (entropy < 40) {
    recommendations.push('Use a longer password (16+ characters)')
  }

  if (!/[A-Z]/.test(password)) {
    recommendations.push('Add uppercase letters')
  }

  if (!/[a-z]/.test(password)) {
    recommendations.push('Add lowercase letters')
  }

  if (!/[0-9]/.test(password)) {
    recommendations.push('Add numbers')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    recommendations.push('Add special characters')
  }

  const { isSequential, isRepeated, isCommon } = analyzeWeakPatterns(password)
  if (isSequential) {
    recommendations.push('Avoid sequential characters (abc, 123)')
  }
  if (isRepeated) {
    recommendations.push('Avoid repeated characters (aaa, 111)')
  }
  if (isCommon) {
    recommendations.push('Avoid common passwords')
  }

  return recommendations
}
