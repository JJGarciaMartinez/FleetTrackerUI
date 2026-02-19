import { create } from 'zustand'
import { api } from '@lib/api.ts'
import type { Driver } from '@lib/types.ts'

interface DriverStore {
  drivers: Driver[] | null
  loading: boolean
  error: Error | null

  isFetching: boolean

  fetchDrivers: () => Promise<void>
  reset: () => void
}

const initialState = {
  drivers: null,
  loading: false,
  error: null,
  isFetching: false,
}

export const useDriversStore = create<DriverStore>((set) => ({
  ...initialState,

  fetchDrivers: async () => {
    set({
      loading: true,
      error: null,
      isFetching: true,
    })

    try {
      const { data } = await api.get<Driver[]>('/drivers', {})

      set({
        drivers: data,
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
