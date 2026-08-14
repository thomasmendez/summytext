import { useEffect } from 'react'
import TitleHeader from '../components/TitleHeader'
import ContentSection from '../components/ContentSection'

const Privacy = () => {
  useEffect(() => {
    document.title = 'Privacy | Sum My Text'
  }, [])

  return (
    <div className="bg-lavender px-3 py-6 text-center" data-testid="privacy-view">
      <TitleHeader titleName="Sum My Text" className="text-3xl py-10" />
      <TitleHeader titleName="Privacy" className="mt-6 text-2xl py-10" testId="privacy-title" />

      <div className="mt-6 bg-panel text-black">
        <ContentSection className="py-10">
          <p className="text-xl" data-testid="privacy-intro">
            Sum My Text does not store any personal data that is inputed for
            summarizing.
          </p>
          <p className="mt-2 text-xl" data-testid="privacy-no-storage">
            No data that is typed is stored.
          </p>
        </ContentSection>
        <ContentSection className="pb-10">
          <p className="text-xl" data-testid="privacy-tracking">
            Tracking services are used only to measure usage and to detect page
            and server errors.
          </p>
        </ContentSection>
      </div>
    </div>
  )
}

export default Privacy
