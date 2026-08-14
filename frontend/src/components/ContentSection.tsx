import type { ReactNode } from 'react'

// The single source of truth for a page's centered content column. Owns the
// horizontal concerns (centering, max-width, side padding); callers pass
// vertical spacing (e.g. "py-10", "pb-10") via className so it never fights
// the base utilities.
type ContentSectionProps = {
  children: ReactNode
  className?: string
}

const ContentSection = ({ children, className = '' }: ContentSectionProps) => (
  <div className={`mx-auto max-w-3xl px-4 ${className}`}>{children}</div>
)

export default ContentSection
