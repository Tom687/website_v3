import express from 'express'
import {
  deleteEvent, getAllEvents, getEvent, insertEvent, linkUserToEvent, unlinkUserFromEvent, updateEvent,
} from '../controllers/events.js'
import requireUser from '../middlewares/requireUser.js'

const router = express.Router()

router.get('/', getAllEvents)
router.get('/:id', getEvent)

router.post('/:id/linkUser', linkUserToEvent)
router.post('/', requireUser, insertEvent)

router.put('/:id', requireUser, updateEvent)

router.delete('/:id/unlinkUser', requireUser, unlinkUserFromEvent)
router.delete('/:id', requireUser, deleteEvent)

export default router