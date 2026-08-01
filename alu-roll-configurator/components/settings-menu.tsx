'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Check, Settings2 } from 'lucide-react'
import { useSettings } from '@/components/settings-provider'
import type { Appearance, Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'

function SegmentedOption<T extends string>({
  value,
  current,
  label,
  onSelect,
}: {
  value: T
  current: T
  label: string
  onSelect: (value: T) => void
}) {
  const selected = value === current
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(value)}
      className={cn(
        'flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
        selected
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {selected && <Check className="size-3 shrink-0" aria-hidden />}
      {label}
    </button>
  )
}

export function SettingsPanel({ className }: { className?: string }) {
  const { language, appearance, setLanguage, setAppearance, t } = useSettings()

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: t('settings.english') },
    { id: 'sr', label: t('settings.serbian') },
  ]

  const appearances: { id: Appearance; label: string }[] = [
    { id: 'system', label: t('settings.system') },
    { id: 'light', label: t('settings.light') },
    { id: 'dark', label: t('settings.dark') },
  ]

  return (
    <div className={cn('flex w-64 flex-col gap-4 p-3', className)}>
      <p className="px-0.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {t('settings.title')}
      </p>

      <div className="flex flex-col gap-1.5">
        <p className="px-0.5 text-xs font-medium text-foreground">{t('settings.language')}</p>
        <div
          role="radiogroup"
          aria-label={t('settings.language')}
          className="flex rounded-lg bg-muted p-0.5"
        >
          {languages.map((item) => (
            <SegmentedOption
              key={item.id}
              value={item.id}
              current={language}
              label={item.label}
              onSelect={setLanguage}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="px-0.5 text-xs font-medium text-foreground">{t('settings.appearance')}</p>
        <div
          role="radiogroup"
          aria-label={t('settings.appearance')}
          className="flex rounded-lg bg-muted p-0.5"
        >
          {appearances.map((item) => (
            <SegmentedOption
              key={item.id}
              value={item.id}
              current={appearance}
              label={item.label}
              onSelect={setAppearance}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SettingsPopover({
  trigger,
  align = 'end',
}: {
  trigger: ReactNode
  align?: 'start' | 'end'
}) {
  const { t } = useSettings()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t('settings.openSettings')}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {trigger}
      </button>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t('settings.title')}
          className={cn(
            'absolute top-full z-50 mt-2 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          <SettingsPanel />
        </div>
      )}
    </div>
  )
}

/** Compact gear trigger for surfaces without a user avatar (e.g. login). */
export function SettingsGearButton({ className }: { className?: string }) {
  return (
    <SettingsPopover
      trigger={
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            className,
          )}
        >
          <Settings2 className="size-4" />
        </span>
      }
    />
  )
}
