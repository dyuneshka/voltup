import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  constructions: [],
};

const constructionSlice = createSlice({
  name: 'construction',
  initialState,
  reducers: {
    addConstruction: (state, action) => {
      state.constructions.push(action.payload);
    },
  },
});

export const { addConstruction } = constructionSlice.actions;
export default constructionSlice.reducer;