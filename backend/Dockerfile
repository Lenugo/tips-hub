# Build stage
FROM node:20-alpine AS builder

# Instalar dependencias del sistema para compilación
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    build-base \
    linux-headers

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias y compilar módulos nativos
RUN pnpm install --frozen-lockfile

# Forzar recompilación de bcrypt
RUN pnpm rebuild bcrypt

# Copiar código fuente
COPY . .

# Compilar aplicación
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Instalar dependencias de runtime mínimas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Recompilar bcrypt en el contenedor de producción
RUN pnpm rebuild bcrypt

# Copiar aplicación compilada desde build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/swagger.json ./swagger.json

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001 -G nodejs

# Cambiar ownership de archivos
RUN chown -R backend:nodejs /app
USER backend

# Usar variable de entorno para el puerto
EXPOSE $PORT

# Comando de inicio
CMD ["node", "dist/server.js"]