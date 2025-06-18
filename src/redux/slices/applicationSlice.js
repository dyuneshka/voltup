import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [],
  },
  reducers: {
    verifyApplication: (state, action) => {
      const appId = action.payload;
      const appIndex = state.applications.findIndex(app => app.id === appId);
      if (appIndex !== -1) {
        state.applications[appIndex].verificationStatus = action.payload === appId ? null : action.payload;
      } else {
        const result = Math.random() > 0.3 ? 'Успешно' : 'Ошибка в документах';
        state.applications.push({ id: appId, verificationStatus: result });
      }
    },
  },
});

export const { verifyApplication } = applicationSlice.actions;
export default applicationSlice.reducer;