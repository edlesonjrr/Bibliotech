# Bibliotech — Leitura Fácil Manager

A responsive library-management interface designed to organize books,
members, users, and loan workflows from a single dashboard.

[Live demo](https://bibliotech-orpin.vercel.app) ·
[Report an issue](https://github.com/edlesonjrr/Bibliotech/issues/new)

## Product scope

- Dashboard with library activity and operational summaries
- Book catalog and registration flows
- Member and user management
- Loan and member-loan workflows
- Authentication screens and protected application layout
- Reusable UI primitives with responsive navigation

## Tech stack

- React 18 and TypeScript
- Vite and SWC
- Tailwind CSS and Radix UI primitives
- TanStack React Query
- React Hook Form and Zod
- React Router
- ESLint

## Project structure

```text
Bibliotech/
└── leitura-facil-manager-main/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   └── types/
    ├── package.json
    ├── tailwind.config.ts
    └── vite.config.ts
```

## Run locally

```bash
git clone https://github.com/edlesonjrr/Bibliotech.git
cd Bibliotech/leitura-facil-manager-main
npm install
npm run dev
```

Open `http://localhost:5173`.

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run the configured lint checks |

## Collaboration

Built as a collaborative academic project by Arthur Cabral, Daniel Aragão,
Edleson Junior, Gabriel Bandeira, Gabryel Santana, Lucca Lima, Osvaldo
Queiroz, José Cleyton, and Luiz Cristiano.
