import {
  type ChangeEvent,
  useTransition,
  useState,
  type FormEvent,
} from 'react'
import type { JSX } from 'react'
import type { VehicleType, StatusVehicle } from '@lib/types'
import './VehicleEditForm.css'

export interface VehicleFormData {
  plate: string
  make: string
  model: string
  year: number
  type: VehicleType
  status: StatusVehicle
  fuelLevel: number
  mileage: number
  assignedDriverId: number | null
  lastMaintenance: string
  currentLocation: {
    latitude: number
    longitude: number
    address: string
  }
}

interface Props {
  onSave: (data: VehicleFormData) => void | Promise<void>
  onCancel: () => void
  isSaving?: boolean
  onFieldChange?: () => void
}

interface FormErrors {
  plate?: string
  make?: string
  model?: string
  year?: string
  mileage?: string
  fuelLevel?: string
  address?: string
  latitude?: string
  longitude?: string
}

const getCurrentYear = () => new Date().getFullYear()
const currentYear = getCurrentYear()

// Default date - hoisted outside component
const getDefaultDate = () => new Date().toISOString().split('T')[0]

export default function VehicleNewForm({
  onSave,
  onCancel,
  isSaving = false,
  onFieldChange,
}: Props): JSX.Element {
  const [isPending, startTransition] = useTransition()

  // Form state - use lazy state init for derived values
  const [formData, setFormData] = useState<VehicleFormData>(() => ({
    plate: '',
    make: '',
    model: '',
    year: currentYear,
    type: 'van',
    status: 'active',
    fuelLevel: 100,
    mileage: 0,
    assignedDriverId: null,
    lastMaintenance: getDefaultDate(),
    currentLocation: {
      latitude: 0,
      longitude: 0,
      address: '',
    },
  }))

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof FormErrors, boolean>>({
    plate: false,
    make: false,
    model: false,
    year: false,
    mileage: false,
    fuelLevel: false,
    address: false,
    latitude: false,
    longitude: false,
  })

  // Validation function - hoisted outside render
  const validateField = (
    name: string,
    value: string | number,
  ): string | undefined => {
    switch (name) {
      case 'plate':
        if (
          !value ||
          (typeof value === 'string' && value.trim().length === 0)
        ) {
          return 'La placa es requerida'
        }
        if (typeof value === 'string' && value.length < 3) {
          return 'La placa debe tener al menos 3 caracteres'
        }
        return undefined
      case 'make':
        if (
          !value ||
          (typeof value === 'string' && value.trim().length === 0)
        ) {
          return 'La marca es requerida'
        }
        return undefined
      case 'model':
        if (
          !value ||
          (typeof value === 'string' && value.trim().length === 0)
        ) {
          return 'El modelo es requerido'
        }
        return undefined
      case 'year':
        const yearValue =
          typeof value === 'number' ? value : parseInt(value as string, 10)
        if (!value || isNaN(yearValue)) {
          return 'El año es requerido'
        }
        if (yearValue < 1900 || yearValue > currentYear + 1) {
          return `El año debe estar entre 1900 y ${currentYear + 1}`
        }
        return undefined
      case 'mileage':
        const mileageValue =
          typeof value === 'number' ? value : parseInt(value as string, 10)
        if (!value || isNaN(mileageValue) || mileageValue < 0) {
          return 'El kilometraje debe ser un número positivo'
        }
        return undefined
      case 'fuelLevel':
        const fuelValue =
          typeof value === 'number' ? value : parseInt(value as string, 10)
        if (typeof value !== 'number' || isNaN(fuelValue)) {
          return 'El nivel de combustible es requerido'
        }
        if (fuelValue < 0 || fuelValue > 100) {
          return 'El nivel debe estar entre 0 y 100'
        }
        return undefined
      case 'address':
        if (
          !value ||
          (typeof value === 'string' && value.trim().length === 0)
        ) {
          return 'La dirección es requerida'
        }
        return undefined
      case 'latitude':
      case 'longitude':
        const coordValue =
          typeof value === 'number' ? value : parseFloat(value as string)
        if (value === '' || isNaN(coordValue)) {
          return 'Coordenada inválida'
        }
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    onFieldChange?.()

    let convertedValue: string | number = value
    if (name === 'year' || name === 'mileage' || name === 'fuelLevel') {
      convertedValue = value === '' ? 0 : parseInt(value, 10)
    } else if (name === 'latitude' || name === 'longitude') {
      convertedValue = value === '' ? 0 : parseFloat(value)
    }

    setErrors((prev) => {
      const error = validateField(name, convertedValue)
      if (error === prev[name as keyof FormErrors]) {
        return prev
      }
      return { ...prev, [name]: error }
    })

    if (name === 'address') {
      setFormData((prev) => ({
        ...prev,
        currentLocation: { ...prev.currentLocation, address: value },
      }))
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData((prev) => ({
        ...prev,
        currentLocation: {
          ...prev.currentLocation,
          [name]: convertedValue as number,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: convertedValue }))
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate field
    const error = validateField(name, value)
    setErrors((prev) => {
      if (error === prev[name as keyof FormErrors]) {
        return prev
      }
      return { ...prev, [name]: error }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'currentLocation') {
        Object.entries(formData.currentLocation).forEach(
          ([locKey, locValue]) => {
            const error = validateField(locKey, locValue)
            if (error) {
              newErrors[locKey as keyof FormErrors] = error
            }
          },
        )
      } else if (key !== 'assignedDriverId') {
        const error = validateField(key, value as string | number)
        if (error) {
          newErrors[key as keyof FormErrors] = error
        }
      }
    })

    setErrors(newErrors)
    setTouched({
      plate: true,
      make: true,
      model: true,
      year: true,
      mileage: true,
      fuelLevel: true,
      address: true,
      latitude: true,
      longitude: true,
    })

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    startTransition(async () => {
      await onSave(formData)
    })
  }

  const isFormDisabled = isSaving || isPending

  return (
    <form onSubmit={handleSubmit} className="vehicle-edit-form">
      <div className="vehicle-edit-form__grid">
        {/* Placa */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="plate" className="vehicle-edit-form__label">
            Placa
          </label>
          <input
            type="text"
            id="plate"
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            className={`vehicle-edit-form__input ${
              touched.plate && errors.plate
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            placeholder="ABC-123"
            aria-invalid={touched.plate && !!errors.plate}
            aria-describedby={
              touched.plate && errors.plate ? 'plate-error' : undefined
            }
          />
          {touched.plate && errors.plate && (
            <span
              id="plate-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.plate}
            </span>
          )}
        </div>

        {/* Marca */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="make" className="vehicle-edit-form__label">
            Marca
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            className={`vehicle-edit-form__input ${
              touched.make && errors.make
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            placeholder="Toyota"
            aria-invalid={touched.make && !!errors.make}
            aria-describedby={
              touched.make && errors.make ? 'make-error' : undefined
            }
          />
          {touched.make && errors.make && (
            <span
              id="make-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.make}
            </span>
          )}
        </div>

        {/* Modelo */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="model" className="vehicle-edit-form__label">
            Modelo
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            className={`vehicle-edit-form__input ${
              touched.model && errors.model
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            placeholder="Corolla"
            aria-invalid={touched.model && !!errors.model}
            aria-describedby={
              touched.model && errors.model ? 'model-error' : undefined
            }
          />
          {touched.model && errors.model && (
            <span
              id="model-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.model}
            </span>
          )}
        </div>

        {/* Año */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="year" className="vehicle-edit-form__label">
            Año
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            min="1900"
            max={currentYear + 1}
            className={`vehicle-edit-form__input ${
              touched.year && errors.year
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            aria-invalid={touched.year && !!errors.year}
            aria-describedby={
              touched.year && errors.year ? 'year-error' : undefined
            }
          />
          {touched.year && errors.year && (
            <span
              id="year-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.year}
            </span>
          )}
        </div>

        {/* Tipo */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="type" className="vehicle-edit-form__label">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isFormDisabled}
            className="vehicle-edit-form__input"
          >
            <option value="van">Van</option>
            <option value="truck">Camión</option>
          </select>
        </div>

        {/* Estado */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="status" className="vehicle-edit-form__label">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isFormDisabled}
            className="vehicle-edit-form__input"
          >
            <option value="active">Activo</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        {/* Kilometraje */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="mileage" className="vehicle-edit-form__label">
            Kilometraje (km)
          </label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            min="0"
            className={`vehicle-edit-form__input ${
              touched.mileage && errors.mileage
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            aria-invalid={touched.mileage && !!errors.mileage}
            aria-describedby={
              touched.mileage && errors.mileage ? 'mileage-error' : undefined
            }
          />
          {touched.mileage && errors.mileage && (
            <span
              id="mileage-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.mileage}
            </span>
          )}
        </div>

        {/* Nivel de combustible */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="fuelLevel" className="vehicle-edit-form__label">
            Nivel de combustible (%)
          </label>
          <input
            type="number"
            id="fuelLevel"
            name="fuelLevel"
            value={formData.fuelLevel}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            min="0"
            max="100"
            className={`vehicle-edit-form__input ${
              touched.fuelLevel && errors.fuelLevel
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            aria-invalid={touched.fuelLevel && !!errors.fuelLevel}
            aria-describedby={
              touched.fuelLevel && errors.fuelLevel
                ? 'fuelLevel-error'
                : undefined
            }
          />
          {touched.fuelLevel && errors.fuelLevel && (
            <span
              id="fuelLevel-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.fuelLevel}
            </span>
          )}
        </div>

        {/* Último mantenimiento */}
        <div className="vehicle-edit-form__field vehicle-edit-form__field--full">
          <label htmlFor="lastMaintenance" className="vehicle-edit-form__label">
            Último mantenimiento
          </label>
          <input
            type="date"
            id="lastMaintenance"
            name="lastMaintenance"
            value={formData.lastMaintenance}
            onChange={handleChange}
            disabled={isFormDisabled}
            className="vehicle-edit-form__input"
          />
        </div>

        {/* Ubicación section header */}
        <div className="vehicle-edit-form__field vehicle-edit-form__field--full">
          <h3 className="vehicle-edit-form__section-title">Ubicación</h3>
        </div>

        {/* Dirección */}
        <div className="vehicle-edit-form__field vehicle-edit-form__field--full">
          <label htmlFor="address" className="vehicle-edit-form__label">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.currentLocation.address}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            className={`vehicle-edit-form__input ${
              touched.address && errors.address
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            placeholder="Calle 123, Ciudad"
            aria-invalid={touched.address && !!errors.address}
            aria-describedby={
              touched.address && errors.address ? 'address-error' : undefined
            }
          />
          {touched.address && errors.address && (
            <span
              id="address-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.address}
            </span>
          )}
        </div>

        {/* Latitud */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="latitude" className="vehicle-edit-form__label">
            Latitud
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            step="any"
            value={formData.currentLocation.latitude}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            className={`vehicle-edit-form__input ${
              touched.latitude && errors.latitude
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            aria-invalid={touched.latitude && !!errors.latitude}
            aria-describedby={
              touched.latitude && errors.latitude ? 'latitude-error' : undefined
            }
          />
          {touched.latitude && errors.latitude && (
            <span
              id="latitude-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.latitude}
            </span>
          )}
        </div>

        {/* Longitud */}
        <div className="vehicle-edit-form__field">
          <label htmlFor="longitude" className="vehicle-edit-form__label">
            Longitud
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            step="any"
            value={formData.currentLocation.longitude}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            className={`vehicle-edit-form__input ${
              touched.longitude && errors.longitude
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
            aria-invalid={touched.longitude && !!errors.longitude}
            aria-describedby={
              touched.longitude && errors.longitude
                ? 'longitude-error'
                : undefined
            }
          />
          {touched.longitude && errors.longitude && (
            <span
              id="longitude-error"
              className="vehicle-edit-form__error"
              role="alert"
            >
              {errors.longitude}
            </span>
          )}
        </div>
      </div>

      {/* Form actions */}
      <div className="vehicle-edit-form__actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={isFormDisabled}
          className="vehicle-edit-form__btn vehicle-edit-form__btn--secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isFormDisabled}
          className="vehicle-edit-form__btn vehicle-edit-form__btn--primary"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
