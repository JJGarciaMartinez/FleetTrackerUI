import type { JSX } from 'react'
import type { Vehicle } from '@lib/types'
import './VehicleDetailSections.css'

interface Props {
  vehicle: Vehicle
}

export default function VehicleMetrics({ vehicle }: Props): JSX.Element {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <section className="detail-card">
      <h2 className="detail-card__title">Métricas</h2>
      <div className="detail-card__content">
        <div className="detail-row">
          <span className="detail-row__label">Kilometraje:</span>
          <span className="detail-row__value">
            {vehicle.mileage?.toLocaleString('es-ES')} km
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Nivel de combustible:</span>
          <span className="detail-row__value">{vehicle.fuelLevel}%</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Último mantenimiento:</span>
          <span className="detail-row__value">
            {formatDate(vehicle.lastMaintenance)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Fecha de creación:</span>
          <span className="detail-row__value">
            {formatDate(vehicle.createdAt)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Última actualización:</span>
          <span className="detail-row__value">
            {formatDate(vehicle.updatedAt)}
          </span>
        </div>
      </div>
    </section>
  )
}
