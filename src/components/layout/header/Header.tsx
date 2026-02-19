import type { JSX } from 'react'
import './Header.css'

interface Props {
  title: string
  children?: JSX.Element | JSX.Element[]
}

export default function Header({ title, children }: Props): JSX.Element {
  return (
    <>
      <div className="header-container">
        <span className="header__title">
          <h1>{title}</h1>
        </span>
        <span className="header__actions">{children}</span>
      </div>
    </>
  )
}
