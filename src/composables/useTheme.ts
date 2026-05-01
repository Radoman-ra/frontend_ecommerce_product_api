import { ref, watch, onMounted } from 'vue'

export type ThemeName = 'light' | 'dark'

const STORAGE_KEY = 'theme'

const getInitialTheme = (): ThemeName => {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null
  if (saved === 'light' || saved === 'dark') return saved
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

const theme = ref<ThemeName>(getInitialTheme())

const applyTheme = (value: ThemeName) => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', value)
  document.documentElement.style.colorScheme = value
}

if (typeof document !== 'undefined') {
  applyTheme(theme.value)
}

watch(theme, (value) => {
  applyTheme(value)
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Ignore storage failures (private mode etc.)
  }
})

export const useTheme = () => {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (value: ThemeName) => {
    theme.value = value
  }

  // Sync with system preference if user hasn't picked one explicitly.
  onMounted(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    }
    media.addEventListener('change', handler)
  })

  return {
    theme,
    toggleTheme,
    setTheme
  }
}
