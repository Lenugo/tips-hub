# Tips Hub Backend Documentation

## Project Overview

The Tips Hub Backend is a RESTful API service built with Node.js, Express, and MongoDB. It provides the server-side functionality for the Tips Hub platform, a web application for sharing and managing tips and advice across various categories.

## Technology Stack

- **Runtime**: Node.js v20
- **Package Manager**: pnpm v8.10.0
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB v8.14.1
- **Authentication**: JWT (jsonwebtoken, Bearer token in header)
- **Password Hashing**: bcrypt
- **Validation**: valibot
- **API Documentation**: Swagger UI Express
- **TypeScript**: v5.8.3

## Project Structure

📦 backend
┣ 📂 src/
┃ ┣ 📂 config/         # Configuration files
┃ ┣ 📂 controllers/    # Request handlers
┃ ┣ 📂 middlewares/    # Express middlewares
┃ ┣ 📂 models/         # Mongoose data models
┃ ┣ 📂 routes/         # API route definitions
┃ ┣ 📂 schemas/        # Data validation schemas
┃ ┣ 📂 services/       # Business logic services
┃ ┣ 📂 types/          # TypeScript type definitions
┃ ┣ 📂 utils/          # Utility functions
┃ ┣ 📜 app.ts          # Express application setup
┃ ┗ 📜 server.ts       # Server entry point
┣ 📜 Dockerfile        # Docker configuration
┣ 📜 package.json      # Project dependencies
┣ 📜 swagger.json      # Generated API documentation
┗ 📜 tsconfig.json     # TypeScript configuration

## Key Components

### Server Setup

- **server.ts**: Entry point that initializes the database connection and starts the Express server
- **app.ts**: Configures Express application with middleware, routes, and Swagger documentation

### API Routes

1. **Auth Routes** (`/auth`):
   - POST `/register`: Register a new user
   - POST `/login`: Authenticate a user and issue JWT token
   - GET `/profile`: Retrieve authenticated user profile

2. **Advice Routes** (`/advices`):
   - GET `/`: List all advice entries with filtering, pagination, and sorting
   - POST `/`: Create a new advice entry (authenticated)
   - GET `/:id`: Retrieve a specific advice by ID
   - PATCH `/:id`: Update an existing advice (authenticated, owner only)
   - DELETE `/:id`: Remove an advice entry (authenticated, owner only)
   - GET `/user/:id`: Get all advice entries by a specific user
   - PATCH `/:id/like`: Increment likes for an advice entry (authenticated)

### Data Models

1. **User Model**:
   - Username (required, trimmed)
   - Email (required, unique)
   - Password (required, hashed)
   - Timestamps (createdAt, updatedAt)

2. **Advice Model**:
   - Title (required, trimmed)
   - Content (required, trimmed)
   - Author (reference to User model)
   - Published Date
   - Categories (array of strings)
   - Likes (counter)
   - LikedBy (array of User references)
   - Timestamps (createdAt, updatedAt)

### Authentication

- JWT-based authentication using Bearer token in the `Authorization` header (no cookies)
- Token generation and verification via `auth.service.ts`
- Password hashing and comparison via `password.service.ts`
- Authentication middleware (`auth.middleware.ts`) for protected routes

### Validation

- Schema-based validation using Valibot
- Custom validation middleware for Mongoose models
- Request validation in controllers

## API Documentation

The API is documented using Swagger UI, accessible at the `/docs` endpoint when the server is running. The documentation includes:

- Endpoint descriptions
- Request parameters
- Request body schemas
- Response formats
- Authentication requirements

## Environment Variables

The application uses the following environment variables:

- `PORT`: Server port (default: 3001)
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment mode (development/production)
- `MONGO_DB_NAME`: MongoDB database name
- `MONGO_URI`: MongoDB connection URI (optional)
- `MONGO_USER`: MongoDB username (optional)
- `MONGO_PASS`: MongoDB password (optional)

## Development

```bash
# Install dependencies
pnpm install
```

```bash
# Run in development mode with hot reload
pnpm run dev
```

```bash
# Generate Swagger documentation
pnpm run swagger
```

## Authentication Example

All protected endpoints require a JWT Bearer token in the `Authorization` header: