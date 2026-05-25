import { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GetRowIdParams, RowClickedEvent } from "ag-grid-community";
import { CalciteInput, CalciteLoader } from "@esri/calcite-components-react";
import { format } from "date-fns";
import { useCourierStore } from "@/store/courierStore";
import { gridDarkTheme } from "@/lib/agGrid";
import type { CourierDTO } from "@/types/api";

function NameCell({ data }: { data: CourierDTO }) {
  return (
    <div className="courier-name-cell">
      <span className="courier-name-cell__name">{data.name}</span>
    </div>
  );
}

function LocationCell({ data }: { data: CourierDTO }) {
  if (!data.lastLocation) return <span className="cell--muted">--</span>;
  return (
    <span className="courier-location-cell">
      {data.lastLocation.lat.toFixed(5)}, {data.lastLocation.lng.toFixed(5)}
    </span>
  );
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters.toFixed(0)} m`;
}

function DistanceCell({ data }: { data: CourierDTO }) {
  if (data.totalDistance == null) return <span className="cell--muted">--</span>;
  return (
    <span className="badge badge--warning">
      {formatDistance(data.totalDistance)}
    </span>
  );
}

function UpdatedCell({ data }: { data: CourierDTO }) {
  if (!data.lastUpdated) return <span className="cell--muted">--</span>;
  return (
    <span className="courier-updated-cell">
      {format(new Date(data.lastUpdated), "dd/MM HH:mm:ss")}
    </span>
  );
}

const COLUMN_DEFS: ColDef<CourierDTO>[] = [
  { headerName: "Courier", field: "name", flex: 1, minWidth: 160, cellRenderer: NameCell },
  { headerName: "Last Location", field: "lastLocation", width: 190, cellRenderer: LocationCell, sortable: false },
  { headerName: "Distance", field: "totalDistance", width: 120, cellRenderer: DistanceCell, sort: "desc" },
  { headerName: "Updated", field: "lastUpdated", width: 130, cellRenderer: UpdatedCell },
];

const DEFAULT_COL_DEF: ColDef = {
  sortable: true,
  resizable: true,
  suppressMovable: true,
  cellStyle: { display: "flex", alignItems: "center" },
};

export function CourierTable() {
  const couriersById = useCourierStore((s) => s.couriersById);
  const loading = useCourierStore((s) => s.loading);
  const searchQuery = useCourierStore((s) => s.searchQuery);
  const setSearchQuery = useCourierStore((s) => s.setSearchQuery);
  const selectedCourierId = useCourierStore((s) => s.selectedCourierId);
  const selectCourier = useCourierStore((s) => s.selectCourier);

  const couriers = useMemo(() => Object.values(couriersById), [couriersById]);

  const filtered = useMemo(() => {
    if (!searchQuery) return couriers;
    const q = searchQuery.toLowerCase();
    return couriers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
  }, [couriers, searchQuery]);

  const getRowId = useCallback((params: GetRowIdParams<CourierDTO>) => params.data.id, []);

  const onRowClicked = useCallback(
    (e: RowClickedEvent<CourierDTO>) => {
      const id = e.data?.id ?? null;
      selectCourier(id === selectedCourierId ? null : id);
    },
    [selectCourier, selectedCourierId]
  );

  const getRowClass = useCallback(
    (params: { data?: CourierDTO }) => {
      if (params.data?.id === selectedCourierId) return "ct-row-selected";
      return undefined;
    },
    [selectedCourierId]
  );

  const handleSearchInput = useCallback(
    (e: CustomEvent) => {
      setSearchQuery((e.target as HTMLInputElement).value);
    },
    [setSearchQuery]
  );

  if (loading && Object.keys(couriersById).length === 0) {
    return (
      <div className="courier-table__loader">
        <CalciteLoader label="Loading couriers" type="indeterminate" scale="m" />
      </div>
    );
  }

  return (
    <div className="courier-table">
      <div className="courier-table__search">
        <CalciteInput
          icon="search"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onCalciteInputInput={handleSearchInput}
          scale="s"
          clearable
        />
      </div>

      <div className="courier-table__grid">
        <AgGridReact<CourierDTO>
          theme={gridDarkTheme}
          containerStyle={{ width: "100%", height: "100%" }}
          rowData={filtered}
          columnDefs={COLUMN_DEFS}
          defaultColDef={DEFAULT_COL_DEF}
          getRowId={getRowId}
          onRowClicked={onRowClicked}
          getRowClass={getRowClass}
          suppressCellFocus
          suppressScrollOnNewData
        />
      </div>

      <div className="courier-table__footer">
        {filtered.length} of {couriers.length} couriers
      </div>
    </div>
  );
}
