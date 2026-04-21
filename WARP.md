# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup and Installation
```bash
bun install
```

### Running the Application
```bash
# Development mode with hot reload
bun run dev

# Production mode
bun run start
```

### Database Operations
```bash
# Run database migrations (development)
bun run migrate

# Deploy migrations to production
bun run migrate:deploy

# Reset database and run all migrations
bun run migrate:reset

# Push schema changes without creating migration files
bun run db:push

# Open Prisma Studio (database GUI)
bun run db:studio

# Generate Prisma client after schema changes
bun run db:generate
```

### Code Quality
```bash
# Lint and fix code issues
bun run lint
```

### Environment Setup
The application requires these environment variables:
- `POSTGRE_URL` - PostgreSQL connection string
- `ACCESS_TOKEN_SECRET` - JWT signing secret
- `PORT` (optional, defaults to 5000)
- `CORS_ORIGIN` (optional, defaults to http://localhost:5001)

## Architecture Overview

This is a **TypeScript API built with Bun runtime and Hono framework**, following a modular architecture pattern.

### Core Framework Stack
- **Runtime**: Bun (not Node.js)
- **Web Framework**: Hono with OpenAPI integration
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schemas
- **API Documentation**: Automatic OpenAPI/Swagger generation

### Project Structure
```
src/
├── config/          # Environment and configuration management
├── lib/             # Core application utilities and setup
├── middleware/      # Hono middleware (auth, logging, CORS, etc.)
├── module/          # Feature modules (auth, etc.)
├── util/            # Utility functions
└── polyfill/        # Runtime polyfills
prisma/
└── schema.prisma    # Database schema definition
```

### Module Architecture Pattern
Each feature module follows this structure:
- `routes.ts` - OpenAPI route definitions
- `controllers.ts` - Request handlers
- `interfaces.ts` - Zod validation schemas
- `database.ts` - Database operations

### Key Architectural Concepts

**OpenAPI-First Development**: All routes are defined using `@hono/zod-openapi` with automatic documentation generation.

**Path Aliases**: The project uses extensive TypeScript path mapping:
- `@config/*` → `./src/config/*`
- `@module/*` → `./src/module/*`
- `@lib/*` → `./src/lib/*`
- `@util/*` → `./src/util/*`
- `@middleware/*` → `./src/middleware/*`

**Database Integration**: Uses Prisma ORM with PostgreSQL. Database schema is defined in `/prisma/schema.prisma`, migrations are stored in `/prisma/migrations/`.

**Magic Fetch Generation**: The application can auto-generate TypeScript API client code based on OpenAPI definitions (controlled by `MAGICFETCH_GENERATE` env var).

### Authentication System
- JWT-based authentication with configurable expiration
- Rate limiting on login attempts (configurable via env vars)
- Password validation with complexity requirements
- Support for email/username login identifiers

### Development Features
- Hot reload in development mode
- Automatic API documentation at runtime
- Static file serving for `/public/*` routes
- Comprehensive middleware stack (compression, CORS, logging)
- Custom emoji favicon (🟠)

## Important Development Notes

### Database Migrations
- Use `bun run migrate` for development migrations
- Use `bun run migrate:deploy` for production deployments
- Use `bun run db:push` for quick schema prototyping
- Migration files are stored in `/prisma/migrations/`
- Database schema is defined in `/prisma/schema.prisma`
- Use `bun run db:studio` to open Prisma Studio for database management

### API Documentation
- Access auto-generated docs at the `/doc` endpoint when running
- Routes automatically generate OpenAPI specs via Zod schemas

### Environment Variables
The app validates all environment variables on startup using Zod schema validation. Missing required variables will cause startup failure with detailed error messages.

### Magic Fetch
When enabled in development, the system generates TypeScript API client code automatically based on your OpenAPI routes, useful for frontend integration.