type BrandProps = { href?: string }

export function Brand({ href = '#inicio' }: BrandProps) {
  return (
    <a className="brand" href={href} aria-label="Legado, volver al inicio">
      <strong>
        LEGA<span>·</span>DO
      </strong>
      <small>Banquetería familiar</small>
    </a>
  )
}
