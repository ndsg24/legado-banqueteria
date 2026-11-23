import { Injectable, Module, type OnModuleInit, type OnApplicationShutdown } from '@nestjs/common'
import { Pool } from 'pg'
import { applyMigrations } from './database-migrations'

@Injectable()
export class DatabasePool extends Pool implements OnModuleInit, OnApplicationShutdown {
  constructor() {
    super({ connectionString: process.env.DATABASE_URL, max: 5 })
  }
  onModuleInit() {
    return applyMigrations(this)
  }
  ready() {
    return this.query('SELECT 1')
  }
  onApplicationShutdown() {
    return this.end()
  }
}
@Module({ providers: [DatabasePool], exports: [DatabasePool] })
export class DatabaseModule {}
