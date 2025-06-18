import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  forms: [],
};

const printFormsSlice = createSlice({
  name: 'printForms',
  initialState,
  reducers: {
    addForm: (state, action) => {
      state.forms.push(action.payload);
    },
  },
});

export const { addForm } = printFormsSlice.actions;
export default printFormsSlice.reducer;