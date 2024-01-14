import express from 'express';
import {
	insertTodo, editTodo, deleteTodo, toggleAllTodos, getTodo, getAllTodos,
} from '../controllers/todos.js';
import requireUser from '../middlewares/requireUser.js';

const router = express.Router();

router.get('/', getAllTodos);
router.get('/:id', getTodo);
router.post('/', requireUser, insertTodo);
router.put('/', requireUser, toggleAllTodos);
router.put('/:id', requireUser, editTodo);
router.delete('/:id', requireUser, deleteTodo);

export default router;