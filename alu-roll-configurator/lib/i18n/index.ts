import { en } from './en'
import { sr } from './sr'
import type { Language, MessageTree, TranslateFn, TranslateValues } from './types'

export type { Appearance, HtmlLang, Language, TranslateFn, TranslateValues } from './types'
export { toHtmlLang } from './types'

export const STORAGE_LANGUAGE = 'aluroll-language'
export const STORAGE_APPEARANCE = 'aluroll-appearance'

export const DEFAULT_LANGUAGE: Language = 'en'

const dictionaries: Record<Language, MessageTree> = { en, sr }

function lookup(tree: MessageTree, key: string): string | undefined {
  const parts = key.split('.')
  let node: string | MessageTree | undefined = tree
  for (const part of parts) {
    if (node == null || typeof node === 'string') return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

function interpolate(template: string, values?: TranslateValues): string {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = values[name]
    return value === undefined ? `{${name}}` : String(value)
  })
}

export function getDictionary(language: Language): MessageTree {
  return dictionaries[language] ?? dictionaries.en
}

export function createTranslator(language: Language): TranslateFn {
  const primary = getDictionary(language)
  const fallback = dictionaries.en
  return (key, values) => {
    const raw = lookup(primary, key) ?? lookup(fallback, key) ?? key
    return interpolate(raw, values)
  }
}

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'sr'
}

export function isAppearance(value: unknown): value is import('./types').Appearance {
  return value === 'system' || value === 'light' || value === 'dark'
}
