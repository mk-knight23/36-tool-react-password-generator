import { ref } from 'vue'

// Syllable patterns for pronounceable passwords
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'
const VOWELS = 'aeiou'
const COMMON_PAIRS = ['th', 'ch', 'sh', 'ph', 'wh', 'ng', 'ck', 'nd', 'st', 'rt', 'rm', 'rn', 'lt']

export function usePronounceable() {
  const randomChar = (chars: string): string => {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return chars[array[0] % chars.length]
  }

  const generateSyllable = (): string => {
    const patterns = 'cv vc cvc vcc ccv'
    const pattern = randomChar(patterns)
    let syllable = ''

    for (const char of pattern) {
      if (char === 'c') {
        // 20% chance to use a common consonant pair
        if (Math.random() < 0.2 && syllable.length === 0) {
          syllable += randomChar(CONSONANTS)
        }
        syllable += randomChar(CONSONANTS)
      } else {
        syllable += randomChar(VOWELS)
      }
    }

    return syllable
  }

  const generate = (length: number, syllableCount: number): string => {
    const syllables: string[] = []

    // Generate syllables
    for (let i = 0; i < syllableCount; i++) {
      syllables.push(generateSyllable())
    }

    let password = syllables.join('-')

    // If we need more characters, add to the last syllable
    while (password.length < length && password.replace(/-/g, '').length < length) {
      const lastIdx = password.length - 1
      if (password[lastIdx] === '-') {
        password += randomChar(CONSONANTS)
      } else {
        password += randomChar(Math.random() > 0.5 ? CONSONANTS : VOWELS)
      }
    }

    // Trim if too long
    if (password.length > length) {
      password = password.substring(0, length)
      // Avoid ending with hyphen
      if (password.endsWith('-')) {
        password = password.slice(0, -1) + randomChar(CONSONANTS)
      }
    }

    // Capitalize first letter of each syllable for readability
    password = password
      .split('-')
      .map(syl => syl.charAt(0).toUpperCase() + syl.slice(1))
      .join('-')

    // Add a random digit at the end for extra entropy
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    const digit = (array[0] % 10).toString()
    password += digit

    return password
  }

  return { generate }
}
