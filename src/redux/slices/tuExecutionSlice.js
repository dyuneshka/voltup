import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tuExecutions: [],
};

const tuExecutionSlice = createSlice({
  name: 'tuExecution',
  initialState,
  reducers: {
    addTuExecution: (state, action) => {
      state.tuExecutions.push(action.payload);
    },
  },
});

export const { addTuExecution } = tuExecutionSlice.actions;
export default tuExecutionSlice.reducer;