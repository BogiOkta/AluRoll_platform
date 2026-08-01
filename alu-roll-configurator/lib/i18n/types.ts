export type Language = 'en' | 'sr'

export type Appearance = 'system' | 'light' | 'dark'

export type HtmlLang = 'en' | 'sr-Latn'

export function toHtmlLang(language: Language): HtmlLang {
  return language === 'sr' ? 'sr-Latn' : 'en'
}

/** Nested string dictionary; leaves are strings. */
export type MessageTree = {
  [key: string]: string | MessageTree
}

export type TranslateValues = Record<string, string | number>

export type TranslateFn = (key: string, values?: TranslateValues) => string
