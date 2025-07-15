import { createSlice } from '@reduxjs/toolkit';

const technicalSlice = createSlice({
  name: 'technical',
  initialState: {
    technicalConditions: [],
    otrDocuments: [],
  },
  reducers: {
    createTechnicalCondition: (state, action) => {
      console.log('Creating technical condition:', action.payload);
      state.technicalConditions.push(action.payload);
    },
    createOtr: (state, action) => {
      console.log('Creating OTR document:', action.payload);
      state.otrDocuments.push(action.payload);
    },
    updateTechnicalCondition: (state, action) => {
      const { id, contractData, contractStep, ssoData, ssoStep } = action.payload;
      const tcIndex = state.technicalConditions.findIndex(tc => tc.id === id);
      if (tcIndex !== -1) {
        state.technicalConditions[tcIndex] = { 
          ...state.technicalConditions[tcIndex], 
          contractData, 
          contractStep,
          ssoData,
          ssoStep
        };
      }
    },
    updateOtr: (state, action) => {
      const { id, ...updates } = action.payload;
      const otrIndex = state.otrDocuments.findIndex(otr => otr.id === id);
      if (otrIndex !== -1) {
        state.otrDocuments[otrIndex] = { ...state.otrDocuments[otrIndex], ...updates };
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
    approveOtr: (state, action) => {
      const { id, status, comment } = action.payload;
      const otrIndex = state.otrDocuments.findIndex(otr => otr.id === id);
      if (otrIndex !== -1) {
        state.otrDocuments[otrIndex] = { ...state.otrDocuments[otrIndex], status, comment };
      }
    },
  },
});

export const { 
  createTechnicalCondition, 
  createOtr,
  updateTechnicalCondition, 
  updateOtr,
  startSsoProcess, 
  createContractProcess, 
  approveTechnicalCondition,
  approveOtr
} = technicalSlice.actions;
export default technicalSlice.reducer;