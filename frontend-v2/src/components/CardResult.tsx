type CardResultProps = {
  title?: string
  content?: string | string[]
  backgroundColor?: string
}

const CardResult = ({
  title = 'Title',
  content = ['Technology', 'History', 'Medicine'],
  backgroundColor = 'lavender',
}: CardResultProps) => {
  return (
    <div
      className="w-full rounded-md p-4 text-left shadow"
      style={{ backgroundColor }}
    >
      <p className="mb-1 text-sm text-gray-600">{title}</p>
      <p className="text-xl">
        {Array.isArray(content) ? content.join(', ') : content}
      </p>
    </div>
  )
}

export default CardResult
