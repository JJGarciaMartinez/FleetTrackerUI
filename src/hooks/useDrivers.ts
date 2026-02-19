import { useDriversStore } from '@stores/drivers.ts'

export function useDrivers() {
  const drivers = useDriversStore((state) => state.drivers)
  const loading = useDriversStore((state) => state.loading)
  const error = useDriversStore((state) => state.error)
  const fetchDrivers = useDriversStore((state) => state.fetchDrivers)

  return {
    drivers,
    loading,
    error,
    fetchDrivers,
  }
}
