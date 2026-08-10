import { useEffect, useRef } from 'react'
import { useAnalysis } from '../context/analysisContext'
import { performAnalysis as callAnalysis } from '../services/sumMyTextService'
import type { PredictError } from '../services/sumMyTextService'
import TitleHeader from '../components/TitleHeader'
import InputSummary from '../components/InputSummary'
import Analysis from '../components/Analysis'

const Home = () => {
  const {
    state,
    completedAnalysis,
    errorAnalysis,
    infoAnalysis,
    clearInfoAnalysis,
    clearErrorAnalysis,
  } = useAnalysis()
  const { isLoading, text, data, info, error } = state

  const infoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    document.title = 'Sum My Text'
  }, [])

  useEffect(() => {
    if (!isLoading) return

    const timer = setInterval(() => {
      infoAnalysis('The request is taking longer than expected. Please wait')
    }, 7000)
    infoTimerRef.current = timer

    callAnalysis(text ?? '')
      .then((res) => {
        clearInterval(timer)
        clearInfoAnalysis()
        completedAnalysis(res)
      })
      .catch((err: PredictError) => {
        clearInterval(timer)
        clearInfoAnalysis()
        console.error(err)
        errorAnalysis(err.message ?? 'Something went wrong. Please try again later.')
      })

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  // Auto-hide errors after 10s (info stays until cleared), matching the old
  // MUI Snackbar behaviour.
  useEffect(() => {
    if (!error) return
    const timeout = setTimeout(() => clearErrorAnalysis(), 10000)
    return () => clearTimeout(timeout)
  }, [error, clearErrorAnalysis])

  const closeSnackbar = () => {
    if (infoTimerRef.current) clearInterval(infoTimerRef.current)
    clearErrorAnalysis()
    clearInfoAnalysis()
  }

  return (
    <div className="bg-lavender px-3 py-6" data-testid="home-view">
      {(error || info) && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
          <div
            data-testid={error ? 'snackbar-error' : 'snackbar-info'}
            className={`flex items-center gap-3 rounded-md px-4 py-3 text-white shadow-lg ${
              error ? 'bg-red-600' : 'bg-sky-600'
            }`}
          >
            <span data-testid="snackbar-message">{error || info}</span>
            <button
              type="button"
              aria-label="Close"
              onClick={closeSnackbar}
              data-testid="snackbar-close"
              className="font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <TitleHeader titleName="Sum My Text" className="text-3xl py-10" testId="home-title" />

      <div className="mt-6 w-full">
        {data ? (
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <InputSummary />
            </div>
            <div className="w-full sm:w-1/2">
              <Analysis
                sentiment={data.sentiment}
                topics={data.topics}
                summary={data.summary}
              />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <InputSummary />
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
