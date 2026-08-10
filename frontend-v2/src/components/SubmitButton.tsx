import { useAnalysis } from '../context/analysisContext'

const SubmitButton = () => {
  const { state, performAnalysis } = useAnalysis()
  const { text, isLoading } = state

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        data-testid="submit-button"
        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-400 px-4 py-2 text-gray-600"
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        Submit
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={!text}
      data-testid="submit-button"
      onClick={() => {
        if (text) performAnalysis(text)
      }}
      className="flex-1 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
    >
      Submit
    </button>
  )
}

export default SubmitButton
