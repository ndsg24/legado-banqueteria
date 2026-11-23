# Seguridad de Legado

La portada, la carta, el diseñador y el cotizador se publican como archivos estáticos en GitHub Pages.
La cotización es pública. Si se configura el Worker, este recibe los datos de contacto y los envía
al buzón de Legado a través de Resend. Con el endpoint vacío, el visitante revisa y envía el
borrador en su propia aplicación de correo.

El piloto de administración usa Nest y PostgreSQL. El esquema de datos, los controles del piloto y los requisitos pendientes para operar con personas reales se detallan en [Privacidad](privacidad.md).

## Controles por categoría

| OWASP 2025 | Control en este proyecto | Alcance operativo |
| --- | --- | --- |
| A01 · Control de acceso | El Worker recibe cotizaciones por POST y expone el calendario de fechas ocupadas por GET. El origen de la agenda y el destinatario de correo se fijan en el servidor. | El origen se comparte con otros proyectos de la misma cuenta de Pages. CORS limita al navegador. El control de frecuencia también se aplica a clientes directos. |
| A02 · Configuración | Vite inserta la política de contenido antes de cargar recursos en cada HTML de producción. Los scripts provienen del propio origen. La política compartida permite además los orígenes HTTPS configurados para consultar la disponibilidad y enviar cotizaciones desde cualquier ruta de entrada. Las páginas omiten el referente. | La animación y los componentes usan estilos en línea. Para impedir que otros sitios enmarquen las páginas, el alojamiento debe servir `Content-Security-Policy: frame-ancestors 'none'` como cabecera HTTP. Pages no configura esa cabecera desde los archivos del proyecto. |
| A03 · Cadena de suministro | El build instala desde el lockfile sin scripts de ciclo de vida, audita también las herramientas de desarrollo y bloquea avisos moderados o superiores. Dependabot revisa npm y GitHub Actions cada semana. | Revisar avisos y probar las actualizaciones antes de incorporarlas. |
| A04 · Criptografía | HTTPS para Pages, el endpoint configurado y el proveedor. La clave de envío pertenece al Worker. El diseño de mesa se puede compartir por URL. El borrador, incluidos los datos de contacto, se guarda en `sessionStorage` de esa pestaña y se elimina al confirmar el envío automático. | El modo de borrador entrega los datos a la aplicación de correo. Revisar acceso y conservación en el buzón y el proveedor. |
| A05 · Inyección | Zod valida también en el servidor, el catálogo limita los identificadores y el correo usa texto plano. Los destinatarios y la URL del proveedor son fijos. | Mantener estas validaciones cuando se amplíe la carta o cambie el proveedor. |
| A06 · Diseño | El Worker limita el cuerpo a 16 KiB y solicita al limitador cinco envíos por minuto por IP. La clave de idempotencia se conserva al reintentar el mismo envío desde el formulario. | El límite por IP reduce abuso. Revisar el consumo total y las cuotas del proveedor de correo. |
| A07 · Autenticación | La visita y la cotización son públicas. La clave del proveedor se entrega desde los secretos de Cloudflare. | Verificar MFA y accesos de los administradores en GitHub, Cloudflare, Resend y el buzón. |
| A08 · Integridad | Las acciones declaradas en el workflow se fijan por SHA. El build tiene acceso de lectura. Solo el trabajo de despliegue recibe permisos para Pages y OIDC, después de superar las pruebas en main. | Proteger main, revisar los cambios de workflow y controlar quién puede publicar en el entorno github-pages. |
| A09 · Registro y alertas | El Worker emite eventos de configuración, limitación y errores de correo. Los mensajes de aplicación contienen códigos de evento y, cuando corresponde, el estado HTTP del proveedor. | Vincular los eventos a un destinatario de alertas y comprobar la recepción en staging. |
| A10 · Fallos excepcionales | Un fallo del limitador detiene el envío. El proveedor tiene un timeout, las redirecciones están deshabilitadas y solo se confirma el envío tras una respuesta satisfactoria. Los errores se devuelven sin traza ni cuerpo del proveedor. | Probar el servicio desplegado con datos de prueba y comprobar que un reintento no duplica el correo. |

## Verificación

Ejecutar `npm ci --ignore-scripts`, `npm run audit:security`, `npm run check` y
`npm run test:e2e`. Las pruebas ejercitan las cuatro páginas compiladas, la política CSP,
la descarga de PDF, las validaciones del Worker, límites, fallos y envío a un proveedor simulado.
El npm audit es una consulta al registro sobre las dependencias del lockfile.

Al configurar el envío, usar la URL HTTPS final del Worker terminada en `/api/v1/quotes`.
Revisar las cuatro páginas compiladas y confirmar que solo la política del cotizador incluya ese origen.
Probar un envío acordado con un buzón de pruebas antes de habilitar tráfico de clientes.

## Alertas del Worker

Después de desplegar el Worker con su configuración de observabilidad, crear un monitor para los
eventos `quote_limit_unavailable`, `quote_config_missing`, `quote_mail_rejected` y
`quote_mail_unavailable`. Como umbral inicial, avisar al responsable si se repiten tres errores en
cinco minutos. Revisar también aumentos de `quote_rate_limited` frente al volumen habitual.
Comprobar en staging tanto el evento como la llegada de la notificación. Mantener las cotizaciones,
direcciones, IP y credenciales fuera de los mensajes de aplicación y revisar los metadatos y la
retención que configura el proveedor.

Referencias: [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/),
[GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use) y
[Cloudflare Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).
