export function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const day = 86_400_000
  if (diff < day) return 'Today'
  if (diff < 2 * day) return 'Yesterday'
  const days = Math.floor(diff / day)
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function formatDimensions(width?: number, height?: number): string {
  if (!width || !height) return 'Not sized'
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
