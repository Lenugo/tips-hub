
/**
 * CORS Configuration
 */
export const corsConfig = {
  origin: ['http://localhost:5173', 'https://lenugo.github.io/tips-hub'].flat(),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400
}
