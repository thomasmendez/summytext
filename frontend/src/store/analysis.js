import { createSlice } from '@reduxjs/toolkit';

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    text: null,
    isLoading: false,
    reqBody: null,
    data: null,
    error: null,
  },
  reducers: {
    handleTextFieldChange: (state, action) => {
      state.text = action.payload;
    },
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
    clearErrorAnalysis: (state) => {
      state.error = null;
    },
  },
});

export const analysisActions = analysisSlice.actions;

export default analysisSlice;
