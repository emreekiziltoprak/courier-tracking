import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CourierDTO, CourierDetailDTO } from "@/types/api";
import { couriersApi } from "@/api/couriers";

interface LocationUpdate {
  readonly courierId: string;
  readonly lat: number;
  readonly lng: number;
}

interface CourierState {
  readonly couriersById: Readonly<Record<string, CourierDTO>>;
  readonly selectedCourierId: string | null;
  readonly courierDetail: CourierDetailDTO | null;
  readonly loading: boolean;
  readonly detailLoading: boolean;
  readonly error: string | null;
  readonly searchQuery: string;
  fetchCouriers: () => Promise<void>;
  fetchDetail: (id: string) => Promise<void>;
  selectCourier: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  updateCourierLocation: (courierId: string, lat: number, lng: number) => void;
  batchUpdateLocations: (updates: readonly LocationUpdate[]) => void;
}

export const selectCouriersArray = (s: CourierState): CourierDTO[] =>
  Object.values(s.couriersById);

export const selectCourierById = (id: string) => (s: CourierState) =>
  s.couriersById[id] as CourierDTO | undefined;

export const useCourierStore = create<CourierState>()(
  persist(
    (set, get) => ({
      couriersById: {},
      selectedCourierId: null,
      courierDetail: null,
      loading: false,
      detailLoading: false,
      error: null,
      searchQuery: "",

      fetchCouriers: async () => {
        set({ loading: true, error: null });
        try {
          const list = await couriersApi.getAll();
          const byId: Record<string, CourierDTO> = {};
          for (const c of list) byId[c.id] = c;
          set({ couriersById: byId, loading: false });
        } catch (e) {
          set({ error: String(e), loading: false });
        }
      },

      fetchDetail: async (id: string) => {
        set({ detailLoading: true });
        try {
          const detail = await couriersApi.getDetail(id);
          set({ courierDetail: detail, detailLoading: false });
        } catch (e) {
          set({ error: String(e), detailLoading: false });
        }
      },

      selectCourier: (id: string | null) => {
        set({ selectedCourierId: id, courierDetail: null });
        if (id) get().fetchDetail(id);
      },

      setSearchQuery: (searchQuery: string) => set({ searchQuery }),

      updateCourierLocation: (courierId, lat, lng) => {
        set((state) => {
          const existing = state.couriersById[courierId];
          if (!existing) return state;
          return {
            couriersById: {
              ...state.couriersById,
              [courierId]: {
                ...existing,
                lastLocation: { lat, lng },
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      batchUpdateLocations: (updates) => {
        set((state) => {
          const newById = { ...state.couriersById };
          let changed = false;
          const now = new Date().toISOString();
          for (const { courierId, lat, lng } of updates) {
            const existing = newById[courierId];
            if (!existing) continue;
            newById[courierId] = {
              ...existing,
              lastLocation: { lat, lng },
              lastUpdated: now,
            };
            changed = true;
          }
          return changed ? { couriersById: newById } : state;
        });
      },
    }),
    {
      name: "courier-tracking-couriers",
      partialize: (state) => ({
        couriersById: state.couriersById,
        selectedCourierId: state.selectedCourierId,
        searchQuery: state.searchQuery,
      }),
    }
  )
);
