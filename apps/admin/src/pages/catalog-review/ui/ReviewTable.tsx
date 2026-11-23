import { Link } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { publicCategoryUrl, type ReviewRow } from '../model/review'
import { reviewCopy } from '../model/copy'

type Props = { rows: ReviewRow[]; onPreview: (id: string) => void }

export function ReviewTable({ rows, onPreview }: Props) {
  const copy = reviewCopy[useI18n().language]
  return (
    <table className="audit-table">
      <thead>
        <tr>
          {[copy.dish, copy.ingredients, copy.links].map((label) => (
            <th key={label} scope="col">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row">
              <div className="audit-identity">
                <div className="audit-photo">
                  {row.photo ? (
                    <img
                      src={row.photo}
                      alt=""
                      width="72"
                      height="72"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{copy.missingPhoto}</span>
                  )}
                </div>
                <div>
                  <small>{row.group}</small>
                  <strong>{row.name}</strong>
                  <p>{row.description || copy.missingDescription}</p>
                </div>
              </div>
            </th>
            <td>
              {row.ingredients.length ? (
                row.ingredients.join(' · ')
              ) : (
                <span className="audit-pending">{copy.missingIngredients}</span>
              )}
            </td>
            <td>
              <div className="audit-links">
                <button
                  type="button"
                  aria-label={copy.showPreview + ' · ' + row.name}
                  aria-controls="catalog-preview"
                  onClick={() => onPreview(row.id)}
                >
                  {copy.showPreview}
                </button>
                <a
                  href={publicCategoryUrl(row.category)}
                  aria-label={copy.menu + ' · ' + row.group}
                >
                  {copy.menu}
                </a>
                <Link
                  to={'/recipes?dish=' + encodeURIComponent(row.id) + '#recipe-detail'}
                  aria-label={copy.recipe + ' · ' + row.name}
                >
                  {copy.recipe}
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
