# Arquitectura y Decisiones - Gigger

## Visión General

Gigger es una aplicación fullstack con:
- **Backend:** Strapi v5 (CMS/API headless)
- **Frontend:** React 19 con Vite

---

## Frontend - Arquitectura

### Routing y Lazy Loading
- Todas las páginas y layouts se cargan con `React.lazy()` + `Suspense`
- Estructura de rutas:
  ```
  App.tsx
  └── MainLayout (lazy) ← Provider del contexto del drawer
      └── [Rutas hijas]
          ├── DashboardPage (lazy) ← index
          └── [Próximas páginas]
  ```

### Right-Side Drawer
**Decisión:** Gestionar el drawer con contexto en lugar de estado por página.

**Razones:**
- Reutilizable desde cualquier página sin prop drilling
- Animación y estilos consistentes
- El drawer es una UI global del layout

**Implementación:**
- `src/context/DrawerContext.tsx` — Split en dos contextos:
  - `DrawerStateContext` — `isOpen`, `content` (rara cambio)
  - `DrawerActionsContext` — `openDrawer()`, `closeDrawer()` (nunca cambian)
  - Esto minimiza re-renders en consumidores que solo llaman acciones
- `src/layouts/MainLayout.tsx` — Renderiza el drawer persistente a la derecha (480px)
- Hook público: `useDrawerActions()` para abrir/cerrar desde páginas

### PageLayout (Header + Body)
**Decisión:** Cada página usa `PageLayout` (Stack-based) y cada feature define su propio header.

- `src/shared/layouts/PageLayout.tsx` — Acepta `header` (ReactNode) y `children` (body)
- Cada feature crea su header en `features/<name>/components/<Name>Header.tsx`

**Uso desde una página:**
```tsx
import { PageLayout } from '@/shared/layouts/PageLayout';
import { MiFeatureHeader } from '../components/MiFeatureHeader';

export default function MiFeaturePage() {
  return (
    <PageLayout header={<MiFeatureHeader />}>
      <p>Contenido aquí</p>
    </PageLayout>
  );
}
```

### Estructura de Carpetas (Feature-Based)
```
frontend/src/
├── features/             # Features independientes
│   ├── dashboard/        # Feature: Dashboard
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   ├── components/   # Componentes específicos del dashboard
│   │   ├── hooks/        # Custom hooks del dashboard
│   │   ├── types/        # Tipos específicos del dashboard
│   │   └── index.ts      # Exports públicos
│   └── [otras features]
│
├── shared/               # Código compartido (no específico de feature)
│   ├── context/          # Contextos globales (DrawerContext)
│   ├── layouts/          # Layouts reutilizables (MainLayout)
│   ├── components/       # Componentes reutilizables (próximo)
│   ├── hooks/            # Custom hooks compartidos (useEvents, etc.)
│   ├── api/              # Cliente HTTP y configuración API (openapi-fetch)
│   ├── types/            # Tipos generados desde OpenAPI spec
│   └── assets/           # Imágenes, iconos, etc. (próximo)
│
├── App.tsx               # Rutas raíz
├── main.tsx              # Entry point
└── index.css             # Reset mínimo (MUI gestiona estilos)
```

**Ventajas del enfoque feature-based:**
- Escalabilidad — nuevas features sin conflictos de carpetas
- Cohesión — todo lo de una feature está junto
- Fácil mover/eliminar features sin afectar el resto
- Imports claros con path aliases (`@/features/dashboard`, `@/shared/context`, etc.)

### Mobile-First y Responsive
- **Todos los componentes** se diseñan mobile-first
- Usar breakpoints de MUI (`xs`, `sm`, `md`, `lg`, `xl`) para adaptar estilos
- Ejemplo: `sx={{ width: { xs: '100%', sm: 480 } }}` — full-width en móvil, 480px en tablet+
- El drawer ocupa el 100% del ancho en móvil y 480px en pantallas >= `sm` (600px)

### Convenciones de Código
- **TypeScript:** Modo estricto, no `any`
- **Tipos:** `union types` sobre enums, `import type` para tipos
- **Nombres:**
  - Archivos TS/hooks: `camelCase` (ej. `useEvents.ts`, `drawerContext.ts`)
  - Componentes: `PascalCase.tsx` (ej. `DashboardPage.tsx`, `DashboardHeader.tsx`)
  - Funciones/variables: `camelCase`
  - Constantes globales: `UPPER_SNAKE_CASE`
- **UI:** MUI v7 para todos los componentes
- **Sin barrel files:** No usar `index.ts` para re-exportar. Importar directamente desde el archivo fuente:
  ```ts
  // ✅ Correcto
  import { useEvents } from '@/features/events/hooks/useEvents';

  // ❌ Prohibido
  import { useEvents } from '@/features/events';
  ```

### API Client
- Cliente type-safe generado desde OpenAPI spec del backend
- `src/api/client.ts` — usa `openapi-fetch`
- `src/types/api.d.ts` — tipos generados
- Hooks de React Query en `src/hooks/useEvents.ts`, etc.

---

## Backend - Content Types

Strapi gestiona internamente los tipos:
- `events` — Eventos
- `people` — Personas
- `tarif-distances` — Tarifas por distancia
- `price` — Precio (single type)

---

## Decisiones Clave

| Decisión | Alternativa Considerada | Razón |
|----------|------------------------|-------|
| Contexto para drawer | Estado por página | Reutilización, consistencia, sin prop drilling |
| Contexto split (state/actions) | Contexto único | Minimizar re-renders en consumidores |
| Lazy loading en layout | Lazy solo en páginas | Defer MainLayout hasta que sea necesario |
| MUI para UI | Tailwind, styled-components | Componentes de alto nivel, accesibilidad built-in, tema global |
| PageLayout por feature | Header centralizado por ruta | Autonomía de cada feature, sin acoplamiento al layout |
| Stack sobre Box | Box con flex manual | Semántica más clara, spacing automático |

---

## Cómo Agregar Una Nueva Feature

1. Crear la carpeta `src/features/mi-feature/`
2. Dentro, crear la estructura que necesites:
   ```
   src/features/mi-feature/
   ├── pages/          # Páginas si las tiene
   ├── components/     # Componentes específicos
   ├── hooks/          # Custom hooks
   ├── types/          # Tipos específicos
   ├── api/            # Llamadas a API específicas (opcional)
   └── index.ts        # Exportar públicamente
   ```
3. En `App.tsx`, agregar la ruta:
   ```tsx
   const MiFeaturePage = lazy(() => import('@/features/mi-feature/pages/MiFeaturePage'));
   // ...
   <Route path="/mi-feature" element={<MiFeaturePage />} />
   ```

## Próximos Pasos

- [ ] Crear componentes reutilizables en `src/shared/components/`
- [ ] Implementar validación de formularios
- [ ] Setup de tests (Vitest + Playwright)
- [ ] Integración con API de Strapi

