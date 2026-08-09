import { createContext, useContext } from 'react'
import type { AnalysisData } from '../services/sumMyTextService'

export type AnalysisState = {
  text: string | null
  isLoading: boolean
  data: AnalysisData | null
  info: string | null
  error: string | null
  previousText: string | null
}

export type AnalysisContextValue = {
  state: AnalysisState
  handleTextFieldChange: (text: string) => void
  performAnalysis: (text: string) => void
  completedAnalysis: (data: AnalysisData) => void
  infoAnalysis: (message: string) => void
  clearInfoAnalysis: () => void
  errorAnalysis: (message: string) => void
  clearErrorAnalysis: () => void
}

export const AnalysisContext = createContext<AnalysisContextValue | null>(null)

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext)
  if (!ctx) {
    throw new Error('useAnalysis must be used within an <AnalysisProvider>')
  }
  return ctx
}
