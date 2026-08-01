export function AluRollMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="AluRoll"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <rect x="8" y="7" width="16" height="3.2" rx="1.6" fill="white" />
      <rect x="8" y="12" width="16" height="2.2" rx="1.1" fill="white" opacity="0.85" />
      <rect x="8" y="15.4" width="16" height="2.2" rx="1.1" fill="white" opacity="0.65" />
      <rect x="8" y="18.8" width="16" height="2.2" rx="1.1" fill="white" opacity="0.45" />
      <rect x="8" y="22.2" width="16" height="2.2" rx="1.1" fill="white" opacity="0.28" />
    </svg>
  )
}
