# 03. Rutas Y Flujos

## Tabla De Rutas

| Ruta | Componente | Proteccion | Descripcion |
| --- | --- | --- | --- |
| `/` | `Inicio` | Publica | Landing principal. |
| `/login` | `LoginVotante` | Publica | Login votante. |
| `/registro/*` | `RegistroLayout` | Publica | Registro de votante. |
| `/loginadmin` | `LoginAdmin` | Publica | Login admin. |
| `/admin/dashboard` | `AdminDashboard` | Admin | Dashboard. |
| `/admin/resultados` | `ControlVotacionAdmin` | Admin | Control de votacion. |
| `/admin/votantes` | `GestionVotantesAdmin` | Admin | Gestion de votantes. |
| `/admin/auditoria` | `AuditLogsAdmin` | Admin | Logs de auditoria. |
| `/mfa/escaneo` | `MFAPaso1DNI` | Votante | MFA DNI. |
| `/mfa/facial` | `MFAPaso2Facial` | Votante | MFA facial. |
| `/mfa/webauthn` | `MFAPaso3WebAuthn` | Votante | MFA WebAuthn. |
| `/candidatos` | `SeleccionCandidato` | Votante | Cedula de votacion. |

## Flujo Publico

```mermaid
flowchart TD
  A["/"] --> B["/registro"]
  A --> C["/login"]
  A --> D["/loginadmin"]
```

## Flujo De Registro

```mermaid
flowchart TD
  A["/registro"] --> B["Escaneo PDF417 DNI"]
  B --> C["scanIdentity"]
  C --> D["registrationId"]
  D --> E["/registro/identidad"]
  E --> F["updateIdentity"]
  F --> G["/registro/reconocimiento"]
  G --> H["registerFace"]
  H --> I["/registro/biometrico"]
  I --> J["webauthnRegisterOptions"]
  J --> K["navigator.credentials.create"]
  K --> L["webauthnRegisterVerify"]
  L --> M["/registro/verificacion"]
  M --> N["getRegistrationSummary"]
  N --> O["completeRegistration"]
```

## Flujo Login Votante Y Voto

```mermaid
flowchart TD
  A["/login"] --> B["loginVoter"]
  B --> C["AuthContext.login role voter"]
  C --> D["/mfa/escaneo"]
  D --> E["validateDNI"]
  E --> F["/mfa/facial"]
  F --> G["validateFace"]
  G --> H["/mfa/webauthn"]
  H --> I["webauthnAuthOptions"]
  I --> J["navigator.credentials.get"]
  J --> K["webauthnAuthVerify"]
  K --> L["/candidatos"]
  L --> M["getCandidates"]
  M --> N["castVote candidato o blank"]
```

## Flujo Admin

```mermaid
flowchart TD
  A["/loginadmin"] --> B["loginAdmin"]
  B --> C["AuthContext.login role admin"]
  C --> D["/admin/dashboard"]
  C --> E["/admin/resultados"]
  C --> F["/admin/votantes"]
  C --> G["/admin/auditoria"]
  D --> H["resultados + participacion + auditoria"]
  E --> I["modal confirmar apertura/cierre"]
  G --> J["logs cada 15s"]
```

## Rutas Protegidas

`ProtectedRoute` decide:

- Sin sesion: redirige a `/login` o `/loginadmin`.
- Con `adminOnly`: exige `isAdmin`.
- Durante carga: renderiza `auth-loading`.

