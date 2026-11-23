import { defaultLayout, floralDefaults, migrateBottleOutfit, totalSeats } from '../table/options'
import type { TableDesign } from '../table/types'
import { designSchema } from '../quote/request'

// Table designs saved before the floor planner described one round table.
export function readQuotedTable(design: Partial<TableDesign>) {
  const parsed = designSchema.safeParse({
    ...defaultLayout,
    ...floralDefaults,
    overlayStyle: 'traditional',
    napkinFold: 'flat',
    ...design,
    bottleOutfit: migrateBottleOutfit(design.bottleOutfit, design.floral),
  })
  return parsed.success ? parsed.data : null
}

export function tableEquipment(design: TableDesign) {
  const tables = design.roundTables + Number(design.headSeats > 0)
  const seats = totalSeats(design)
  return {
    chair: seats,
    glass: seats,
    cutlery: seats,
    dinnerware: seats,
    chairCover: seats,
    sash: seats,
    napkin: seats,
    accentNapkin: design.napkinFold === 'duo' ? seats : 0,
    tablecloth: tables,
    overlay: tables,
    floral: design.floral === 'none' ? 0 : tables,
    bottleOutfit: design.bottleOutfit === 'pair' ? tables * 2 : 0,
  }
}
