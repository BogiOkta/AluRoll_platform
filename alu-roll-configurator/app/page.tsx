'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { AluRollMark } from '@/components/brand'
import { ShutterPreview } from '@/components/shutter-preview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useApp()
  const [email, setEmail] = useState('alex@meridianbuild.com')
  const [password, setPassword] = useState('demo1234')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    login(email)
    router.push('/dashboard')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Left — form */}
      <div className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center gap-2.5">
          <AluRollMark className="size-8" />
          <span className="text-base font-semibold tracking-tight">AluRoll</span>
        </div>

        <div className="mx-auto w-full max-w-sm py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Sign in to your workspace
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure custom roller shutters in minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="mt-2 h-11 w-full text-sm">
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo workspace — use the pre-filled details or your own email to continue.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} AluRoll. All rights reserved.
        </p>
      </div>

      {/* Right — showcase */}
      <div className="relative hidden overflow-hidden bg-secondary lg:block">
        <div className="flex h-full flex-col justify-center px-14 py-16">
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Every window, perfectly specified.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              A guided configurator that hides the technical complexity, so you only ever
              choose from valid options.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {[
                'One decision at a time',
                'Live visual preview as you build',
                'Only technically valid choices',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 max-w-md rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
              <ShutterPreview
                config={{
                  application: 'large',
                  width: 2600,
                  height: 2200,
                  mounting: 'built-in',
                  profile: 'insulated',
                  color: '#3f4548',
                  operation: 'smart',
                  extras: [],
                }}
                openPercent={62}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
