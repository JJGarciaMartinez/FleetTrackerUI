import {
  type ChangeEvent,
  useTransition,
  useState,
  type FormEvent,
} from 'react'
import type { JSX } from 'react'
import type { Vehicle } from '@lib/types'
import './VehicleEditForm.css'

interface Props {
  vehicle: Vehicle
  onSave: (data: Partial<Vehicle>) => void | Promise<void>
  onCancel: () => void
  isSaving?: boolean
}

interface FormErrors {
  plate?: string
  make?: string
  model?: string
  year?: string
  mileage?: string
  fuelLevel?: string
  address?: string
}

export default function VehicleEditForm({
  vehicle,
  onSave,
  onCancel,
  isSaving = false,
}: Props): JSX.Element {
  const [isPending, startTransition] = useTransition()

  // Form state - use lazy state init for derived values
  const [formData, setFormData] = useState(() => ({
    plate: vehicle.plate,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuelLevel: vehicle.fuelLevel,
    address: vehicle.currentLocation ? vehicle.currentLocation.address : '',
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
        const currentYear = new Date().getFullYear()
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
      default:
        return undefined
    }
  }

  // Handle input change - using functional setState for stable callbacks
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    const numericValue =
      name === 'year' || name === 'mileage' || name === 'fuelLevel'
        ? value === ''
          ? 0
          : parseInt(value, 10)
        : value

    setErrors((prev) => {
      const error = validateField(name, numericValue)
      if (error === prev[name as keyof FormErrors]) {
        return prev
      }
      return { ...prev, [name]: error }
    })

    setFormData((prev) => ({ ...prev, [name]: numericValue }))
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setTouched((prev) => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setErrors((prev) => {
      if (error === prev[name as keyof FormErrors]) {
        return prev
      }
      return { ...prev, [name]: error }
    })
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof FormErrors] = error
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
    })

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    startTransition(async () => {
      await onSave({
        plate: formData.plate,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        fuelLevel: formData.fuelLevel,
        currentLocation: {
          ...vehicle.currentLocation,
          address: formData.address,
        },
      })
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
            max={new Date().getFullYear() + 1}
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

        {/* Dirección */}
        <div className="vehicle-edit-form__field vehicle-edit-form__field--full">
          <label htmlFor="address" className="vehicle-edit-form__label">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isFormDisabled}
            className={`vehicle-edit-form__input ${
              touched.address && errors.address
                ? 'vehicle-edit-form__input--error'
                : ''
            }`}
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
