import { useCallback } from "react";
import { Layout, Model, TabNode } from "flexlayout-react";
import "flexlayout-react/style/dark.css";
import { DashboardMap } from "@/components/map/DashboardMap";
import { EntryLogTable } from "@/components/logs/EntryLogTable";
import { DashboardFilters } from "@/components/filters/DashboardFilters";

const LAYOUT_CONFIG = {
  global: {
    tabEnableClose: false,
    tabEnableFloat: false,
    tabSetMinWidth: 200,
    tabSetMinHeight: 100,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 22,
        children: [
          { type: "tab", name: "Filters", component: "filters" },
          { type: "tab", name: "Event Log", component: "logs" },
        ],
      },
      {
        type: "tabset",
        weight: 78,
        children: [
          { type: "tab", name: "Map", component: "map" },
        ],
      },
    ],
  },
};

const COMPONENT_MAP: Record<string, React.FC> = {
  map: DashboardMap,
  logs: EntryLogTable,
  filters: DashboardFilters,
};

const model = Model.fromJson(LAYOUT_CONFIG);

export function DashboardPage() {
  const factory = useCallback((node: TabNode) => {
    const Component = COMPONENT_MAP[node.getComponent() ?? ""];
    return Component ? <Component /> : null;
  }, []);

  return (
    <div className="page">
      <Layout model={model} factory={factory} />
    </div>
  );
}
