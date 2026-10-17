# Informe de cobertura de pruebas unitarias — Sonido Vivo (Etapa 2)

**Asignatura:** DSY1104 Desarrollo Fullstack II · **Evaluación Parcial 2**
**Proyecto:** `fase2/proyecto_Etapa2_REACT` (React + Vite + Bootstrap)
**Framework de pruebas:** Vitest (autorizado por el profesor en lugar de Jasmine/Karma)

> Todos los números de este informe salen de ejecutar `npm run coverage` y `npx vitest run --reporter=verbose`. La salida cruda quedó guardada en esta carpeta: [`salida_coverage.txt`](salida_coverage.txt), [`salida_tests.txt`](salida_tests.txt) y el reporte navegable en [`reporte_html/index.html`](reporte_html/index.html).

## 1. Resultado global

| Métrica | Resultado |
|---|---|
| Archivos de prueba | 10 (todos pasan) |
| Pruebas | **172** (todas pasan) — la rúbrica pide 10 y el encargo mínimo 20 |
| Sentencias | **99.86 %** (725/726) |
| Ramas | **91.52 %** (378/413) |
| Funciones | **99.6 %** (254/255) |
| Líneas | **100 %** (652/652) |

## 2. Herramientas y configuración del entorno

| Herramienta | Versión | Para qué se usa |
|---|---|---|
| Vitest | 5.0.3 | Ejecutor de pruebas (`describe` / `it` / `expect`, `vi.fn`, `vi.spyOn`) |
| jsdom | 29.1.1 | Simula el navegador (DOM, `localStorage`, `window`) |
| @testing-library/react | 16.3.3 | Renderiza componentes y los consulta como lo haría un usuario (`getByRole`, `getByLabelText`) |
| @testing-library/user-event | 14.6.7 | Simula escribir, hacer clic y elegir opciones de forma realista |
| @testing-library/jest-dom | 7.0.1 | Matchers de DOM: `toBeInTheDocument`, `toHaveValue`, `toBeDisabled`... |
| @vitest/coverage-v8 | 5.0.3 | Mide la cobertura con el motor V8 |

Configuración en `vite.config.js`:

```js
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/setupTests.js',
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    include: ['src/**/*.{js,jsx}'],
    exclude: ['src/main.jsx', 'src/__tests__/**'],
  },
}
```

`src/setupTests.js` registra los matchers de jest-dom y, después de cada prueba, desmonta lo renderizado y limpia `localStorage`, de modo que **cada prueba parte con datos limpios** y no dependen unas de otras.

Scripts (`package.json`):

| Comando | Acción |
|---|---|
| `npm test` | `vitest run` — ejecuta todas las pruebas una vez |
| `npm run test:watch` | `vitest` — modo observador mientras se programa |
| `npm run coverage` | `vitest run --coverage` — pruebas + reporte de cobertura |

Para que la tabla de la sección 4 incluya también los archivos con 100 %, el reporte se generó con:

```bash
npm run coverage -- --coverage.reporter=text --coverage.reporter=html --coverage.reporter=json-summary --coverage.skipFull=false
```

## 3. Pruebas por categoría

Las 172 pruebas están en `src/__tests__/`. Distribución por archivo: `componentes.test.jsx` (30), `paginas.test.jsx` (36), `admin.test.jsx` (36), `validaciones.test.js` (20), `cupones.test.jsx` (10), `db.test.js` (17), `casos-borde.test.jsx` (8), `pago.test.jsx` (6), `formularios.test.js` (5), `App.test.jsx` (4).

| Categoría (según el encargo) | Qué se prueba | Archivo |
|---|---|---|
| **Renderizado** | `ProductGrid` dibuja una tarjeta por producto; `CartTable` muestra una fila por ítem y el total correcto; estados vacíos ("No hay productos", "Tu carrito está vacío"); `OrderSummary`, `Footer`, `AdminSidebar`, `StatCard` | `componentes.test.jsx` |
| **Renderizado condicional** | `AlertMessage` y `FormField` muestran el error solo si hay error; la etiqueta "Stock crítico" solo aparece si `stock <= stockCrítico`; el `Navbar` muestra "Iniciar sesión" o el nombre del usuario (y el enlace Admin solo a administradores y vendedores); botón "Sin stock" deshabilitado | `componentes.test.jsx`, `App.test.jsx`, `admin.test.jsx` |
| **Props** | `ProductCard` recibe nombre, precio en formato CLP e imagen (y precio de oferta tachado); `Button` recibe `label` y `onClick`; `CategoryCard` recibe categoría y cantidad | `componentes.test.jsx` |
| **Estado** | un formulario controlado cambia su estado al escribir; `SearchBar` avisa cada cambio; `ConfirmButton` guarda el estado "pidiendo confirmación"; la cantidad del carrito sube y baja y recalcula el total; el carrito cobra el precio de oferta | `componentes.test.jsx`, `paginas.test.jsx` |
| **Eventos** | clic en "Añadir al carrito" llama a la función y actualiza el contador del navbar; submit de login inválido muestra errores; el filtro de búsqueda y de categoría reduce la lista; registro, contacto, checkout y formularios del admin | `componentes.test.jsx`, `paginas.test.jsx`, `admin.test.jsx` |
| **Lógica pura** (`utils/`) | campo requerido, largo mínimo/máximo (valor límite incluido), correo y dominios, RUN con dígito verificador, rangos de precio y stock (0, negativo, texto, máximo inclusive), esquemas de formulario, `prepararFormulario` (props de cada campo, errores visibles solo tras escribir o enviar), roles con acceso al panel, `formatearCLP`, `esStockCritico`, `precioVigente`, `filtrarProductos`, `resumenVentas`, regiones/comunas | `validaciones.test.js`, `formularios.test.js`, `admin.test.jsx`, `casos-borde.test.jsx` |
| **db.js con mocks** | CRUD completo sobre un `localStorage` simulado; casos de error: **JSON corrupto**, **código duplicado**, **producto inexistente** | `db.test.js` |
| **Pago** | el checkout se autocompleta con la sesión; pago exitoso → página `PagoCorrecto` ("Se ha realizado la compra nro #1001"), orden creada, stock descontado y carrito vacío; pago con error → `PagoError`, carrito conservado; "Imprimir boleta" llama a `window.print`; "Enviar por email" confirma; orden inexistente | `pago.test.jsx` |
| **Casos borde y errores** | sesión/carrito corruptos en `localStorage`, stock insuficiente al pagar, región→comuna, orden de las órdenes, impresión de boleta; correo repetido al editar un usuario y nombre repetido al renombrar una categoría; acceso del Vendedor al panel | `casos-borde.test.jsx`, `admin.test.jsx`, `App.test.jsx`, `paginas.test.jsx` |

El listado completo, prueba por prueba, está en [`salida_tests.txt`](salida_tests.txt).

## 4. Cobertura real por archivo

Fuente: `npm run coverage` (V8). Un `100 %` en ramas significa que cada `if`, ternario, `&&`, `||` y `??` se evaluó por sus dos lados.

| Archivo | Sentencias | Ramas | Funciones | Líneas |
|---|---:|---:|---:|---:|
| `src/App.jsx` | 100% | 100% | 100% | 100% |
| `src/components/AdminSidebar.jsx` | 100% | 100% | 100% | 100% |
| `src/components/AlertMessage.jsx` | 100% | 100% | 100% | 100% |
| `src/components/Button.jsx` | 100% | 100% | 100% | 100% |
| `src/components/CartTable.jsx` | 100% | 100% | 100% | 100% |
| `src/components/CategoriaForm.jsx` | 100% | 85.71% | 100% | 100% |
| `src/components/CategoryCard.jsx` | 100% | 91.66% | 100% | 100% |
| `src/components/ConfirmButton.jsx` | 100% | 100% | 100% | 100% |
| `src/components/CriticalBadge.jsx` | 100% | 100% | 100% | 100% |
| `src/components/Footer.jsx` | 100% | 100% | 100% | 100% |
| `src/components/FormField.jsx` | 100% | 100% | 100% | 100% |
| `src/components/Navbar.jsx` | 100% | 100% | 100% | 100% |
| `src/components/OrderSummary.jsx` | 100% | 100% | 100% | 100% |
| `src/components/ProductCard.jsx` | 100% | 100% | 100% | 100% |
| `src/components/ProductGrid.jsx` | 100% | 100% | 100% | 100% |
| `src/components/ProductoForm.jsx` | 100% | 88.88% | 100% | 100% |
| `src/components/ProductosTabla.jsx` | 100% | 100% | 100% | 100% |
| `src/components/RegionComunaFields.jsx` | 100% | 100% | 100% | 100% |
| `src/components/SearchBar.jsx` | 100% | 100% | 100% | 100% |
| `src/components/StatCard.jsx` | 100% | 100% | 100% | 100% |
| `src/components/UsuarioForm.jsx` | 100% | 93.33% | 100% | 100% |
| `src/context/CartContext.jsx` | 100% | 90.9% | 100% | 100% |
| `src/context/SessionContext.jsx` | 100% | 100% | 100% | 100% |
| `src/data/db.js` | 100% | 91.66% | 100% | 100% |
| `src/data/portada.js` | 100% | 100% | 100% | 100% |
| `src/data/seed.js` | 100% | 100% | 100% | 100% |
| `src/layouts/AdminLayout.jsx` | 100% | 100% | 100% | 100% |
| `src/layouts/StoreLayout.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/CategoriaEditar.jsx` | 100% | 80% | 100% | 100% |
| `src/pages/admin/CategoriaNueva.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/CategoriasAdmin.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/Dashboard.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/DetalleOrden.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/HistorialCompras.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/Ordenes.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/Perfil.jsx` | 100% | 75% | 100% | 100% |
| `src/pages/admin/ProductoEditar.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/ProductoNuevo.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/ProductosAdmin.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/ProductosCriticos.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/Reportes.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/UsuarioEditar.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/UsuarioNuevo.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/admin/UsuariosAdmin.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Blogs.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Carrito.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Categorias.jsx` | 100% | 83.33% | 100% | 100% |
| `src/pages/Checkout.jsx` | 100% | 91.66% | 100% | 100% |
| `src/pages/Contacto.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/DetalleBlog.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/DetalleProducto.jsx` | 100% | 80% | 100% | 100% |
| `src/pages/Home.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Login.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Nosotros.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/NotFound.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Ofertas.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/PagoCorrecto.jsx` | 100% | 75% | 100% | 100% |
| `src/pages/PagoError.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Productos.jsx` | 100% | 100% | 100% | 100% |
| `src/pages/Registro.jsx` | 100% | 83.33% | 100% | 100% |
| `src/utils/cupones.js` | 100% | 100% | 100% | 100% |
| `src/utils/formato.js` | 100% | 100% | 100% | 100% |
| `src/utils/formularios.js` | 100% | 87.5% | 100% | 100% |
| `src/utils/productos.js` | 100% | 75% | 100% | 100% |
| `src/utils/regiones-comunas.js` | 100% | 100% | 100% | 100% |
| `src/utils/reportes.js` | 94.11% | 100% | 83.33% | 100% |
| `src/utils/roles.js` | 100% | 100% | 100% | 100% |
| `src/utils/validaciones.js` | 100% | 91.42% | 100% | 100% |
| **TOTAL** | **99.86%** | **91.52%** | **99.6%** | **100%** |

Evidencia de la ejecución: la salida textual de la terminal está en [`salida_coverage.txt`](salida_coverage.txt) y el reporte HTML interactivo (con las líneas no cubiertas resaltadas) en [`reporte_html/index.html`](reporte_html/index.html).

## 5. Análisis del código no cubierto

Ninguna **línea** quedó sin ejecutar (100 %). Lo pendiente son ramas (decisiones): 35 de 413 (8.48 %), más una sentencia y una función. Detalle, con el número de línea que informa el reporte:

| Archivo (línea) | Qué no se probó | Riesgo |
|---|---|---|
| `components/CategoriaForm.jsx` (17), `ProductoForm.jsx` (30), `UsuarioForm.jsx` (30) | El clic en *Guardar* con el formulario inválido a nivel del componente aislado: se prueba el envío válido y los errores en vivo | Bajo: la validación está cubierta en `validaciones.test.js` y `formularios.test.js` |
| `components/CategoryCard.jsx` (18) | Singular "1 producto" (solo se prueba el plural) | Muy bajo (texto) |
| `context/CartContext.jsx` (21, 38) | Rama del reducer cuando el carrito tiene otras filas además de la modificada (las pruebas del reducer usan un solo producto al sumar) | Bajo |
| `data/db.js` (78, 118) | Rama de `generarId` para colecciones distintas de `ordenes`, y `reiniciar()` sin argumento (todas las colecciones) | Bajo |
| `utils/formularios.js` (19) | Valor `undefined` de un campo (el `?? ''` de seguridad) | Muy bajo |
| `pages/Categorias.jsx` (42) | Mensaje "Elige una categoría" en `/categorias` sin selección (se prueban la categoría existente y la inexistente) | Muy bajo |
| `pages/Checkout.jsx` (64, 74) | Producto eliminado del catálogo mientras estaba en el carrito; compra sin sesión (`run: null`) | Medio: caso real |
| `pages/DetalleProducto.jsx` (62-68) | Entrada no numérica en la cantidad y producto con stock 0 en el detalle | Bajo |
| `pages/PagoCorrecto.jsx` (39-40) | Boleta con departamento e indicaciones (se prueba sin ellos) | Muy bajo |
| `pages/Registro.jsx` (48) | Mensaje de error genérico distinto de "ya existe" | Muy bajo |
| `pages/admin/CategoriaEditar.jsx` (31-43) | Guardar sin cambiar el nombre y categoría sin descripción | Bajo |
| `pages/admin/Perfil.jsx` (14, 19) | Perfil sin sesión y guardado con contraseña nueva | Bajo |
| `utils/productos.js` (40-46, 58-66) | Valores opcionales vacíos (`marca`, `modelo`, `descripcion`) en las conversiones formulario ↔ producto | Bajo |
| `utils/validaciones.js` (73, 192) | Dígitos verificadores `0` y `K` en `validarRun` y precio de oferta sin precio normal | Medio: los dígitos `0` y `K` son casos borde clásicos del RUN |
| `utils/reportes.js` | Una función anónima: el comparador que ordena las ventas por categoría (necesita ventas en 2 o más categorías) | Bajo |

### Plan para cubrirlo

1. **Prioridad media (casos reales):** RUN con dígito verificador `0` y `K` en `validarRun`; checkout con un producto eliminado del catálogo y checkout sin sesión; precio de oferta sin precio normal.
2. **Formularios:** una prueba por formulario que haga clic en *Guardar* con los campos vacíos y compruebe que `onGuardar` (un `vi.fn()`) **no** se llamó.
3. **Reportes:** una orden con productos de dos categorías distintas para ejecutar el comparador.
4. **Valores por defecto:** pruebas parametrizadas (`it.each`) para `valoresAProducto` / `productoAValores` con campos opcionales vacíos, y `reiniciar()` sin argumentos.
5. **Textos y singulares:** `CategoryCard` con `cantidad = 1`, `/categorias` sin selección, boleta con depto e indicaciones.

Con esas pruebas pequeñas las ramas se acercarían al 100 %. No se hicieron en esta entrega porque lo pendiente no representa riesgo funcional alto, y se priorizó mantener pruebas legibles y bien estructuradas antes que perseguir el porcentaje.

## 6. Uso de mocks

Un *mock* reemplaza una pieza real por una controlada para probar sin efectos secundarios.

| Técnica | Dónde | Para qué |
|---|---|---|
| `vi.spyOn(Storage.prototype, 'getItem' / 'setItem').mockImplementation(...)` | `db.test.js` | `db.js` guarda todo en `localStorage`. Se sustituyen `getItem`/`setItem` por funciones que usan un `Map` en memoria. Así se comprueba **qué** se guarda y **cuántas veces** (por ejemplo, que un `crear` duplicado **no** llama a `setItem`) y se simula un JSON corrupto escribiendo texto roto en el `Map`. Se restauran con `vi.restoreAllMocks()` en `afterEach`. |
| `vi.fn()` como callback | `formularios.test.js`, `componentes.test.jsx` | Función espía que registra llamadas: el `setValores` que recibe `prepararFormulario` se invoca al escribir en un campo; `Button`, `ProductCard`, `CartTable`, `ConfirmButton` y `Navbar` reciben un `vi.fn()` por props y se verifica con `toHaveBeenCalledWith(...)`. |
| `vi.spyOn(window, 'print').mockImplementation(() => {})` | `pago.test.jsx`, `casos-borde.test.jsx` | "Imprimir boleta" abriría el diálogo de impresión; se reemplaza por una función vacía y se comprueba que se llamó una vez. |
| `localStorage` real de jsdom + limpieza en `setupTests.js` | Pruebas de páginas | En las pruebas de integración (login, carrito, checkout, admin) se usa el almacenamiento de jsdom para recorrer el flujo completo; se vacía tras cada prueba. |

En las pruebas de páginas no se mockearon los componentes ni `db.js` a propósito: se probó la integración real (formulario → validación → `db.js` → pantalla), porque el proyecto no tiene servidor y `db.js` es rápido y determinista.

## 7. Cómo reproducir

```bash
cd fase2/proyecto_Etapa2_REACT
npm install
npm test            # 172 pruebas
npm run coverage    # tabla en consola + carpeta coverage/ (HTML)
```
