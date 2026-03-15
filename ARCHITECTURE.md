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

### Navbar (Left Sidebar)
- `src/shared/components/Navbar.tsx` — Barra lateral izquierda con dos estados:
  - **Expanded** (240px): icono + label de cada elemento
  - **Collapsed** (64px): solo icono con tooltip
- **Mobile (`xs`):** navbar oculta, se abre como drawer temporal con botón hamburguesa
- **Desktop (`sm`+):** drawer permanente con toggle collapse/expand
- Estado de collapsed/expanded gestionado localmente en `MainLayout`
- Los items de navegación se definen como un array `navItems` en el propio componente:
  - Dashboard (`/`)
  - Eventos (`/events`)
  - Personas (`/people`)
  - Tarifas (`/tariffs`)

### Right-Side Drawer
**Decisión:** Gestionar el drawer con contexto en lugar de estado por página.

**Razones:**
- Reutilizable desde cualquier página sin prop drilling
- Animación y estilos consistentes
- El drawer es una UI global del layout

**Implementación:**
- `src/shared/context/DrawerContext.tsx` — Split en dos contextos:
  - `DrawerStateContext` — `isOpen`, `content` (rara cambio)
  - `DrawerActionsContext` — `openDrawer()`, `closeDrawer()` (nunca cambian)
  - Esto minimiza re-renders en consumidores que solo llaman acciones
- `src/shared/layouts/MainLayout.tsx` — Renderiza el drawer persistente a la derecha (480px)
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
├── features/                  # Features independientes
│   ├── dashboard/             # Feature: Dashboard
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   └── components/
│   │       ├── DashboardHeader.tsx
│   │       └── EventsSummaryCard.tsx (+stories)
│   ├── events/                # Feature: Events
│   │   ├── components/
│   │   │   └── EventChip.tsx (+stories)
│   │   └── hooks/
│   │       └── useEvents.ts
│   └── [otras features]
│
├── shared/                    # Código compartido (no específico de feature)
│   ├── api/
│   │   └── client.ts          # Cliente type-safe (openapi-fetch)
│   ├── components/
│   │   ├── Calendar.tsx (+stories)
│   │   ├── Card.tsx (+stories)
│   │   └── Navbar.tsx
│   ├── context/
│   │   └── DrawerContext.tsx   # Contexto global del drawer (split state/actions)
│   ├── layouts/
│   │   ├── MainLayout.tsx     # Layout principal con navbar + drawer
│   │   └── PageLayout.tsx     # Layout de página (header + body)
│   └── types/
│       └── api.d.ts           # Tipos generados desde OpenAPI
│
├── stories/                   # Storybook examples (boilerplate)
├── App.tsx                    # Rutas raíz
├── main.tsx                   # Entry point
└── index.css                  # Reset mínimo (MUI gestiona estilos)
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
  // Correcto
  import { useEvents } from '@/features/events/hooks/useEvents';

  // Prohibido
  import { useEvents } from '@/features/events';
  ```

---

## Componentes Compartidos

### Calendar
**Ubicación:** `src/shared/components/Calendar.tsx` y `Calendar.stories.tsx`

**Props:**
```tsx
interface CalendarProps {
  value?: Dayjs | null;                        // fecha seleccionada
  onChange?: (value: Dayjs | null) => void;    // callback al cambiar
  markedDays?: Record<string, DayMark[]>;      // días con puntos (clave: 'YYYY-MM-DD')
  blockedRanges?: BlockedRange[];              // periodos bloqueados
  showLegend?: boolean;                        // mostrar leyenda debajo del calendario
  onDayHover?: (dateKey: string, el: HTMLElement) => void;  // hover sobre día
  onDayLeave?: () => void;                     // salir del hover
}

interface DayMark {
  color: string;  // MUI theme color (ej. 'primary.main', '#ff0000')
}

interface BlockedRange {
  start: Dayjs;
  end: Dayjs;
  color?: string;  // MUI color, defaults to 'error.main'
}
```

**Características:**
- **Puntos debajo del número (dots):** marcan días con eventos, hasta 4 por día, customizables en color
- **Franja de fondo (blocked ranges):** periodos con fondo semitransparente, redondeado en inicio/fin del rango
- **Leyenda opcional:** muestra significado de dots y rangos bloqueados
- **Hover events:** callbacks `onDayHover`/`onDayLeave` para mostrar información al pasar el ratón
- **Interactivo:** puede seleccionar fechas con click
- **Responsive:** se adapta a cualquier ancho
- Usa `@mui/x-date-pickers` v8 (community, gratuito) con `dayjs`

**Implementación interna:**
- `MarkedDay` componente custom que reemplaza el día por defecto de `DateCalendar`
- `LocalizationProvider` + `AdapterDayjs` envueltos en el componente
- Lógica de rango: `isStart` (50% rounded left), `isEnd` (50% rounded right), `isSingle` (4-corner rounded)

### Card
**Ubicación:** `src/shared/components/Card.tsx` y `Card.stories.tsx`

**Props:**
```tsx
interface ICardProps {
  headerContent: React.ReactNode;   // título / cabecera
  cardContent: React.ReactNode;     // contenido principal
  cardMainAction: () => void;       // acción al hacer click en el card
  cardActions: React.ReactNode;     // acciones del pie (botones)
}
```

Wrapper sobre `MUI Card` con `CardActionArea`, `CardHeader`, `CardContent` y `CardActions` integrados.

### EventChip
**Ubicación:** `src/features/events/components/EventChip.tsx` y `EventChip.stories.tsx`

Chip coloreado según el tipo de evento:
| Tipo | Label | Color |
|------|-------|-------|
| `Reservation` | Reserva | `warning` |
| `Event` | Evento | `success` |
| `Viability` | Disponibilidad | `error` |

### EventCard (EventsSummaryCard)
**Ubicación:** `src/features/dashboard/components/EventsSummaryCard.tsx` y `EventsSummaryCard.stories.tsx`

Tarjeta de resumen de evento que muestra:
- Nombre + `EventChip` con el tipo
- Descripción
- Fecha(s): formato rango para periodos, fecha completa para puntuales
- Tiempo relativo ("hace 2 días", "en 3 semanas") para eventos puntuales
- Botón "Ver detalles"

---

## Hooks

### useEvents
**Ubicación:** `src/features/events/hooks/useEvents.ts`

| Hook | Descripción | Params |
|------|-------------|--------|
| `useEvents(params?)` | Lista todos los eventos | `{ query?: ListQuery }` |
| `useEventById(id, params?)` | Evento por ID | `id: string`, `{ query?: EventByIdQuery }` |
| `useCreateEvent()` | Crear evento (mutation) | `body: CreateEventBody` |
| `useUpdateEvent()` | Actualizar evento (mutation) | `{ id: string, body: UpdateEventBody }` |
| `useDeleteEvent()` | Eliminar evento (mutation) | `id: string` |
| `useUpcomingEvents(options?)` | Próximos eventos filtrados | `{ limit?, type?, daysBack? }` |

Todos los mutations invalidan automáticamente la query `['events']` tras éxito.

**`useUpcomingEvents` — detalle:**
```tsx
type UseUpcomingEventsOptions = {
  limit?: number;             // máx eventos (default: 5)
  type?: EventType | EventType[];  // filtro por tipo
  daysBack?: number;          // incluir eventos desde N días atrás (default: 1)
};
```

### API Client
**Ubicación:** `src/shared/api/client.ts`

Cliente type-safe generado con `openapi-fetch` que expone métodos tipados:
- `api.getEvents()`
- `api.getEventById()`
- `api.createEvent()`
- `api.updateEvent()`
- `api.deleteEvent()`

Los tipos se generan desde la spec OpenAPI del backend en `src/shared/types/api.d.ts`.

---

## Dashboard

**Ubicación:** `src/features/dashboard/pages/DashboardPage.tsx`

Layout responsive con dos columnas en desktop, una en móvil:

| Columna izquierda | Columna derecha |
|-------------------|-----------------|
| Calendario interactivo con eventos marcados | Lista de próximos eventos (EventCards) |

**Funcionalidades:**
- **Calendario con datos reales:** usa `useEvents()` para marcar días con dots (eventos puntuales) y rangos bloqueados (periodos)
- **Popper al hover:** al pasar el ratón sobre un día en el calendario, muestra un popper con las EventCards de ese día
- **Próximos eventos:** usa `useUpcomingEvents({ limit: 5, type: ['Event', 'Reservation'] })` para listar los próximos 5 eventos/reservas
- **Loading state:** muestra `CircularProgress` mientras cargan los datos

---

## Backend - Content Types

Strapi gestiona internamente los tipos:
- `events` — Eventos (con relación many-to-many a people, componente repeatable Budget)
- `people` — Personas (con relación many-to-many a events)
- `tarif-distances` — Tarifas por distancia
- `price` — Precio (single type)

### Componente Budget (repeatable)
```json
{
  "Base": "integer",
  "Equipment": "boolean",
  "Dietas": "integer",
  "DJ": "boolean"
}
```

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
| openapi-fetch | axios, fetch manual | Type-safety automático desde spec OpenAPI |
| Feature-based structure | Flat/type-based | Escalabilidad, cohesión, facilidad de refactor |
| dayjs | date-fns, luxon | Ligero, compatible con MUI x-date-pickers |

---

## Cómo Agregar Una Nueva Feature

1. Crear la carpeta `src/features/mi-feature/`
2. Dentro, crear la estructura que necesites:
   ```
   src/features/mi-feature/
   ├── pages/          # Páginas si las tiene
   ├── components/     # Componentes específicos (+stories)
   ├── hooks/          # Custom hooks
   └── types/          # Tipos específicos
   ```
3. En `App.tsx`, agregar la ruta:
   ```tsx
   const MiFeaturePage = lazy(() => import('@/features/mi-feature/pages/MiFeaturePage'));
   // ...
   <Route path="/mi-feature" element={<MiFeaturePage />} />
   ```
4. Crear stories en Storybook para los componentes nuevos

## Próximos Pasos

- [x] Crear componentes reutilizables en `src/shared/components/` (Calendar, Card, Navbar)
- [x] Integración con API de Strapi (Calendar con eventos en Dashboard)
- [x] EventCard con resumen de eventos y tiempo relativo
- [x] useUpcomingEvents con filtros por tipo y fecha
- [x] Storybook stories para componentes (Calendar, Card, EventChip, EventsSummaryCard)
- [ ] Implementar formularios para CRUD de eventos
- [ ] Validación de formularios (useForm, Zod/Yup)
- [ ] Setup de tests (Vitest + Playwright)
- [ ] Páginas adicionales: Events, People, Tariffs
- [ ] Autenticación y logout
