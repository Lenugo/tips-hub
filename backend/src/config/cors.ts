import { envs } from './envs'

const originConfig = () => {
  let origins: string[] = []
  if (envs.NODE_ENV !== 'production') {
    origins = ['http://localhost:5173']
  } else {
    origins = ['https://lenugo.github.io', 'https://lenugo.github.io/tips-hub']
  }

  return origins.flat()
}

export const corsConfig = {
  origin: originConfig(),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400
}
