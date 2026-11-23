import { Module } from '@nestjs/common'
import { GetQuoteModule } from './get-quote/get-quote.module'
import { ListQuotesModule } from './list-quotes/list-quotes.module'
import { QuoteCalendarModule } from './quote-calendar/quote-calendar.module'
import { QuoteAvailabilityModule } from './quote-availability/quote-availability.module'

@Module({
  imports: [GetQuoteModule, ListQuotesModule, QuoteCalendarModule, QuoteAvailabilityModule],
  exports: [GetQuoteModule, ListQuotesModule, QuoteCalendarModule, QuoteAvailabilityModule],
})
export class QueriesModule {}
