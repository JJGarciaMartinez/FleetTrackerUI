import type { JSX } from 'react'
import type { Vehicle } from '@lib/types'
import './VehicleDetailSections.css'

interface Props {
  vehicle: Vehicle
}

export default function VehicleAssignment({ vehicle }: Props): JSX.Element {
  return (
    <section className="detail-card">
      <h2 className="detail-card__title">Asignación</h2>
      <div className="detail-card__content">
        <div className="detail-row">
          <span className="detail-row__label">Conductor asignado:</span>
          <span className="detail-row__value">
            {vehicle.assignedDriverId
              ? `ID: ${vehicle.assignedDriverId}`
              : 'Sin asignar'}
          </span>
        </div>
      </div>
    </section>
  )
}
