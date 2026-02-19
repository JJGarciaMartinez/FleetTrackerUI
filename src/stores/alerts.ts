import { create } from 'zustand'
import { api } from '@lib/api.ts'
import type { Alert } from '@lib/types.ts'

interface AlertStore {
  alerts: Alert[] | null
  loading: boolean
  error: Error | null
  isFetching: boolean

  fetchAlerts: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  reset: () => void
}

const initialState = {
  alerts: null,
  loading: false,
  error: null,
  isFetching: false,
}

export const useAlertsStore = create<AlertStore>((set, get) => ({
  ...initialState,

  fetchAlerts: async () => {
    set({
      loading: true,
      error: null,
      isFetching: true,
    })

    try {
      const { data } = await api.get<Alert[]>('/alerts', {})

      set({
        alerts: data,
        loading: false,
        isFetching: false,
      })
    } catch (error) {
      if (error instanceof Error && error.name !== 'CanceledError') {
        set({
          error: error as Error,
          loading: false,
          isFetching: false,
        })
      } else {
        set({ isFetching: false })
      }
    }
  },
  markAsRead: async (id: number) => {
    const previousAlerts = get().alerts

    set((state) => ({
      alerts:
        state.alerts?.map((alert) =>
          alert.id === id ? { ...alert, read: true } : alert,
        ) ?? null,
    }))

    try {
      await api.patch(`/alerts/${id}`, { read: true })
    } catch (error) {
      set({ alerts: previousAlerts })
      console.error('Failed to mark alert as read:', error)
    }
  },

  reset: () => set(initialState),
}))
