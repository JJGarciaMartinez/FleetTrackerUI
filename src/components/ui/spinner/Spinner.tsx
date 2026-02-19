import type { JSX } from 'react'
import { SpinnerIcon } from '@phosphor-icons/react'
import './Spinner.css'

export default function Spinner({ size = 32 }): JSX.Element {
  return (
    <div className="spinner" style={{ width: size, height: size }}>
      <SpinnerIcon size={size} />
    </div>
  )
}
