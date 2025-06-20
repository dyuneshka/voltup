import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [],
  },
  reducers: {
    verifyApplication: (state, action) => {
      const { id, ...updates } = action.payload;
      const appIndex = state.applications.findIndex(app => app.id === id);
      if (appIndex !== -1) {
        state.applications[appIndex] = { ...state.applications[appIndex], ...updates };
      } else {
        state.applications.push({ id, ...updates, status: 'Заполнена' });
      }
    },
  },
});

export const { verifyApplication } = applicationSlice.actions;
export default applicationSlice.reducer;