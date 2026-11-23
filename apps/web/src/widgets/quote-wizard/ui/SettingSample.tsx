import { SettingSample as BrandSettingSample, type SettingPart } from '@legado/brand/table'
import type { TableDesign } from '../../../entities/table'

const imageUrl = (path: string) => import.meta.env.BASE_URL + 'images/' + path + '.webp'

export function SettingSample({ part, design }: { part: SettingPart; design: TableDesign }) {
  return <BrandSettingSample part={part} design={design} imageUrl={imageUrl} />
}
