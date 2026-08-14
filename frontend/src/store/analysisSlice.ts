import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AnalysisData } from '../services/sumMyTextService'

export type AnalysisState = {
  text: string | null
  isLoading: boolean
  data: AnalysisData | null
  info: string | null
  error: string | null
  previousText: string | null
}

const initialState: AnalysisState = {
  text: null,
  isLoading: false,
  data: null,
  info: null,
  error: null,
  previousText: null,
}

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    handleTextFieldChange: (state, action: PayloadAction<string>) => {
      state.text = action.payload
    },
    performAnalysis: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.previousText = action.payload
    },
    completedAnalysis: (state, action: PayloadAction<AnalysisData>) => {
      state.isLoading = false
      state.data = action.payload
    },
    infoAnalysis: (state, action: PayloadAction<string>) => {
      state.info = action.payload
    },
    clearInfoAnalysis: (state) => {
      state.info = null
    },
    errorAnalysis: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    clearErrorAnalysis: (state) => {
      state.error = null
    },
  },
})

export const analysisActions = analysisSlice.actions

export default analysisSlice
