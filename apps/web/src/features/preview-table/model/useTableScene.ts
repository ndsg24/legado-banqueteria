import { useTableScene as useSharedTableScene } from '@legado/brand/table-scene'
import type { TableDesign, TablePart } from '../../../entities/table'

async function loadSundayMain() {
  return (await import('../lib/sundayMain')).createSundayMain
}

export function useTableScene(
  design: TableDesign,
  onSelect?: (part: TablePart) => void,
  enabled = true,
  serveSalmon = false,
) {
  return useSharedTableScene(design, onSelect, enabled, serveSalmon ? loadSundayMain : undefined)
}
