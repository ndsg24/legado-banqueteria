import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import type { CatalogItem } from '../../types/catalog'
import { menuSauces } from '../../config/catalog'
import { selectedSauce, type SauceChoices } from '../../quote/sauces'
import { CatalogItemPhoto } from '../catalog/CatalogItemPhoto'
import { CategoryMotif } from '../catalog/CategoryMotif'

const emptySauceBowl: CatalogItem = {
  id: '',
  name: 'Sin salsa',
  description: 'Solo el plato principal.',
  image: 'images/catalog/banquet/sin-salsa.webp',
  imageWidth: 320,
  imageHeight: 320,
  imageBounds: { x: 26, y: 38, width: 265, height: 252 },
}
const sauceOptions = [emptySauceBowl, ...menuSauces]

export type SaucePickerProps = {
  sauces: SauceChoices
  onSauceChange: (main: string, sauce: string) => void
}

export function MainSaucePicker({
  main,
  sauces,
  onSauceChange,
  showThumbnail = false,
}: SaucePickerProps & { main: CatalogItem; showThumbnail?: boolean }) {
  const current = selectedSauce(main.id, sauces)
  const selectedId = current?.id ?? ''
  return (
    <DialogTrigger>
      <Button
        className="quote-sauces"
        aria-label={
          (current ? 'Cambiar ' + current.name.toLowerCase() + ' de ' : 'Añadir salsa a ') +
          main.name
        }
      >
        {showThumbnail ? (
          <span className="quote-sauces__photo">
            <CatalogItemPhoto item={current ?? emptySauceBowl} sizes="36px" alt="" />
          </span>
        ) : (
          <CategoryMotif categoryId="salsas" />
        )}
        <span>{current?.name ?? 'Añadir salsa'}</span>
        <span aria-hidden="true">›</span>
      </Button>
      <ModalOverlay className="sauce-overlay" isDismissable>
        <Modal className="sauce-panel">
          <Dialog className="sauce-dialog">
            {({ close }) => (
              <>
                <figure className="sauce-dialog__dish">
                  <span className="sauce-dialog__dish-photo">
                    <CatalogItemPhoto item={main} sizes="(max-width: 650px) 88px, 360px" alt="" />
                  </span>
                  <figcaption>{main.name}</figcaption>
                </figure>
                <div className="sauce-dialog__menu">
                  <header className="sauce-dialog__header">
                    <Heading slot="title">
                      Elige tu <em>salsa</em>
                    </Heading>
                    <Button
                      slot="close"
                      aria-label="Cerrar selector de salsa"
                      className="sauce-dialog__close"
                    >
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="m6 6 12 12M18 6 6 18" />
                      </svg>
                    </Button>
                  </header>
                  <div className="sauce-dialog__list">
                    {sauceOptions.map((sauce) => (
                      <button
                        key={sauce.id}
                        type="button"
                        className="sauce-option"
                        aria-label={sauce.name}
                        aria-pressed={sauce.id === selectedId}
                        onClick={() => {
                          onSauceChange(main.id, sauce.id)
                          close()
                        }}
                      >
                        <span className="sauce-option__photo">
                          <CatalogItemPhoto
                            item={sauce}
                            sizes="(max-width: 650px) 54px, 76px"
                            alt=""
                          />
                        </span>
                        <span className="sauce-option__text">
                          {sauce.name}
                          <small>{sauce.description}</small>
                        </span>
                        {sauce.id === selectedId && (
                          <span className="sauce-option__mark" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
