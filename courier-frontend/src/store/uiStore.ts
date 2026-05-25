import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coordinate } from "@/types/api";

type ActiveTab = "dashboard" | "couriers";

interface MapFocus {
  readonly coord: Coordinate;
  readonly ts: number;
}

interface UiState {
  readonly activeTab: ActiveTab;
  readonly sseConnected: boolean;
  readonly mapFocus: MapFocus | null;
  setActiveTab: (tab: ActiveTab) => void;
  setSseConnected: (v: boolean) => void;
  focusOnMap: (coord: Coordinate) => void;
  clearMapFocus: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      activeTab: "dashboard",
      sseConnected: false,
      mapFocus: null,
      setActiveTab: (activeTab) => set({ activeTab }),
      setSseConnected: (sseConnected) => set({ sseConnected }),
      focusOnMap: (coord) =>
        set({ mapFocus: { coord: { lat: coord.lat, lng: coord.lng }, ts: Date.now() } }),
      clearMapFocus: () => set({ mapFocus: null }),
    }),
    {
      name: "courier-tracking-ui",
      partialize: (state) => ({ activeTab: state.activeTab }),
    }
  )
);
