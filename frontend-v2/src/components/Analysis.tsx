import type { AnalysisData } from '../services/sumMyTextService'
import TitleHeader from './TitleHeader'
import CardResult from './CardResult'

type AnalysisProps = Partial<AnalysisData> & {
  backgroundColor?: string
}

const Analysis = ({
  backgroundColor = '#d3eef2',
  sentiment = 'Positive',
  topics = ['Technology', 'History', 'Medicine'],
  summary = 'My text summary',
}: AnalysisProps) => {
  return (
    <div className="w-full">
      <TitleHeader
        titleName="Analysis"
        variant="h5"
        pt={3}
        pb={3}
        backgroundColor="#b5ecf5"
      />
      <div className="rounded-md p-4 shadow" style={{ backgroundColor }}>
        <div className="flex flex-col gap-6">
          <CardResult
            title="Summarized Text"
            content={summary}
            backgroundColor="#b5ecf5"
          />
          <CardResult title="Topics" content={topics} backgroundColor="#b5ecf5" />
          <CardResult
            title="Sentiment"
            content={sentiment}
            backgroundColor="#b5ecf5"
          />
        </div>
      </div>
    </div>
  )
}

export default Analysis
