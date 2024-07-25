import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    map: null,
  },
  reducers: {
    setMap(state, action) {
      state.map = action.payload;
    },
  },
});

export const { setMap } = mapSlice.actions;

export default mapSlice.reducer;
