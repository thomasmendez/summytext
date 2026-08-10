import { useAnalysis } from '../context/analysisContext'
import SubmitButton from './SubmitButton'
// Disabled input features (see button row below):
// - PDF-to-text: dropped because the pdfjs-dist parsing path carried a
//   high-severity vulnerability. Not worth the risk for a convenience feature.
// - Speech-to-text: dropped as low-value / rarely used.
// import PdfToTextButton from './PdfToTextButton'
// import SpeechToTextButton from './SpeechToTextButton'

type InputTextboxProps = {
  backgroundColor?: string
}

const CHARACTER_LIMIT = 5000

const InputTextbox = ({ backgroundColor = '#d3eef2' }: InputTextboxProps) => {
  const { state, handleTextFieldChange } = useAnalysis()
  const value = state.text ?? state.previousText ?? ''

  return (
    <div className="rounded-md p-4 shadow" style={{ backgroundColor }}>
      <textarea
        data-testid="input-textarea"
        className="w-full resize-y rounded-md border border-gray-300 bg-white p-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
        placeholder="Enter text you wish to summarize here..."
        rows={20}
        maxLength={CHARACTER_LIMIT}
        value={value}
        autoFocus
        onChange={(event) => handleTextFieldChange(event.target.value)}
      />
      <div className="mt-3 flex gap-2">
        {/* PDF-to-text and speech-to-text are intentionally disabled. The
            components remain in the repo for reference; re-enable by
            restoring their imports and rendering them here. */}
        {/* <SpeechToTextButton /> */}
        {/* <PdfToTextButton /> */}
        <SubmitButton />
      </div>
    </div>
  )
}

export default InputTextbox
