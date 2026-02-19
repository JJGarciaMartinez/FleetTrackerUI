import { create } from 'zustand'
import { api } from '@lib/api.ts'
import type { StatusVehicle, Vehicle, VehicleType } from '@lib/types.ts'

interface VehicleFilters {
  q?: string
  status?: StatusVehicle
  type?: VehicleType
}

interface PaginationState {
  page: number
  limit: number
  items: number
  pages: number
}

interface VehicleStore {
  vehicles: Vehicle[] | null
  vehicle: Vehicle | null
  loading: boolean
  error: Error | null
  filters: VehicleFilters
  pagination: PaginationState
  isFetching: boolean

  fetchVehicles: () => Promise<void>
  fetchVehicleById: (id: string) => Promise<Vehicle | undefined>
  setFilters: (filters: VehicleFilters) => void
  setPage: (page: number) => void
  clearFilters: () => void

  createVehicle: (
    vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Vehicle>
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => Promise<Vehicle>
  deleteVehicle: (id: number) => Promise<void>

  reset: () => void
}

interface VehiclesResponse {
  first: number
  items: number
  last: number
  next: number | null
  pages: number
  prev: number | null
  data: Vehicle[]
}

const initialState = {
  vehicle: null,
  vehicles: null,
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 1, limit: 10, items: 0, pages: 0 },
  isFetching: false,
}

export const useVehiclesStore = create<VehicleStore>((set, get) => ({
  ...initialState,

  fetchVehicles: async () => {
    const { filters, pagination } = get()

    set({
      loading: true,
      error: null,
      isFetching: true,
    })

    try {
      let querySearch = ''

      const params: Record<string, string> = {
        _page: pagination.page.toString(),
        _per_page: pagination.limit.toString(),
      }

      if (filters.q) {
        querySearch = `?plate=${filters.q}`
      }

      if (filters.status) params.status = filters.status
      if (filters.type) params.type = filters.type

      const { data } = await api.get<VehiclesResponse>(
        `/vehicles${querySearch}`,
        {
          params,
        },
      )

      const items = data.items ?? data.data?.length ?? 0
      const pages = data?.pages ?? 0

      set({
        vehicles: data.data,
        pagination: { ...pagination, items, pages },
        loading: false,
        isFetching: false,
      })
    } catch (error) {
      if (error instanceof Error && error.name !== 'CanceledError') {
        set({ error: error as Error })
      } else {
        set({ isFetching: false })
      }
    } finally {
      set({ loading: false, isFetching: false })
    }
  },

  fetchVehicleById: async (id: string) => {
    set({
      loading: true,
      error: null,
      isFetching: true,
    })

    try {
      const { data } = await api.get<Vehicle>(`/vehicles/${id}`)
      set({ loading: false, isFetching: false, vehicle: data })
      return data
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error)
    } finally {
      set({ loading: false, isFetching: false })
    }
  },

  setFilters: (filters: VehicleFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    }))
    get()
      .fetchVehicles()
      .then((r) => r)
      .catch((e) => console.error('Error fetching vehicles:', e))
  },

  setPage: (page: number) => {
    set((state) => ({ pagination: { ...state.pagination, page } }))
    get()
      .fetchVehicles()
      .then((r) => r)
      .catch((e) => console.error('Error fetching vehicles:', e))
  },

  clearFilters: () => {
    set((state) => ({
      filters: {},
      pagination: { ...state.pagination, page: 1 },
    }))
    get()
      .fetchVehicles()
      .then((r) => r)
      .catch((e) => console.error('Error fetching vehicles:', e))
  },

  createVehicle: async (vehicle) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post<Vehicle>('/vehicles', vehicle)
      set((state) => ({
        vehicles: [...(state.vehicles || []), data],
        loading: false,
      }))
      return data
    } catch (error) {
      set({ error: error as Error, loading: false })
      throw error
    }
  },

  updateVehicle: async (id, vehicle) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.patch<Vehicle>(`/vehicles/${id}`, vehicle)
      set(() => ({
        loading: false,
      }))
      return data
    } catch (error) {
      set({ error: error as Error, loading: false })
      throw error
    }
  },

  deleteVehicle: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/vehicles/${id}`)
      set((state) => {
        const newItems = state.pagination.items - 1
        const newPages = Math.ceil(newItems / state.pagination.limit)
        return {
          vehicles: state.vehicles?.filter((v) => v.id !== id) ?? null,
          loading: false,
          pagination: {
            ...state.pagination,
            items: newItems,
            pages: newPages,
          },
        }
      })
    } catch (error) {
      set({ error: error as Error, loading: false })
      throw error
    }
  },

  reset: () => set(initialState),
}))
