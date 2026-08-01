'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/app-provider'
import { useSettings } from '@/components/settings-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export function CreateProjectModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { createProject } = useApp()
  const { t } = useSettings()
  const router = useRouter()
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [reference, setReference] = useState('')

  function reset() {
    setName('')
    setClient('')
    setReference('')
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const project = createProject({ name: name.trim(), client: client.trim(), reference: reference.trim() })
    reset()
    onClose()
    router.push(`/dashboard/projects/${project.id}`)
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title={t('createProject.title')}
      description={t('createProject.description')}
    >
      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-name" className="text-sm font-medium">
            {t('createProject.name')}
          </label>
          <Input
            id="proj-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('createProject.namePlaceholder')}
            autoFocus
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-client" className="text-sm font-medium">
            {t('createProject.client')}{' '}
            <span className="font-normal text-muted-foreground">{t('common.optional')}</span>
          </label>
          <Input
            id="proj-client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder={t('createProject.clientPlaceholder')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-ref" className="text-sm font-medium">
            {t('createProject.reference')}{' '}
            <span className="font-normal text-muted-foreground">{t('common.optional')}</span>
          </label>
          <Input
            id="proj-ref"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder={t('createProject.referencePlaceholder')}
          />
        </div>
        <div className="mt-1 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="h-10"
            onClick={() => {
              reset()
              onClose()
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" size="lg" className="h-10">
            {t('createProject.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
