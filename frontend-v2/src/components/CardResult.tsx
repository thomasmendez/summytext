type CardResultProps = {
  title: string
  content: string | string[]
  testId?: string
}

const CardResult = ({ title, content, testId }: CardResultProps) => {
  return (
    <div className="w-full rounded-md bg-panel p-4 text-left shadow">
      <p className="mb-1 text-sm text-gray-600">{title}</p>
      <p className="text-xl" data-testid={testId}>
        {Array.isArray(content) ? content.join(', ') : content}
      </p>
    </div>
  )
}

export default CardResult
