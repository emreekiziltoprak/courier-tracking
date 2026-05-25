import { api } from "./client";
import type { StoreDTO, StoreEntryLogDTO, LogsFilter } from "@/types/api";

export const storesApi = {
  getAll: () => api.get<StoreDTO[]>("/stores"),
  getLogs: (filter?: LogsFilter) => {
    const params = new URLSearchParams();
    if (filter?.courierId) params.set("courierId", filter.courierId);
    if (filter?.storeName) params.set("storeName", filter.storeName);
    if (filter?.from) params.set("from", filter.from);
    if (filter?.to) params.set("to", filter.to);
    const qs = params.toString();
    return api.get<StoreEntryLogDTO[]>(`/stores/logs${qs ? `?${qs}` : ""}`);
  },
} as const;
