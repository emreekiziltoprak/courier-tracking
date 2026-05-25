import type { LocationEventDTO } from "@/types/api";

const SSE_URL = "/api/v1/sse/stream";

export function createSseConnection(
  onLocation: (data: LocationEventDTO) => void,
  onError?: (err: Event) => void
): EventSource {
  const es = new EventSource(SSE_URL);

  es.addEventListener("location", (e: MessageEvent) => {
    try {
      const parsed = JSON.parse(e.data as string) as LocationEventDTO;
      onLocation(parsed);
    } catch {
    }
  });

  es.onerror = (err) => onError?.(err);
  return es;
}
