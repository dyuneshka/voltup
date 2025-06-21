import { createSlice } from '@reduxjs/toolkit';

const technicalSlice = createSlice({
  name: 'technical',
  initialState: {
    technicalConditions: [],
  },
  reducers: {
    createTechnicalCondition: (state, action) => {
      console.log('Creating technical condition:', action.payload);
      state.technicalConditions.push(action.payload);
    },
    updateTechnicalCondition: (state, action) => {
      const { id, contractData, contractStep } = action.payload;
      const tcIndex = state.technicalConditions.findIndex(tc => tc.id === id);
      if (tcIndex !== -1) {
        state.technicalConditions[tcIndex] = { ...state.technicalConditions[tcIndex], contractData, contractStep };
      }
    },
    startSsoProcess: (state, action) => {
      const { id, ssoProcessStarted } = action.payload;
      const tcIndex = state.technicalConditions.findIndex(tc => tc.id === id);
      if (tcIndex !== -1) {
        state.technicalConditions[tcIndex] = { ...state.technicalConditions[tcIndex], ssoProcessStarted };
      }
    },
    createContractProcess: (state, action) => {
      const { id, contractProcessStarted } = action.payload;
      const tcIndex = state.technicalConditions.findIndex(tc => tc.id === id);
      if (tcIndex !== -1) {
        state.technicalConditions[tcIndex] = { ...state.technicalConditions[tcIndex], contractProcessStarted };
      }
    },
    approveTechnicalCondition: (state, action) => {
      const { id, status, comment } = action.payload;
      const tcIndex = state.technicalConditions.findIndex(tc => tc.id === id);
      if (tcIndex !== -1) {
        state.technicalConditions[tcIndex] = { ...state.technicalConditions[tcIndex], status, comment };
      }
    },
  },
});

export const { createTechnicalCondition, updateTechnicalCondition, startSsoProcess, createContractProcess, approveTechnicalCondition } = technicalSlice.actions;
export default technicalSlice.reducer;