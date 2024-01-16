import express from 'express'
import { getTodos } from '../controllers/todos.js'
import requireUser from '../middlewares/requireUser.js'
import { getEvents } from '../controllers/events.js'
import { getUserCurrentSessionHandler } from '../controllers/sessions.js'

const router = express.Router()

router.get('/todos', requireUser, getTodos)
router.get('/events', requireUser, getEvents)
router.get('/sessions', requireUser, getUserCurrentSessionHandler)

export default router