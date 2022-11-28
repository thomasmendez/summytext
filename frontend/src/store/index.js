import { configureStore } from '@reduxjs/toolkit';
import { analysisSlice } from './analysis';

export default configureStore({
  reducer: {
    analysis: analysisSlice.reducer,
  },
});