import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  powerCenters: [],
  tpApplications: [],
  otherApplications: [],
  integrationLogs: [],
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    addPowerCenter: (state, action) => {
      state.powerCenters.push(action.payload);
    },
    addTpApplication: (state, action) => {
      state.tpApplications.push(action.payload);
    },
    addOtherApplication: (state, action) => {
      state.otherApplications.push(action.payload);
    },
    addIntegrationLog: (state, action) => {
      state.integrationLogs.push(action.payload);
    },
  },
});

export const { addPowerCenter, addTpApplication, addOtherApplication, addIntegrationLog } = integrationSlice.actions;
export default integrationSlice.reducer;