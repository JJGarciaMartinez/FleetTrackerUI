import { useVehiclesStore } from '@stores/vehicles.ts'

export function useVehicles() {
  const vehicle = useVehiclesStore((state) => state.vehicle)
  const vehicles = useVehiclesStore((state) => state.vehicles)
  const loading = useVehiclesStore((state) => state.loading)
  const error = useVehiclesStore((state) => state.error)
  const filters = useVehiclesStore((state) => state.filters)
  const pagination = useVehiclesStore((state) => state.pagination)

  const fetchVehicleById = useVehiclesStore((state) => state.fetchVehicleById)
  const fetchVehicles = useVehiclesStore((state) => state.fetchVehicles)
  const setFilters = useVehiclesStore((state) => state.setFilters)
  const setPage = useVehiclesStore((state) => state.setPage)
  const clearFilters = useVehiclesStore((state) => state.clearFilters)

  const createVehicle = useVehiclesStore((state) => state.createVehicle)
  const updateVehicle = useVehiclesStore((state) => state.updateVehicle)
  const deleteVehicle = useVehiclesStore((state) => state.deleteVehicle)

  return {
    vehicle,
    vehicles,
    loading,
    error,
    filters,
    pagination,
    fetchVehicles,
    setFilters,
    setPage,
    clearFilters,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    fetchVehicleById,
  }
}
