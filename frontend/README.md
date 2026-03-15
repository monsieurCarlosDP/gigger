# Gigger - Frontend

SPA en React 19 con arquitectura feature-based para gestión de eventos.

## Stack

- **React 19** + **TypeScript** (estricto)
- **Vite** — bundler y dev server
- **MUI v7** — componentes UI
- **TanStack Query v5** — data fetching y cache
- **React Router v7** — routing con lazy loading
- **openapi-fetch** — cliente API type-safe
- **dayjs** — manejo de fechas
- **Storybook v10** — documentación visual de componentes

## Scripts

```bash
npm run dev              # Dev server (http://localhost:5173)
npm run build            # Build de producción
npm run preview          # Preview del build
npm run storybook        # Storybook (http://localhost:6006)
npm run openapi:generate # Regenerar tipos desde OpenAPI spec
```

## Estructura

```
src/
├── features/              # Features independientes
│   ├── dashboard/         # Dashboard con calendario y resumen de eventos
│   │   ├── pages/         # DashboardPage
│   │   └── components/    # DashboardHeader, EventsSummaryCard
│   └── events/            # Lógica de eventos compartida
│       ├── components/    # EventChip
│       └── hooks/         # useEvents, useUpcomingEvents, CRUD hooks
│
├── shared/                # Código compartido
│   ├── api/               # Cliente HTTP type-safe (openapi-fetch)
│   ├── components/        # Calendar, Card, Navbar
│   ├── context/           # DrawerContext (split state/actions)
│   ├── layouts/           # MainLayout, PageLayout
│   └── types/             # api.d.ts (generado desde OpenAPI)
│
├── stories/               # Storybook examples
├── App.tsx                # Rutas
└── main.tsx               # Entry point
```

## Convenciones

- **Sin barrel files** — importar siempre desde el archivo fuente directo
- **camelCase** para archivos TS/hooks, **PascalCase** para componentes
- **Mobile-first** — todos los componentes usan breakpoints de MUI
- **`import type`** para importaciones solo de tipos
- **Union types** sobre enums
- Path alias: `@/` apunta a `src/`

## Componentes Principales

| Componente | Ubicación | Descripción |
|-----------|-----------|-------------|
| `Calendar` | `shared/components/` | Calendario con dots, rangos bloqueados, leyenda y hover events |
| `Card` | `shared/components/` | Wrapper sobre MUI Card con action area y acciones |
| `Navbar` | `shared/components/` | Sidebar izquierda collapsible, mobile-responsive |
| `EventChip` | `features/events/components/` | Chip coloreado por tipo de evento |
| `EventCard` | `features/dashboard/components/` | Tarjeta de resumen de evento con fecha y tiempo relativo |

## Hooks de Eventos

| Hook | Uso |
|------|-----|
| `useEvents(params?)` | Lista eventos con query opcional |
| `useEventById(id)` | Evento por ID |
| `useCreateEvent()` | Mutation para crear |
| `useUpdateEvent()` | Mutation para actualizar |
| `useDeleteEvent()` | Mutation para eliminar |
| `useUpcomingEvents({ limit, type, daysBack })` | Próximos eventos filtrados |

## API

El frontend consume la API REST de Strapi a través de un cliente type-safe generado desde la spec OpenAPI:

```
Backend (Strapi) → OpenAPI spec → openapi:generate → api.d.ts → openapi-fetch client
```

El cliente está en `src/shared/api/client.ts` y los tipos en `src/shared/types/api.d.ts`.
