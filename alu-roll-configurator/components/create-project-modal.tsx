'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/app-provider'
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
      title="New project"
      description="Group your shutter positions under one project."
    >
      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-name" className="text-sm font-medium">
            Project name
          </label>
          <Input
            id="proj-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Riverside Residence"
            autoFocus
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-client" className="text-sm font-medium">
            Client <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="proj-client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="e.g. Meridian Build Group"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proj-ref" className="text-sm font-medium">
            Reference <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="proj-ref"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. RIV-2041"
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
            Cancel
          </Button>
          <Button type="submit" size="lg" className="h-10">
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  )
}
