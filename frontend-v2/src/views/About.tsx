import { useEffect } from 'react'
import TitleHeader from '../components/TitleHeader'

const About = () => {
  useEffect(() => {
    document.title = 'About | Sum My Text'
  }, [])

  return (
    <div className="bg-[lavender] text-center">
      <TitleHeader
        titleName="Sum My Text"
        variant="h4"
        backgroundColor="#b5ecf5"
      />
      <TitleHeader titleName="About" variant="h5" backgroundColor="#b5ecf5" />

      <div className="bg-[#b5ecf5] text-black">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-xl">
            Need to summarize a text message, report, review, or an email? No
            problem!
          </p>
          <p className="mt-2 text-xl">
            Sum My Text is a free online tool that allows users to summarize,
            identify topics, and describe emotional sentiment of their text.
          </p>
        </div>

        <div className="mx-auto max-w-xl px-4 pb-10">
          <table className="w-full border border-black text-left">
            <tbody>
              <tr>
                <td className="border-b border-black p-3 align-top">
                  📕 Summarizes
                </td>
                <td className="border-b border-black p-3 align-top">
                  Reports, essays &amp; documents
                </td>
              </tr>
              <tr>
                <td className="border-b border-black p-3 align-top">
                  🚀 Capabilities
                </td>
                <td className="border-b border-black p-3 align-top">
                  <p>
                    Summarize Up To 5000 Characters (approx. 1 page 12-pt font)
                  </p>
                  <p>Identify Topics (Classification)</p>
                  <p>Emotional Tone (Positive or Negative)</p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-black p-3 align-top">
                  💡 AI Models
                </td>
                <td className="border-b border-black p-3 align-top">
                  <p>ChatGPT 2 Transformer Model</p>
                  <p>Flair NLP Classification Model</p>
                  <p>Flair NLP Sentiment Model</p>
                </td>
              </tr>
              <tr>
                <td className="border-b border-black p-3 align-top">
                  💰 Free to Use
                </td>
                <td className="border-b border-black p-3 align-top">
                  Summarize at no cost
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default About
