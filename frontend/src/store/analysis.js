import { createSlice } from '@reduxjs/toolkit';

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    text: null,
    isLoading: false,
    reqBody: null,
    data: null,
    info: null,
    error: null,
    previousText: null,
  },
  reducers: {
    handleTextFieldChange: (state, action) => {
      state.text = action.payload;
    },
    performAnalysis: (state, action) => {
      state.isLoading = true;
      state.reqBody = action.payload;
      state.previousText = action.payload;
    },
    completedAnalysis: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    infoAnalysis: (state, action) => {
      state.info = action.payload;
    },
    clearInfoAnalysis: (state) => {
      state.info = null;
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
