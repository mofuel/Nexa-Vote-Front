# Nexa Vote Front

Frontend web de Nexa Vote, un sistema de voto electronico construido con React y Vite. La aplicacion cubre tres experiencias principales: registro de votantes, autenticacion multifactor del votante y administracion de resultados.

## Indice Rapido

- [docs/01-inicio-rapido.md](docs/01-inicio-rapido.md): instalacion, variables de entorno, scripts y despliegue.
- [docs/02-arquitectura.md](docs/02-arquitectura.md): estructura general, tecnologias y responsabilidades por capa.
- [docs/03-rutas-y-flujos.md](docs/03-rutas-y-flujos.md): rutas publicas, votante, registro y administracion.
- [docs/04-api-y-datos.md](docs/04-api-y-datos.md): endpoints consumidos, Supabase, `localStorage` y contratos esperados.
- [docs/05-componentes-y-archivos.md](docs/05-componentes-y-archivos.md): inventario archivo por archivo.
- [docs/06-biometria-y-seguridad.md](docs/06-biometria-y-seguridad.md): DNI PDF417, reconocimiento facial, WebAuthn y tokens.
- [docs/07-estilos-y-ui.md](docs/07-estilos-y-ui.md): estilos, tipografias, iconos y convenciones visuales.
- [docs/08-mantenimiento.md](docs/08-mantenimiento.md): pruebas manuales, riesgos conocidos y mejoras recomendadas.

## Que Hace La Aplicacion

Nexa Vote Front permite:

- Mostrar una pagina publica de entrada al sistema.
- Registrar votantes mediante escaneo de DNI, datos personales, rostro y WebAuthn.
- Iniciar sesion como votante.
- Validar al votante con tres pasos MFA: DNI, rostro con liveness y WebAuthn.
- Presentar candidatos y emitir un voto autenticado.
- Iniciar sesion como administrador.
- Consultar resultados, participacion y vistas administrativas.

## Stack

- React 19.
- Vite 8.
- React Router DOM 7.
- Supabase JS 2.
- face-api.js para deteccion facial y descriptors.
- @zxing/browser para lectura PDF417 del DNI.
- WebAuthn nativo del navegador.
- Sonner para notificaciones.
- Docker para build y preview en puerto 10000.

## Requisitos

- Node.js 20 o compatible.
- Backend de Nexa Vote disponible por `VITE_API_URL`.
- Proyecto Supabase configurado por `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Navegador con soporte de camara, WebAuthn y `navigator.credentials`.
- Modelos de face-api.js presentes en `public/models`.

## Variables De Entorno

Crear un archivo `.env` local con:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

`VITE_API_URL` no debe terminar necesariamente en `/`; el codigo concatena rutas como `/api/auth/login`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Estructura Principal

```text
src/
  App.jsx                         Rutas principales de la SPA
  main.jsx                        Punto de montaje React
  config/api.js                   Lee VITE_API_URL
  services/api.js                 Cliente fetch para backend
  lib/supabaseClient.js           Cliente Supabase
  context/                        Estado del flujo de registro
  pages/
    Inicio.jsx                    Landing publica
    votante/                      Login, MFA y votacion
    registro/                     Alta de votantes
    admin/                        Login y paneles administrativos
    components/                   Layout, sidebars, footers y steppers
  css/                            Estilos por pantalla
public/
  models/                         Modelos de face-api.js
  favicon.svg
  icons.svg
```

## Flujo Funcional Resumido

1. El usuario entra por `/`.
2. Puede registrarse por `/registro` o iniciar sesion por `/login`.
3. El registro lee el DNI, completa datos, registra rostro, registra WebAuthn y confirma en Supabase.
4. El login de votante guarda `token`, `voter_id` y `voter`.
5. El votante pasa por `/mfa/escaneo`, `/mfa/facial` y `/mfa/webauthn`.
6. Al completar MFA, llega a `/candidatos`.
7. Selecciona candidato y envia voto a `/api/votes/cast`.
8. El administrador entra por `/loginadmin` y consulta `/admin/dashboard`, `/admin/resultados` y `/admin/votantes`.

## Documentacion Completa

La documentacion completa esta en `docs/`. Empieza por [docs/01-inicio-rapido.md](docs/01-inicio-rapido.md) si vas a ejecutar el proyecto, o por [docs/05-componentes-y-archivos.md](docs/05-componentes-y-archivos.md) si necesitas entender cada archivo del repositorio.
