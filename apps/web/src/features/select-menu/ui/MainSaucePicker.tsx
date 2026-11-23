import { DialogCloseButton } from '../../../shared/ui/DialogCloseButton'
import { DishDialogPhoto } from './DishDialogPhoto'
import { useI18n } from '../../../shared/i18n'
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { type CatalogItem, type SauceChoices } from '../../../entities/menu'
import { CatalogItemPhoto, CategoryMotif } from '../../../entities/menu/ui'
import { SauceOptionsGrid } from './SauceOptionsGrid'
import { emptySauceBowl } from './sauceOptions'

export type SaucePickerProps = {
  sauces: SauceChoices
  onSauceChange: (main: string, sauce: string) => void
}

export function MainSaucePicker({
  main,
  current,
  onSauceChange,
  showThumbnail = false,
}: Pick<SaucePickerProps, 'onSauceChange'> & {
  main: CatalogItem
  current?: CatalogItem
  showThumbnail?: boolean
}) {
  const { t } = useI18n()

  const selectedId = current?.id ?? ''
  return (
    <DialogTrigger>
      <Button
        className="quote-sauces"
        aria-label={
          current
            ? t('quote.sauce.changeNamed', { sauce: t(current.name), dish: t(main.name) })
            : t('quote.sauce.addTo') + ' ' + t(main.name)
        }
      >
        {showThumbnail ? (
          <span className="quote-sauces__photo">
            <CatalogItemPhoto item={current ?? emptySauceBowl} sizes="36px" alt="" />
          </span>
        ) : (
          <CategoryMotif categoryId="salsas" />
        )}
        <span>{t(current?.name ?? 'quote.sauce.add')}</span>
        <span aria-hidden="true">›</span>
      </Button>
      <ModalOverlay className="sauce-overlay ingredients-overlay" isDismissable>
        <Modal className="sauce-panel">
          <Dialog className="ingredients-dialog sauce-dialog">
            {({ close }) => (
              <div className="ingredients-dialog__card">
                <DishDialogPhoto item={main} />
                <DialogCloseButton label={t('quote.sauce.close')} />
                <div className="ingredients-dialog__body">
                  <p className="sauce-dialog__dish-name">{t(main.name)}</p>
                  <Heading slot="title">
                    {t('quote.sauce.title')} <em>{t('quote.sauce.accent')}</em>
                  </Heading>
                  <SauceOptionsGrid
                    selected={selectedId}
                    onChoose={(id) => {
                      onSauceChange(main.id, id)
                      close()
                    }}
                  />
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
