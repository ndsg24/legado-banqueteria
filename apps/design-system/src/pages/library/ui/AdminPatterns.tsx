import { NativeSelect } from '@legado/brand/controls'
import { useSearchParams } from 'react-router'
import { quoteStatuses } from '@legado/domain/quote/history'
import { QuoteStatusBadge } from '../../../../../admin/src/entities/quotes/ui/QuoteStatusBadge'
import { EmptyNotice } from '../../../../../admin/src/shared/ui/EmptyNotice'
import { PageHeading } from '../../../../../admin/src/shared/ui/PageHeading'
import { Pagination } from '../../../../../admin/src/shared/ui/Pagination'
import { ApexChart } from '../../../../../admin/src/shared/ui/ApexChart'

const records = Array.from({ length: 27 }, (_, i) => ({
  number: 1001 + i,
  guests: 40 + i * 5,
  status: quoteStatuses[i % quoteStatuses.length],
}))
const chart = [8, 12, 5]

export function AdminPatterns() {
  const [params, setParams] = useSearchParams()
  const requestedPageSize = Number(params.get('pageSize'))
  const pageSize = [5, 10, 25].includes(requestedPageSize) ? requestedPageSize : 5
  const pageCount = Math.ceil(records.length / pageSize)
  const requestedPage = Number(params.get('page'))
  const page = Number.isInteger(requestedPage) ? Math.min(pageCount, Math.max(1, requestedPage)) : 1
  const statuses = params.get('estado')
  const visible = records.filter(({ status }) => !statuses || status === statuses)
  const activePage = Math.min(page, Math.max(1, Math.ceil(visible.length / pageSize)))

  return (
    <>
      <article className="ds-specimen admin-surface">
        <PageHeading title="Historial de cotizaciones">
          <p>Tabla, estados y paginación con datos ficticios.</p>
        </PageHeading>
        <label className="ds-select">
          Estado
          <NativeSelect
            value={statuses ?? ''}
            onChange={(event) => {
              const next = new URLSearchParams(params)
              next.delete('page')
              if (event.target.value) next.set('estado', event.target.value)
              else next.delete('estado')
              setParams(next)
            }}
          >
            <option value="">Todos</option>
            <option value="requested">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </NativeSelect>
        </label>
        <table className="ds-admin-table">
          <caption className="ds-sr-only">Cotizaciones de ejemplo</caption>
          <thead>
            <tr>
              <th scope="col">Solicitud</th>
              <th scope="col">Invitados</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visible
              .slice((activePage - 1) * pageSize, activePage * pageSize)
              .map(({ number, guests, status }) => (
                <tr key={number}>
                  <th scope="row">#{number}</th>
                  <td>{guests}</td>
                  <td>
                    <QuoteStatusBadge status={status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Pagination page={activePage} pageSize={pageSize} total={visible.length} allowResize />
      </article>
      <article className="ds-specimen admin-surface">
        <h2>Estado vacío</h2>
        <EmptyNotice icon="date">No hay eventos para el período seleccionado.</EmptyNotice>
      </article>
      <article className="ds-specimen admin-surface">
        <h2>Demanda mensual</h2>
        <p>
          Solicitudes de ejemplo. Septiembre {chart[0]}, octubre {chart[1]} y noviembre {chart[2]}.
        </p>
        <ApexChart
          type="bar"
          series={[{ name: 'Solicitudes', data: chart }]}
          options={{ xaxis: { categories: ['Sep', 'Oct', 'Nov'] } }}
          height={220}
        />
      </article>
      <article className="ds-specimen">
        <h2>Flujos operativos</h2>
        <p>
          El panel de demostración reúne el resumen, calendario, compras, preparación, recetario,
          contenido y finanzas.
        </p>
        <a href="http://localhost:5187/admin/">Abrir panel de demostración local</a>
      </article>
    </>
  )
}
