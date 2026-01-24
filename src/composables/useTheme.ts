import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    selector: 'body',
    attribute: 'class',
    valueDark: '',
    valueLight: 'light'
  })
  const toggleTheme = useToggle(isDark)

  return { isDark, toggleTheme }
}
