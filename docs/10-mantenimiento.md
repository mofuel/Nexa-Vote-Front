# 10. Mantenimiento

## Checklist Antes De Fusionar

```bash
npm run lint
npm run build
npm run test:e2e:run
k6 run K6/health-test.js
```

## Pruebas Manuales

- Landing `/`.
- Login votante `/login`.
- Registro completo `/registro`.
- MFA DNI.
- MFA facial.
- MFA WebAuthn.
- Cedula `/candidatos`.
- Voto por candidato.
- Voto en blanco.
- Login admin.
- Dashboard admin.
- Control de votacion.
- Auditoria.
- Rutas protegidas sin sesion.
- Cambio de tema.

## Pendientes Tecnicos

- Persistir apertura/cierre de votacion en backend.
- Conectar completamente gestion de votantes a backend.
- Revisar y alinear tests Cypress con rutas reales.
- Parametrizar scripts k6 para no depender de URLs y credenciales hardcodeadas.
- Implementar o eliminar `FaceStep.jsx`.
- Reducir estilos inline del admin.
- Agregar tests unitarios para parseo de DNI.
- Agregar tests para conversiones WebAuthn.
- Validar MFA siempre en backend antes de votar.

## Riesgos De Produccion

- Tokens en storage requieren buena proteccion XSS.
- WebAuthn depende de HTTPS.
- Camara depende de permisos del navegador.
- Modelos faciales deben estar completos.
- Backend debe evitar doble voto.
- Backend debe validar rol admin, aunque la UI tenga `ProtectedRoute`.

## Recomendaciones

1. Mantener `services/api.js` como unica puerta al backend.
2. Evitar llamadas `fetch` directas nuevas desde pantallas.
3. Documentar cambios de contrato API aqui.
4. Mantener tests E2E por flujo critico.
5. Mantener pruebas k6 para endpoints criticos del backend.
6. Migrar mocks admin a backend o fixtures.
7. Mantener diagramas Mermaid actualizados cuando cambien rutas o flujos.
