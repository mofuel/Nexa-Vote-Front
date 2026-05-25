# 05. Componentes Y Archivos

Este inventario documenta todos los archivos de codigo, configuracion y assets principales del repositorio.

## Raiz

| Archivo | Descripcion |
| --- | --- |
| `package.json` | Define nombre `nexa-vote`, scripts de Vite/ESLint y dependencias. |
| `package-lock.json` | Bloqueo exacto de dependencias npm. |
| `vite.config.js` | Configura React plugin y preview en puerto 10000 con host permitido de Render. |
| `eslint.config.js` | Configuracion ESLint flat para JS/JSX, React Hooks y React Refresh. |
| `Dockerfile` | Imagen Node 20, instala dependencias, compila y sirve preview. |
| `index.html` | HTML base con `#root`, favicon, fuentes Inter/Space Grotesk y Material Symbols. |
| `README.md` | Documentacion principal del proyecto. |

## Entrada Y Configuracion

| Archivo | Descripcion |
| --- | --- |
| `src/main.jsx` | Monta React en modo estricto. |
| `src/App.jsx` | Declara todas las rutas de la SPA y el `Toaster`. |
| `src/config/api.js` | Exporta `VITE_API_URL`. |
| `src/services/api.js` | Funciones REST compartidas para login, votos, reportes, admin y estadisticas. |
| `src/lib/supabaseClient.js` | Crea y exporta el cliente Supabase. |
| `src/test/supabaseTest.js` | Funcion de prueba que consulta `voter_registration` y escribe en consola. |

## Contexto

| Archivo | Descripcion |
| --- | --- |
| `src/context/RegistrationProvider.jsx` | Provider del flujo de registro. Guarda `registrationId`, datos parciales, paso y reset. |
| `src/context/useRegistration.js` | Hook para consumir `RegistrationContext`. |

## Paginas Publicas

| Archivo | Descripcion |
| --- | --- |
| `src/pages/Inicio.jsx` | Landing publica con CTA a registro/login, tarjetas de seguridad y prueba Supabase al montar. |

## Paginas De Votante

| Archivo | Descripcion |
| --- | --- |
| `src/pages/votante/LoginVotante.jsx` | Login con DNI/password. Guarda token y usuario. Bloquea si `has_voted` es verdadero. |
| `src/pages/votante/Mfapaso1dni.jsx` | MFA paso 1. Carga foto del DNI, lee PDF417, extrae DNI y valida con backend. |
| `src/pages/votante/Mfapaso2facial.jsx` | MFA paso 2. Usa camara, face-api.js, liveness y descriptor facial. |
| `src/pages/votante/Mfapaso3webauthn.jsx` | MFA paso 3. Autentica WebAuthn y redirige a candidatos. |
| `src/pages/votante/Seleccioncandidato.jsx` | Lista candidatos, permite seleccionar uno y emitir voto. |

## Paginas De Registro

| Archivo | Descripcion |
| --- | --- |
| `src/pages/registro/RegistroLayout.jsx` | Envuelve subrutas de registro con `RegistrationProvider`. |
| `src/pages/registro/RegistroEscaneDNI.jsx` | Primer paso de registro. Escanea DNI y crea registro inicial. |
| `src/pages/registro/RegistroIdentidad.jsx` | Segundo paso. Carga datos del votante y completa fecha/email/password. |
| `src/pages/registro/RegistroReconocimiento.jsx` | Tercer paso. Captura y registra rostro con validaciones de calidad. |
| `src/pages/registro/RegistroBiometrico.jsx` | Cuarto paso. Registra credencial WebAuthn de plataforma. |
| `src/pages/registro/ConfirmacionRegistro.jsx` | Paso final. Consulta Supabase, verifica rostro/WebAuthn y finaliza registro. |

## Paginas Admin

| Archivo | Descripcion |
| --- | --- |
| `src/pages/admin/LoginAdmin.jsx` | Login de administrador. Guarda `admin_token` y datos del admin. |
| `src/pages/admin/AdminDashboard.jsx` | Dashboard con resultados reales del backend, participacion y auditoria mock. |
| `src/pages/admin/ControlVotacionAdmin.jsx` | Pantalla de control visual del estado de votacion con toggle local. |
| `src/pages/admin/GestionVotantesAdmin.jsx` | Gestion de votantes con tabla, filtros y datos mock. |

## Componentes De Layout

| Archivo | Descripcion |
| --- | --- |
| `src/pages/components/layout/header/AdminHeader.jsx` | Barra superior admin con menu, navegacion visual y avatar. |
| `src/pages/components/layout/sidebar/AdminSidebar.jsx` | Menu lateral admin, navegacion y logout. |
| `src/pages/components/layout/footer/Footer.jsx` | Footer general de pantallas publicas/votante. |
| `src/pages/components/layout/footer/AdminFooter.jsx` | Footer admin. Actualmente igual al footer general. |

## Componentes UI

| Archivo | Descripcion |
| --- | --- |
| `src/pages/components/ui/Stepper.jsx` | Stepper generico para registro con pasos completados/activo/pendientes. |
| `src/pages/components/ui/Mfastepper.jsx` | Stepper especifico de MFA: DNI, facial y WebAuthn. |
| `src/components/FaceStep.jsx` | Archivo vacio. No exporta componente ni se usa actualmente. |

## Estilos

| Archivo | Pantalla/Area |
| --- | --- |
| `src/index.css` | Reset global, fondo base y configuracion de Material Symbols. |
| `src/App.css` | Estilos remanentes del template inicial. No se importa en `main.jsx` ni `App.jsx`. |
| `src/css/Inicio.css` | Landing publica. |
| `src/css/votante/LoginVotante.css` | Login votante. |
| `src/css/votante/Mfapaso1dni.css` | MFA DNI. |
| `src/css/votante/Mfapaso2facial.css` | MFA facial. |
| `src/css/votante/Mfapaso3webauthn.css` | MFA WebAuthn. |
| `src/css/votante/Seleccioncandidato.css` | Cedula de votacion. |
| `src/css/registro/Registroidentidad.css` | Escaneo DNI y datos de identidad. |
| `src/css/registro/RegistroReconocimiento.css` | Registro facial. |
| `src/css/registro/RegistroBiometrico.css` | Registro WebAuthn. |
| `src/css/registro/ConfirmacionRegistro.css` | Confirmacion final. |
| `src/css/admin/LoginAdmin.css` | Login admin. |
| `src/css/admin/AdminDashboard.css` | Estilos admin disponibles, aunque varias pantallas admin usan estilos inline. |

## Assets

| Archivo/Carpeta | Descripcion |
| --- | --- |
| `src/assets/hero.png` | Imagen de hero disponible en assets. |
| `src/assets/react.svg` | Asset heredado de Vite. |
| `src/assets/vite.svg` | Asset heredado de Vite. |
| `public/favicon.svg` | Favicon de la app. |
| `public/icons.svg` | Sprite/asset SVG publico. |
| `public/models/*` | Modelos y manifests de face-api.js. |

## Modelos En `public/models`

- `tiny_face_detector_model-*`: deteccion rapida de rostro.
- `face_landmark_68_model-*`: landmarks faciales.
- `face_landmark_68_tiny_model-*`: variante ligera de landmarks.
- `face_recognition_model-*`: descriptor facial.
- `face_expression_model-*`: expresiones usadas para sonrisa/liveness.
- `ssd_mobilenetv1_model-*`, `mtcnn_model-*`, `age_gender_model-*`: modelos disponibles en carpeta aunque no todos se cargan desde el codigo actual.

