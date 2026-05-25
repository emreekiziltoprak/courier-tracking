import { useEffect } from "react";
import { useCourierStore } from "@/store/courierStore";
import { useStoreStore } from "@/store/storeStore";
import { useLogStore } from "@/store/logStore";
import { useUiStore } from "@/store/uiStore";

const LOG_POLL_MS = 10_000;
const COURIER_POLL_MS = 30_000;

export function useDataInit() {
  const fetchCouriers = useCourierStore((s) => s.fetchCouriers);
  const fetchDetail = useCourierStore((s) => s.fetchDetail);
  const selectedCourierId = useCourierStore((s) => s.selectedCourierId);
  const fetchStores = useStoreStore((s) => s.fetchStores);
  const fetchLogs = useLogStore((s) => s.fetchLogs);
  const sseConnected = useUiStore((s) => s.sseConnected);

  useEffect(() => {
    fetchCouriers();
    fetchStores();
    fetchLogs();

    if (selectedCourierId) {
      fetchDetail(selectedCourierId);
    }
  }, []);

  useEffect(() => {
    const logTimer = setInterval(fetchLogs, LOG_POLL_MS);
    const courierTimer = sseConnected
      ? undefined
      : setInterval(fetchCouriers, COURIER_POLL_MS);

    return () => {
      clearInterval(logTimer);
      if (courierTimer) clearInterval(courierTimer);
    };
  }, [sseConnected, fetchCouriers, fetchLogs]);
}
