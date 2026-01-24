import type { PasswordStrength } from '../types'

export function useStrength() {
  const calculate = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: 'Weak', entropy: 0, color: 'bg-slate-500' }
    }

    let charsetSize = 0
    if (/[a-z]/.test(password)) charsetSize += 26
    if (/[A-Z]/.test(password)) charsetSize += 26
    if (/[0-9]/.test(password)) charsetSize += 10
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32

    const entropy = Math.round(password.length * Math.log2(charsetSize))

    if (entropy < 40) return { score: 0, label: 'Weak', entropy, color: 'bg-red-500' }
    if (entropy < 60) return { score: 1, label: 'Fair', entropy, color: 'bg-orange-500' }
    if (entropy < 80) return { score: 2, label: 'Good', entropy, color: 'bg-yellow-500' }
    if (entropy < 100) return { score: 3, label: 'Strong', entropy, color: 'bg-blue-500' }
    return { score: 4, label: 'Secure', entropy, color: 'bg-emerald-500' }
  }

  return { calculate }
}
