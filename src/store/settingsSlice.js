import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currency: 'GBP',      
  region: 'America',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrency(state, action) {
      state.currency = action.payload;
    },
    setRegion(state, action) {
      state.region = action.payload;
    },
    resetSettings(state) {
      state.currency = 'GBP';
      state.region = 'America';
    },
  },
});

export const { setCurrency, setRegion, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
