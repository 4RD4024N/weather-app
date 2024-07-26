// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    register: (state, action) => {
      state.users.push(action.payload);
    },
    login: (state, action) => {
      const user = state.users.find(user => user.email === action.payload.email && user.password === action.payload.password);
      if (user) {
        state.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
    },
  },
});

export const { register, login, logout } = userSlice.actions;

export default userSlice.reducer;
