import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  consumption: [
    { date: '2025-05-01', value: 150 },
    { date: '2025-05-15', value: 160 },
    { date: '2025-06-01', value: 145 },
    { date: '2025-06-09', value: 155 },
    { date: '2025-06-10', value: 162 },
  ],
  currentReading: 162,
  paymentHistory: [
    { id: 1, amount: 5000, date: '2025-05-10', status: 'Оплачено' },
    { id: 2, amount: 6000, date: '2025-06-01', status: 'Оплачено' },
    { id: 3, amount: 4500, date: '2025-06-05', status: 'Ожидает оплаты' },
  ],
  notifications: [
    'Статус заявки обновлен: В обработке',
    'Оплата на 6000 руб. успешно проведена',
    'Технические условия готовы к просмотру',
    'Напоминание: Подпишите договор до 12.06.2025',
  ],
  recommendations: ['Снизьте потребление на 10% для экономии', 'Установите умный счетчик для точного мониторинга'],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateConsumption: (state, action) => {
      state.consumption.push(action.payload);
    },
    updateReading: (state, action) => {
      state.currentReading = action.payload;
    },
    addPayment: (state, action) => {
      state.paymentHistory.push(action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    addRecommendation: (state, action) => {
      state.recommendations.push(action.payload);
    },
  },
});

export const { updateConsumption, updateReading, addPayment, addNotification, addRecommendation } = dashboardSlice.actions;
export default dashboardSlice.reducer;