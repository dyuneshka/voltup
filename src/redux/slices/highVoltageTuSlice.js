import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  highVoltageTu: [],
};

const highVoltageTuSlice = createSlice({
  name: 'highVoltageTu',
  initialState,
  reducers: {
    addHighVoltageTu: (state, action) => {
      state.highVoltageTu.push(action.payload);
    },
  },
});

export const { addHighVoltageTu } = highVoltageTuSlice.actions;
export default highVoltageTuSlice.reducer;