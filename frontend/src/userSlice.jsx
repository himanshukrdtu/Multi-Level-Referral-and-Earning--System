import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  earnings: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.earnings = null;
    },
    setEarnings: (state, action) => {
      state.earnings = action.payload;
    }
  },
});

export const { loginSuccess, logout, setEarnings } = userSlice.actions;
export default userSlice.reducer;
