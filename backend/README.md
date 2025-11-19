# GradeBox Backend

Backend API for GradeBox - A minimalist system for recording and querying student grades.

## Features

- RESTful API with Express.js
- TypeScript for type safety
- SQL Server database with automated migrations
- Multi-tenancy support with schema isolation
- Comprehensive validation with Zod
- CORS and security middleware

## Prerequisites

- Node.js 18+ and npm
- SQL Server (local or Azure)
- Git

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials and configuration.

## Database Setup

The application uses automated database migrations. On first startup, the migration system will:

1. Create the project-specific schema (`project_gradebox`)
2. Create the `grade` table with proper indexes
3. Create all required stored procedures

No manual database setup is required.

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Grade Management

- `GET /api/v1/internal/grade` - List all grades (with optional filters)
- `POST /api/v1/internal/grade` - Create a new grade
- `GET /api/v1/internal/grade/:id` - Get a specific grade
- `PUT /api/v1/internal/grade/:id` - Update a grade
- `DELETE /api/v1/internal/grade/:id` - Delete a grade (soft delete)

### Health Check

- `GET /health` - Server health status

## Project Structure

```
backend/
├── migrations/              # SQL migration files
│   └── initial_migration.sql
├── src/
│   ├── api/                 # API controllers
│   │   └── v1/internal/grade/
│   ├── config/              # Configuration
│   ├── middleware/          # Express middleware
│   ├── migrations/          # Migration runner
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic
│   ├── utils/               # Utilities
│   └── server.ts            # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

### Required

- `DB_SERVER` - Database server address
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `PROJECT_ID` - Project identifier for schema isolation

### Optional

- `PORT` - Server port (default: 3000)
- `DB_PORT` - Database port (default: 1433)
- `DB_ENCRYPT` - Enable encryption (default: true)
- `NODE_ENV` - Environment (development/production)
- `API_VERSION` - API version (default: v1)
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)

## Database Schema

The application uses a single `grade` table with the following structure:

- `id` - Primary key (auto-increment)
- `idAccount` - Account identifier (multi-tenancy)
- `studentName` - Student name (max 100 characters)
- `subject` - Subject name (max 100 characters)
- `gradeValue` - Grade value (0.00 to 100.00)
- `dateCreated` - Creation timestamp
- `dateModified` - Last modification timestamp
- `deleted` - Soft delete flag

## Multi-Tenancy

The application implements schema-based multi-tenancy:

- Each project gets its own schema (`project_<PROJECT_ID>`)
- All data is isolated by `idAccount`
- Migrations are project-specific
- Other project schemas remain untouched

## Security

- Helmet.js for security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention through parameterized queries
- Account-based data isolation

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## License

MIT