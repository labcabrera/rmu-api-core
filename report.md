# Informe de analisis del repositorio rmu-api-core

Fecha: 2026-05-08

## 1. Resumen ejecutivo

`rmu-api-core` es una API NestJS 11/TypeScript para datos core de RMU. La estructura muestra una intencion clara de arquitectura modular con DDD ligero, CQRS, puertos/adaptadores, Mongoose para persistencia, Kafka para eventos, JWT/JWKS para autenticacion y Swagger para contrato HTTP.

El proyecto compila y el lint pasa, pero hay riesgos relevantes:

- La suite de tests esta rota: todos los archivos de `test/` estan vacios y `test/jest-e2e.json` tambien.
- Hay huecos de autorizacion confirmados en handlers de `Race`, `Traits` y lectura directa de `Realm`.
- El despliegue Kubernetes esta incompleto frente a las variables obligatorias validadas por Joi.
- Hay secretos en scripts versionados y `.dockerignore` no protege adecuadamente el contexto Docker.
- `npm audit` reporta 44 vulnerabilidades: 1 critica, 23 altas, 18 moderadas y 2 bajas.
- Kafka es obligatorio para arrancar, incluso para rutas HTTP y health checks.

## 2. Agentes usados

- `workflow-orchestrator`: coordinacion, division del trabajo y consolidacion.
- `solution-architect`: arquitectura, modularidad, acoplamientos y deuda tecnica.
- `backend-nestjs-developer`: revision de seguridad, autorizacion, validacion y bugs backend.
- `qa-engineer`: pruebas, cobertura, scripts y estrategia QA.
- `technical-reviewer`: dependencias, Docker, Kubernetes, secretos y operacion.

## 3. Validaciones ejecutadas

| Comando | Resultado |
| --- | --- |
| `npm run build` | OK |
| `npm run lint` | OK; el script usa `--fix`, aunque no dejo cambios en git |
| `npm test -- --runInBand` | Falla: `test/example.spec.ts` no contiene ningun test |
| `npm run test:e2e -- --runInBand` | Falla: `test/jest-e2e.json` esta vacio |
| `npm audit --audit-level=moderate` | Falla por vulnerabilidades: 44 totales |
| `npm outdated` | Lista varias dependencias con parches disponibles |
| `git status --short` | Limpio antes de crear este informe |

## 4. Hallazgos criticos

### C1. Despliegue Kubernetes incompleto

`src/app.module.ts` valida como obligatorias variables de Mongo, IAM y Kafka, pero `k8s/deployment.yaml` solo inyecta `RMU_MONGO_CORE_URI`. En una imagen limpia, el pod deberia fallar al arrancar.

Evidencia:

- `src/app.module.ts`: requiere `RMU_IAM_JWK_URI`, `RMU_IAM_TOKEN_URI`, `RMU_IAM_CLIENT_ID`, `RMU_IAM_CLIENT_SECRET`, `RMU_KAFKA_BROKERS`, `RMU_KAFKA_CLIENT_ID`.
- `k8s/deployment.yaml`: solo define `RMU_MONGO_CORE_URI`.

Recomendacion: completar ConfigMap/Secret y documentar todas las variables requeridas.

### C2. Secretos en scripts versionados

Estado: corregido en el arbol de trabajo actual.

`docker-run.sh` contenia credenciales Mongo y un client secret IAM en variables `-e`. El script ya no versiona valores sensibles: ahora exige un fichero local `.env.docker`, ignorado por git, y se ha anadido `docker-run.env.example` solo con placeholders.

Evidencia:

- `docker-run.sh`: usa `--env-file "${ENV_FILE}"` y no contiene valores de secretos.
- `.gitignore`: ignora `.env.docker`.
- `docker-run.env.example`: documenta las variables requeridas con placeholders.

Pendiente fuera del cambio de codigo: rotar los secretos que estuvieron expuestos, eliminarlos del historial si aplica, y mover los valores reales a variables externas, K8s Secrets o Secret Manager.

### C3. Contexto Docker expone archivos sensibles/locales

Estado: corregido en el arbol de trabajo actual.

`.dockerignore` ya excluye configuracion local y secretos (`.env`, `.env.*`, `db-seed/.env`, env-files locales de Docker), dependencias (`node_modules/`), salidas de build (`dist/`, `out/`), cobertura y metadatos locales. El `Dockerfile` mantiene `COPY . .`, pero el contexto queda reducido por `.dockerignore`.

Tambien se ha sustituido `npm install --frozen-lockfile` por `npm ci`, coherente con `package-lock.json` y builds reproducibles.

Evidencia:

- `.dockerignore`: excluye secretos, dependencias, artefactos y metadatos locales.
- `Dockerfile`: usa `npm ci` tras copiar `package*.json`.

Pendiente operativo: revisar si existen otros ficheros locales no versionados con datos sensibles y mantener secret scanning en CI.

### C4. Suite de tests inutilizable

Todos los archivos de `test/` tienen 0 lineas. `npm test` falla por suite vacia y `test:e2e` falla porque `test/jest-e2e.json` esta vacio.

Recomendacion: eliminar o completar specs vacios, crear configuracion e2e valida y hacer que `test`, `test:unit`, `test:e2e` y `test:all` sean puertas reales de calidad.

## 5. Hallazgos altos

### A1. Bypass de autorizacion en Race

Estado: corregido en el arbol de trabajo actual.

`UpdateRaceHandler` y `DeleteRaceHandler` ahora inyectan `RaceGuardPort` y aplican `checkUpdate`/`checkDelete` antes de modificar o borrar la entidad. Si el guard deniega la operacion, no se persiste el cambio ni se publican eventos.

Evidencia:

- `src/modules/races/application/cqrs/handlers/update-race.handler.ts`: valida `RaceGuardPort.checkUpdate`.
- `src/modules/races/application/cqrs/handlers/delete-race.handler.ts`: valida `RaceGuardPort.checkDelete`.
- `src/modules/races/application/cqrs/handlers/race-authorization.handler.spec.ts`: cubre update/delete permitidos y denegados.

Recomendacion: mantener estas pruebas como regresion y extender el mismo patron a otros agregados con hallazgos de autorizacion.

### A2. Traits no aplica autorizacion de dominio

Los handlers de `Traits` no validan permisos de lectura, actualizacion ni borrado pese a que las entidades tienen owner/acceso.

Evidencia:

- `src/modules/traits/application/cqrs/handlers/get-trait.handler.ts`
- `src/modules/traits/application/cqrs/handlers/get-realms.handler.ts`
- `src/modules/traits/application/cqrs/handlers/update-trait.handler.ts`
- `src/modules/traits/application/cqrs/handlers/delete-trait.handler.ts`

Recomendacion: introducir `TraitGuardPort`, filtrar listados y validar read/update/delete.

### A3. Realm permite lectura directa por id sin checkRead

`GetRealmHandler` devuelve la entidad sin validar `accessType`, owner ni roles. El controller solo pasa `userId`, no roles.

Evidencia:

- `src/modules/realms/interfaces/http/realm.controller.ts:34`
- `src/modules/realms/application/cqrs/handlers/get-realm.handler.ts:120`

Recomendacion: ampliar `GetRealmQuery` con roles y aplicar `RealmGuardPort.checkRead`.

### A4. JWT valida firma, pero no issuer/audience

`JwtStrategy` usa JWKS y `RS256`, pero no configura `issuer` ni `audience`. Un token valido del mismo proveedor/realm pero para otro cliente podria ser aceptado.

Evidencia:

- `src/modules/auth/jwt.strategy.ts`

Recomendacion: configurar `issuer` y `audience`/client id desde `ConfigService`, y anadir tests con `aud` incorrecto.

### A5. Kafka acoplado al arranque HTTP

`main.ts` conecta siempre un microservicio Kafka y `KafkaProducerService` conecta en `onModuleInit`. Si Kafka no esta disponible, el arranque de la API HTTP queda acoplado a esa dependencia.

Evidencia:

- `src/main.ts:106`
- `src/modules/shared/infrastructure/messaging/kafka-producer.service.ts:98`

Recomendacion: modo Kafka opcional por configuracion, health separado y politica de retry/backoff.

### A6. Eventos sin garantia transaccional

Los cambios en Mongo y la publicacion Kafka no estan coordinados. Si Mongo confirma y Kafka falla, el sistema queda inconsistente. Los adapters solo registran TODO de manejo de error.

Evidencia:

- `src/modules/races/infrastructure/messaging/kafka.race-event-bus.adapter.ts`
- `src/modules/realms/infrastructure/messaging/kafka.realm-bus.adapter.ts`
- `src/modules/cultures/infrastructure/messaging/kafka.culture-event-bus.adapter.ts`
- `src/modules/traits/infrastructure/messaging/kafka.trait-event-bus.adapter.ts`

Recomendacion: outbox pattern, reintentos, DLQ, idempotencia y metricas.

### A7. Seguridad y hardening de despliegue insuficientes

Kubernetes usa `labcabrera/rmu-api-core:latest`, no define probes, requests/limits ni `securityContext`. El contenedor corre como root por defecto. El Ingress desactiva redireccion HTTPS.

Evidencia:

- `k8s/deployment.yaml`
- `k8s/ingress.yaml`
- `Dockerfile`

Recomendacion: tags inmutables o digest, usuario no root, `runAsNonRoot`, `readOnlyRootFilesystem`, capabilities drop, probes contra health y recursos.

### A8. Vulnerabilidades en dependencias

`npm audit` reporta 44 vulnerabilidades: 1 critica, 23 altas, 18 moderadas y 2 bajas. Destacan `handlebars` critica, avisos altos en `@nestjs/core`, `@nestjs/microservices`, `axios`, `mongoose`, `multer`, `path-to-regexp`, `lodash`, `validator` y otros transitorios.

Recomendacion: ejecutar `npm audit fix` en rama dedicada, revisar cambios de lockfile y priorizar parches de NestJS, Axios y Mongoose. Evitar `npm audit fix --force` sin revision porque introduce cambios mayores, por ejemplo `module@2`.

## 6. Hallazgos medios

### M1. Uso inconsistente de `req.user`

Varios endpoints pasan `req.user` completo casteado como string en lugar de `req.user.id`. Esto rompe comparaciones de owner contra userId y puede producir falsos negativos de permisos o bypass si el handler no valida.

Evidencia:

- `src/modules/races/interfaces/http/race.controller.ts`
- `src/modules/cultures/interfaces/http/culture.controller.ts`

Recomendacion: crear decorator `@CurrentUser()` tipado y prohibir casts manuales.

### M2. Paginacion sin limite superior

`PagedQueryDto` valida `size >= 1`, pero no define `@Max`. Un cliente autenticado puede pedir tamanos enormes.

Evidencia:

- `src/modules/shared/interfaces/http/dto/paged-rsql-query.ts:22`

Recomendacion: anadir `@Max(100)` o valor configurable.

### M3. RSQL permite campos arbitrarios y regex sin control

`RsqlParser` convierte selectores directamente a filtros Mongo e incluye `$regex` case-insensitive. No hay allowlist por recurso ni limites para regex.

Evidencia:

- `src/modules/shared/infrastructure/persistence/repositories/rsql-parser.ts`

Recomendacion: whitelist por endpoint/repositorio, bloquear campos internos, limitar regex y cubrir con tests.

### M4. Bug latente en callbacks de `RsqlParser`

`node.args.map(this.processNode)` pierde el binding de `this` en ramas AND/OR. Puede romper expresiones anidadas.

Recomendacion: usar `node.args.map(arg => this.processNode(arg))`.

### M5. Puertos de aplicacion dependen de Mongoose

`BaseRepository` y `EntityGuard` importan `FilterQuery` desde Mongoose. Esto rompe el limite hexagonal y dificulta tests de aplicacion sin infraestructura.

Evidencia:

- `src/modules/shared/application/ports/base-repository.ts`
- `src/modules/shared/application/ports/entity-guard.ts`

Recomendacion: definir criterios de busqueda propios y traducirlos a Mongo en infraestructura.

### M6. Validacion global permisiva

`ValidationPipe` usa `whitelist: true`, pero `forbidNonWhitelisted: false`. Los campos desconocidos se descartan silenciosamente.

Evidencia:

- `src/main.ts:91`

Recomendacion: valorar `forbidNonWhitelisted: true`, especialmente para APIs externas.

### M7. OpenAPI hardcodeado a localhost

Swagger define OAuth y server en localhost.

Evidencia:

- `src/main.ts`

Recomendacion: mover URLs OAuth, token y servers a configuracion por entorno.

### M8. `TokenService` sin timeout ni resiliencia

La llamada `axios.post` no define timeout, retry ni mapeo explicito de errores.

Evidencia:

- `src/modules/auth/token.service.ts`

Recomendacion: configurar timeout, retry controlado y errores de dominio/infraestructura.

### M9. Tooling con scripts no ideales para CI

`lint` ejecuta `eslint ... --fix`. En CI conviene que lint solo verifique y falle sin modificar archivos.

Evidencia:

- `package.json`

Recomendacion: separar `lint` y `lint:fix`.

## 7. Hallazgos bajos y deuda tecnica

- Typos estructurales: `amor-types.module.ts`, `intrastructure`, `profession-guar.addapter.ts`, `dommain`, handlers con nombres cruzados como `update-race.handler.ts` dentro de cultures.
- Tokens de DI como strings duplicados (`'RaceRepository'`, etc.). Usar constantes o `Symbol`.
- TypeScript no esta en modo estricto completo: `noImplicitAny` esta en `false` y hay muchos `eslint-disable`/reglas unsafe degradadas.
- `@nestjs/mapped-types` usa version `"*"`.
- Dependencia runtime sospechosa: `"test": "^3.3.0"`.
- Falta `engines` en `package.json` para fijar Node/npm.
- README describe el dominio, pero no documenta variables, ejecucion local, Docker, K8s, seeds, auth, Kafka, Mongo ni health.

## 8. Recomendaciones priorizadas

1. Rotar y retirar secretos versionados; ampliar `.dockerignore`.
2. Arreglar tests base: specs no vacios, `jest-e2e.json` valido y scripts funcionando.
3. Corregir autorizacion en `Race`, `Traits` y `Realm`.
4. Validar JWT con `issuer` y `audience`.
5. Completar deployment K8s con Secrets, ConfigMap, probes, recursos y hardening.
6. Aplicar parches de seguridad de dependencias en rama dedicada.
7. Hacer Kafka opcional o resiliente y disenar outbox para eventos.
8. Limitar paginacion y RSQL.
9. Separar `lint`/`lint:fix` y anadir `lint:check`.
10. Endurecer TypeScript gradualmente y reducir `any`/`eslint-disable`.

## 9. Plan de trabajo sugerido

### Sprint tecnico 1: seguridad y CI minimo

- Rotar secretos expuestos.
- Corregir `.dockerignore`.
- Crear `test/jest-e2e.json` valido.
- Eliminar specs vacios o crear pruebas minimas reales.
- Anadir `lint:check`.
- Corregir autorizacion Race/Realm/Traits.

### Sprint tecnico 2: operacion y dependencias

- Actualizar NestJS/Axios/Mongoose y lockfile.
- Completar K8s con variables obligatorias, probes, resources y securityContext.
- Reemplazar `latest` por tag inmutable.
- Parametrizar Swagger/OpenAPI por entorno.

### Sprint tecnico 3: arquitectura y resiliencia

- Introducir outbox o mecanismo equivalente para eventos.
- Hacer Kafka opcional/resiliente.
- Sustituir `FilterQuery` en puertos por criterios propios.
- Centralizar tokens DI.
- Definir whitelist RSQL por recurso.

## 10. Riesgos residuales

- No se ha ejecutado la aplicacion contra Mongo/Kafka/IAM reales.
- No se ha probado ningun endpoint HTTP porque la suite e2e esta vacia.
- `npm audit fix` no se ha aplicado; el informe solo documenta vulnerabilidades.
- Algunos hallazgos de autorizacion requieren tests negativos para confirmar explotabilidad completa en runtime, aunque el codigo muestra ausencia clara de checks.
