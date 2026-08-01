'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OptionCard({
  label,
  description,
  selected,
  onSelect,
  icon,
}: {
  label: string
  description: string
  selected: boolean
  onSelect: () => void
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/[0.04] ring-1 ring-primary'
          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40',
      )}
    >
      {icon && (
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            selected ? 'bg-primary/12 text-primary' : 'bg-muted text-muted-foreground',
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold">{label}</span>
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all',
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-transparent',
        )}
        aria-hidden
      >
        <Check className="size-3" />
      </span>
    </button>
  )
}
