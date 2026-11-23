import { Link, isRouteErrorResponse, useRouteError, useRevalidator } from 'react-router'
import { ActionButton, DetailIcon } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { messages } from '../shared/config/messages'

export function Failure() {
  const copy = messages[useI18n().language]
  const error = useRouteError()
  const retry = useRevalidator()
  return (
    <section className="admin-surface recovery-panel">
      <DetailIcon kind="email" />
      <h1>
        {isRouteErrorResponse(error) && error.status === 404 ? copy.missing : copy.unavailable}
      </h1>
      <ActionButton variant="secondary" onPress={() => void retry.revalidate()}>
        {copy.retry}
      </ActionButton>{' '}
      <Link to="/quotes">{copy.back}</Link>
    </section>
  )
}
