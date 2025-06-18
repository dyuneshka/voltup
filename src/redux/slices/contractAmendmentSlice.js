import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  amendments: [],
};

const contractAmendmentSlice = createSlice({
  name: 'contractAmendment',
  initialState,
  reducers: {
    addAmendment: (state, action) => {
      state.amendments.push(action.payload);
    },
  },
});

export const { addAmendment } = contractAmendmentSlice.actions;
export default contractAmendmentSlice.reducer;