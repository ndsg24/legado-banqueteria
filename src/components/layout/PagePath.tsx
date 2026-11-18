type PagePathProps = { href: string; backLabel: string; current: string }
export function PagePath({ href, backLabel, current }: PagePathProps) {
  return <nav className="page-path" aria-label="Ubicación en el sitio"><a href={href}><span aria-hidden="true">←</span>{backLabel}</a><p>Legado <span aria-hidden="true">/</span>{current}</p></nav>
}
