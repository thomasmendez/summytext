import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { analysisActions } from '../store/analysisSlice'
import { performAnalysis as callAnalysis } from '../services/sumMyTextService'
import type { PredictError } from '../services/sumMyTextService'
import TitleHeader from '../components/TitleHeader'
import InputTextbox from '../components/InputTextbox'
import Analysis from '../components/Analysis'

const Home = () => {
  const dispatch = useAppDispatch()
  const { isLoading, text, data, info, error } = useAppSelector(
    (state) => state.analysis,
  )

  const infoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    document.title = 'Sum My Text'
  }, [])

  useEffect(() => {
    if (!isLoading) return

    // Rotate messages so a slow response (often a cold start) reads as the model
    // working through the text, not a stalled request.
    const workingMessages = [
      'AI Models are processing your request…',
      'Analyzing your text…',
      'Still working through it…',
      'Almost there, hang tight…',
    ]
    let msgIndex = 0
    const timer = setInterval(() => {
      dispatch(analysisActions.infoAnalysis(workingMessages[msgIndex % workingMessages.length]))
      msgIndex += 1
    }, 15000)
    infoTimerRef.current = timer

    callAnalysis(text ?? '')
      .then((res) => {
        clearInterval(timer)
        dispatch(analysisActions.clearInfoAnalysis())
        dispatch(analysisActions.completedAnalysis(res))
      })
      .catch((err: PredictError) => {
        clearInterval(timer)
        dispatch(analysisActions.clearInfoAnalysis())
        console.error(err)
        dispatch(analysisActions.errorAnalysis(err.message ?? 'Something went wrong. Please try again later.'))
      })

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  // Auto-hide errors after 10s (info stays until cleared), matching the old
  // MUI Snackbar behaviour.
  useEffect(() => {
    if (!error) return
    const timeout = setTimeout(() => dispatch(analysisActions.clearErrorAnalysis()), 10000)
    return () => clearTimeout(timeout)
  }, [error, dispatch])

  const closeSnackbar = () => {
    if (infoTimerRef.current) clearInterval(infoTimerRef.current)
    dispatch(analysisActions.clearErrorAnalysis())
    dispatch(analysisActions.clearInfoAnalysis())
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
              <InputTextbox />
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
            <InputTextbox />
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
