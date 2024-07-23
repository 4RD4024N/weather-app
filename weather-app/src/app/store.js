import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../weatherSlice';
import themeReducer from '../themeSlice';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    theme:themeReducer,
  },
});

export default store;
