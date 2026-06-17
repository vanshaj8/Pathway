# Pathway

**Your path to mastery.**

Pathway is a platform for repeatable mastery — turning goals into trail-inspired journeys where every attempt leaves a trace.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 16** (App Router, Server Components by default)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **shadcn/ui** (Button, Card, Input)
- **Prisma ORM 7** + **PostgreSQL**
- **Auth.js (NextAuth v5)** + **bcrypt** + **Zod**
- **ESLint**

## Project Structure

```
prisma/
├── schema.prisma     # Database models
└── migrations/       # Versioned migration history
src/
├── app/              # Next.js App Router pages and layouts
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── layout/       # Global layout components (navigation)
│   └── trail/        # Trail-inspired visual components
├── generated/prisma/ # Prisma Client (generated — do not edit)
├── lib/              # Shared utilities (prisma.ts, auth/)
├── styles/           # Supplemental stylesheets
└── types/            # Shared TypeScript types
```

## Database Setup

Pathway uses **PostgreSQL** with **Prisma ORM**. You can run PostgreSQL locally with Docker or connect to a cloud provider (Neon, Supabase).

### Environment variables

Copy the example file and set your connection string:

```bash
cp .env.local.example .env.local
```

Set `DATABASE_URL` in `.env.local` (used by Next.js) and `.env` (used by Prisma CLI via `prisma.config.ts`):

```env
# Local Docker (default credentials — dev only)
DATABASE_URL="postgresql://pathway:pathway@localhost:5432/pathway?schema=public"

# Auth.js
NEXTAUTH_SECRET="replace-with-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloud (Neon or Supabase) — paste your provider's connection URI
# DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

Never commit real credentials. `.env` and `.env.local` are gitignored.

### Local PostgreSQL (Docker)

Start the database:

```bash
docker compose up -d
```

Check status:

```bash
docker compose ps
```

Stop the database (data persists in the Docker volume):

```bash
docker compose down
```

Remove the database and all data:

```bash
docker compose down -v
```

Docker Compose reads optional overrides from a root `.env` file (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`). Defaults are for local development only.

### Cloud PostgreSQL

Set `DATABASE_URL` in `.env.local` and `.env` to your Neon or Supabase connection string. No code changes are required — Prisma reads the URL from the environment.

For Neon: [console.neon.tech](https://console.neon.tech) → Connection string.

For Supabase: Project Settings → Database → Connection string (URI).

### Prisma commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Regenerate Prisma Client after schema changes |
| `npm run db:migrate` | Create and apply a new migration (development) |
| `npm run db:push` | Push schema changes without a migration (prototyping) |
| `npm run db:studio` | Open Prisma Studio to browse data |

### Migration workflow

1. Start PostgreSQL (`docker compose up -d` or use a cloud URL).
2. Ensure `DATABASE_URL` is set in `.env` and `.env.local`.
3. Edit `prisma/schema.prisma`.
4. Run `npm run db:migrate` and name the migration when prompted.
5. Commit the new folder under `prisma/migrations/`.
6. Prisma Client is regenerated via `postinstall` and `npm run build`.

For production deploys, run `npx prisma migrate deploy`.

### Data model

Pathway separates **task definitions** from **completion state** so journeys can be repeated without losing history:

```
User → Journey → Topic → Task          (permanent definitions)
Journey → Attempt → TaskProgress       (attempt-scoped completion)
Task → TaskProgress
```

| Model | Purpose |
|-------|---------|
| `User` | Account holder |
| `Journey` | A repeatable learning trail owned by a user |
| `Topic` | A segment within a journey |
| `Task` | A permanent waypoint — never duplicated on new attempts |
| `Attempt` | One run through a journey |
| `TaskProgress` | Completion state for a task within a specific attempt |

`TaskProgress` enforces one record per attempt + task pair (`@@unique([attemptId, taskId])`).

### Cascade delete behavior

| Parent deleted | Children removed |
|----------------|------------------|
| User | Journeys (and all nested data) |
| Journey | Topics, Attempts (and their TaskProgress) |
| Topic | Tasks (and their TaskProgress) |
| Task | TaskProgress rows for that task |
| Attempt | TaskProgress rows for that attempt |

All foreign keys use `onDelete: Cascade` to prevent orphaned records.

## Design System

Pathway's visual language is a **trail map**:

| Concept   | Trail metaphor     |
|-----------|--------------------|
| Journeys  | Trails             |
| Topics    | Trail segments     |
| Tasks     | Waypoints          |
| Attempts  | Traces of past trips |

### Color Tokens

All colors are defined as CSS variables in `src/app/globals.css` and exposed through Tailwind theme tokens. **Never hardcode these values in components.**

| Token             | Hex       | Usage                              |
|-------------------|-----------|------------------------------------|
| `basecamp-ink`    | `#16241D` | Primary text, dark accents         |
| `topo-paper`      | `#EFE8D8` | Page background                    |
| `trail-blaze`     | `#E2862F` | Primary actions, focus rings, CTAs |
| `switchback-gold` | `#D9B23C` | Accents, waypoints, highlights     |
| `contour-sage`    | `#7A9B76` | Secondary elements, trail start    |
| `slate-fog`       | `#8B9A91` | Muted text, borders, contours      |

Use in Tailwind classes: `text-trail-blaze`, `bg-topo-paper`, `border-contour-sage`, etc.

### Typography

Three font roles, loaded via `next/font/google` in `src/app/layout.tsx`:

| Role    | Font            | Tailwind class   | Usage                                    |
|---------|-----------------|------------------|------------------------------------------|
| Display | Public Sans     | `font-heading`   | Logo, headlines, journey titles          |
| Body    | Inter           | `font-sans`      | Paragraphs, buttons, forms, UI copy      |
| Data    | JetBrains Mono  | `font-mono`      | Percentages, streaks, dates (future use) |

### Accessibility

- Mobile-first responsive layout
- Keyboard focus states use `trail-blaze`
- Semantic HTML (`header`, `nav`, `main`, `section`)
- `prefers-reduced-motion` respected for trail animations
- ARIA labels on navigation and interactive elements

## Day 1 Scope

This foundation includes:

- Design system with color tokens and typography
- Responsive navigation with non-functional Login / Get Started buttons
- Trail-inspired hero with animated elevation profile
- shadcn/ui Button, Card, and Input components customized to Pathway tokens

## Day 2 Scope

Database foundation:

- PostgreSQL via Docker Compose (local) or Neon/Supabase (cloud)
- Prisma schema with User, Journey, Topic, Task, Attempt, and TaskProgress models
- Initial migration applied
- Shared Prisma client helper at `src/lib/prisma.ts`

## Day 3 Scope

Authentication foundation:

- Auth.js (NextAuth) with Credentials provider
- Email/password signup and login
- bcrypt password hashing
- Zod validation for all auth inputs
- JWT sessions (user id, email, name only)
- Middleware-protected `/dashboard` routes
- Trail-themed login and signup pages
- Placeholder dashboard with sign out

## Day 4 Scope

Journey builder (CRUD):

- Create, view, edit, and delete Journeys
- Dashboard journey list with trail-themed cards and empty state
- Automatic Attempt #1 creation on every new Journey (Prisma transaction)
- Zod validation and ownership checks on all operations
- Server Actions for mutations — no REST API routes

Not yet implemented: task completion, Attempt history UI, CSV import, or progress charts.

## Day 5 Scope

Topics and Tasks trail builder:

- Create, edit, and delete Topics inside owned Journeys
- Create, edit, and delete Tasks inside owned Topics
- User-controlled `order` fields for both Topics and Tasks
- Automatic next-order assignment on create (`max(order) + 1`)
- Ordered Journey detail trail view with Topic segments and Task waypoints
- Empty states for Journeys with no Topics and Topics with no Tasks
- Zod validation and ownership checks on all Topic and Task mutations
- Server Actions only — no REST API routes

## Journeys

A **Journey** is the parent trail in Pathway. Each Journey belongs to one user and will eventually contain Topics, Tasks, and Attempts. Day 4 implements full Journey CRUD for authenticated users.

### Automatic Attempt #1

Every newly created Journey automatically creates **Attempt #1** with `status: "active"` in the same Prisma transaction. If either operation fails, both are rolled back. No `TaskProgress` records are created yet because Tasks do not exist.

### Journey CRUD

| Operation | Route | How it works |
|-----------|-------|--------------|
| List | `/dashboard` | Fetches the current user's journeys, newest first, with active attempt info |
| Create | `/dashboard/journeys/new` | Validates with Zod, creates Journey + Attempt #1 in a transaction |
| View | `/dashboard/journeys/[id]` | Shows journey details and current attempt marker |
| Edit | `/dashboard/journeys/[id]/edit` | Updates title, description, and category |
| Delete | Journey detail page | Confirms in UI, deletes Journey (cascades to Topics, Attempts, etc.) |

### Authorization & ownership

- All Journey operations require authentication via `auth()`.
- Queries filter by `userId` — users only see their own journeys.
- Updates and deletes verify ownership before proceeding.
- Accessing another user's Journey returns a 404 (not found), never exposing whether the ID exists.

### Validation rules

Defined in `src/lib/validations/journey.ts`:

| Field | Rules |
|-------|-------|
| Title | Required, 3–100 characters |
| Category | Optional, max 50 characters |
| Description | Optional, max 500 characters |

### Journey architecture

```
src/actions/journey.ts              # Server actions (create, update, delete)
src/lib/validations/journey.ts      # Zod schemas
src/lib/journey/queries.ts          # Data access with ownership filtering
src/components/journey/             # Trail-themed UI (cards, forms, empty state)
src/app/dashboard/
├── page.tsx                        # Journey list
└── journeys/
    ├── new/page.tsx                # Create form
    └── [id]/
        ├── page.tsx                # Journey details
        └── edit/page.tsx           # Edit form
```

## Topics & Tasks

Day 5 turns a Journey into a structured trail. A **Topic** is a trail segment, and a **Task** is a waypoint inside that segment. They are permanent Journey definitions; completion state still belongs only to the future `TaskProgress → Attempt → Journey` flow.

### Ordering behavior

Topics and Tasks never rely on creation time for display order.

| Resource | Display order | Create behavior | Edit behavior |
|----------|---------------|-----------------|---------------|
| Topic | `order ASC` within a Journey | New Topic gets the next available order for that Journey | User can update title and order |
| Task | `order ASC` within a Topic | New Task gets the next available order for that Topic | User can update title, description, external link, and order |

Next-order assignment is calculated with Prisma aggregate queries:

```
nextOrder = (max(order) ?? 0) + 1
```

### Topic and Task ownership

All mutations require an authenticated user via Auth.js. Server Actions do not trust IDs submitted by the client:

- Topic create verifies the parent Journey exists with `{ id, userId }`.
- Topic edit/delete queries the Topic through its parent Journey ownership.
- Task create verifies the parent Topic belongs to a Journey owned by the current user.
- Task edit/delete queries the Task through `Task → Topic → Journey → userId`.

Unauthorized or missing records return safe "not found" style errors without exposing another user's data.

### Trail visualization

The Journey detail page now renders the complete trail:

```
Journey title
↓
vertical trail line
↓
Topic segment: Mile 1
  ○ Task waypoint
  ○ Task waypoint
↓
Topic segment: Mile 2
  ○ Task waypoint
```

Topic segments show mile markers using their `order`, title, edit/delete controls, and an Add Task form. Task waypoints use hollow circular markers because completion is not implemented yet, and include title, optional description, optional external link, edit controls, and delete controls.

### Topic and Task architecture

```
src/actions/
├── topic.ts                       # Server actions for Topic create/update/delete
└── task.ts                        # Server actions for Task create/update/delete

src/lib/validations/
├── topic.ts                       # Zod Topic schemas
└── task.ts                        # Zod Task schemas

src/lib/journey/queries.ts         # Journey detail query with ordered Topics and Tasks

src/components/trail/
├── topic-card.tsx                 # Topic segment display
├── task-waypoint.tsx              # Task waypoint display
├── topic-form.tsx                 # Reusable Topic create/edit form
├── task-form.tsx                  # Reusable Task create/edit form
├── trail-line.tsx                 # Vertical trail connector
└── delete-buttons.tsx             # Topic and Task delete controls
```

## Authentication Setup

Pathway uses **Auth.js (NextAuth v5)** with a **Credentials** provider, **Prisma** for user storage, **bcrypt** for password hashing, and **Zod** for input validation.

### Required environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (same as Day 2) |
| `NEXTAUTH_SECRET` | Secret for signing session tokens. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App base URL (e.g. `http://localhost:3000` in development) |

Set the same values in `.env` for Prisma CLI and in `.env.local` for Next.js. Never commit real secrets.

### Auth architecture

```
src/lib/auth/
├── auth.config.ts  # Edge-safe shared config (session, callbacks, pages)
├── auth.ts         # NextAuth configuration with Credentials provider
├── actions.ts      # Server actions for login and registration
├── password.ts     # bcrypt hash and verify helpers
└── schemas.ts      # Zod validation schemas

src/app/
├── (auth)/login/     # Login page
├── (auth)/signup/    # Signup page
├── api/auth/[...nextauth]/   # Auth.js route handler
└── dashboard/        # Protected placeholder dashboard

src/middleware.ts     # Redirects unauthenticated users away from /dashboard
```

The Credentials provider is configured alongside empty provider slots — Google, GitHub, or other OAuth providers can be added later in `auth.ts` without restructuring.

### Account creation flow

1. User visits `/signup` and submits name (optional), email, and password.
2. Input is validated with Zod (`src/lib/auth/schemas.ts`).
3. Server action checks for an existing email via Prisma.
4. Password is hashed with bcrypt (12 salt rounds) before storage.
5. User record is created in PostgreSQL.
6. User is signed in automatically and redirected to `/dashboard`.

### Login flow

1. User visits `/login` and submits email and password.
2. Input is validated with Zod.
3. Auth.js Credentials provider looks up the user by email.
4. bcrypt compares the submitted password against the stored hash.
5. On success, a JWT session is created containing only `id`, `email`, and `name`.
6. User is redirected to `/dashboard`.

### Sign out flow

1. User clicks **Sign out** on the dashboard.
2. Server action calls `signOut()` from Auth.js.
3. Session cookie is invalidated.
4. User is redirected to the landing page (`/`).

### Protected routes

`src/middleware.ts` uses Auth.js session checks to protect all `/dashboard` routes:

- Unauthenticated visitors are redirected to `/login`.
- Authenticated users who visit `/login` or `/signup` are redirected to `/dashboard`.
- Session persists across page refreshes via JWT cookies.

### Session contents

The session includes only:

- User ID
- Email
- Name (nullable)

Passwords and password hashes are never exposed in the session or API responses.
