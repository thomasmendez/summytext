import TitleHeader from './TitleHeader'
import InputTextbox from './InputTextbox'

const InputSummary = () => {
  return (
    <div className="w-full">
      <TitleHeader titleName="Text to Summarize" className="text-2xl py-6" />
      <InputTextbox />
    </div>
  )
}

export default InputSummary
