import { createSlice } from '@reduxjs/toolkit';

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    isLoading: false,
    reqBody: null,
    data: {
      grammaticalCorrectness: 'True',
    },
    error: null,

  },
  reducers: {
    performAnalysis: (state, action) => {
        state.isLoading = true;
        state.reqBody = action.payload;
    },
    completedAnalysis: (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
    },
    errorAnalysis: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
    },
  },
});

export const analysisActions = analysisSlice.actions;

export default analysisSlice;
