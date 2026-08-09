import TitleHeader from './TitleHeader'
import InputTextbox from './InputTextbox'

const InputSummary = () => {
  return (
    <div className="w-full">
      <TitleHeader
        titleName="Text to Summarize"
        variant="h5"
        pt={3}
        pb={3}
        backgroundColor="#b5ecf5"
      />
      <InputTextbox />
    </div>
  )
}

export default InputSummary
