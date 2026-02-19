import { useEffect, useTransition, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { JSX } from 'react'
import { useVehicles } from '@hooks/index.ts'
import type { StatusVehicle, Vehicle, VehicleType } from '@lib/types.ts'
import {
  ChartBarIcon,
  PlusCircleIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react'
import Header from '@components/layout/header/Header.tsx'
import {
  SearchBar,
  Filters,
  Table,
  Pagination,
  type Column,
} from '@components/ui/index.ts'
import { ConfirmDialog } from '@components/ui/modal'
import './VehiclesList.css'
import InfoScreen from '@components/layout/infoScreen/InfoScreen.tsx'

export default function VehiclesList(): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)

  const {
    vehicles,
    loading,
    error,
    filters,
    pagination,
    fetchVehicles,
    setFilters,
    setPage,
    clearFilters,
    deleteVehicle,
  } = useVehicles()

  useEffect(() => {
    fetchVehicles()
      .then((r) => r)
      .catch((e) => console.error('Error fetching vehicles:', e))
  }, [fetchVehicles])

  const statusLabels: Record<StatusVehicle, string> = {
    active: 'Activo',
    maintenance: 'Mantenimiento',
    inactive: 'Inactivo',
  }

  const filterGroups = useMemo(
    () => [
      {
        label: 'Estado',
        name: 'status',
        value: filters.status,
        options: [
          { value: '', label: 'Todos' },
          { value: 'active', label: 'Activo' },
          { value: 'maintenance', label: 'Mantenimiento' },
          { value: 'inactive', label: 'Inactivo' },
        ],
      },
      {
        label: 'Tipo',
        name: 'type',
        value: filters.type,
        options: [
          { value: '', label: 'Todos' },
          { value: 'van', label: 'Van' },
          { value: 'truck', label: 'Camión' },
        ],
      },
    ],
    [filters.status, filters.type],
  )

  const columns: Column<Vehicle>[] = [
    { key: 'plate', label: 'Placa', className: 'table-cell--plate' },
    { key: 'make', label: 'Marca' },
    { key: 'model', label: 'Modelo' },
    { key: 'year', label: 'Año' },
    {
      key: 'type',
      label: 'Tipo',
      render: (_, row) => (row.type === 'van' ? 'Van' : 'Camión'),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_, row) => (
        <span className={`status-badge status-${row.status}`}>
          {statusLabels[row.status]}
        </span>
      ),
    },
    {
      key: 'mileage',
      label: 'Kilometraje',
      render: (value) => `${Number(value).toLocaleString()} km`,
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'table-cell--right',
      render: (_, row) => (
        <div className="action-buttons">
          <Link
            to={`/vehicles/${row.id}`}
            className="btn btn-small btn-secondary"
          >
            Ver
          </Link>
          <button
            onClick={() => handleDeleteClick(row)}
            className="btn btn-small btn-destructive"
            title="Eliminar vehículo"
          >
            <TrashSimpleIcon size={14} weight="bold" />
          </button>
        </div>
      ),
    },
  ]

  async function handleSearch(query: string) {
    startTransition(() => {
      setFilters({ q: query || undefined })
    })
  }

  async function handleFiltersSubmit(formData: FormData) {
    const status = formData.get('status') as StatusVehicle | null
    const type = formData.get('type') as VehicleType | null

    startTransition(() => {
      setFilters({
        status: status || undefined,
        type: type || undefined,
      })
    })
  }

  async function handlePageChange(page: number) {
    startTransition(() => {
      setPage(page)
    })
  }

  function handleDeleteClick(vehicle: Vehicle) {
    setVehicleToDelete(vehicle)
    setDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!vehicleToDelete) return

    try {
      await deleteVehicle(vehicleToDelete.id)
      setDeleteDialogOpen(false)
      setVehicleToDelete(null)
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  if (loading && !vehicles) {
    return (
      <InfoScreen
        isLoading
        description={'Cargando los vehículos. Por favor, espera un momento.'}
      />
    )
  }

  if (error) {
    return (
      <InfoScreen
        isError
        description={
          'Ocurrió un error al cargar los vehículos. Por favor, intenta nuevamente.'
        }
      />
    )
  }

  return (
    <div className="vehicles-page-container">
      <Header title={'Vehículos'}>
        <Link to="/" className="link-button">
          <p>Dashboard</p>
          <ChartBarIcon size={18} />
        </Link>
        <Link to="/vehicles/new" className="link-button">
          <p>Nuevo Vehículo</p>
          <PlusCircleIcon size={18} />
        </Link>
      </Header>

      <div className="filters-card">
        <SearchBar
          placeholder="Buscar por placa, marca o modelo..."
          defaultValue={filters.q}
          action={handleSearch}
          pending={isPending}
        />

        <Filters
          groups={filterGroups}
          action={handleFiltersSubmit}
          onClear={clearFilters}
          showClear={!!(filters.status || filters.type)}
          pending={isPending}
        />
      </div>

      <Table
        columns={columns}
        data={vehicles || []}
        rowKey={(vehicle) => vehicle.id}
        emptyMessage="No se encontraron vehículos"
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Eliminar Vehículo"
        description={
          vehicleToDelete
            ? `¿Estás seguro de eliminar el vehículo ${vehicleToDelete.plate} - ${vehicleToDelete.make} ${vehicleToDelete.model}? Esta acción no se puede deshacer.`
            : '¿Estás seguro de eliminar este vehículo? Esta acción no se puede deshacer.'
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  )
}
