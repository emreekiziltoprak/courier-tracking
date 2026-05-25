import { api } from "./client";
import type { CourierCreateDTO, CourierDTO, CourierDetailDTO } from "@/types/api";

export const couriersApi = {
  getAll: () => api.get<CourierDTO[]>("/couriers"),
  getById: (id: string) => api.get<CourierDTO>(`/couriers/${id}`),
  getDetail: (id: string) => api.get<CourierDetailDTO>(`/couriers/${id}/detail`),
  getDistance: (id: string) => api.get<number>(`/couriers/${id}/distance`),
  create: (dto: CourierCreateDTO) => api.post<CourierDTO>("/couriers", dto),
} as const;
