import type { Appearance } from '@/lib/i18n'

export function resolveDarkMode(appearance: Appearance): boolean {
  if (appearance === 'dark') return true
  if (appearance === 'light') return false
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyDocumentTheme(appearance: Appearance) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const dark = resolveDarkMode(appearance)
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}
