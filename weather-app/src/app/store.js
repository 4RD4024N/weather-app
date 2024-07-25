import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../weatherSlice';
import searchReducer from '../searchSlice'
import themeReducer from '../themeSlice';
import mapReducer from '../mapSlice';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    theme:themeReducer,
    search:searchReducer,
    map: mapReducer

  },
});

export default store;
