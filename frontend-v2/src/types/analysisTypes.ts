// Backend contract for the Sum My Text predict endpoint. Kept in src/types so
// MSW fixtures and the service share one source of truth (see msw-mocks skill).

export type AnalysisData = {
  sentiment: string
  topics: string[]
  summary: string
}

export type PredictError = {
  status?: number
  message: string
  isNetwork: boolean
}
