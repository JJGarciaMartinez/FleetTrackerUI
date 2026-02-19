import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { JSX } from 'react'
import { useVehicles } from '@hooks/index.ts'
import type { StatusVehicle, Vehicle } from '@lib/types.ts'
import InfoScreen from '@components/layout/infoScreen/InfoScreen.tsx'
import { Modal, ConfirmDialog } from '@components/ui/modal'
import VehicleEditForm from '@components/vehicles/VehicleEditForm'
import {
  VehicleGeneralInfo,
  VehicleMetrics,
  VehicleLocation,
  VehicleAssignment,
  VehicleStatusChange,
} from '@components/vehicles/vehicle-detail'
import './VehicleDetail.css'
import Header from '@components/layout/header/Header.tsx'
import {
  ChartBarIcon,
  PencilSimpleLineIcon,
  PlusCircleIcon,
  SteeringWheelIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react'

export default function VehicleDetail(): JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const {
    vehicle: vehicleData,
    loading,
    error,
    fetchVehicleById,
    updateVehicle,
    deleteVehicle,
  } = useVehicles()

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!id) return

    fetchVehicleById(id)
      .then((r) => r)
      .catch((e) => console.error('Error fetching vehicle:', e))
  }, [id, fetchVehicleById])

  useEffect(() => {
    if (vehicleData) {
      setVehicle(vehicleData || null)
    }
  }, [vehicleData, id])

  const handleStatusChange = async (status: StatusVehicle) => {
    if (!vehicle) return
    try {
      const updated = await updateVehicle(vehicle.id, { status })
      setVehicle(updated)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async () => {
    if (!vehicle) return
    try {
      await deleteVehicle(vehicle.id)
      setIsDeleteDialogOpen(false)
      navigate('/vehicles')
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  const handleSave = async (data: Partial<Vehicle>) => {
    if (!vehicle) return
    try {
      setIsSaving(true)
      const updated = await updateVehicle(vehicle.id, data)
      setVehicle(updated)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating vehicle:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <InfoScreen
        isLoading
        description={'Obteniendo la información del vehiculo'}
      />
    )
  }

  if (error) {
    return (
      <InfoScreen
        isError
        description={
          'Ocurrió un error al cargar la información del vehículo. Por favor, intenta nuevamente.'
        }
      />
    )
  }

  if (!vehicle) {
    return (
      <div className="not-found-container">
        <div className="not-found-text">Vehículo no encontrado</div>
        <Link to="/vehicles" className="btn-back">
          Volver al listado
        </Link>
      </div>
    )
  }

  return (
    <div className="vehicle-detail">
      <Header title={'Vehículos'}>
        <Link to="/" className="link-button">
          <p>Dashboard</p>
          <ChartBarIcon size={18} />
        </Link>
        <Link to="/vehicles" className="link-button">
          <p>Vehiculos</p>
          <SteeringWheelIcon size={18} />
        </Link>
        <Link to="/vehicles/new" className="link-button">
          <p>Nuevo Vehículo</p>
          <PlusCircleIcon size={18} />
        </Link>
      </Header>
      <header className="vehicle-detail__header">
        <div className="vehicle-detail__header-left">
          <h1 className="vehicle-detail__title">
            {vehicle.make} - {vehicle.model}
          </h1>
        </div>
        <div className="vehicle-detail__actions">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="vehicle-detail__btn vehicle-detail__btn--secondary"
          >
            <PencilSimpleLineIcon size={16} weight={'bold'} />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="vehicle-detail__btn vehicle-detail__btn--destructive"
          >
            <TrashSimpleIcon size={18} weight="bold" />
          </button>
        </div>
      </header>

      {/* Content grid */}
      <div className="vehicle-detail__grid">
        <VehicleGeneralInfo vehicle={vehicle} />
        <VehicleMetrics vehicle={vehicle} />
        <VehicleLocation vehicle={vehicle} />
        <VehicleAssignment vehicle={vehicle} />
      </div>

      {/* Status change section */}
      <VehicleStatusChange
        vehicle={vehicle}
        onStatusChange={handleStatusChange}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Vehículo"
        size="lg"
      >
        <VehicleEditForm
          vehicle={vehicle}
          onSave={handleSave}
          onCancel={() => setIsEditModalOpen(false)}
          isSaving={isSaving}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Eliminar Vehículo"
        description="¿Estás seguro de eliminar este vehículo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
