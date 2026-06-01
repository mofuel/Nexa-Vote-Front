# Nexa Vote Front

Frontend web de Nexa Vote, sistema de voto electronico construido con React y Vite.

Esta documentacion mantiene la estructura extendida anterior, actualizada contra:

- `main`: `10e953fc1b3172e57fc9d1d762457aedbc3792dc`
- `Pruebas`: `15053091e34f378d135b65410c7e4cd1b0818765`

`Pruebas` esta un commit por delante de `main` y agrega Cypress/E2E. La documentacion integra ambos estados en una sola vision del proyecto.

## Indice De Documentacion

- [docs/01-inicio-rapido.md](docs/01-inicio-rapido.md): instalacion, variables, scripts y Docker.
- [docs/02-arquitectura.md](docs/02-arquitectura.md): arquitectura, capas, providers y diagramas.
- [docs/03-rutas-y-flujos.md](docs/03-rutas-y-flujos.md): rutas publicas, privadas, admin, registro y votacion.
- [docs/04-api-y-datos.md](docs/04-api-y-datos.md): endpoints, contratos, `apiFetch`, storage y Supabase.
- [docs/05-componentes-y-archivos.md](docs/05-componentes-y-archivos.md): inventario archivo por archivo.
- [docs/06-biometria-y-seguridad.md](docs/06-biometria-y-seguridad.md): DNI, face-api.js, WebAuthn, auth y riesgos.
- [docs/07-estilos-y-ui.md](docs/07-estilos-y-ui.md): tema, CSS, UI, layout y convenciones visuales.
- [docs/08-admin-y-auditoria.md](docs/08-admin-y-auditoria.md): dashboard, auditoria, control y gestion.
- [docs/09-pruebas-e2e.md](docs/09-pruebas-e2e.md): Cypress en la rama `Pruebas`.
- [docs/10-mantenimiento.md](docs/10-mantenimiento.md): checklist, pendientes y recomendaciones.

## Inicio Rapido

```bash
npm install
npm run dev
```

Variables necesarias:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

Scripts principales:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test:e2e
npm run test:e2e:run
```
