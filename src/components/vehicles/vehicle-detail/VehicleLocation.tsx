import type { JSX } from 'react'
import type { Vehicle } from '@lib/types'
import './VehicleDetailSections.css'

interface Props {
  vehicle: Vehicle
}

export default function VehicleLocation({ vehicle }: Props): JSX.Element {
  return (
    <section className="detail-card">
      <h2 className="detail-card__title">Ubicación Actual</h2>
      <div className="detail-card__content">
        <div className="detail-row">
          <span className="detail-row__label">Dirección:</span>
          <span className="detail-row__value">
            {vehicle?.currentLocation
              ? vehicle?.currentLocation?.address
              : '---'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Latitud:</span>
          <span className="detail-row__value">
            {vehicle?.currentLocation
              ? vehicle?.currentLocation?.latitude
              : '---'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Longitud:</span>
          <span className="detail-row__value">
            {vehicle?.currentLocation
              ? vehicle?.currentLocation?.longitude
              : '---'}
          </span>
        </div>
      </div>
    </section>
  )
}
