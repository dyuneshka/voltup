import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  registeredUsers: [
    { id: 1, username: 'user1', password: 'pass1', role: 'applicant', email: 'user1@example.com', phone: '+79991234567' },
    { id: 2, username: 'employee1', password: 'pass2', role: 'employee', email: 'employee1@chechenenergo.ru', phone: '+79998765432' },
    { id: 3, username: 'user2', password: 'pass3', role: 'applicant', email: 'user2@example.com', phone: '+79997654321' },
  ],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    register: (state, action) => {
      state.registeredUsers.push(action.payload);
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;