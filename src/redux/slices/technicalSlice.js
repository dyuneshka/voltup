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
      const { id, status, comment } = action.payload;
      const tcIndex = state.technicalConditions.findIndex(tc => tc.id === id);
      if (tcIndex !== -1) {
        state.technicalConditions[tcIndex] = { ...state.technicalConditions[tcIndex], status, comment };
      }
    },
  },
});

export const { createTechnicalCondition, approveTechnicalCondition } = technicalSlice.actions;
export default technicalSlice.reducer;