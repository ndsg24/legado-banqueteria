import { ReviewActionIcon } from './ReviewActionIcon'
import { ActionButton } from '../../../shared/ui/ActionButton'
import { DialogTrigger } from 'react-aria-components'
import type { menuGroups } from '../../../entities/quote'
import { MenuDrawer } from '../../../features/select-menu'
import { useI18n } from '../../../shared/i18n'

export function FullMenuDialog({
  menu,
  onOpen,
}: {
  menu: ReturnType<typeof menuGroups>
  onOpen: () => void
}) {
  const { t } = useI18n()
  return (
    <DialogTrigger
      onOpenChange={(open) => {
        if (open) onOpen()
      }}
    >
      <ActionButton variant="secondary">
        <ReviewActionIcon action="menu" />
        {t('quote.tasting.full')}
      </ActionButton>
      <MenuDrawer
        getMenu={() => menu}
        title={t('quote.tasting.fullTitle')}
        closeLabel={t('common.nav.close')}
      />
    </DialogTrigger>
  )
}
