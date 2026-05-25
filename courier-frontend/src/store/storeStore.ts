import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreDTO } from "@/types/api";
import { storesApi } from "@/api/stores";

interface StoreState {
  readonly stores: readonly StoreDTO[];
  readonly loading: boolean;
  readonly error: string | null;
  fetchStores: () => Promise<void>;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      stores: [],
      loading: false,
      error: null,

      fetchStores: async () => {
        set({ loading: true, error: null });
        try {
          const stores = await storesApi.getAll();
          set({ stores, loading: false });
        } catch (e) {
          set({ error: String(e), loading: false });
        }
      },
    }),
    {
      name: "courier-tracking-stores",
      partialize: (state) => ({ stores: state.stores }),
    }
  )
);
