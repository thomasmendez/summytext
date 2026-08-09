import { useCallback, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AnalysisData } from '../services/sumMyTextService'
import { AnalysisContext } from './analysisContext'
import type { AnalysisState } from './analysisContext'

// Replaces the Redux Toolkit `analysis` slice + store. Same shape, same
// transitions -- just backed by useReducer + Context instead of Redux.

const initialState: AnalysisState = {
  text: null,
  isLoading: false,
  data: null,
  info: null,
  error: null,
  previousText: null,
}

type Action =
  | { type: 'handleTextFieldChange'; payload: string }
  | { type: 'performAnalysis'; payload: string }
  | { type: 'completedAnalysis'; payload: AnalysisData }
  | { type: 'infoAnalysis'; payload: string }
  | { type: 'clearInfoAnalysis' }
  | { type: 'errorAnalysis'; payload: string }
  | { type: 'clearErrorAnalysis' }

const reducer = (state: AnalysisState, action: Action): AnalysisState => {
  switch (action.type) {
    case 'handleTextFieldChange':
      return { ...state, text: action.payload }
    case 'performAnalysis':
      return { ...state, isLoading: true, previousText: action.payload }
    case 'completedAnalysis':
      return { ...state, isLoading: false, data: action.payload }
    case 'infoAnalysis':
      return { ...state, info: action.payload }
    case 'clearInfoAnalysis':
      return { ...state, info: null }
    case 'errorAnalysis':
      return { ...state, isLoading: false, error: action.payload }
    case 'clearErrorAnalysis':
      return { ...state, error: null }
    default:
      return state
  }
}

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleTextFieldChange = useCallback(
    (text: string) => dispatch({ type: 'handleTextFieldChange', payload: text }),
    [],
  )
  const performAnalysis = useCallback(
    (text: string) => dispatch({ type: 'performAnalysis', payload: text }),
    [],
  )
  const completedAnalysis = useCallback(
    (data: AnalysisData) => dispatch({ type: 'completedAnalysis', payload: data }),
    [],
  )
  const infoAnalysis = useCallback(
    (message: string) => dispatch({ type: 'infoAnalysis', payload: message }),
    [],
  )
  const clearInfoAnalysis = useCallback(
    () => dispatch({ type: 'clearInfoAnalysis' }),
    [],
  )
  const errorAnalysis = useCallback(
    (message: string) => dispatch({ type: 'errorAnalysis', payload: message }),
    [],
  )
  const clearErrorAnalysis = useCallback(
    () => dispatch({ type: 'clearErrorAnalysis' }),
    [],
  )

  const value = useMemo(
    () => ({
      state,
      handleTextFieldChange,
      performAnalysis,
      completedAnalysis,
      infoAnalysis,
      clearInfoAnalysis,
      errorAnalysis,
      clearErrorAnalysis,
    }),
    [
      state,
      handleTextFieldChange,
      performAnalysis,
      completedAnalysis,
      infoAnalysis,
      clearInfoAnalysis,
      errorAnalysis,
      clearErrorAnalysis,
    ],
  )

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}
