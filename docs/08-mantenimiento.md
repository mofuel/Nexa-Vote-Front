# 08. Mantenimiento

## Checklist Para Cambios

Antes de subir cambios:

```bash
npm run lint
npm run build
```

Pruebas manuales recomendadas:

- Landing carga y navega a login/registro.
- Registro lee DNI y guarda `registrationId`.
- Registro facial carga modelos desde `/models`.
- WebAuthn registra credencial en un navegador compatible.
- Login votante guarda token y bloquea usuarios que ya votaron.
- MFA completo navega a candidatos.
- Voto se envia una sola vez.
- Login admin navega al dashboard.
- Dashboard carga resultados, total y participacion.

## Observaciones Tecnicas

- `src/components/FaceStep.jsx` esta vacio.
- `src/App.css` contiene estilos del template y no parece importarse en la app actual.
- `getCurrentUser`, `validateMultifactor` y `getReport` existen en `services/api.js`, pero no se usan en las pantallas actuales.
- `ControlVotacionAdmin` tiene toggle local sin persistencia backend.
- `GestionVotantesAdmin` usa datos mock.
- `AdminDashboard` mezcla datos reales con logs mock.
- `AdminDashboard.css` existe, pero el dashboard usa principalmente estilos inline.
- Algunas rutas del sidebar apuntan a `/admin/auditoria`, pero esa ruta no existe en `App.jsx`.
- Los pasos MFA esperan `dni_barcode_valid`, pero la pantalla de validacion DNI debe asegurar que esa bandera se marque cuando el backend aprueba.

## Riesgos Funcionales A Vigilar

- Si `VITE_API_URL` esta vacio, todas las llamadas REST fallan.
- Si faltan variables de Supabase, `ConfirmacionRegistro` y `testConnection` fallan.
- Si falta algun archivo de `public/models`, face-api.js no puede cargar modelos.
- Si el backend no devuelve la forma esperada de `success` y `data`, varias pantallas quedan sin datos.
- Si WebAuthn se prueba fuera de HTTPS o `localhost`, el navegador puede bloquearlo.

## Mejoras Recomendadas

1. Agregar guards de ruta para votante y admin.
2. Revalidar contra backend cada paso MFA antes de permitir votar.
3. Mover constantes mock a backend o archivos de fixtures claramente marcados.
4. Agregar pruebas unitarias para parseo de DNI y conversiones WebAuthn.
5. Agregar tests de integracion para login, MFA y voto.
6. Centralizar cliente API para manejar errores HTTP de forma uniforme.
7. Tipar contratos con TypeScript o esquemas de validacion.
8. Reducir dependencia de `localStorage` para estados sensibles.
9. Documentar version y contrato del backend junto al frontend.
10. Limpiar assets y CSS heredados de Vite si no se usan.

## Guia Para Nuevos Desarrolladores

1. Leer `README.md`.
2. Configurar `.env`.
3. Ejecutar `npm install`.
4. Ejecutar `npm run dev`.
5. Revisar rutas en `src/App.jsx`.
6. Revisar endpoints en `src/services/api.js` y `docs/04-api-y-datos.md`.
7. Para cambios de registro, empezar por `src/pages/registro/RegistroLayout.jsx`.
8. Para cambios de MFA, empezar por `src/pages/votante/Mfapaso1dni.jsx`.
9. Para cambios admin, empezar por `src/pages/admin/AdminDashboard.jsx`.

