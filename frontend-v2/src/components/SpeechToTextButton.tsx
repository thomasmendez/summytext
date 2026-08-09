import { useRef, useState } from 'react'
import { useAnalysis } from '../context/analysisContext'

// Native replacement for react-speech-recognition using the Web Speech API.
// Currently unused -- like the original app, speech-to-text is left wired but
// not rendered (see InputTextbox). No extra packages required.

type SpeechRecognitionResult = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type SpeechRecognitionInstance = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionResult) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

const getRecognitionCtor = (): SpeechRecognitionCtor | undefined => {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

const SpeechToTextButton = () => {
  const { handleTextFieldChange } = useAnalysis()
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const Ctor = getRecognitionCtor()
  if (!Ctor) {
    return (
      <button
        type="button"
        disabled
        className="flex-1 cursor-not-allowed rounded-md border border-gray-400 px-4 py-2 text-gray-600"
      >
        Browser does not support speech recognition
      </button>
    )
  }

  const start = () => {
    const recognition = new Ctor()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      handleTextFieldChange(transcript)
    }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  const stop = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  if (listening) {
    return (
      <button
        type="button"
        onClick={stop}
        className="flex-1 rounded-md bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600"
      >
        Turn off Speech to Text
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={start}
      className="flex-1 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
    >
      Speech to Text
    </button>
  )
}

export default SpeechToTextButton
