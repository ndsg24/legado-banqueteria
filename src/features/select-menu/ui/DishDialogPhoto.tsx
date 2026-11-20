import type { CatalogItem } from '../../../entities/menu'
import { CatalogItemPhoto } from '../../../entities/menu/ui'

export function DishDialogPhoto({ item }: { item: CatalogItem }) {
  return (
    <div className="ingredients-dialog__stage">
      <span className="quote-dish__photo">
        <CatalogItemPhoto item={item} alt="" sizes="(max-width: 450px) 58vw, 256px" />
      </span>
    </div>
  )
}
