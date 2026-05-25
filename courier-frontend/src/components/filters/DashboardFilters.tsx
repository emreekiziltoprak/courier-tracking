import { useMemo, useCallback } from "react";
import { CalciteButton, CalciteLabel, CalciteSelect, CalciteOption } from "@esri/calcite-components-react";
import { useCourierStore } from "@/store/courierStore";
import { useStoreStore } from "@/store/storeStore";
import { useLogStore } from "@/store/logStore";

export function DashboardFilters() {
  const couriersById = useCourierStore((s) => s.couriersById);
  const couriers = useMemo(() => Object.values(couriersById), [couriersById]);
  const stores = useStoreStore((s) => s.stores);
  const filter = useLogStore((s) => s.filter);
  const setFilter = useLogStore((s) => s.setFilter);
  const clearFilter = useLogStore((s) => s.clearFilter);
  const fetchLogs = useLogStore((s) => s.fetchLogs);

  const activeFilterCount = useMemo(
    () => [filter.courierId, filter.storeName, filter.from, filter.to].filter(Boolean).length,
    [filter.courierId, filter.storeName, filter.from, filter.to]
  );

  const handleApply = useCallback(() => fetchLogs(), [fetchLogs]);

  const handleClear = useCallback(() => {
    clearFilter();
    setTimeout(fetchLogs, 0);
  }, [clearFilter, fetchLogs]);

  const handleCourierChange = useCallback(
    (e: Event) => setFilter({ courierId: (e.target as HTMLSelectElement).value || undefined }),
    [setFilter]
  );

  const handleStoreChange = useCallback(
    (e: Event) => setFilter({ storeName: (e.target as HTMLSelectElement).value || undefined }),
    [setFilter]
  );

  const handleFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFilter({ from: e.target.value ? new Date(e.target.value).toISOString() : undefined }),
    [setFilter]
  );

  const handleToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFilter({ to: e.target.value ? new Date(e.target.value).toISOString() : undefined }),
    [setFilter]
  );

  return (
    <div className="dashboard-filters">
      <div className="dashboard-filters__header">
        <span className="dashboard-filters__title">Event Filters</span>
        {activeFilterCount > 0 && (
          <span className="badge badge--filter">
            {activeFilterCount} active
          </span>
        )}
      </div>

      <CalciteLabel scale="s" className="dashboard-filters__field">
        Courier
        <CalciteSelect
          label="Courier"
          scale="s"
          value={filter.courierId ?? ""}
          onCalciteSelectChange={handleCourierChange}
        >
          <CalciteOption value="">All Couriers</CalciteOption>
          {couriers.map((c) => (
            <CalciteOption key={c.id} value={c.id}>
              {c.name}
            </CalciteOption>
          ))}
        </CalciteSelect>
      </CalciteLabel>

      <CalciteLabel scale="s" className="dashboard-filters__field">
        Store
        <CalciteSelect
          label="Store"
          scale="s"
          value={filter.storeName ?? ""}
          onCalciteSelectChange={handleStoreChange}
        >
          <CalciteOption value="">All Stores</CalciteOption>
          {stores.map((s) => (
            <CalciteOption key={s.name} value={s.name}>
              {s.name}
            </CalciteOption>
          ))}
        </CalciteSelect>
      </CalciteLabel>

      <div className="dashboard-filters__divider" />

      <CalciteLabel scale="s" className="dashboard-filters__field">
        From
        <input
          type="datetime-local"
          className="ct-datetime-input"
          value={filter.from ? filter.from.slice(0, 16) : ""}
          onChange={handleFromChange}
        />
      </CalciteLabel>

      <CalciteLabel scale="s" className="dashboard-filters__field--lg">
        To
        <input
          type="datetime-local"
          className="ct-datetime-input"
          value={filter.to ? filter.to.slice(0, 16) : ""}
          onChange={handleToChange}
        />
      </CalciteLabel>

      <div className="dashboard-filters__actions">
        <CalciteButton
          kind="brand"
          iconStart="filter"
          scale="s"
          width="full"
          onClick={handleApply}
        >
          Apply
        </CalciteButton>
        <CalciteButton
          appearance="transparent"
          kind="neutral"
          iconStart="x"
          scale="s"
          onClick={handleClear}
          disabled={activeFilterCount === 0 ? true : undefined}
        >
          Clear
        </CalciteButton>
      </div>
    </div>
  );
}
