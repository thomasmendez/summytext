import { useEffect } from 'react'
import TitleHeader from '../components/TitleHeader'

const Privacy = () => {
  useEffect(() => {
    document.title = 'Privacy | Sum My Text'
  }, [])

  return (
    <div className="bg-lavender text-center" data-testid="privacy-view">
      <TitleHeader titleName="Sum My Text" className="text-3xl py-10" />
      <TitleHeader titleName="Privacy" className="text-2xl py-10" testId="privacy-title" />

      <div className="bg-panel text-black">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-xl" data-testid="privacy-intro">
            Sum My Text does not store any personal data that is inputed for
            summarizing.
          </p>
          <p className="mt-2 text-xl" data-testid="privacy-no-storage">
            No data that is typed or imported from a PDF is stored.
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-10">
          <p className="text-xl" data-testid="privacy-tracking">
            Tracking services are used only to measure usage and to detect page
            and server errors.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Privacy
