# 05. Componentes Y Archivos

## Raiz

| Archivo | Descripcion |
| --- | --- |
| `package.json` | Scripts, dependencias y Cypress en `Pruebas`. |
| `package-lock.json` | Lockfile npm. |
| `vite.config.js` | Configuracion Vite y preview. |
| `eslint.config.js` | ESLint flat config. |
| `Dockerfile` | Build y preview en Node 20. |
| `index.html` | HTML base, fuentes e iconos. |
| `README.md` | Indice de documentacion. |
| `AGENTS.md` | Instrucciones del proyecto agregadas en `main`. |

## Core

| Archivo | Descripcion |
| --- | --- |
| `src/main.jsx` | Monta React con `AuthProvider`. |
| `src/App.jsx` | Rutas, tema, toaster y guards. |
| `src/config/api.js` | URL base del backend. |
| `src/services/api.js` | Cliente API centralizado. |
| `src/lib/supabaseClient.js` | Cliente Supabase. |

## Contextos

| Archivo | Descripcion |
| --- | --- |
| `src/context/AuthContext.jsx` | Sesion global con role. |
| `src/context/useAuth.js` | Hook para auth. |
| `src/context/ThemeContext.jsx` | Tema claro/oscuro. |
| `src/context/RegistrationProvider.jsx` | Estado de registro. |
| `src/context/useRegistration.js` | Hook de registro. |

## Componentes Globales

| Archivo | Descripcion |
| --- | --- |
| `src/components/ProtectedRoute.jsx` | Proteccion de rutas. |
| `src/components/CandidatePieChart.jsx` | Grafico circular de candidatos. |
| `src/components/ConfirmVotingModal.jsx` | Modal de confirmacion admin. |
| `src/components/FaceStep.jsx` | Archivo vacio. |

## Paginas Publicas Y Votante

| Archivo | Descripcion |
| --- | --- |
| `src/pages/Inicio.jsx` | Landing publica. |
| `src/pages/votante/LoginVotante.jsx` | Login votante. |
| `src/pages/votante/Mfapaso1dni.jsx` | Validacion DNI MFA. |
| `src/pages/votante/Mfapaso2facial.jsx` | Validacion facial MFA. |
| `src/pages/votante/Mfapaso3webauthn.jsx` | Validacion WebAuthn MFA. |
| `src/pages/votante/Seleccioncandidato.jsx` | Cedula, tema, logout y voto en blanco. |

## Registro

| Archivo | Descripcion |
| --- | --- |
| `src/pages/registro/RegistroLayout.jsx` | Subrutas de registro. |
| `src/pages/registro/RegistroEscaneDNI.jsx` | Escaneo PDF417 del DNI. |
| `src/pages/registro/RegistroIdentidad.jsx` | Datos personales. |
| `src/pages/registro/RegistroReconocimiento.jsx` | Registro facial. |
| `src/pages/registro/RegistroBiometrico.jsx` | Registro WebAuthn. |
| `src/pages/registro/ConfirmacionRegistro.jsx` | Resumen backend y finalizacion. |

## Admin

| Archivo | Descripcion |
| --- | --- |
| `src/pages/admin/LoginAdmin.jsx` | Login admin. |
| `src/pages/admin/AdminDashboard.jsx` | Dashboard con graficos y auditoria. |
| `src/pages/admin/ControlVotacionAdmin.jsx` | Control local de votacion con modal. |
| `src/pages/admin/GestionVotantesAdmin.jsx` | Gestion de votantes. |
| `src/pages/admin/AuditLogsAdmin.jsx` | Vista de auditoria. |

## Layout

| Archivo | Descripcion |
| --- | --- |
| `src/pages/components/layout/header/AdminHeader.jsx` | Header admin. |
| `src/pages/components/layout/sidebar/AdminSidebar.jsx` | Sidebar admin. |
| `src/pages/components/layout/footer/Footer.jsx` | Footer general. |
| `src/pages/components/layout/footer/AdminFooter.jsx` | Footer admin. |
| `src/pages/components/ui/Stepper.jsx` | Stepper de registro. |
| `src/pages/components/ui/Mfastepper.jsx` | Stepper MFA. |

## Cypress

| Archivo | Descripcion |
| --- | --- |
| `cypress.config.js` | Base URL y viewport. |
| `cypress/e2e/admin-login.cy.js` | Tests login admin. |
| `cypress/e2e/inicio.cy.js` | Test landing. |
| `cypress/e2e/protected-routes.cy.js` | Tests de rutas protegidas. |
| `cypress/e2e/registro.cy.js` | Tests registro. |
| `cypress/support/e2e.js` | Carga soporte Cypress. |
| `cypress/support/commands.js` | Comandos custom placeholder. |
| `cypress/fixtures/example.json` | Fixture de ejemplo. |

## k6

La rama `Pruebas` tambien agrega una carpeta `K6/` para pruebas de carga contra el backend desplegado en Render.

| Archivo | Descripcion |
| --- | --- |
| `K6/health-test.js` | Prueba de salud contra `/`. |
| `K6/candidates-test.js` | Carga progresiva sobre `/api/votes/candidates` con check de status 200. |
| `K6/login-test.js` | Carga sobre `/api/auth/login` usando credenciales de prueba. |
| `K6/register-test.js` | Crea payloads aleatorios para `/register/identity`. |
| `K6/stress-test.js` | Escenario de stress sobre `/register/identity`. |
| `K6/spike-test.js` | Pico rapido sobre `/api/votes/candidates`. |
