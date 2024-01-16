import app from '../app.js'
import log from '../utils/logger.js'

// Safety net : If there are uncaught exceptions
process.on('uncaughtException', err => {
  console.log('Uncaught Exception. Shutting down…')
  console.log(err.name, err.message)
  // Shutting server down
  process.exit(1) // 0 = success | 1 = Uncaught Exception
})

const port = process.env.PORT || 1337

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`)
})