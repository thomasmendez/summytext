import type { AnalysisData } from '../services/sumMyTextService'
import TitleHeader from './TitleHeader'
import CardResult from './CardResult'

type AnalysisProps = Partial<AnalysisData>

const Analysis = ({
  sentiment = 'Positive',
  topics = ['Technology', 'History', 'Medicine'],
  summary = 'My text summary',
}: AnalysisProps) => {
  return (
    <div className="w-full" data-testid="analysis-view">
      <TitleHeader titleName="Analysis" className="text-2xl py-6" testId="analysis-title" />
      <div className="rounded-md bg-panel-soft p-4 shadow">
        <div className="flex flex-col gap-6">
          <CardResult title="Summarized Text" content={summary} testId="analysis-summary" />
          <CardResult title="Topics" content={topics} testId="analysis-topics" />
          <CardResult title="Sentiment" content={sentiment} testId="analysis-sentiment" />
        </div>
      </div>
    </div>
  )
}

export default Analysis
