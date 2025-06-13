# Tips Hub

Tips Hub is a web platform for sharing, managing, and discovering tips and recommendations across various categories. It features user authentication, tip management, a like system, and advanced search.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Patterns](#architecture--patterns)
- [Main Features](#main-features)
- [Future Features](#future-features)
- [Development & Deployment](#development--deployment)
- [API & Documentation](#api--documentation)

---

## Tech Stack

### Backend

- **Node.js** v20
- **Express.js** v5
- **TypeScript** v5
- **MongoDB** (Atlas)
- **Mongoose** v8
- **JWT** for authentication
- **bcrypt** for password hashing
- **Valibot** for data validation
- **Swagger UI Express** for API docs
- **Docker** (multi-stage builds)

### Frontend

- **Vue 3** + **Vite**
- **TypeScript**
- **Pinia** for state management
- **Vue Router**
- **Tailwind CSS**
- **Cypress** for E2E tests
- **Vitest** for unit tests

---

## Project Structure

```
tips-hub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── swagger.json
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── assets/
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── ...
│   ├── Dockerfile
│   └── ...
└── README.md
```

---

## Architecture & Patterns

### Backend

- **MVC**: Clear separation between models, controllers, and routes.
- **Middlewares**: For validation, authentication, and error handling.
- **Service Layer**: Business logic decoupled from controllers.
- **Centralized Validation**: Using Valibot schemas.
- **Authentication**: JWT in HTTP-only cookies, with route protection middleware.
- **API Documentation**: Swagger auto-generated from route annotations.

### Frontend

- **Component Composition**: Vue 3 + Composition API.
- **State Management**: Pinia for users, tips, and notifications.
- **Strict Typing**: TypeScript throughout the app.
- **Styling**: Tailwind CSS utility classes.
- **Protected Routes**: Vue Router guards based on authentication.
- **Global Notifications**: Centralized feedback system.
- **i18n**: Internationalization with Spanish and English support.

---

## Main Features

- User registration, login, and logout
- Tip management: create, edit, delete, list
- Like system for tips
- Advanced search and filtering
- User profile and personal tips
- Swagger API documentation at `/api/docs`
- Unit and E2E tests
- Docker multi-stage deployment

---

## Future Features

- **Comments on tips**
- **Real-time notifications**
- **Moderation and reporting**
- **Admin dashboard**
- **Social media integration**
- **Image support for tips**

---

## Development & Deployment

### Backend

```bash
pnpm install
pnpm run dev
# or for production
pnpm run build
pnpm start
```

### Frontend

```bash
bun install
bun dev
# or for production
bun run build
```

### Docker

Both services include Dockerfiles and support multi-stage builds for production deployment.

---

## API & Documentation

- The backend API is documented with Swagger and is available at:  
  [https://tips-hub-backend-latest.onrender.com/api/docs/](https://tips-hub-backend-latest.onrender.com/api/docs/)

- To generate the Swagger documentation locally, run:  
  ```bash
  pnpm run swagger
  ```

---

**Author:** Lenugo

**Repository:** [github.com/lenugo/tips-hub](https://github.com/lenugo/tips-hub)
