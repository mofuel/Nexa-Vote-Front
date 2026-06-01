# 04. API Y Datos

## Configuracion Base

`src/config/api.js` exporta `VITE_API_URL`.

`src/services/api.js` contiene `apiFetch`, que:

- Lee `token` o `admin_token` de `sessionStorage`.
- Agrega `Content-Type: application/json`.
- Agrega `Authorization: Bearer`.
- Si recibe 401, limpia sesion y dispara `auth:logout`.

## Endpoints

| Funcion | Metodo | Endpoint |
| --- | --- | --- |
| `loginVoter` | POST | `/api/auth/login` |
| `getCurrentUser` | GET | `/auth/me` |
| `validateMultifactor` | POST | `/validation/multifactor` |
| `getCandidates` | GET | `/api/votes/candidates` |
| `castVote` | POST | `/api/votes/cast` |
| `getReport` | GET | `/reports/summary` |
| `loginAdmin` | POST | `/api/admin/login` |
| `getVoteResults` | GET | `/api/votes/results` |
| `getTotalVotes` | GET | `/api/votes/total` |
| `getTurnout` | GET | `/api/votes/turnout` |
| `getTurnoutDetailed` | GET | `/api/votes/turnout-detailed` |
| `validateDNI` | POST | `/api/mfa/validate-dni` |
| `validateFace` | POST | `/api/mfa/validate-face` |
| `webauthnAuthOptions` | POST | `/webauthn/auth/options` |
| `webauthnAuthVerify` | POST | `/webauthn/auth/verify` |
| `scanIdentity` | POST | `/register/identity/scan` |
| `getVoter` | GET | `/register/voter/:id` |
| `updateIdentity` | PUT | `/register/identity/:id` |
| `registerFace` | POST | `/register/face` |
| `webauthnRegisterOptions` | POST | `/webauthn/register/options` |
| `webauthnRegisterVerify` | POST | `/webauthn/register/verify` |
| `getRegistrationSummary` | GET | `/register/summary/:id` |
| `completeRegistration` | PUT | `/register/complete/:id` |
| `getAuditLogs` | GET | `/api/admin/audit-logs` |
| `getVoteReport` | GET | `/api/votes/report` |

## Storage

### `sessionStorage`

| Clave | Uso |
| --- | --- |
| `token` | Token de sesion actual. |
| `admin_token` | Token administrativo. |
| `voter` | Datos del votante. |
| `admin` | Datos del administrador. |
| `voter_id` | ID del votante. |

### `localStorage`

| Clave | Uso |
| --- | --- |
| `theme` | Tema claro/oscuro. |
| `registrationId` | ID del registro en progreso. |
| `nexavote_sidebar_open` | Estado visual del sidebar admin. |

## Contratos Esperados

Login votante:

```json
{
  "success": true,
  "data": {
    "token": "jwt",
    "user": { "id": "uuid" },
    "has_voted": false
  }
}
```

Resultados:

```json
{
  "success": true,
  "data": [
    { "candidate_name": "Nombre", "total": 10 }
  ]
}
```

Auditoria:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "created_at": "2026-05-31T00:00:00Z",
      "action_type": "VOTE_CAST",
      "status": "success",
      "ip_address": "127.0.0.1",
      "voter_id": "uuid",
      "metadata": {}
    }
  ]
}
```

## Supabase

El cliente sigue disponible en `src/lib/supabaseClient.js`, pero la confirmacion de registro actual usa backend:

- `getRegistrationSummary`
- `completeRegistration`

Esto reduce acoplamiento directo entre UI y tablas Supabase.

