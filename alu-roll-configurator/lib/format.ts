import type { Language, TranslateFn } from '@/lib/i18n'

export function formatRelative(ts: number, t: TranslateFn, language: Language = 'en'): string {
  const diff = Date.now() - ts
  const day = 86_400_000
  if (diff < day) return t('format.today')
  if (diff < 2 * day) return t('format.yesterday')
  const days = Math.floor(diff / day)
  if (days < 7) return t('format.daysAgo', { count: days })
  if (days < 30) return t('format.weeksAgo', { count: Math.floor(days / 7) })
  const locale = language === 'sr' ? 'sr-Latn' : 'en-GB'
  return new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

export function formatDimensions(width: number | undefined, height: number | undefined, t: TranslateFn): string {
  if (!width || !height) return t('format.notSized')
  return `${width} × ${height} mm`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
}

export function positionWord(count: number, t: TranslateFn, language: Language = 'en'): string {
  if (count === 1) return t('common.position')
  if (language === 'sr' && count >= 2 && count <= 4) return t('common.positionsFew')
  return t('common.positions')
}
