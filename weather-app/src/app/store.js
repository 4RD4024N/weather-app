import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../weatherSlice';
import searchReducer from '../searchSlice'
import themeReducer from '../themeSlice';
import mapReducer from '../mapSlice';
import authReducer from '../authSlice';
import  userReducer  from '../userSlice';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    theme:themeReducer,
    search:searchReducer,
    map: mapReducer,
    auth: authReducer,
    user: userReducer,

  },
});

export default store;
