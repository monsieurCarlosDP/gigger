# Client Form - Gigger

Frontend form de Gigger para que los clientes puedan solicitar eventos.

## Stack

- React 19
- Vite
- React Router
- TanStack Query
- Material UI

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El formulario estará disponible en `http://localhost:5174`

## Build

```bash
npm run build
```

## Environment Variables

Copia `.env.example` a `.env` y configura:

```env
VITE_API_URL=http://localhost:1337/api
```

## Estructura

```
src/
├── features/
│   └── event-request/          # Feature para solicitud de eventos
│       ├── pages/
│       │   └── EventRequestFormPage.tsx
│       └── hooks/
│           └── useEventRequestForm.ts
└── shared/
    ├── api/
    │   └── client.ts           # Cliente HTTP
    └── types/
        └── api.ts              # Tipos compartidos
```
