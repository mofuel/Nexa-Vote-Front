# 03. Rutas Y Flujos

## Tabla De Rutas

| Ruta | Componente | Descripcion |
| --- | --- | --- |
| `/` | `Inicio` | Pagina publica con CTA de registro y login. |
| `/login` | `LoginVotante` | Autenticacion de votante con DNI y password. |
| `/registro/*` | `RegistroLayout` | Subrutas del alta de votante. |
| `/registro/` | `RegistroEscaneDNI` | Escaneo PDF417 del reverso del DNI. |
| `/registro/identidad` | `RegistroIdentidad` | Completa fecha, email y password. |
| `/registro/reconocimiento` | `RegistroReconocimiento` | Captura descriptor facial con prueba de vida. |
| `/registro/biometrico` | `RegistroBiometrico` | Registro WebAuthn del dispositivo. |
| `/registro/verificacion` | `ConfirmacionRegistro` | Confirma datos en Supabase y finaliza registro. |
| `/loginadmin` | `LoginAdmin` | Autenticacion administrativa. |
| `/admin/dashboard` | `AdminDashboard` | Resultados, votos emitidos, participacion y auditoria mock. |
| `/admin/resultados` | `ControlVotacionAdmin` | Control visual del estado de votacion. |
| `/admin/votantes` | `GestionVotantesAdmin` | Vista mock de gestion de votantes. |
| `/mfa/escaneo` | `MFAPaso1DNI` | Validacion del DNI del votante autenticado. |
| `/mfa/facial` | `MFAPaso2Facial` | Validacion facial del votante autenticado. |
| `/mfa/webauthn` | `MFAPaso3WebAuthn` | Validacion WebAuthn antes de votar. |
| `/candidatos` | `SeleccionCandidato` | Lista candidatos y registra voto. |

## Flujo Publico

```mermaid
flowchart TD
  A["/ Inicio"] --> B["/registro"]
  A --> C["/login"]
  A --> D["/loginadmin"]
```

`Inicio.jsx` tambien ejecuta `testConnection()` contra Supabase al montar la pantalla. Esa llamada imprime datos y errores en consola.

## Flujo De Registro

```mermaid
flowchart TD
  A["Escanear DNI"] --> B["POST /register/identity/scan"]
  B --> C["Guardar registrationId"]
  C --> D["Completar identidad"]
  D --> E["PUT /register/identity/:registrationId"]
  E --> F["Reconocimiento facial"]
  F --> G["POST /register/face"]
  G --> H["Registro WebAuthn"]
  H --> I["POST /webauthn/register/options"]
  I --> J["navigator.credentials.create"]
  J --> K["POST /webauthn/register/verify"]
  K --> L["Confirmacion"]
  L --> M["Supabase update registration_status"]
```

Detalles:

- `RegistroEscaneDNI` lee PDF417 con `BrowserPDF417Reader`.
- `parsearDNI` extrae DNI y nombre completo desde el texto crudo.
- El backend devuelve `data.voter_id`; se guarda como `registrationId`.
- `RegistroIdentidad` recupera datos por `GET /register/voter/:registrationId`.
- `RegistroReconocimiento` carga modelos de face-api.js y captura 5 muestras validas.
- `RegistroBiometrico` usa WebAuthn para crear una credencial de plataforma.
- `ConfirmacionRegistro` lee tablas Supabase y solo permite finalizar si hay rostro y credencial WebAuthn.

## Flujo De Login Y Voto

```mermaid
flowchart TD
  A["/login"] --> B["POST /api/auth/login"]
  B --> C{"has_voted?"}
  C -- "si" --> X["Bloquea ingreso"]
  C -- "no" --> D["Guardar token, voter_id y voter"]
  D --> E["/mfa/escaneo"]
  E --> F["POST /api/mfa/validate-dni"]
  F --> G["/mfa/facial"]
  G --> H["POST /api/mfa/validate-face"]
  H --> I["/mfa/webauthn"]
  I --> J["POST /webauthn/auth/options"]
  J --> K["navigator.credentials.get"]
  K --> L["POST /webauthn/auth/verify"]
  L --> M["/candidatos"]
  M --> N["GET /api/votes/candidates"]
  N --> O["POST /api/votes/cast"]
```

Persistencia local usada por este flujo:

- `token`: JWT o token emitido por backend.
- `voter_id`: identificador del votante.
- `voter`: datos serializados del usuario.
- `dni_barcode_valid`: bandera esperada por los pasos MFA posteriores.
- `face_valid`: bandera marcada tras validacion facial.
- `fingerprint_valid`: bandera marcada tras validacion WebAuthn.

## Flujo Admin

```mermaid
flowchart TD
  A["/loginadmin"] --> B["POST /api/admin/login"]
  B --> C["Guardar admin_token y admin"]
  C --> D["/admin/dashboard"]
  D --> E["GET /api/votes/results"]
  D --> F["GET /api/votes/total"]
  D --> G["GET /api/votes/turnout"]
  C --> H["/admin/resultados"]
  C --> I["/admin/votantes"]
```

Notas:

- `AdminDashboard` consume datos reales de resultados, total y participacion.
- `ControlVotacionAdmin` usa estado local para alternar `votingOpen`; no persiste el cambio en backend.
- `GestionVotantesAdmin` muestra datos mock definidos en el archivo.
- `AdminSidebar` elimina `admin_token` y `admin` al cerrar sesion.

