import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreEntryLogDTO, LogsFilter } from "@/types/api";
import { storesApi } from "@/api/stores";

const MAX_PERSISTED_LOGS = 500;

interface LogState {
  readonly logs: readonly StoreEntryLogDTO[];
  readonly filter: LogsFilter;
  readonly loading: boolean;
  readonly error: string | null;
  setFilter: (filter: Partial<LogsFilter>) => void;
  clearFilter: () => void;
  fetchLogs: () => Promise<void>;
}

export const useLogStore = create<LogState>()(
  persist(
    (set, get) => ({
      logs: [],
      filter: {},
      loading: false,
      error: null,

      setFilter: (partial: Partial<LogsFilter>) => {
        set((s) => ({ filter: { ...s.filter, ...partial } }));
      },

      clearFilter: () => set({ filter: {} }),

      fetchLogs: async () => {
        const hadLogs = get().logs.length > 0;
        if (!hadLogs) set({ loading: true });
        set({ error: null });
        try {
          const logs = await storesApi.getLogs(get().filter);
          set({ logs, loading: false });
        } catch (e) {
          set({ error: String(e), loading: false });
        }
      },
    }),
    {
      name: "courier-tracking-logs",
      partialize: (state) => ({
        filter: state.filter,
        logs: state.logs.slice(0, MAX_PERSISTED_LOGS),
      }),
    }
  )
);
