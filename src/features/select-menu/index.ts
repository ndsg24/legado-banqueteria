import { lazy } from 'react'

export { QuoteMenu } from './ui/QuoteMenu'
export { QuoteSelection } from './ui/QuoteSelection'
export { SelectionCard } from './ui/SelectionCard'
export { MenuDrawer } from './ui/MenuDrawer'
export { SelectionCategory } from './ui/SelectionCategory'
export { SelectionCardPhoto } from './ui/SelectionCardPhoto'
export const LazyDishDetailsDialog = lazy(() =>
  import('./ui/DishDetailsDialog').then(({ DishDetailsDialog }) => ({
    default: DishDetailsDialog,
  })),
)
