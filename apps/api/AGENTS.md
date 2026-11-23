# Guía del backend de Legado

Esta guía rige el desarrollo de `apps/api` y complementa la [guía del monorepo](../../AGENTS.md). La API es un monolito modular NestJS. Organiza el código por contexto de negocio y, dentro de cada contexto, aplica arquitectura hexagonal, diseño guiado por el dominio (DDD) y separación de comandos y consultas (CQRS).

La referencia es el backend de Clerity. El recorrido de alta de producto muestra cómo un controlador despacha un comando, su handler obtiene el puerto por inyección, el caso de uso opera sobre ese contrato y un adaptador implementa la persistencia. [Guía de Clerity](https://github.com/ndsg24/clerity/blob/68677e75b0ef0907b3fc5f92988e678bf5adadbb/apps/platform/api/AGENTS.md) · [Handler de alta de producto](https://github.com/ndsg24/clerity/blob/68677e75b0ef0907b3fc5f92988e678bf5adadbb/apps/platform/api/src/firstfruits/application/commands/create-product/create-product.handler.ts) · [Caso de uso](https://github.com/ndsg24/clerity/blob/68677e75b0ef0907b3fc5f92988e678bf5adadbb/apps/platform/api/src/firstfruits/application/use-cases/create-product.use-case.ts)

## Organizar un contexto

Usa `hexagonal-architecture` para diseñar puertos y adaptadores, `clean-architecture` para revisar dependencias, `domain-driven-design` para modelar el negocio y `nestjs-best-practices` para la integración con Nest. Aplica la estructura de Clerity descrita aquí.

La API tiene cuatro contextos bajo `src/`. Cotizaciones recibe las solicitudes, consulta el historial y arma el calendario. Identidad autentica al administrador y rota las sesiones. Finanzas registra movimientos y calcula resultados. Cocina administra las recetas y sus revisiones.

La estructura de `apps/platform/api` de Clerity es la referencia obligatoria. Este ejemplo usa la recepción de cotizaciones. Los otros recursos y sus consultas siguen el mismo recorrido.

```text
quotes/
  index.ts
  quotes.module.ts
  application/
    application.module.ts
    commands/
      commands.module.ts
      receive-quote/
        receive-quote.command.ts
        receive-quote.handler.ts
        receive-quote.module.ts
    queries/
      queries.module.ts
      get-quote/
        get-quote.query.ts
        get-quote.handler.ts
        get-quote.module.ts
    use-cases/
      receive-quote.use-case.ts
      get-quote.use-case.ts
  domain/
    ports/output/
      quote-reader.port.ts
      quote-writer.port.ts
  infrastructure/
    infrastructure.module.ts
    adapters/
      adapters.module.ts
      quotes.postgres.ts
    mappers/
      intake.mapper.ts
      intake.presenter.ts
    web/http/
      controllers/intake.controller.ts
      dtos/requests/intake.request.dto.ts
      dtos/responses/receipt.response.dto.ts
      quotes.openapi.ts
```

- Cada acción tiene un mensaje CQRS con su resultado tipado, un handler Nest, un módulo de acción y un caso de uso puro. El módulo de acción importa CQRS e infraestructura y registra su handler. El handler recibe los puertos por inyección, compone el caso de uso y delega en él.
- Los módulos de comandos y consultas reúnen las acciones del contexto. El módulo de aplicación importa y exporta los grupos existentes. El módulo del contexto reúne aplicación e infraestructura y se publica en `index.ts`.
- Los puertos viven en `domain/ports/output/`. Usa nombres de negocio para modelos, políticas, valores y errores. Los casos de uso pueden importar el tipo de su mensaje. El dominio y los casos de uso se prueban sin Nest ni base de datos.
- `infrastructure/adapters/adapters.module.ts` enlaza tokens y adaptadores concretos. `infrastructure/infrastructure.module.ts` registra controladores y exporta los adaptadores para inyección. El transporte valida DTOs de entrada, despacha al bus y presenta un DTO de salida. Ubica los mappers y presenters en `infrastructure/mappers/`.
- Los imports entre contextos pasan por su `index.ts`. ESLint vigila estas dependencias. La suite de arquitectura verifica que cada operación tenga mensaje, handler, módulo y caso de uso.
- Legado conserva el adaptador PostgreSQL con `pg`, las migraciones SQL versionadas en `apps/api/migrations/` y su historial de ejecución. El pool y el ejecutor de migraciones viven en `shared/infrastructure/database/`. El trabajo de retención espera a las migraciones, ejecuta las políticas de expiración de Identidad y Cotizaciones y espera cualquier ejecución en curso al cerrar la API.

## Contrato HTTP y documentación obligatoria

Toda operación HTTP de negocio usa inglés en rutas, parámetros, campos, valores enumerados, mensajes de error y documentación. Usa el prefijo `/api/v{major}` y versionado URI de Nest. Los datos libres del cliente, nombres geográficos e identificadores históricos de catálogo conservan su valor. Traduce en la interfaz y adapta el formato de transporte en el límite del contexto. Un cambio incompatible en una versión publicada requiere una versión mayor y un plan de migración de consumidores.

Cada endpoint se entrega en el mismo cambio con su operación OpenAPI en `<contexto>/infrastructure/web/http/<contexto>.openapi.ts` (ensamblado en `src/openapi.ts`) y una petición ejecutable en `bruno/`. Documenta autenticación, entradas, respuestas, errores, paginación e idempotencia cuando correspondan. Utiliza datos ficticios y credenciales de entorno. Verifica el contrato con la API real, el proxy del panel, el cliente web, el Worker cuando corresponda y el healthcheck de Compose.

## Aplicación al piloto actual

La recepción, el historial y el detalle viven en `src/quotes/`. La escritura conserva la idempotencia en PostgreSQL y el caso de uso aplica las restricciones del piloto. El listado omite los datos de contacto y la retención se aplica también al detalle. Mantén las migraciones versionadas en `apps/api/migrations/`. [Privacidad del piloto](../../docs/privacidad.md)

## Verificar los límites

- Prueba las invariantes y los casos de uso con puertos en memoria, sin arrancar Nest. Para cambios de persistencia, verifica el adaptador con PostgreSQL real, incluidos reintentos concurrentes y conflictos cuando corresponda.
- Para cambios HTTP, comprueba el contrato observable, el acceso privado y los límites de datos del piloto. Desde la raíz, `npm run build:api` comprueba tipos y compila. Con la API de prueba levantada, `npm run test:api` recorre recepción, reintento y lectura privada.
- Al revisar dependencias, sigue el flujo desde el controlador hasta el adaptador. Un import de Nest o `pg` en el dominio o en un caso de uso, un controlador que recibe un repositorio concreto o una fila SQL que llega a la respuesta señalan una frontera que hay que corregir.

## DTO, mappers, presenters y sesiones

Cada mapper y presenter se exporta como clase con métodos estáticos sin estado. Los controladores invocan la clase directamente, por ejemplo `SessionMapper.toSignInCommand(input)` y `SessionPresenter.toResponse(pair)`.

Al modificar estas clases, ejecuta desde la raíz `node --test apps/api/tests/unit/architecture/api-architecture.spec.mjs`. Esta prueba recorre los archivos `*.mapper.ts` y `*.presenter.ts` de la API, incluidos los de contextos nuevos. También forma parte de `npm run test:api`.

Cada operación define un DTO de request para body, params y query aplicables y un contrato de response, incluso si responde 204. Valida con esquemas en el borde HTTP. El mapper traduce el DTO al comando o consulta y el presenter transforma la salida en la proyección pública. Documenta esos mismos contratos en OpenAPI y Bruno. Los casos de uso dependen de puertos y las filas, secretos y detalles del adaptador quedan en infraestructura.

Los listados administrativos filtran, buscan y paginan en la base con parámetros enlazados, límites explícitos y orden determinista. Devuelven filas, total, página y tamaño. Comprueba resultados vacíos y exclusión de datos de contacto en los resúmenes. La API verifica JWT de acceso y sesión vigente. La renovación rota el token de un solo uso y la base conserva únicamente su digest. Cubre expiración, revocación y reintentos concurrentes.
