# Gigger

Aplicación fullstack para la gestión de eventos, personas y tarifas.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Strapi v5, SQLite (dev), TypeScript |
| Frontend | React 19, Vite, TypeScript, MUI v7 |
| Data Fetching | TanStack Query v5, openapi-fetch |
| Routing | React Router v7 |
| Testing | Storybook v10, Vitest, Playwright |

## Estructura del Proyecto

```
gigger/
├── backend/          # Strapi v5 CMS / API headless
│   ├── src/api/      # Content types (events, people, price, tarif-distances)
│   └── config/       # Configuración (DB, plugins, middlewares)
├── frontend/         # React SPA
│   ├── src/
│   │   ├── features/ # Features independientes (dashboard, events)
│   │   ├── shared/   # Código compartido (layouts, components, api, context)
│   │   └── App.tsx   # Rutas raíz
│   └── .storybook/   # Configuración de Storybook
└── ARCHITECTURE.md   # Decisiones de arquitectura detalladas
```

## Inicio Rápido

### Backend (Strapi)

```bash
cd backend
npm install
npm run develop    # http://localhost:1337
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Storybook

```bash
cd frontend
npm run storybook  # http://localhost:6006
```

### Generar tipos desde OpenAPI

```bash
cd frontend
npm run openapi:generate
```

## Content Types (Backend)

| Tipo | Categoría | Campos principales |
|------|-----------|-------------------|
| **events** | Collection | Name, StartDate, EndDate, Period, Type (Event/Reservation/Viability), Distance, Location, Budget, contacts |
| **people** | Collection | Name, Email, Number, Description, Type (Client/Provider/Manager), events |
| **tarif-distances** | Collection | minDistance, additionalPrice |
| **price** | Single | Base, DJ, Equipment |

## Documentación API

La documentación OpenAPI se genera automáticamente con el plugin `@strapi/plugin-documentation` y está disponible en:

- **Swagger UI:** `http://localhost:1337/documentation`
- **Spec JSON:** `backend/src/extensions/documentation/documentation/1.0.0/full_documentation.json`
