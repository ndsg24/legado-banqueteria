type ParallaxDividerProps = {
  phrase: string
  detail: string
  variant?: 'table' | 'dish'
}

export function ParallaxDivider({ phrase, detail, variant = 'table' }: ParallaxDividerProps) {
  return (
    <aside className={`parallax-divider parallax-divider--${variant}`} aria-label={phrase}>
      <div className="parallax-divider__veil" />
      <p>{phrase}</p>
      <span>{detail}</span>
    </aside>
  )
}
