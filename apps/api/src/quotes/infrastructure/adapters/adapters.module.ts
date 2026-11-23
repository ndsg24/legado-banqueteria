import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../../shared'
import { QUOTE_READER } from '../../domain/ports/output/quote-reader.port'
import { QUOTE_WRITER } from '../../domain/ports/output/quote-writer.port'
import { PostgresQuoteStore } from './quotes.postgres'

@Module({
  imports: [DatabaseModule],
  providers: [
    PostgresQuoteStore,
    { provide: QUOTE_READER, useExisting: PostgresQuoteStore },
    { provide: QUOTE_WRITER, useExisting: PostgresQuoteStore },
  ],
  exports: [QUOTE_READER, QUOTE_WRITER],
})
export class AdaptersModule {}
