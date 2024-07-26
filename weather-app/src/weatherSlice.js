import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWeather = createAsyncThunk('weather/fetchWeather', async (city) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: city,
        units: 'metric',
        appid: process.env.REACT_APP_OPEN_WEATHER_MAP_KEY,
        lang: 'tr'
      }
    }
  );

  // Convert 3-hour interval data to 1-hour interval data
  const hourlyData = response.data.list.flatMap((item) => {
    const date = new Date(item.dt_txt);
    const tempDiff = item.main.temp_max - item.main.temp_min;
    return [
      { ...item, dt_txt: new Date(date.getTime() + 0 * 60 * 60 * 1000).toISOString(), main: { ...item.main, temp: item.main.temp_min + tempDiff * 0.0 } },
      { ...item, dt_txt: new Date(date.getTime() + 1 * 60 * 60 * 1000).toISOString(), main: { ...item.main, temp: item.main.temp_min + tempDiff * 0.33 } },
      { ...item, dt_txt: new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString(), main: { ...item.main, temp: item.main.temp_min + tempDiff * 0.67 } }
    ];
  });

  return { ...response.data, list: hourlyData };
});

export const fetchCityInfo = createAsyncThunk('weather/fetchCityInfo', async (city) => {
  const response = await axios.get(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
  );
  return response.data;
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    city: '',
    suggestions: [],
    weather: null,
    error: null,
    cityInfo: null,
    loading: false,
  },
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    },
    setSuggestions(state, action) {
      state.suggestions = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchCityInfo.fulfilled, (state, action) => {
        state.cityInfo = action.payload;
      });
  },
});

export const { setCity, setSuggestions, setError, clearError } = weatherSlice.actions;

export default weatherSlice.reducer;
