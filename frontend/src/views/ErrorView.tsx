import { useEffect } from 'react'
import TitleHeader from '../components/TitleHeader'

type ErrorViewProps = {
  errorCode: number
}

const ErrorView = ({ errorCode }: ErrorViewProps) => {
  useEffect(() => {
    document.title = `${errorCode} | Sum My Text`
  }, [errorCode])

  const message = errorCode === 404 ? 'Not Found' : ''

  return (
    <div className="min-h-[75vh] bg-lavender" data-testid="error-view">
      <TitleHeader
        titleName={`${errorCode} ${message}`}
        className="text-3xl py-10"
        testId="error-title"
      />
    </div>
  )
}

export default ErrorView
