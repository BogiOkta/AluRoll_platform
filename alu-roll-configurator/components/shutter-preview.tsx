'use client'

import { useId, useMemo } from 'react'
import { useSettings } from '@/components/settings-provider'
import type { Configuration } from '@/lib/types'

function shade(hex: string, amount: number) {
  // amount: -1..1 (negative darker, positive lighter)
  const h = hex.replace('#', '')
  const num = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  )
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  const t = amount < 0 ? 0 : 255
  const p = Math.abs(amount)
  r = Math.round((t - r) * p) + r
  g = Math.round((t - g) * p) + g
  b = Math.round((t - b) * p) + b
  return `rgb(${r}, ${g}, ${b})`
}

interface ShutterPreviewProps {
  config: Configuration
  /** 0 = fully open (rolled up), 100 = fully closed (down). */
  openPercent: number
}

export function ShutterPreview({ config, openPercent }: ShutterPreviewProps) {
  const { t } = useSettings()
  const uid = useId().replace(/:/g, '')
  const color = config.color ?? '#c3c7ca'
  const widthMm = config.width ?? 1200
  const heightMm = config.height ?? 1400

  // Keep the drawing area constant; vary the window aspect within it.
  const stage = { w: 420, h: 460 }
  const pad = 46

  const aspect = widthMm / heightMm
  const maxW = stage.w - pad * 2
  const maxH = stage.h - pad * 2 - 26 // reserve space for box

  const { winW, winH } = useMemo(() => {
    let w = maxW
    let h = w / aspect
    if (h > maxH) {
      h = maxH
      w = h * aspect
    }
    return { winW: w, winH: h }
  }, [aspect, maxW, maxH])

  const winX = (stage.w - winW) / 2
  const boxH = config.profile === 'strong' ? 30 : config.profile === 'insulated' ? 26 : 22
  const winY = pad + boxH

  const slatHeight = config.profile === 'strong' ? 12 : config.profile === 'insulated' ? 11 : 9
  const gap = 1.5
  const closed = Math.max(0, Math.min(100, openPercent)) / 100
  const coverH = winH * closed
  const slatCount = Math.max(0, Math.floor(coverH / (slatHeight + gap)))

  const railW = 10
  const isConcealed = config.mounting !== 'front'

  const wallId = `wall-${uid}`
  const glassId = `glass-${uid}`
  const slatId = `slat-${uid}`
  const softId = `soft-${uid}`

  return (
    <svg
      viewBox={`0 0 ${stage.w} ${stage.h}`}
      className="h-full w-full"
      role="img"
      aria-label={t('preview.aria')}
    >
      <defs>
        <linearGradient id={wallId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--preview-wall-1)" />
          <stop offset="100%" stopColor="var(--preview-wall-2)" />
        </linearGradient>
        <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--preview-glass-1)" />
          <stop offset="45%" stopColor="var(--preview-glass-2)" />
          <stop offset="100%" stopColor="var(--preview-glass-3)" />
        </linearGradient>
        <linearGradient id={slatId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(color, 0.16)} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={shade(color, -0.14)} />
        </linearGradient>
        <filter id={softId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="10"
            floodColor="var(--preview-shadow)"
            floodOpacity="0.12"
          />
        </filter>
      </defs>

      {/* wall */}
      <rect x="0" y="0" width={stage.w} height={stage.h} fill={`url(#${wallId})`} />

      {/* window reveal + glass */}
      <g filter={`url(#${softId})`}>
        <rect
          x={winX - 6}
          y={winY - 6}
          width={winW + 12}
          height={winH + 12}
          rx="6"
          fill="var(--preview-frame)"
        />
        <rect x={winX} y={winY} width={winW} height={winH} fill={`url(#${glassId})`} />
        {/* window mullion */}
        <line
          x1={winX + winW / 2}
          y1={winY}
          x2={winX + winW / 2}
          y2={winY + winH}
          stroke="var(--preview-mullion)"
          strokeWidth="3"
          opacity="0.7"
        />
        <line
          x1={winX}
          y1={winY + winH / 2}
          x2={winX + winW}
          y2={winY + winH / 2}
          stroke="var(--preview-mullion)"
          strokeWidth="3"
          opacity="0.7"
        />
      </g>

      {/* guide rails */}
      {config.mounting && (
        <>
          <rect
            x={winX - railW}
            y={winY - 2}
            width={railW}
            height={winH + 2}
            rx="2"
            fill={shade(color, -0.05)}
            opacity="0.9"
          />
          <rect
            x={winX + winW}
            y={winY - 2}
            width={railW}
            height={winH + 2}
            rx="2"
            fill={shade(color, -0.05)}
            opacity="0.9"
          />
        </>
      )}

      {/* slats (drawn from top down) */}
      <g>
        {Array.from({ length: slatCount }).map((_, i) => {
          const y = winY + i * (slatHeight + gap)
          return (
            <g key={i}>
              <rect
                x={winX + 1}
                y={y}
                width={winW - 2}
                height={slatHeight}
                rx="2.5"
                fill={`url(#${slatId})`}
              />
            </g>
          )
        })}
      </g>

      {/* shutter box */}
      {config.mounting && (
        <g filter={`url(#${softId})`}>
          <rect
            x={isConcealed ? winX - railW : winX - railW - 3}
            y={pad}
            width={isConcealed ? winW + railW * 2 : winW + railW * 2 + 6}
            height={boxH}
            rx={isConcealed ? 3 : 6}
            fill={shade(color, -0.06)}
          />
          <rect
            x={isConcealed ? winX - railW : winX - railW - 3}
            y={pad}
            width={isConcealed ? winW + railW * 2 : winW + railW * 2 + 6}
            height={boxH / 2}
            rx={isConcealed ? 3 : 6}
            fill={shade(color, 0.1)}
            opacity="0.5"
          />
        </g>
      )}
    </svg>
  )
}
