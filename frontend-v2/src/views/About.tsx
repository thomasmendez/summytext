import { useEffect } from 'react'
import TitleHeader from '../components/TitleHeader'
import ContentSection from '../components/ContentSection'

const About = () => {
  useEffect(() => {
    document.title = 'About | Sum My Text'
  }, [])

  return (
    <div className="bg-lavender px-3 py-6 text-center" data-testid="about-view">
      <TitleHeader titleName="Sum My Text" className="text-3xl py-10" />
      <TitleHeader titleName="About" className="mt-6 text-2xl py-10" testId="about-title" />

      <div className="mt-6 bg-panel text-black">
        <ContentSection className="py-10">
          <p className="text-xl" data-testid="about-intro">
            Need to summarize a text message, report, review, or an email? No
            problem!
          </p>
          <p className="mt-2 text-xl" data-testid="about-description">
            Sum My Text is a free online tool that allows users to summarize,
            identify topics, and describe emotional sentiment of their text.
          </p>
        </ContentSection>

        <ContentSection className="pb-10">
          <table
            className="w-full border border-black text-left"
            data-testid="about-capabilities-table"
          >
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
        </ContentSection>
      </div>
    </div>
  )
}

export default About
