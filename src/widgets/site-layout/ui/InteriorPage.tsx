import type { ReactNode } from 'react'
import { DottedTexture } from '../../../shared/ui/DottedTexture'
import { useTheme } from '../../../shared/theme'
import { Footer } from './Footer'
import { Header } from './Header'
import { PagePath } from './PagePath'

type Props = {
  section: 'carta' | 'ambientacion' | 'cotizar'
  topHref: string
  backHref: string
  backLabel: string
  current: string
  className?: string
  mainClassName?: string
  mainId?: string
  children: ReactNode
}

export function InteriorPage({
  section,
  topHref,
  backHref,
  backLabel,
  current,
  className = '',
  mainClassName,
  mainId,
  children,
}: Props) {
  const { theme, setTheme } = useTheme()
  return (
    <div className={`site-shell site-texture ${className}`.trimEnd()}>
      <DottedTexture />
      <Header activeSection={section} theme={theme} onThemeChange={setTheme} />
      <main id={mainId} className={mainClassName}>
        <PagePath href={backHref} backLabel={backLabel} current={current} />
        {children}
      </main>
      <Footer homeHref="/#inicio" topHref={topHref} />
    </div>
  )
}
