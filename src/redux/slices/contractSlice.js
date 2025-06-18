import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contracts: [
    { id: 1, applicationId: 1, status: 'Подписан', date: '2025-06-03', cost: 15000, signedBy: 'user1' },
    { id: 2, applicationId: 2, status: 'Ожидает подписи', date: '2025-06-05', cost: 250000, signedBy: null },
    { id: 3, applicationId: 3, status: 'Исполнен', date: '2025-06-07', cost: 8000, signedBy: 'user2' },
  ],
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    createContract: (state, action) => {
      state.contracts.push({ ...action.payload, id: Date.now(), status: 'Ожидает подписи' });
    },
    updateContractStatus: (state, action) => {
      const contract = state.contracts.find(c => c.id === action.payload.id);
      if (contract) contract.status = action.payload.status;
    },
  },
});

export const { createContract, updateContractStatus } = contractSlice.actions;
export default contractSlice.reducer;