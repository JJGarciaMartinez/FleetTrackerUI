import { useAlertsStore } from '@stores/alerts.ts'

export function useAlerts() {
  const alerts = useAlertsStore((state) => state.alerts)
  const loading = useAlertsStore((state) => state.loading)
  const error = useAlertsStore((state) => state.error)
  const fetchAlerts = useAlertsStore((state) => state.fetchAlerts)
  const markAsRead = useAlertsStore((state) => state.markAsRead)

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    markAsRead,
  }
}
