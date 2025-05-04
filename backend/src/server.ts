import app from './app'

const PORT = process.env.PORT || 3001
const enviroment = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
  console.log(`Running on ${enviroment === 'development' ? `http://localhost:${PORT}` : `port:${PORT}`}`)
})