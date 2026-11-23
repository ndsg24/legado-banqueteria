import type { ReactNode } from 'react'
import { DottedTexture } from '../../../shared/ui/DottedTexture'
import { useTheme, type Theme } from '../../../shared/theme'
import { Footer } from './Footer'
import { Header } from './Header'
import { PagePath } from './PagePath'

type Props = {
  section: 'carta' | 'ambientacion' | 'cotizar' | 'privacidad'
  topHref: string
  backHref: string
  backLabel: string
  current: string
  className?: string
  mainClassName?: string
  mainId?: string
  children: ReactNode
}

export type InteriorAppearance = { theme: Theme; setTheme: (theme: Theme) => void }

export function InteriorPage(props: Props & { appearance?: InteriorAppearance }) {
  return props.appearance ? (
    <InteriorLayout {...props} appearance={props.appearance} />
  ) : (
    <ThemedInteriorPage {...props} />
  )
}

function ThemedInteriorPage(props: Props) {
  const appearance = useTheme()
  return <InteriorLayout {...props} appearance={appearance} />
}

function InteriorLayout({
  section,
  topHref,
  backHref,
  backLabel,
  current,
  className = '',
  mainClassName,
  mainId,
  children,
  appearance: { theme, setTheme },
}: Props & { appearance: InteriorAppearance }) {
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
