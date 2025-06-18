import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  calculations: [],
};

const powerCalculationSlice = createSlice({
  name: 'powerCalculation',
  initialState,
  reducers: {
    addCalculation: (state, action) => {
      state.calculations.push(action.payload);
    },
  },
});

export const { addCalculation } = powerCalculationSlice.actions;
export default powerCalculationSlice.reducer;