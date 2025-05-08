# NodeJS Base Project with PostgreSQL

This project uses Node.js with Express and connects to a PostgreSQL database via Docker.

## Setup

1. Create an `.env` file in the root directory with the following content:

```
# PostgreSQL DB Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=todolist
DB_HOST=localhost
DB_PORT=6000

# PgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

2. Start the Docker containers:

```bash
docker-compose up -d
```

3. Install dependencies:

```bash
npm install
# or
pnpm install
```

## Database Migration and Seeding

This project includes database migration and seeding scripts to help set up your database:

1. Run migrations to create database tables:

```bash
npm run migrate
# or
pnpm run migrate
```

2. Seed the database with initial data:

```bash
npm run seed
# or
pnpm run seed
```

## Development

Start the development server:

```bash
npm run dev
# or
pnpm run dev
```

## Available Scripts

- `npm run start` - Start the production server
- `npm run dev` - Start the development server with hot reloading
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database with sample data 