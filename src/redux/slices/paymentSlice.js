import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [
    { userId: 1, amount: 5000, date: '2025-05-10', status: 'Paid' },
    { userId: 2, amount: 6000, date: '2025-06-01', status: 'Paid' },
    { userId: 1, amount: 4500, date: '2025-06-05', status: 'Pending' },
  ],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    payInvoice: (state, action) => {
      state.payments.push(action.payload);
    },
  },
});

export const { payInvoice } = paymentSlice.actions;
export default paymentSlice.reducer;