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
    <div className="min-h-[75vh] bg-[lavender]">
      <TitleHeader
        titleName={`${errorCode} ${message}`}
        variant="h4"
        backgroundColor="#b5ecf5"
      />
    </div>
  )
}

export default ErrorView
