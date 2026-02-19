import type { JSX } from 'react'
import './AlertCard.css'
import { ChecksIcon } from '@phosphor-icons/react'

interface Props {
  id: number
  message: string
  read: boolean
  onMarkAsRead: (id: number) => void
}

export default function AlertCard({
  id,
  message,
  read,
  onMarkAsRead,
}: Props): JSX.Element {
  return (
    <li className={`alert-card ${read ? 'alert-card--read' : ''}`}>
      <span className="alert-card__message">{message}</span>
      {read ? (
        <>
          <ChecksIcon size={25} />
        </>
      ) : (
        <button onClick={() => onMarkAsRead(id)} className="alert-card__button">
          Marcar como leído
        </button>
      )}
    </li>
  )
}
