# 07. Estilos Y UI

## Sistema Visual

La interfaz usa una estetica oscura institucional con acentos:

- Fondo principal: tonos oscuros cercanos a `#14121c`.
- Acento verde: `#41eec2`.
- Acento violeta: `#6c47ff` y `#c9beff`.
- Texto principal: `#e6e0ef`.
- Texto secundario: `#c9c3d9`.

## Fuentes

`index.html` carga Google Fonts:

- `Inter`: texto general.
- `Space Grotesk`: titulos, etiquetas tecnicas y elementos de dashboard.

Tambien carga Material Symbols Outlined para iconos.

## Organizacion De CSS

El CSS esta separado por pantalla:

- `src/css/Inicio.css`
- `src/css/votante/*`
- `src/css/registro/*`
- `src/css/admin/*`

Ademas, varias pantallas admin usan estilos inline en JSX. Esto permite prototipado rapido, pero dificulta reutilizacion y mantenimiento si el panel crece.

## Componentes Reutilizables

- `Footer` y `AdminFooter`: pie de pagina.
- `AdminHeader`: cabecera del panel admin.
- `AdminSidebar`: navegacion lateral admin.
- `Stepper`: progreso de registro.
- `MFAStepper`: progreso de MFA.

## Estados Visuales

Patrones usados:

- Loading con texto dinamico.
- Mensajes de error y exito por estado local.
- Toasts con Sonner.
- Barras de progreso para captura facial.
- Tarjetas seleccionables para candidatos.
- Badges de seguridad y verificacion.

## Assets Visuales

- `src/assets/hero.png` esta disponible para hero o secciones visuales.
- `public/favicon.svg` se usa como favicon.
- `public/icons.svg` esta disponible como asset publico.
- Algunas pantallas usan imagenes remotas de Googleusercontent como avatar.

## Convenciones Actuales

- Los nombres de clases suelen llevar prefijo por pantalla: `lv-`, `mfa1-`, `mfa2-`, `mfa3-`, `sc-`, `ri-`, `rr-`, `rb-`, `cr-`, `la-`.
- Los textos mezclan espanol e ingles en algunas secciones administrativas.
- Hay estilos heredados de template en `src/App.css` que actualmente no forman parte del flujo principal.

## Recomendacion De Mantenimiento UI

Si se continua el desarrollo, conviene:

- Mover estilos inline admin a CSS o componentes reutilizables.
- Unificar idioma visible.
- Consolidar colores en variables CSS.
- Eliminar estilos del template que no se usan.
- Reemplazar imagenes remotas de avatar por assets propios o datos reales.

