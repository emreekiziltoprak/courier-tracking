import { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GetRowIdParams, RowClickedEvent } from "ag-grid-community";
import { CalciteLoader, CalciteNotice } from "@esri/calcite-components-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCourierStore } from "@/store/courierStore";
import { useUiStore } from "@/store/uiStore";
import { gridDarkThemeCompact } from "@/lib/agGrid";
import { MiniMap } from "@/components/map/MiniMap";
import type { StoreEntryLogDTO } from "@/types/api";

function StoreTag({ value }: { readonly value: string }) {
  return (
    <span className="badge badge--brand" title={value}>
      {value}
    </span>
  );
}

function Stat({ label, value, accent }: { readonly label: string; readonly value: string; readonly accent?: string }) {
  return (
    <div className="stat">
      <div className="stat__label">
        {label}
      </div>
      <div className={`stat__value ${accent ? "stat__value--accent" : "stat__value--mono"}`}>
        {value}
      </div>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${meters.toFixed(0)} m`;
}

export function CourierDetailPanel() {
  const selectedId = useCourierStore((s) => s.selectedCourierId);
  const detail = useCourierStore((s) => s.courierDetail);
  const loading = useCourierStore((s) => s.detailLoading);
  const focusOnMap = useUiStore((s) => s.focusOnMap);
  const navigate = useNavigate();

  const onEntryClicked = useCallback(
    (e: RowClickedEvent<StoreEntryLogDTO>) => {
      if (e.data) {
        focusOnMap(e.data.storeLocation);
        navigate("/dashboard");
      }
    },
    [focusOnMap, navigate]
  );

  const colDefs = useMemo<ColDef<StoreEntryLogDTO>[]>(
    () => [
      {
        headerName: "Time", field: "entryTime", width: 120, sort: "desc",
        cellRenderer: ({ data }: { data: StoreEntryLogDTO }) => (
          <span className="entry-log-time-cell">
            {format(new Date(data.entryTime), "dd/MM HH:mm:ss")}
          </span>
        ),
      },
      {
        headerName: "Store", field: "storeName", flex: 1, minWidth: 100,
        cellRenderer: ({ value }: { value: string }) => <StoreTag value={value} />,
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({ sortable: true, resizable: true, suppressMovable: true, cellStyle: { display: "flex", alignItems: "center" } }),
    []
  );

  const getRowId = useCallback((params: GetRowIdParams<StoreEntryLogDTO>) => params.data.id, []);

  if (!selectedId) {
    return (
      <div className="courier-detail__empty">
        <CalciteNotice open icon="user" scale="l" width="auto">
          <div slot="title">No courier selected</div>
          <div slot="message">Select a courier from the list</div>
        </CalciteNotice>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="courier-detail__loader">
        <CalciteLoader label="Loading courier details" type="indeterminate" scale="m" />
      </div>
    );
  }

  if (!detail) return null;

  const distance = detail.totalDistance != null ? formatDistance(detail.totalDistance) : "\u2014";

  return (
    <div className="courier-detail">
      <div className="courier-detail__header">
        <div className="avatar avatar--lg">
          {detail.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="courier-detail__name">{detail.name}</div>
          <div className="courier-detail__id">{detail.id}</div>
        </div>
      </div>

      <div className="courier-detail__body">
        <div className="courier-detail__stats">
          <Stat label="Total Distance" value={distance} accent="var(--calcite-color-status-warning)" />
          <Stat label="Store Entries" value={String(detail.storeEntries.length)} accent="var(--calcite-color-brand)" />
          <Stat label="Last Location" value={detail.lastLocation ? `${detail.lastLocation.lat.toFixed(5)}, ${detail.lastLocation.lng.toFixed(5)}` : "\u2014"} />
          <Stat label="Last Updated" value={detail.lastUpdated ? format(new Date(detail.lastUpdated), "dd/MM HH:mm:ss") : "\u2014"} />
        </div>

        {detail.lastLocation && (
          <div className="courier-detail__map-wrapper">
            <MiniMap detail={detail} />
          </div>
        )}

        {detail.storeEntries.length > 0 && (
          <>
            <div className="courier-detail__entries-header">
              Store Entries ({detail.storeEntries.length})
            </div>
            <div style={{ height: Math.min(detail.storeEntries.length * 40 + 32 + 4, 280) }}>
              <AgGridReact<StoreEntryLogDTO>
                theme={gridDarkThemeCompact}
                containerStyle={{ width: "100%", height: "100%" }}
                rowData={detail.storeEntries as StoreEntryLogDTO[]}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                getRowId={getRowId}
                onRowClicked={onEntryClicked}
                suppressCellFocus
                suppressScrollOnNewData
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
