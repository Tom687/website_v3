import { configureStore } from '@reduxjs/toolkit';
import TodoSlice from '../features/TodoList/TodoList/TodoSlice';
import FilterSlice from '../features/TodoList/Filter/FilterSlice';

const store = configureStore({
	reducer: {
		todos: TodoSlice,
		filters: FilterSlice,
	}
});

export default store;