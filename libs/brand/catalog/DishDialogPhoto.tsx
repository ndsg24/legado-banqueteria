import '../styles/dish-dialog.css'
import type { CatalogItem } from '@legado/domain/menu/types'
import { CatalogItemPhoto } from './CatalogItemPhoto'
import type { CatalogImageResolver } from './image-source'

export function DishDialogPhoto({
  item,
  resolveImage,
}: {
  item: CatalogItem
  resolveImage?: CatalogImageResolver
}) {
  return (
    <div className="ingredients-dialog__stage">
      <span className="quote-dish__photo">
        <CatalogItemPhoto
          item={item}
          resolveImage={resolveImage}
          alt=""
          sizes="(max-width: 450px) 58vw, 256px"
        />
      </span>
    </div>
  )
}
