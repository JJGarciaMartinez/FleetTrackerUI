import { useRoutesStore } from '@stores/routes.ts'

export function useRoutes() {
  const routes = useRoutesStore((state) => state.routes)
  const loading = useRoutesStore((state) => state.loading)
  const error = useRoutesStore((state) => state.error)
  const fetchRoutes = useRoutesStore((state) => state.fetchRoutes)

  return {
    routes,
    loading,
    error,
    fetchRoutes,
  }
}
