import { useEffect, useRef } from "react";
import { createSseConnection } from "@/api/sse";
import { useCourierStore } from "@/store/courierStore";
import { useUiStore } from "@/store/uiStore";

interface LocationBuffer {
  readonly courierId: string;
  readonly lat: number;
  readonly lng: number;
}

const RECONNECT_DELAY_MS = 2000;

export function useSSE() {
  const batchUpdateLocations = useCourierStore((s) => s.batchUpdateLocations);
  const setSseConnected = useUiStore((s) => s.setSseConnected);
  const esRef = useRef<EventSource | null>(null);
  const bufferRef = useRef<LocationBuffer[]>([]);
  const rafRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let disposed = false;

    const flush = () => {
      if (bufferRef.current.length > 0) {
        batchUpdateLocations(bufferRef.current);
        bufferRef.current = [];
      }
      rafRef.current = requestAnimationFrame(flush);
    };
    rafRef.current = requestAnimationFrame(flush);

    const connect = () => {
      if (disposed) return;

      esRef.current = createSseConnection(
        (event) => {
          bufferRef.current.push({
            courierId: event.courierId,
            lat: event.coordinate.lat,
            lng: event.coordinate.lng,
          });
        },
        () => {
          setSseConnected(false);
          reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      );
      esRef.current.onopen = () => setSseConnected(true);
    };

    connect();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      esRef.current?.close();
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      setSseConnected(false);
    };
  }, [batchUpdateLocations, setSseConnected]);
}
