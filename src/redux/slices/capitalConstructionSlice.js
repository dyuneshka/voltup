import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  constructions: [],
};

const capitalConstructionSlice = createSlice({
  name: 'capitalConstruction',
  initialState,
  reducers: {
    addConstruction: (state, action) => {
      state.constructions.push(action.payload);
    },
  },
});

export const { addConstruction } = capitalConstructionSlice.actions;
export default capitalConstructionSlice.reducer;