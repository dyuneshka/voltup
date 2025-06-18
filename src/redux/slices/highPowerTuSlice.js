import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  highPowerTu: [],
};

const highPowerTuSlice = createSlice({
  name: 'highPowerTu',
  initialState,
  reducers: {
    addHighPowerTu: (state, action) => {
      state.highPowerTu.push(action.payload);
    },
  },
});

export const { addHighPowerTu } = highPowerTuSlice.actions;
export default highPowerTuSlice.reducer;