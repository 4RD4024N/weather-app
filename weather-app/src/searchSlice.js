import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNearbyPlaces = createAsyncThunk('search/fetchNearbyPlaces', async (keyword, { getState }) => {
  const { map } = getState().map;
  const service = new window.google.maps.places.PlacesService(map);
  
  return new Promise((resolve, reject) => {
    const request = {
      location: map.getCenter(),
      radius: '5000',
      keyword: keyword,
    };
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
});

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults(state) {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyPlaces.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.loading = false;
      })
      .addCase(fetchNearbyPlaces.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
