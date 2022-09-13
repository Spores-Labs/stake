import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: { address: '', yourStakedBalance: '0', balance: '0' },
  reducers: {
    updateInfosProfile: (state, { payload: profile }) => {
      return { ...state, ...profile };
    },
    signIn: (state, { payload: profile }) => {
      // localStorage.setItem('profile', JSON.stringify(profile));
      return { ...state, ...profile, isLoggedIn: true };
    },
    signOut: () => {
      // localStorage.removeItem('profile');
      return { isLoggedIn: false };
    },
  },
});

export const { signIn, signOut, updateInfosProfile } = profileSlice.actions;

export const profileSelector = ({ profile }) => profile;

export default profileSlice.reducer;
