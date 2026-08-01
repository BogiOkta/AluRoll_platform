'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  STORAGE_APPEARANCE,
  STORAGE_LANGUAGE,
  createTranslator,
  isAppearance,
  isLanguage,
  toHtmlLang,
  type Appearance,
  type Language,
  type TranslateFn,
} from '@/lib/i18n'
import { applyDocumentTheme } from '@/lib/theme'

interface SettingsState {
  language: Language
  appearance: Appearance
}

const DEFAULT_STATE: SettingsState = {
  language: 'en',
  appearance: 'system',
}

let state: SettingsState = DEFAULT_STATE
let hydrated = false
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function readStoredLanguage(): Language {
  try {
    const value = localStorage.getItem(STORAGE_LANGUAGE)
    return isLanguage(value) ? value : 'en'
  } catch {
    return 'en'
  }
}

function readStoredAppearance(): Appearance {
  try {
    const value = localStorage.getItem(STORAGE_APPEARANCE)
    return isAppearance(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

function hydrateFromStorage() {
  if (hydrated || typeof window === 'undefined') return
  state = {
    language: readStoredLanguage(),
    appearance: readStoredAppearance(),
  }
  hydrated = true
  document.documentElement.lang = toHtmlLang(state.language)
  document.title = createTranslator(state.language)('meta.title')
  applyDocumentTheme(state.appearance)
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): SettingsState {
  return state
}

function getServerSnapshot(): SettingsState {
  return DEFAULT_STATE
}

function persistLanguage(language: Language) {
  state = { ...state, language }
  try {
    localStorage.setItem(STORAGE_LANGUAGE, language)
  } catch {
    /* ignore quota / private mode */
  }
  document.documentElement.lang = toHtmlLang(language)
  document.title = createTranslator(language)('meta.title')
  emit()
}

function persistAppearance(appearance: Appearance) {
  state = { ...state, appearance }
  try {
    localStorage.setItem(STORAGE_APPEARANCE, appearance)
  } catch {
    /* ignore quota / private mode */
  }
  applyDocumentTheme(appearance)
  emit()
}

interface SettingsContextValue {
  language: Language
  appearance: Appearance
  setLanguage: (language: Language) => void
  setAppearance: (appearance: Appearance) => void
  t: TranslateFn
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    hydrateFromStorage()
  }, [])

  useEffect(() => {
    if (snapshot.appearance !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyDocumentTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [snapshot.appearance])

  const setLanguage = useCallback((next: Language) => {
    persistLanguage(next)
  }, [])

  const setAppearance = useCallback((next: Appearance) => {
    persistAppearance(next)
  }, [])

  const t = useMemo(() => createTranslator(snapshot.language), [snapshot.language])

  const value = useMemo<SettingsContextValue>(
    () => ({
      language: snapshot.language,
      appearance: snapshot.appearance,
      setLanguage,
      setAppearance,
      t,
    }),
    [snapshot.language, snapshot.appearance, setLanguage, setAppearance, t],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

export function useT() {
  return useSettings().t
}

/** Inline boot script — keeps theme/lang in sync before React hydrates. */
export const SETTINGS_BOOT_SCRIPT = `(function(){try{var a=localStorage.getItem('${STORAGE_APPEARANCE}')||'system';var dark=a==='dark'||(a==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var d=document.documentElement;d.classList.toggle('dark',dark);d.style.colorScheme=dark?'dark':'light';var l=localStorage.getItem('${STORAGE_LANGUAGE}')||'en';d.lang=l==='sr'?'sr-Latn':'en';}catch(e){}})();`
