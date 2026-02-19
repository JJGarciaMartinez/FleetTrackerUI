import type { JSX } from 'react'
import type { Vehicle, StatusVehicle } from '@lib/types'
import './VehicleDetailSections.css'

interface Props {
  vehicle: Vehicle
}

const statusColors: Record<StatusVehicle, string> = {
  active: 'status-badge status-active',
  maintenance: 'status-badge status-maintenance',
  inactive: 'status-badge status-inactive',
}

const statusLabels: Record<StatusVehicle, string> = {
  active: 'Activo',
  maintenance: 'Mantenimiento',
  inactive: 'Inactivo',
}

export default function VehicleGeneralInfo({ vehicle }: Props): JSX.Element {
  return (
    <section className="detail-card">
      <h2 className="detail-card__title">Información General</h2>
      <div className="detail-card__content">
        <div className="detail-row">
          <span className="detail-row__label">Placa:</span>
          <span className="detail-row__value">{vehicle.plate}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Marca:</span>
          <span className="detail-row__value">{vehicle.make}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Modelo:</span>
          <span className="detail-row__value">{vehicle.model}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Año:</span>
          <span className="detail-row__value">{vehicle.year}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Tipo:</span>
          <span className="detail-row__value capitalize">
            {vehicle.type === 'van' ? 'Van' : 'Camión'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Estado:</span>
          <span className={statusColors[vehicle.status]}>
            {statusLabels[vehicle.status]}
          </span>
        </div>
      </div>
    </section>
  )
}
