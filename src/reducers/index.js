import { configureStore } from '@reduxjs/toolkit';
import profile from './profile';
import contractInfos from './contractInfos';

export const store = configureStore({
  reducer: {
    profile,
    contractInfos
  },
});

