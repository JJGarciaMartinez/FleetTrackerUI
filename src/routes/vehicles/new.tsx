import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { JSX } from 'react'
import { useVehicles } from '@hooks/index.ts'
import InfoScreen from '@components/layout/infoScreen/InfoScreen.tsx'
import Header from '@components/layout/header/Header.tsx'
import VehicleNewForm, {
  type VehicleFormData,
} from '@components/vehicles/VehicleNewForm'
import { ChartBarIcon, SteeringWheelIcon } from '@phosphor-icons/react'
import { ConfirmDialog } from '@components/ui/modal'
import './VehicleDetail.css'

export default function VehicleNew(): JSX.Element {
  const navigate = useNavigate()
  const { createVehicle, loading } = useVehicles()

  const [hasChanges, setHasChanges] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const handleSave = async (data: VehicleFormData) => {
    try {
      await createVehicle(data)
      navigate('/vehicles')
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  }

  const handleCancelClick = () => {
    if (hasChanges) {
      setIsCancelDialogOpen(true)
    } else {
      navigate('/vehicles')
    }
  }

  const confirmCancel = () => {
    setIsCancelDialogOpen(false)
    navigate('/vehicles')
  }

  if (loading && !hasChanges) {
    return (
      <InfoScreen
        isLoading
        description={'Cargando formulario de nuevo vehículo'}
      />
    )
  }

  return (
    <div className="vehicle-detail">
      <Header title="Nuevo Vehículo">
        <Link to="/" className="link-button">
          <p>Dashboard</p>
          <ChartBarIcon size={18} />
        </Link>
        <Link to="/vehicles" className="link-button">
          <p>Vehículos</p>
          <SteeringWheelIcon size={18} />
        </Link>
      </Header>

      <VehicleNewForm
        onSave={handleSave}
        onCancel={handleCancelClick}
        isSaving={loading}
        onFieldChange={() => setHasChanges(true)}
      />

      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        title="Cancelar creación"
        description="Tienes cambios sin guardar. ¿Estás seguro de que deseas cancelar la creación del vehículo?"
        confirmText="Sí, cancelar"
        cancelText="Continuar editando"
        onConfirm={confirmCancel}
      />
    </div>
  )
}
