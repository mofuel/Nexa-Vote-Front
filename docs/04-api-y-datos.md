# 04. API Y Datos

## Configuracion

`src/config/api.js` exporta:

```js
const API_URL = import.meta.env.VITE_API_URL;
export default API_URL;
```

Todas las llamadas al backend dependen de esa variable.

## Endpoints Consumidos

| Metodo | Endpoint | Usado en | Proposito |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | `loginVoter` | Login de votante con `dni` y `password`. |
| `GET` | `/auth/me` | `getCurrentUser` | Obtener usuario actual usando `Authorization: Bearer`. |
| `POST` | `/validation/multifactor` | `validateMultifactor` | Validacion MFA generica. Actualmente importada en MFA WebAuthn pero no usada. |
| `GET` | `/api/votes/candidates` | `getCandidates` | Lista candidatos para la cedula. |
| `POST` | `/api/votes/cast` | `castVote` | Registra voto con `candidate_id`. |
| `GET` | `/reports/summary` | `getReport` | Resumen de reportes. No se usa actualmente en pantallas. |
| `POST` | `/api/admin/login` | `loginAdmin` | Login administrativo con email/password. |
| `GET` | `/api/votes/results` | `getVoteResults` | Resultados por candidato. |
| `GET` | `/api/votes/total` | `getTotalVotes` | Total de votos emitidos. |
| `GET` | `/api/votes/turnout` | `getTurnout` | Porcentaje de participacion. |
| `POST` | `/api/mfa/validate-dni` | `MFAPaso1DNI` | Valida DNI escaneado durante MFA. |
| `POST` | `/api/mfa/validate-face` | `MFAPaso2Facial` | Valida descriptor facial durante MFA. |
| `POST` | `/register/identity/scan` | `RegistroEscaneDNI` | Crea registro inicial desde DNI escaneado. |
| `GET` | `/register/voter/:registrationId` | `RegistroIdentidad` | Recupera datos iniciales del votante. |
| `PUT` | `/register/identity/:registrationId` | `RegistroIdentidad` | Completa datos personales del votante. |
| `POST` | `/register/face` | `RegistroReconocimiento` | Guarda descriptor facial del registro. |
| `POST` | `/webauthn/register/options` | `RegistroBiometrico` | Solicita challenge para registrar credencial. |
| `POST` | `/webauthn/register/verify` | `RegistroBiometrico` | Verifica y guarda credencial WebAuthn. |
| `POST` | `/webauthn/auth/options` | `MFAPaso3WebAuthn` | Solicita challenge para autenticar WebAuthn. |
| `POST` | `/webauthn/auth/verify` | `MFAPaso3WebAuthn` | Verifica credencial WebAuthn. |

## Contratos Esperados Del Backend

### Login de votante

Entrada:

```json
{
  "dni": "12345678",
  "password": "secret"
}
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "token": "jwt",
    "user": { "id": "voter-id" },
    "has_voted": false
  }
}
```

### Lista de candidatos

Respuesta esperada:

```json
{
  "success": true,
  "data": [
    {
      "id": "candidate-id",
      "name": "Nombre",
      "party": "Partido",
      "photo_url": "https://..."
    }
  ]
}
```

### Resultados

`AdminDashboard` espera objetos con:

```json
{
  "candidate_name": "Nombre",
  "total": 10
}
```

### Registro inicial por DNI

Entrada:

```json
{
  "dni": "12345678",
  "full_name": "Nombre Apellido"
}
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "voter_id": "uuid"
  }
}
```

## Supabase

`src/lib/supabaseClient.js` crea el cliente con:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Tablas consultadas en `ConfirmacionRegistro`:

| Tabla | Campos usados | Uso |
| --- | --- | --- |
| `voters` | `*` | Datos principales del votante. |
| `biometric_data` | `face_embedding` | Verificar si el rostro fue registrado. |
| `webauthn_credentials` | `credential_id` | Verificar si WebAuthn fue registrado. |
| `registration_status` | `current_step`, `status`, `completed_at` | Leer y finalizar estado de registro. |

`finishRegistration` actualiza:

```js
{
  current_step: 4,
  status: "completed",
  completed_at: new Date()
}
```

## localStorage

| Clave | Escrita por | Leida por | Uso |
| --- | --- | --- | --- |
| `registrationId` | `RegistrationProvider.setRegistrationId` | Registro completo | Identifica el registro en progreso. |
| `token` | `LoginVotante` | MFA y voto | Autoriza endpoints del votante. |
| `voter_id` | `LoginVotante` | WebAuthn auth | Relaciona credencial con votante. |
| `voter` | `LoginVotante` | Disponible para UI futura | Datos serializados del votante. |
| `dni_barcode_valid` | Esperada por MFA | `MFAPaso2Facial`, `MFAPaso3WebAuthn` | Bandera de DNI validado. |
| `face_valid` | `MFAPaso2Facial` | `MFAPaso3WebAuthn` | Bandera de rostro validado. |
| `fingerprint_valid` | `MFAPaso3WebAuthn` | Disponible para UI futura | Bandera de WebAuthn validado. |
| `admin_token` | `LoginAdmin` | Admin futuro | Token de administrador. |
| `admin` | `LoginAdmin` | Admin futuro | Datos serializados del admin. |

## Datos Mock

Hay pantallas con datos estaticos:

- `AdminDashboard`: `auditLogs`.
- `ControlVotacionAdmin`: cifras visuales de votos y participacion.
- `GestionVotantesAdmin`: arreglo `voters`, filtros y badges.

Estos datos deben conectarse a backend si se busca operacion real.

