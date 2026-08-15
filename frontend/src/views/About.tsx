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
                  <p><a href="https://huggingface.co/openai-community/gpt2-medium" target="_blank">ChatGPT 2 Transformer Model</a></p>
                  <p><a href="https://huggingface.co/flair/ner-english-ontonotes-large" target="_blank">Flair NLP Classification Model</a></p>
                  <p><a href="https://github.com/flairNLP/flair" target="_blank">Flair NLP Sentiment Model</a></p>
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

          <a
            href="https://github.com/thomasmendez/summytext"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#181717] text-white px-4 py-2.5 rounded-lg no-underline font-sans hover:bg-[#2b2b2b] transition-colors mt-6"
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View on GitHub
          </a>
        </ContentSection>
      </div>
    </div>
  )
}

export default About
