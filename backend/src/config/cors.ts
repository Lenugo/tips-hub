import { envs } from './envs'

export const corsConfig = {
  origin: `${ envs.NODE_ENV === 'development' ? 'http://localhost:5173': ''}`,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400
}
