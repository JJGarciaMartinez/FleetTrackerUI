import { create } from 'zustand'
import { api } from '@lib/api.ts'
import type { Route } from '@lib/types.ts'

interface RouteStore {
  routes: Route[] | null
  loading: boolean
  error: Error | null
  isFetching: boolean

  fetchRoutes: () => Promise<void>
  reset: () => void
}

const initialState = {
  routes: null,
  loading: false,
  error: null,
  isFetching: false,
}

export const useRoutesStore = create<RouteStore>((set) => ({
  ...initialState,

  fetchRoutes: async () => {
    set({
      loading: true,
      error: null,
      isFetching: true,
    })

    try {
      const { data } = await api.get<Route[]>('/routes', {})

      set({
        routes: data,
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

  reset: () => set(initialState),
}))
