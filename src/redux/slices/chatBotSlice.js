import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatHistory: [
    { id: 1, user: 'user1', message: 'Какой статус моей заявки?', bot: 'Ваш статус заявки: В обработке.', date: '2025-06-09 10:00' },
    { id: 2, user: 'user1', message: 'Где посмотреть договор?', bot: 'Договор доступен в личном кабинете.', date: '2025-06-09 10:05' },
    { id: 3, user: 'user2', message: 'Как оплатить?', bot: 'Перейдите в раздел "Оплата" для проведения платежа.', date: '2025-06-09 11:00' },
  ],
};

const chatBotSlice = createSlice({
  name: 'chatBot',
  initialState,
  reducers: {
    addChatMessage: (state, action) => {
      state.chatHistory.push({ ...action.payload, id: Date.now(), date: new Date().toISOString() });
    },
  },
});

export const { addChatMessage } = chatBotSlice.actions;
export default chatBotSlice.reducer;