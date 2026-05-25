# 06. Biometria Y Seguridad

## DNI PDF417

Se usa `@zxing/browser` para leer el codigo PDF417 del reverso del DNI.

Pantallas:

- `RegistroEscaneDNI.jsx`: extrae DNI y nombre completo para iniciar registro.
- `Mfapaso1dni.jsx`: extrae DNI y lo valida contra el backend para MFA.

Tecnicas usadas:

- `BrowserPDF417Reader`.
- Reintentos con filtros de canvas.
- Escalado de imagen para mejorar lectura.
- Mensajes de error por baja calidad o codigo no encontrado.

## Reconocimiento Facial

Se usa `face-api.js` con modelos cargados desde `/models`.

Modelos cargados:

- `tinyFaceDetector`
- `faceLandmark68Net`
- `faceRecognitionNet`
- `faceExpressionNet`

Validaciones principales:

- Deteccion de un rostro.
- Tamano minimo del rostro en el cuadro.
- Rostro frontal.
- Cabeza vertical.
- Prueba de vida: mirar izquierda, mirar derecha y sonreir.
- Captura de 5 muestras y promedio del descriptor.

Pantallas:

- `RegistroReconocimiento.jsx`: registra el descriptor en backend.
- `MFAPaso2Facial.jsx`: valida descriptor contra backend durante MFA.

## WebAuthn

La app usa WebAuthn nativo del navegador.

### Registro

`RegistroBiometrico.jsx`:

1. Solicita challenge a `/webauthn/register/options`.
2. Ejecuta `navigator.credentials.create`.
3. Convierte `rawId`, `clientDataJSON` y `attestationObject` a Base64.
4. Envia payload a `/webauthn/register/verify`.

### Autenticacion

`MFAPaso3WebAuthn.jsx`:

1. Solicita challenge a `/webauthn/auth/options`.
2. Ejecuta `navigator.credentials.get`.
3. Envia `voter_id` e `id` de la credencial a `/webauthn/auth/verify`.
4. Marca `fingerprint_valid` y navega a `/candidatos`.

## Tokens Y Sesion

Votante:

- `token` se guarda en `localStorage`.
- Se envia como `Authorization: Bearer ${token}` en endpoints sensibles.
- `voter_id` y `voter` quedan disponibles para pasos posteriores.

Administrador:

- `admin_token` y `admin` se guardan en `localStorage`.
- `AdminSidebar` los elimina en logout.

## Reglas Que Debe Reforzar El Backend

El frontend mejora la experiencia, pero no debe ser fuente de autoridad. El backend debe validar:

- Que el token sea valido y pertenezca al votante.
- Que el votante no haya votado previamente.
- Que el DNI escaneado corresponda al usuario autenticado.
- Que el descriptor facial coincida con el registro.
- Que los challenges WebAuthn sean de un solo uso y expiren.
- Que el voto se pueda emitir una sola vez.
- Que las rutas admin requieran token administrativo valido.

## Riesgos A Tener En Cuenta

- `localStorage` es vulnerable si hay XSS.
- Las banderas MFA en cliente pueden modificarse manualmente; solo sirven como apoyo de navegacion.
- WebAuthn requiere HTTPS en produccion.
- La camara puede fallar por permisos, navegador o dispositivos virtuales.
- Los modelos de face-api.js deben publicarse completos; si falta un shard, el reconocimiento falla.

