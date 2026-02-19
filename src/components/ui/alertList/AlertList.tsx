import type { JSX } from 'react'
import type { Alert } from '@lib/types.ts'
import AlertCard from '../alertCard/AlertCard.tsx'
import './AlertList.css'

interface Props {
  alerts: Alert[]
  maxItems?: number
  onMarkAsRead: (id: number) => void
}

export default function AlertList({
  alerts,
  maxItems = 5,
  onMarkAsRead,
}: Props): JSX.Element | null {
  if (!alerts || alerts.length === 0) {
    return null
  }

  return (
    <div className="alert-list">
      <h2 className="alert-list__title">Alertas Recientes</h2>
      <ul className="alert-list__items">
        {alerts.slice(0, maxItems).map((alert) => (
          <AlertCard
            key={alert.id}
            id={alert.id}
            message={alert.message}
            read={alert.read}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </ul>
    </div>
  )
}
