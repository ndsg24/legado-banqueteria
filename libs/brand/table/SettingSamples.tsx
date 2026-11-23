import type { CSSProperties } from 'react'
import { dinnerwareStyles } from '@legado/domain/table/options'
import type { FabricTexture, FloralStyle, TableDesign } from '@legado/domain/table/types'
import './samples.css'

export function FabricSample({ texture, color }: { texture: FabricTexture; color: string }) {
  return (
    <i
      className={'fabric-sample fabric-sample--' + texture}
      style={{ '--swatch': color } as CSSProperties}
      aria-hidden="true"
    />
  )
}

export function PlateSample({ plate }: { plate: TableDesign['dinnerware'] }) {
  return (
    <i
      className="plate-sample"
      data-rim={plate === 'goldRim'}
      style={{ backgroundColor: dinnerwareStyles[plate].color }}
      aria-hidden="true"
    />
  )
}

export function FloralSample({ floral }: { floral: FloralStyle }) {
  return (
    <i className={'floral-sample floral-sample--' + floral} aria-hidden="true">
      {floral === 'none' ? '—' : '✿'}
    </i>
  )
}
