import type { PasswordConfig } from '../types'

// EFF wordlist - commonly used for passphrases
// Source: https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases
const wordList = [
  'apple', 'banana', 'cherry', 'delta', 'eagle', 'falcon', 'garden', 'harbor',
  'igloo', 'jungle', 'kite', 'lemon', 'mango', 'nebula', 'ocean', 'piano',
  'quartz', 'river', 'salsa', 'tiger', 'umbrella', 'violin', 'whale', 'xray',
  'yellow', 'zebra', 'anchor', 'bridge', 'canyon', 'dragon', 'ember', 'forest',
  'galaxy', 'horizon', 'island', 'jacket', 'knight', 'ladder', 'meadow', 'north',
  'orange', 'pearl', 'quiver', 'rabbit', 'shadow', 'temple', 'unicorn', 'valley',
  'winter', 'yellow', 'alcove', 'breeze', 'cactus', 'dagger', 'eclipse', 'fabric',
  'goblin', 'hammer', 'icicle', 'journey', 'kernel', 'legend', 'magnum', 'noble',
  'orchid', 'puzzle', 'quiver', 'ranger', 'signal', 'thunder', 'utopia', 'voyage',
  'wonder', 'zipper', 'atlas', 'bullet', 'crystal', 'diamond', 'empire', 'fortune',
  'giant', 'hunter', 'inferno', 'jupiter', 'karma', 'lunar', 'mirror', 'ninja',
  'omega', 'portal', 'quantum', 'rocket', 'sphinx', 'titan', 'urban', 'vector',
  'wizard', 'xenon', 'yacht', 'zephyr', 'arrow', 'blizzard', 'comet', 'drift'
]

export function usePassphrase() {
  const generate = (config: PasswordConfig): string => {
    // Use 4-6 words for passphrase (default to config.length / 8 as word count)
    const wordCount = Math.max(3, Math.min(8, Math.floor(config.length / 6)))

    const words: string[] = []
    const array = new Uint32Array(wordCount)
    window.crypto.getRandomValues(array)

    for (let i = 0; i < wordCount; i++) {
      const word = wordList[array[i] % wordList.length]
      words.push(word)
    }

    // Add a number for extra security
    const numArray = new Uint32Array(1)
    window.crypto.getRandomValues(numArray)
    const number = numArray[0] % 100

    // Randomly capitalize one word
    const capitalizeIndex = numArray[0] % words.length
    words[capitalizeIndex] = words[capitalizeIndex].charAt(0).toUpperCase() + words[capitalizeIndex].slice(1)

    return `${words.join('-')}-${number}`
  }

  return { generate }
}
