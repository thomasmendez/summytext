type TitleHeaderProps = {
  titleName: string
  className?: string
  testId?: string
}

// Background/color never vary across callers; size and padding come in via
// className (e.g. "text-3xl py-10").
const TitleHeader = ({ titleName, className = '', testId }: TitleHeaderProps) => {
  return (
    <p
      className={`bg-panel text-center font-normal text-black ${className}`}
      data-testid={testId}
    >
      {titleName}
    </p>
  )
}

export default TitleHeader
