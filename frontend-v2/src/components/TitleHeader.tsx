import type { CSSProperties } from 'react'

type Variant = 'h3' | 'h4' | 'h5' | 'h6' | 'body1'

const variantClasses: Record<Variant, string> = {
  h3: 'text-4xl',
  h4: 'text-3xl',
  h5: 'text-2xl',
  h6: 'text-xl',
  body1: 'text-base',
}

type TitleHeaderProps = {
  titleName: string
  variant?: Variant
  backgroundColor?: string
  color?: string
  pt?: number
  pb?: number
  testId?: string
}

const TitleHeader = ({
  titleName,
  variant = 'h3',
  backgroundColor = 'lavender',
  color = 'black',
  pt = 5,
  pb = 5,
  testId,
}: TitleHeaderProps) => {
  // MUI spacing units are 8px each; keep the original padding scale.
  const style: CSSProperties = {
    backgroundColor,
    color,
    paddingTop: pt * 8,
    paddingBottom: pb * 8,
  }
  return (
    <p
      className={`text-center font-normal ${variantClasses[variant]}`}
      style={style}
      data-testid={testId}
    >
      {titleName}
    </p>
  )
}

export default TitleHeader
