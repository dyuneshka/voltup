import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  megaPowerTu: [],
};

const megaPowerTuSlice = createSlice({
  name: 'megaPowerTu',
  initialState,
  reducers: {
    addMegaPowerTu: (state, action) => {
      state.megaPowerTu.push(action.payload);
    },
  },
});

export const { addMegaPowerTu } = megaPowerTuSlice.actions;
export default megaPowerTuSlice.reducer;