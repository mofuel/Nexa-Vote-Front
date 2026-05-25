# 01. Inicio Rapido

## Instalacion Local

```bash
npm install
npm run dev
```

La app queda disponible normalmente en `http://localhost:5173`.

## Variables De Entorno

El frontend usa variables de entorno de Vite, por lo que todas deben iniciar con `VITE_`.

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

Responsabilidades:

- `VITE_API_URL`: URL base del backend REST.
- `VITE_SUPABASE_URL`: URL del proyecto Supabase.
- `VITE_SUPABASE_ANON_KEY`: clave publica anonima para consultas del cliente.

## Scripts Disponibles

| Script | Comando | Uso |
| --- | --- | --- |
| Desarrollo | `npm run dev` | Levanta Vite con hot reload. |
| Build | `npm run build` | Genera `dist/` para produccion. |
| Preview | `npm run preview` | Sirve el build localmente. |
| Lint | `npm run lint` | Ejecuta ESLint sobre el proyecto. |

## Build Con Docker

El `Dockerfile` usa Node 20, instala dependencias, recibe variables como argumentos, compila y sirve con `vite preview` en el puerto `10000`.

```bash
docker build \
  --build-arg VITE_API_URL=https://api.ejemplo.com \
  --build-arg VITE_SUPABASE_URL=https://tu-proyecto.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=tu_clave_anonima \
  -t nexa-vote-front .

docker run -p 10000:10000 nexa-vote-front
```

## Preview En Produccion

`vite.config.js` configura:

- `preview.port = 10000`
- `preview.host = true`
- `allowedHosts = ['nexa-vote-front.onrender.com']`

Esto indica que el despliegue esta preparado para un host tipo Render.

## Requisitos Del Navegador

Para probar todos los flujos se necesita:

- Camara habilitada.
- Contexto seguro para WebAuthn. En produccion debe ser HTTPS. En local, `localhost` suele ser aceptado.
- Soporte de `navigator.credentials.create` y `navigator.credentials.get`.
- Permisos de archivo/camara para cargar fotos del DNI o capturar rostro.

## Verificacion Manual Basica

1. Abrir `/`.
2. Validar que la landing cargue sin errores.
3. Probar `/registro` con una imagen de DNI compatible PDF417.
4. Probar `/login` con credenciales del backend.
5. Revisar que los modelos de `public/models` carguen antes de usar reconocimiento facial.
6. Probar `/loginadmin` con credenciales administrativas.

