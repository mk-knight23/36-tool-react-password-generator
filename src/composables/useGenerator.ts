import { ref } from 'vue'
import type { PasswordConfig } from '../types'

export function useGenerator() {
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O'
  }

  const generate = (config: PasswordConfig): string => {
    // Add length validation
    if (config.length < 4) {
      console.warn('Password length too short. Minimum length is 4.');
      return '';
    }

    // Add charset validation
    if (!config.useUppercase &&
      !config.useLowercase &&
      !config.useNumbers &&
      !config.useSymbols) {
      console.warn('No character sets selected. Please select at least one.');
      return '';
    }

    let allowedChars = ''
    if (config.useUppercase) allowedChars += charSets.uppercase
    if (config.useLowercase) allowedChars += charSets.lowercase
    if (config.useNumbers) allowedChars += charSets.numbers
    if (config.useSymbols) allowedChars += charSets.symbols

    if (config.excludeSimilar) {
      const similarRegex = new RegExp(`[${charSets.similar}]`, 'g')
      allowedChars = allowedChars.replace(similarRegex, '')
    }

    if (!allowedChars) return ''

    let password = ''
    const array = new Uint32Array(config.length)
    window.crypto.getRandomValues(array)

    for (let i = 0; i < config.length; i++) {
      password += allowedChars.charAt(array[i] % allowedChars.length)
    }

    return password
  }

  return { generate }
}
