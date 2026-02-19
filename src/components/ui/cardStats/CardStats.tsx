import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import './CardStats.css'

interface Props {
  title: string
  value: number
  subtitle?: string | JSX.Element
  linkTo?: string
  disabled?: boolean
}

export default function CardStats({
  title,
  value,
  subtitle,
  linkTo,
  disabled = false,
}: Props): JSX.Element {
  const content = (
    <div className={`card-stats ${disabled ? 'card-stats--disabled' : ''}`}>
      <div className="card-stats__title">{title}</div>
      <div className="card-stats__value">{value}</div>
      <div className="card-stats__subtitle">{subtitle}</div>
    </div>
  )

  if (linkTo && !disabled) {
    return (
      <Link to={linkTo} className="card-stats-link">
        {content}
      </Link>
    )
  }

  return content
}
