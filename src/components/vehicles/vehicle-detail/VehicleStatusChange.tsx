import type { JSX } from 'react'
import type { Vehicle, StatusVehicle } from '@lib/types'
import './VehicleDetailSections.css'

interface Props {
  vehicle: Vehicle
  onStatusChange: (status: StatusVehicle) => void
}

export default function VehicleStatusChange({
  vehicle,
  onStatusChange,
}: Props): JSX.Element {
  return (
    <section className="detail-card detail-card--status">
      <h2 className="detail-card__title">Cambiar Estado</h2>
      <div className="status-change-buttons">
        <button
          onClick={() => onStatusChange('active')}
          disabled={vehicle.status === 'active'}
          className="status-btn status-btn--active"
        >
          Activo
        </button>
        <button
          onClick={() => onStatusChange('maintenance')}
          disabled={vehicle.status === 'maintenance'}
          className="status-btn status-btn--maintenance"
        >
          Mantenimiento
        </button>
        <button
          onClick={() => onStatusChange('inactive')}
          disabled={vehicle.status === 'inactive'}
          className="status-btn status-btn--inactive"
        >
          Inactivo
        </button>
      </div>
    </section>
  )
}
