import { createSelector, createSlice } from '@reduxjs/toolkit';

import { VisibilityFilters } from '../Filter/FilterSlice';

const TodoSlice = createSlice({
	name: 'todos',
	initialState: /*{
		id: '',
		text: '',
		createdOn: '',
		completed: undefined,
	}*/
	[],
	reducers: {
		addTodo(state, action) {
			const { id, text } = action.payload;

			state.push({ id, text, completed: false });
		},
		addTodosFromDB(state, action) {
			let { id, title, completed } = action.payload;
			
			state.push({ id, text: title, completed });
		},
		toggleTodo(state, action) {
			const todo = state.find(todo => todo.id === action.payload);
			
			if (todo) {
				todo.completed = !todo.completed;
			}
		},
		toggleAllTodos(state, action) {
			const doneTodos = state.every(todo => todo.completed);

			state.map(todo => todo.completed = !doneTodos);
		},
		editTodo(state, action) {
			const todo = state.find(todo => todo.id === action.payload.id);

			if (todo) {
				todo.text = action.payload.text;
			}
		},
		removeTodo(state, action) {
			return state.filter(todo => todo.id !== action.payload);
		},
		removeAllTodos(state, action) {
			return state = [];
		}
	},
});

export const selectAllTodos = state => state.todos;
const selectFilters = state => state.filters;

export const selectVisibleTodos = createSelector(
	[selectAllTodos, selectFilters],
	(todos, filter) => {
		switch (filter) {
			case VisibilityFilters.SHOW_ALL:
				return todos;
			case VisibilityFilters.SHOW_ACTIVE:
				return todos.filter(todo => !todo.completed);
			case VisibilityFilters.SHOW_COMPLETED:
				return todos.filter(todo => todo.completed);
			default:
				throw new Error(`Unknown filter : ${filter}`);
		}
	}
);

export const selectUndoneTodosNumber = createSelector(
	[selectAllTodos],
	(todos) => {
		return todos.filter(todo => !todo.completed).length;
	}
);

const { actions, reducer } = TodoSlice;

export const { addTodo, addTodosFromDB, toggleTodo, toggleAllTodos, editTodo, removeTodo, removeAllTodos } = actions;

export default reducer;