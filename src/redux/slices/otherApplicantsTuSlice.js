import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otherApplicantsTu: [],
};

const otherApplicantsTuSlice = createSlice({
  name: 'otherApplicantsTu',
  initialState,
  reducers: {
    addOtherApplicantsTu: (state, action) => {
      state.otherApplicantsTu.push(action.payload);
    },
  },
});

export const { addOtherApplicantsTu } = otherApplicantsTuSlice.actions;
export default otherApplicantsTuSlice.reducer;