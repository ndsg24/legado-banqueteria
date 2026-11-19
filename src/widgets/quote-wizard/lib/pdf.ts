import type { Translate } from '../../../shared/i18n'
import pdfMake from 'pdfmake/build/pdfmake'
import fonts from 'pdfmake/build/vfs_fonts'
import type { Content, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces'
import type { CatalogItem } from '../../../entities/menu'
import {
  eventLabels,
  type QuoteRequest,
  contactDetails,
  eventDetails,
  menuGroups,
  tableDetails,
  eventTimeZone,
} from '../../../entities/quote'
import wordmark from '../assets/legado-wordmark.svg?raw'

pdfMake.addVirtualFileSystem(fonts)

const gold = '#8a6525'

async function dishPhoto(item: CatalogItem) {
  try {
    const image = new Image()
    image.src = import.meta.env.BASE_URL + (item.imageSmall ?? item.image)
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y, width, height } = item.imageBounds
    const scale = image.naturalWidth / item.imageWidth
    const fit = 120 / Math.max(width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 128, 128)
    ctx.drawImage(
      image,
      x * scale,
      y * scale,
      width * scale,
      height * scale,
      (128 - width * fit) / 2,
      (128 - height * fit) / 2,
      width * fit,
      height * fit,
    )
    return canvas.toDataURL('image/jpeg', 0.87)
  } catch {
    return undefined
  }
}

function section(text: string): Content {
  return { text, style: 'section', headlineLevel: 1 }
}

function facts(rows: string[][], labelWidth = 78): Content {
  return {
    layout: 'noBorders',
    table: {
      widths: [labelWidth, '*'],
      body: rows.map(([label, value]) => [
        { text: label, color: '#645f55' },
        { text: value.replace(/(\S{19})(?=\S)/gu, '$1\u200b') },
      ]),
    },
  }
}

export async function downloadQuotePdf(
  quote: QuoteRequest,
  t: Translate,
  locale: string,
  tablePhoto?: string,
) {
  const issuedAt = new Intl.DateTimeFormat('es-CL', {
    timeZone: eventTimeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date())
  const groups = menuGroups(quote.items, quote.sauces, t)
  const content: Content[] = [
    {
      columnGap: 10,
      columns: [
        {
          width: '*',
          stack: [
            { svg: wordmark, width: 98 },
            {
              text: t('quote.pdf.tagline'),
              style: 'eyebrow',
              characterSpacing: 1,
              margin: [0, 5, 0, 0],
            },
          ],
        },
        {
          width: 'auto',
          alignment: 'right',
          stack: [
            { text: t('quote.pdf.issued'), style: 'eyebrow' },
            { text: issuedAt, fontSize: 11, margin: [0, 4, 0, 0] },
          ],
        },
      ],
    },
    {
      margin: [0, 14, 0, 14],
      canvas: [
        { type: 'line', x1: 0, y1: 0, x2: 503, y2: 0, lineWidth: 0.7, lineColor: '#bb9b62' },
      ],
    },
    { text: t('quote.pdf.title'), fontSize: 30, bold: true },
    {
      text: t(eventLabels[quote.event]) + '  /  ' + quote.guests + ' ' + t('quote.event.guestUnit'),
      italics: true,
      color: gold,
      margin: [0, 3, 0, 6],
    },
    {
      columnGap: 20,
      columns: [
        { stack: [section(t('quote.review.event')), facts(eventDetails(quote, locale, t), 66)] },
        { stack: [section(t('quote.review.contact')), facts(contactDetails(quote, t), 72)] },
      ],
    },
    section(t('quote.review.dishes')),
  ]
  if (!groups.length) content.push(t('quote.review.menuPending'))
  for (const group of groups) {
    const body: TableCell[][] = [[{ text: group.name, style: 'eyebrow', colSpan: 3 }, '', '']]
    for (const { item, name, quantity } of group.entries) {
      const photo = await dishPhoto(item)
      body.push([
        photo ? { image: photo, width: 28 } : '',
        { text: name, margin: [0, 8, 0, 0] },
        { text: quantity, alignment: 'right', margin: [0, 8, 0, 0] },
      ])
    }
    content.push({
      margin: [0, 6, 0, 6],
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        dontBreakRows: true,
        widths: [32, '*', 100],
        body,
      },
      layout: {
        fillColor: (row) => (row === 0 ? '#f4f0e8' : null),
        hLineWidth: (index) => (index > 0 ? 0.4 : 0),
        vLineWidth: () => 0,
        hLineColor: () => '#ddd6c9',
      },
    })
  }
  const setting: Content = quote.table
    ? facts(tableDetails(quote.table, t))
    : t('quote.review.tablePending')
  content.push({
    unbreakable: true,
    stack: [
      section(t('quote.review.setting')),
      tablePhoto
        ? {
            columnGap: 14,
            columns: [
              { width: 216, image: tablePhoto, fit: [216, 160] },
              { width: '*', stack: [setting] },
            ],
          }
        : setting,
    ],
  })
  if (quote.notes)
    content.push(section(t('quote.review.details')), {
      text: quote.notes.replace(/(\S{55})(?=\S)/gu, '$1\u200b'),
    })
  const document: TDocumentDefinitions = {
    info: { title: t('quote.review.documentTitle'), author: 'Legado Banquetería' },
    pageSize: 'A4',
    pageMargins: [46, 44, 46, 50],
    content,
    defaultStyle: { fontSize: 10, lineHeight: 1.15, color: '#292721' },
    styles: {
      section: { bold: true, fontSize: 16, margin: [0, 15, 0, 5] },
      eyebrow: { fontSize: 9, bold: true, color: gold },
    },
    pageBreakBefore: (node, queries) =>
      node.headlineLevel === 1 && queries.getFollowingNodesOnPage().length === 0,
    footer: (page, pages) => ({
      margin: [46, 12, 46, 0],
      color: gold,
      fontSize: 8,
      columns: [
        'LEGADO  /  ' + t('quote.pdf.title'),
        { text: page + ' / ' + pages, alignment: 'right' },
      ],
    }),
  }
  await pdfMake.createPdf(document).download('mi-celebracion-legado.pdf')
}
