# Nexa Vote — Guía para OpenCode

Frontend de votación electrónica con React 19 + Vite 8. **Sin TypeScript** (JSX plano). El backend API es un repositorio separado; este es solo el cliente.

## Comandos

| Comando | Uso |
|---------|------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build producción |
| `npm run lint` | ESLint (react-hooks + react-refresh), solo .js/.jsx |
| `npm run preview` | Sirve build en puerto 10000 (`--host`) |

## Entorno

Todas las variables REQUIEREN prefijo `VITE_` (convención de Vite).

```
VITE_SUPABASE_URL=https://satnlrdqkpgnvpgcvgna.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_API_URL=http://localhost:5000
```

`.env` existe localmente con una anon key publicable; `.env` está en `.gitignore` — no committear cambios.

## Arquitectura

- **Entrypoint**: `src/main.jsx` → `src/App.jsx`
- **Routing**: React Router v7 (`react-router-dom`), todo en `App.jsx`
- **Estilos**: CSS plano en `src/css/` organizado por ruta (NO co-located, NO CSS modules)
- **API**: `src/services/api.js` usa **fetch nativo** (axios está en package.json pero no se usa en api.js)
- **Supabase**: `src/lib/supabaseClient.js` usando `@supabase/supabase-js`
- **Modelos face-api.js**: en `public/models/` (18 archivos), cargados en runtime
- **Tema**: `data-theme` en `<html>`, persistido en localStorage, controlado por `ThemeContext`
- **`app/`** en raíz: tiene `uploads/` vacío — es un artifact legacy, no tocar

### Rutas clave

| Ruta | Propósito |
|------|-----------|
| `/` | Inicio |
| `/login` | Login votante |
| `/registro/*` | Registro 5 pasos (cada paso es ruta anidada) |
| `/mfa/escaneo`, `/mfa/facial`, `/mfa/webauthn` | MFA votante |
| `/candidatos` | Selección de candidato (votar) |
| `/loginadmin` | Login admin |
| `/admin/dashboard`, `/admin/resultados`, `/admin/votantes` | Admin |

### Registro (5 pasos)

Rutas anidadas bajo `/registro/`: raíz → identidad → reconocimiento → biometrico → verificacion.
`RegistroLayout` envuelve las rutas con su propio `RegistrationProvider`. El contexto persiste `registrationId` en localStorage.

### MFA votante

Escaneo DNI (`/mfa/escaneo`) → Reconocimiento facial (`/mfa/facial`) → WebAuthn (`/mfa/webauthn`).

## Componentes compartidos

- `src/components/FaceStep.jsx` — paso de reconocimiento facial reutilizable
- `src/pages/components/ui/Stepper.jsx` — stepper del registro
- `src/pages/components/ui/Mfastepper.jsx` — stepper del MFA
- `src/pages/components/layout/` — Footer, AdminFooter, AdminSidebar, AdminHeader

## Testing

No hay framework de tests. Solo `src/test/supabaseTest.js` para probar conexión manual a Supabase.

## Deploy

Dockerfile (Node 20): build requiere pasar `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` como ARGs. Sirve con `npm run preview` en puerto 10000.
Host Render `nexa-vote-front.onrender.com` configurado en `vite.config.js` como `allowedHosts`.

## Notas

- **README.md** es el template por defecto de Vite — ignorar.
- `index.html` carga Google Fonts (Space Grotesk, Inter) y Material Symbols.
- DNI scanning usa `@zxing/browser` (BrowserPDF417Reader) con preprocesamiento de imagen (filtros CSS).
- No hay codegen, migraciones, snapshots, ni suites de integración.
