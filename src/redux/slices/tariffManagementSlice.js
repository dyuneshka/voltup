import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tariffs: [],
};

const tariffManagementSlice = createSlice({
  name: 'tariffManagement',
  initialState,
  reducers: {
    addTariff: (state, action) => {
      state.tariffs.push(action.payload);
    },
  },
});

export const { addTariff } = tariffManagementSlice.actions;
export default tariffManagementSlice.reducer;