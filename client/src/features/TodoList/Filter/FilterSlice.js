import { createSlice } from '@reduxjs/toolkit';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

const FilterSlice = createSlice({
  name: 'filters',
  initialState: VisibilityFilters.SHOW_ALL,
  reducers: {
    setVisibilityFilter(state, action) {
      return action.payload;
    },
  },
});

export const selectFilters = state => state.filter;

const { actions, reducer } = FilterSlice;

export const { setVisibilityFilter } = actions;

export default reducer;