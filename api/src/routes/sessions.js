import express from 'express'
import validateResource from '../middlewares/validateResource.js'
import { createSessionSchema } from '../schemas/sessions.js'
import {
  createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler, googleOAuthHandler,
} from '../controllers/sessions.js'
import requireUser from '../middlewares/requireUser.js'

const router = express.Router()

router.get('/', requireUser, getUserSessionsHandler)
router.get('/oauth/google', googleOAuthHandler)

router.post('/', validateResource(createSessionSchema), createUserSessionHandler)

router.delete('/', requireUser, deleteSessionHandler)

export default router