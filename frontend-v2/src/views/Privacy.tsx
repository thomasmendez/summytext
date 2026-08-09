import { useEffect } from 'react'
import TitleHeader from '../components/TitleHeader'

const Privacy = () => {
  useEffect(() => {
    document.title = 'Privacy | Sum My Text'
  }, [])

  return (
    <div className="bg-[lavender] text-center">
      <TitleHeader
        titleName="Sum My Text"
        variant="h4"
        backgroundColor="#b5ecf5"
      />
      <TitleHeader titleName="Privacy" variant="h5" backgroundColor="#b5ecf5" />

      <div className="bg-[#b5ecf5] text-black">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-xl">
            Sum My Text does not store any personal data that is inputed for
            summarizing.
          </p>
          <p className="mt-2 text-xl">
            No data that is typed or imported from a PDF is stored.
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-10">
          <p className="text-xl">
            Tracking services are used only to measure usage and to detect page
            and server errors.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Privacy
