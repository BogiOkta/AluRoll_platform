'use client'

import { useSettings } from '@/components/settings-provider'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
}) {
  const { t } = useSettings()

  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="lg" className="h-10" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="h-10"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel ?? t('common.delete')}
        </Button>
      </div>
    </Modal>
  )
}
