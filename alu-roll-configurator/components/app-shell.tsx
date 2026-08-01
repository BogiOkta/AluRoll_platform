'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { useSettings } from '@/components/settings-provider'
import { SettingsPopover } from '@/components/settings-menu'
import { initials } from '@/lib/format'
import { AluRollMark } from '@/components/brand'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp()
  const { t } = useSettings()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <AluRollMark className="size-7" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              AluRoll
            </span>
            <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline-block">
              {t('common.configurator')}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <SettingsPopover
                trigger={
                  <div className="flex items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-muted/70">
                    <div className="hidden text-right leading-tight sm:block">
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.company}</div>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {initials(user.name)}
                    </div>
                  </div>
                }
              />
            )}
            <button
              type="button"
              onClick={() => {
                logout()
                router.push('/')
              }}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t('common.signOut')}
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
