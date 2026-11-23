import { useId, useMemo, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { ActionButton, TextField, NativeSelect } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { ingredients, units, type RecipeLine } from '@legado/domain/operations/recipes'
import { messages } from '../../../shared/config/messages'
import { operations } from '../../../shared/config/operations'

const labels = {
  es: {
    ingredient: 'Ingrediente',
    saving: 'Guardando…',
    empty: 'Añade el primer ingrediente para esta porción.',
  },
  en: {
    ingredient: 'Ingredient',
    saving: 'Saving…',
    empty: 'Add the first ingredient for this serving.',
  },
  fr: {
    ingredient: 'Ingrédient',
    saving: 'Enregistrement…',
    empty: 'Ajoutez le premier ingrédient pour cette portion.',
  },
  pt: {
    ingredient: 'Ingrediente',
    saving: 'Salvando…',
    empty: 'Adicione o primeiro ingrediente desta porção.',
  },
} as const

type Props = {
  id: string
  initial: RecipeLine[]
  revision: number
  saved: boolean
  onEdit: () => void
  onSaved: () => void
}

export function RecipeForm({ id, initial, revision, saved, onEdit, onSaved }: Props) {
  const { language, t, locale } = useI18n()
  const c = operations[language]
  const copy = labels[language]
  const addId = useId()
  const [error, setError] = useState<'conflict' | 'service' | null>(null)
  const { control, register, getValues, handleSubmit, setFocus, formState } = useForm<{
    lines: RecipeLine[]
  }>({ defaultValues: { lines: initial } })
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = useWatch({ control, name: 'lines' })
  const options = useMemo(
    () =>
      [...ingredients].sort((a, b) =>
        t(`menu.ingredients.${a}`).localeCompare(t(`menu.ingredients.${b}`), locale),
      ),
    [t, locale],
  )
  const busy = formState.isSubmitting
  function notifyChange() {
    onEdit()
    setError(null)
  }
  function addIngredient() {
    const current = getValues('lines')
    const ingredient = options.find((option) => !current.some((row) => row.ingredient === option))
    if (!ingredient) return
    const line = { ingredient, amount: 1, unit: 'g' } as const
    notifyChange()
    append(line, { focusName: `lines.${current.length}.ingredient` })
  }
  function removeIngredient(index: number) {
    const remaining = fields.length - 1
    notifyChange()
    remove(index)
    requestAnimationFrame(() => {
      if (remaining) setFocus(`lines.${Math.min(index, remaining - 1)}.ingredient`)
      else document.getElementById(addId)?.focus()
    })
  }
  async function save({ lines: recipeLines }: { lines: RecipeLine[] }) {
    onEdit()
    setError(null)
    try {
      const res = await fetch('/admin/api/v1/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishId: id, revision, lines: recipeLines }),
      })
      if (res.status === 401) {
        const next = location.pathname + location.search + location.hash
        location.replace('/admin/login?next=' + encodeURIComponent(next))
        return
      }
      if (res.status !== 204) {
        setError(res.status === 409 ? 'conflict' : 'service')
        return
      }
      onSaved()
    } catch {
      setError('service')
    }
  }
  return (
    <form className="recipe-yields" onSubmit={handleSubmit(save)} onChange={notifyChange}>
      <header className="recipe-yields__header">
        <h3>{c.ingredients}</h3>
        <p>{c.recipeHint}</p>
      </header>
      <fieldset disabled={busy} aria-label={c.ingredients}>
        {fields.length === 0 && <p className="recipe-yields__empty">{copy.empty}</p>}
        {fields.map((field, i) => (
          <div key={field.id} className="recipe-entry">
            <label className="recipe-entry__ingredient">
              <span className="recipe-field-label">{copy.ingredient}</span>
              <NativeSelect
                aria-label={copy.ingredient + ' ' + (i + 1)}
                value={lines[i]?.ingredient ?? field.ingredient}
                {...register(`lines.${i}.ingredient`)}
              >
                {options
                  .filter(
                    (key) =>
                      lines[i]?.ingredient === key || !lines.some((row) => row.ingredient === key),
                  )
                  .map((key) => (
                    <option key={key} value={key}>
                      {t(`menu.ingredients.${key}`)}
                    </option>
                  ))}
              </NativeSelect>
            </label>
            <TextField
              label={c.quantity}
              labelClassName="recipe-field-label"
              aria-label={c.quantity + ' ' + (i + 1)}
              type="number"
              inputMode="decimal"
              required
              min=".001"
              step="any"
              max="10000"
              {...register(`lines.${i}.amount`, { setValueAs: Number })}
            />
            <label>
              <span className="recipe-field-label">{c.measure}</span>
              <NativeSelect aria-label={c.measure + ' ' + (i + 1)} {...register(`lines.${i}.unit`)}>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit === 'unit' ? c.unit : unit}
                  </option>
                ))}
              </NativeSelect>
            </label>
            <ActionButton
              variant="secondary"
              className="recipe-entry__remove"
              aria-label={
                c.remove + ' ' + t(`menu.ingredients.${lines[i]?.ingredient ?? field.ingredient}`)
              }
              onPress={() => removeIngredient(i)}
              isDisabled={busy}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6.5h16M9 6.5v-2h6v2M6.5 6.5l.8 13h9.4l.8-13M10 10v6m4-6v6" />
              </svg>
            </ActionButton>
          </div>
        ))}
      </fieldset>
      <div className="recipe-yields__actions">
        <ActionButton
          id={addId}
          variant="secondary"
          isDisabled={busy || fields.length >= 40}
          onPress={addIngredient}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2.5 8h11M8 2.5v11" />
          </svg>
          {c.addIngredient}
        </ActionButton>
        <ActionButton type="submit" isDisabled={busy || !fields.length}>
          {busy ? copy.saving : c.saveRecipe}
        </ActionButton>
      </div>
      {error && (
        <p className="recipe-yields__error" role="alert">
          {error === 'conflict' ? c.stale : messages[language].serviceError}
        </p>
      )}
      {saved && (
        <p className="recipe-yields__saved" role="status">
          {c.recipeSaved}
        </p>
      )}
    </form>
  )
}
