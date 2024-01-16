import express from 'express'
import validateResource from '../middlewares/validateResource.js'
import { createUserSchema } from '../schemas/user.js'
import { deleteUser, getAllUsers, getCurrentUser, getOneUser, registerUser, updateUser } from '../controllers/users.js'
import requireUser from '../middlewares/requireUser.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getOneUser)
router.get('/me', requireUser, getCurrentUser)

router.post('/', validateResource(createUserSchema), registerUser)

router.patch('/:id', requireUser, updateUser)

router.delete('/:id', requireUser, deleteUser)

export default router