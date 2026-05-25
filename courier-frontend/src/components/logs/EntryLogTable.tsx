import { useRef, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, RowClickedEvent, GridReadyEvent, GridApi } from "ag-grid-community";
import { format } from "date-fns";
import { useLogStore } from "@/store/logStore";
import { useUiStore } from "@/store/uiStore";
import { useCourierStore } from "@/store/courierStore";
import { gridDarkThemeLogs } from "@/lib/agGrid";
import type { StoreEntryLogDTO } from "@/types/api";

function TimeCell({ data }: { data: StoreEntryLogDTO }) {
  return (
    <span className="entry-log-time-cell">
      {format(new Date(data.entryTime), "dd/MM HH:mm:ss")}
    </span>
  );
}

function CourierCell({ data }: { data: StoreEntryLogDTO }) {
  const courier = useCourierStore((s) => s.couriersById[data.courierId]);
  const name = courier?.name ?? data.courierId;
  return (
    <span className="entry-log-courier-cell">{name}</span>
  );
}

function StoreCell({ data }: { data: StoreEntryLogDTO }) {
  return (
    <span className="badge badge--brand" title={data.storeName}>
      {data.storeName}
    </span>
  );
}

export function EntryLogTable() {
  const gridRef = useRef<AgGridReact<StoreEntryLogDTO>>(null);
  const apiRef = useRef<GridApi<StoreEntryLogDTO> | null>(null);
  const prevLogsRef = useRef<readonly StoreEntryLogDTO[]>([]);
  const focusOnMap = useUiStore((s) => s.focusOnMap);

  const onGridReady = useCallback((e: GridReadyEvent<StoreEntryLogDTO>) => {
    apiRef.current = e.api;
    const logs = useLogStore.getState().logs;
    prevLogsRef.current = logs;
    e.api.setGridOption("rowData", logs as StoreEntryLogDTO[]);
  }, []);

  useEffect(() => {
    return useLogStore.subscribe((state) => {
      const api = apiRef.current;
      if (!api) return;

      const newLogs = state.logs;
      const oldLogs = prevLogsRef.current;
      if (newLogs === oldLogs) return;

      const oldMap = new Map(oldLogs.map((l) => [l.id, l]));
      const newMap = new Map(newLogs.map((l) => [l.id, l]));

      const add: StoreEntryLogDTO[] = [];
      const update: StoreEntryLogDTO[] = [];
      const remove: StoreEntryLogDTO[] = [];

      for (const log of newLogs) {
        if (!oldMap.has(log.id)) add.push(log);
        else if (oldMap.get(log.id) !== log) update.push(log);
      }

      for (const log of oldLogs) {
        if (!newMap.has(log.id)) remove.push(log);
      }

      if (add.length || update.length || remove.length) {
        api.applyTransaction({ add, update, remove });
      }

      prevLogsRef.current = newLogs;
    });
  }, []);

  const onRowClicked = useCallback(
    (e: RowClickedEvent<StoreEntryLogDTO>) => {
      if (e.data) focusOnMap(e.data.storeLocation);
    },
    [focusOnMap]
  );

  const colDefs = useMemo<ColDef<StoreEntryLogDTO>[]>(
    () => [
      { headerName: "Time", field: "entryTime", width: 120, cellRenderer: TimeCell, sort: "desc" },
      { headerName: "Courier", field: "courierId", flex: 1, minWidth: 120, cellRenderer: CourierCell },
      { headerName: "Store", field: "storeName", flex: 1, minWidth: 100, cellRenderer: StoreCell },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      suppressMovable: true,
      cellStyle: { display: "flex", alignItems: "center" },
    }),
    []
  );

  const getRowId = useCallback(
    (params: { data: StoreEntryLogDTO }) => params.data.id,
    []
  );

  return (
    <div className="entry-log">
      <AgGridReact<StoreEntryLogDTO>
        ref={gridRef}
        theme={gridDarkThemeLogs}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        getRowId={getRowId}
        suppressCellFocus
        suppressScrollOnNewData
      />
    </div>
  );
}
