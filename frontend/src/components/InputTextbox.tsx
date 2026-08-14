import { useAppDispatch, useAppSelector } from '../store'
import { analysisActions } from '../store/analysisSlice'
import TitleHeader from './TitleHeader'
import SubmitButton from './SubmitButton'

type InputTextboxProps = {
  backgroundColor?: string
}

const CHARACTER_LIMIT = 5000

const InputTextbox = ({ backgroundColor = '#d3eef2' }: InputTextboxProps) => {
  const dispatch = useAppDispatch()
  const { text, previousText } = useAppSelector((state) => state.analysis)
  const value = text ?? previousText ?? ''

  return (
    <div className="w-full">
      <TitleHeader titleName="Text to Summarize" className="text-2xl py-6" />
      <div className="rounded-md p-4 shadow" style={{ backgroundColor }}>
      <textarea
        data-testid="input-textarea"
        className="w-full resize-y rounded-md border border-gray-300 bg-white p-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
        placeholder="Enter text you wish to summarize here..."
        rows={20}
        maxLength={CHARACTER_LIMIT}
        value={value}
        autoFocus
        onChange={(event) => dispatch(analysisActions.handleTextFieldChange(event.target.value))}
      />
      <div className="mt-3 flex gap-2">
        <SubmitButton />
        </div>
      </div>
    </div>
  )
}

export default InputTextbox
