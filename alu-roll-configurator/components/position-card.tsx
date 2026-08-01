'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { ShutterPreview } from '@/components/shutter-preview'
import { useSettings } from '@/components/settings-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  applicationLabel,
  colorLabel,
  configProgress,
  isConfigComplete,
  mountingLabel,
  operationLabel,
  profileLabel,
} from '@/lib/config-schema'
import { formatDimensions } from '@/lib/format'
import type { Position } from '@/lib/types'

export function PositionCard({
  projectId,
  position,
}: {
  projectId: string
  position: Position
}) {
  const router = useRouter()
  const { duplicatePosition, deletePosition } = useApp()
  const { t } = useSettings()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const complete = isConfigComplete(position.config)
  const progress = configProgress(position.config)
  const c = position.config

  const specs: { label: string; value: string }[] = [
    { label: t('position.application'), value: applicationLabel(c.application, t) },
    { label: t('position.size'), value: formatDimensions(c.width, c.height, t) },
    { label: t('position.fitting'), value: mountingLabel(c.mounting, t) },
    { label: t('position.type'), value: profileLabel(c.profile, t) },
    { label: t('position.colour'), value: colorLabel(c.color, t) },
    { label: t('position.operation'), value: operationLabel(c.operation, t) },
  ]

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card sm:flex-row">
      {/* Thumbnail */}
      <div className="relative w-full shrink-0 bg-secondary sm:w-44">
        <div className="aspect-[4/3] sm:h-full sm:aspect-auto">
          <ShutterPreview config={c} openPercent={complete ? 68 : 42} />
        </div>
        {c.color && (
          <span
            className="absolute bottom-2 left-2 size-5 rounded-full border-2 border-card shadow-sm"
            style={{ backgroundColor: c.color }}
            aria-hidden
          />
        )}
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold">{position.name}</p>
            <p className="text-xs text-muted-foreground">
              {applicationLabel(c.application, t)} · {formatDimensions(c.width, c.height, t)}
            </p>
          </div>
          {complete ? (
            <Badge variant="success">{t('position.ready')}</Badge>
          ) : (
            <Badge variant="warning">{t('position.pctDone', { pct: progress })}</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {specs.map((s) => (
            <div key={s.label} className="min-w-0">
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
              <p className="truncate text-xs font-medium">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() =>
              router.push(
                `/dashboard/projects/${projectId}/configure?position=${position.id}`,
              )
            }
          >
            <Pencil className="size-3.5" />
            {complete ? t('position.edit') : t('position.continue')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={() => duplicatePosition(projectId, position.id)}
          >
            <Copy className="size-3.5" />
            {t('position.duplicate')}
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="ml-auto text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            aria-label={t('position.deleteAria')}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => deletePosition(projectId, position.id)}
        title={t('position.deleteTitle')}
        description={t('position.deleteDescription', { name: position.name })}
      />
    </div>
  )
}
