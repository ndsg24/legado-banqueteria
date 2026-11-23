import { useState } from 'react'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import { referenceRecipe } from '@legado/domain/operations/preparation'
import { RecipeForm } from './RecipeForm'
import './recipe-editor.css'

type Props = {
  id: string
  book: RecipeBook
  onSaved: () => void
}

export function RecipeEditor({ id, book, onSaved }: Props) {
  const [savedDish, setSavedDish] = useState<string | null>(null)
  return (
    <div className="recipe-workform">
      <RecipeForm
        key={id + ':' + (book[id]?.revision ?? 0)}
        id={id}
        initial={book[id]?.lines ?? referenceRecipe(id)}
        revision={book[id]?.revision ?? 0}
        saved={savedDish === id}
        onEdit={() => setSavedDish(null)}
        onSaved={() => {
          setSavedDish(id)
          onSaved()
        }}
      />
    </div>
  )
}
