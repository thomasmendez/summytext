import type { AnalysisData } from '../../types/analysisTypes.ts'

// Simulated body for POST /api/v1/predict. Typed (not cast) against the backend
// type so the compiler catches drift. Playwright asserts against this same
// fixture so mock and test never disagree.
const AnalysisMock: AnalysisData = {
  sentiment: 'Positive',
  topics: ['Technology', 'Science', 'Education'],
  summary:
    'Sum My Text turns long passages into a short, readable summary while also '
    + 'flagging the main topics and the overall emotional tone.',
}

export default AnalysisMock
