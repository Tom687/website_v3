import express from 'express'
import config from 'config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import globalErrorHandler from './middlewares/errorHandler.js'
import sessionsRoutes from './routes/sessions.js'
import usersRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import eventsRoutes from './routes/events.js'
import todosRoutes from './routes/todos.js'
import meRoutes from './routes/me.js'
import deserializeUser from './middlewares/deserializeUser.js'
import dotenv from 'dotenv'

dotenv.config({ path: './config.env' })

const app = express()

const NODE_ENV = 'production'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
  cors({
    credentials: true,
    origin: config.get('origin'),
  }),
)

app.use(deserializeUser)

app.get('/healthcheck', (req, res) => res.sendStatus(200))
app.use('/api/me', meRoutes)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/todos', todosRoutes)

app.use(globalErrorHandler)

export default app