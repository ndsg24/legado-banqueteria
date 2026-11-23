import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { QueryBus } from '@nestjs/cqrs'
import { configureHttp } from './configure-http'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL.')
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  app.enableShutdownHooks()
  configureHttp(app, app.get(QueryBus))
  await app.listen(Number(process.env.PORT || 3000), process.env.BIND_HOST || '127.0.0.1')
}

void main().catch(() => {
  console.error('API startup failed. Check PostgreSQL and the environment configuration.')
  process.exitCode = 1
})
