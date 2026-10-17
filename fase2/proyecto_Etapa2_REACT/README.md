# Sonido Vivo — Etapa 2 (React)

Vite + React (JavaScript) + react-router-dom + Bootstrap 5. Pruebas con Vitest y Testing Library.

```bash
npm install
npm run dev        # servidor de desarrollo
npm test           # vitest run
npm run test:watch # vitest en modo observador
npm run coverage   # vitest run --coverage (reporte en ./coverage)
npm run build      # build de producción
```

## Estructura de `src/`

| Carpeta | Responsabilidad |
|---|---|
| `components/` | Piezas reutilizables con una sola responsabilidad (`ProductCard`, `CartTable`, `FormField`...) |
| `pages/`, `pages/admin/` | Una vista por archivo, enrutadas en `App.jsx` |
| `layouts/` | `StoreLayout` (navbar + footer) y `AdminLayout` (sidebar) |
| `context/` | Sesión y carrito (Context) |
| `data/` | `db.js` (CRUD sobre `localStorage`; las páginas lo leen al dibujarse) y `seed.js` (datos iniciales) |
| `utils/` | Funciones puras: validaciones, ayuda de formularios (`prepararFormulario`), roles del panel, regiones/comunas, formato, reglas de productos, reportes |
| `__tests__/` | Pruebas Vitest |

Cuentas de demostración: `maria.perez@gmail.com` / `admin123` (administradora), `carlos.munoz@duoc.cl` / `vend123` (vendedor) y `camila.rojas@gmail.com` / `cli123` (cliente). Datos de demostración: ver `seed.js`. Para restaurar la base, borra los datos del sitio en el navegador.

Documentación del proyecto: carpeta `docs/` en la raíz del repositorio.
