import { useLayoutEffect, useRef, useState } from 'react'
import { DottedTexture } from '@legado/brand/dotted-texture'
import { themes, type Theme } from '@legado/brand/theme'
import { coreColors, themeNames, tokenNames } from '../../../shared/config/tokens'

function TokenTable({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLTableSectionElement>(null)
  const [values, setValues] = useState<string[]>([])
  useLayoutEffect(() => {
    const styles = getComputedStyle(ref.current!)
    setValues(tokenNames.map((name) => styles.getPropertyValue(name).trim()))
  }, [theme])

  return (
    <details className="ds-token-reference">
      <summary>Consultar todos los tokens CSS</summary>
      <table>
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Valor calculado</th>
          </tr>
        </thead>
        <tbody ref={ref}>
          {tokenNames.map((name, index) => (
            <tr key={name}>
              <th scope="row">
                <code>{name}</code>
              </th>
              <td>{values[index] || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

export function Foundations({ theme }: { theme: Theme }) {
  return (
    <>
      <div className="ds-palettes">
        {themes.map((value) => (
          <section className="ds-palette" data-sample={value} key={value}>
            <h2>{themeNames[value]}</h2>
            <ul>
              {coreColors.map((token) => (
                <li key={token}>
                  <span style={{ background: 'var(' + token + ')' }} />
                  <code>{token}</code>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <article className="ds-specimen">
        <h2>Tipografía</h2>
        <p>
          Syne para títulos y opciones, Manrope para lectura y controles, e Instrument Serif para
          acentos.
        </p>
        <div className="ds-type-display">Una mesa con historia</div>
        {['section', 'subheading', 'card', 'option', 'body', 'caption', 'action'].map((role) => (
          <div className="ds-type-row" key={role}>
            <code>--type-{role}</code>
            <span style={{ font: 'var(--type-' + role + ')' }}>Detalles de la celebración</span>
          </div>
        ))}
      </article>
      <article className="ds-specimen ds-motifs table-watermark">
        <DottedTexture />
        <h2>Motivos de fondo</h2>
        <p>La trama de puntos y el sello de mesa acompañan superficies y fondos editoriales.</p>
      </article>
      <TokenTable theme={theme} />
    </>
  )
}
