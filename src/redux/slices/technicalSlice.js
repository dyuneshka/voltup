import { createSlice } from '@reduxjs/toolkit';

const technicalSlice = createSlice({
  name: 'technical',
  initialState: {
    technicalConditions: [],
  },
  reducers: {
    createTechnicalCondition: (state, action) => {
      state.technicalConditions.push(action.payload);
    },
    approveTechnicalCondition: (state, action) => {
      const tc = state.technicalConditions.find(tc => tc.id === action.payload.id);
      if (tc) {
        tc.status = action.payload.status;
        tc.comment = action.payload.comment;
      }
    },
  },
});

export const { createTechnicalCondition, approveTechnicalCondition } = technicalSlice.actions;
export default technicalSlice.reducer;