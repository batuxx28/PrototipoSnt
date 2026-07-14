# Prototipo web institucional de SENATI

Prototipo funcional, navegable y responsive construido únicamente con HTML5, CSS3 y JavaScript ES6. No necesita framework, dependencias, compilación, backend ni conexión a internet.

## Ejecutar el proyecto

Opción rápida: abre `index.html` directamente en un navegador moderno.

Opción recomendada para desarrollo:

```bash
cd senati-prototipo
python3 -m http.server 4173
```

Luego visita `http://localhost:4173`.

## Páginas

- `index.html`: home institucional, hero, formulario, especialidades, mapa de sedes, experiencia, testimonios y empresas aliadas.
- `carreras.html`: resultados con filtros locales, ordenamiento, contador, estado vacío y paginación.
- `detalle-carrera.html`: plantilla reutilizable de detalle, galería tecnológica, resumen, formulario, pestañas/acordeones y malla curricular.

## Estructura

```text
senati-prototipo/
├── index.html
├── carreras.html
├── detalle-carrera.html
├── css/
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── data.js
│   ├── app.js
│   ├── carreras.js
│   └── detalle-carrera.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── logo/
└── README.md
```

## Datos y configuración

Los datos mock de especialidades, carreras, sedes, testimonios, empresas y malla curricular están centralizados en `js/data.js`.

La actualización de Home incorpora además:

- Carrusel de cinco especialidades con autoplay, controles, teclado, pausa y swipe táctil.
- Formulario corto del Hero con tres rutas de estudio y validación accesible.
- Cinco modalidades institucionales vinculadas al buscador de carreras.
- Buscador que navega a resultados con sus filtros en la URL.
- Home reordenada por intención: Especialidades, Modalidades, Buscador y Sedes como bloques independientes de ancho completo.
- Selector de sedes con silueta local del Perú, diez marcadores interactivos y detalle sincronizado, sin claves externas.
- Logo oficial blanco de SENATI en el header oscuro.

Los recursos de cada slide se encuentran en `assets/images/hero-*.jpg`; son archivos locales optimizados para la carga inicial y los slides diferidos.

El número ficticio de WhatsApp se configura en el objeto `whatsapp` de `js/data.js`. Debe reemplazarse únicamente por un número institucional autorizado antes de publicar el sitio.

Los formularios son demostrativos: validan en el navegador, muestran errores accesibles y simulan un envío satisfactorio sin transmitir datos.

## Responsive y accesibilidad

El diseño contempla móvil hasta 767 px, tablet entre 768 y 1023 px, desktop desde 1024 px y desktop amplio desde 1440 px. Incluye navegación por teclado, `focus-visible`, etiquetas de formulario, regiones ARIA, contraste, movimiento reducido y contenido semántico.

## Activos visuales

Las ilustraciones tecnológicas, retratos y datos de contacto son activos o contenidos provisionales preparados para este prototipo. Pueden reemplazarse conservando las rutas indicadas en `js/data.js` y en los HTML.

El mapa geográfico de `assets/images/peru-map.svg` corresponde a “Blank map of Peru”, creado por JCRules y publicado en Wikimedia Commons bajo licencia CC BY-SA 4.0. Se utiliza sin modificar el archivo fuente; el color se adapta únicamente mediante CSS. Fuente: https://commons.wikimedia.org/wiki/File:Blank_map_of_Peru.svg
