import { useCallback } from "react";
import { Layout, Model, TabNode } from "flexlayout-react";
import "flexlayout-react/style/dark.css";
import { CourierTable } from "@/components/courier/CourierTable";
import { CourierDetailPanel } from "@/components/courier/CourierDetailPanel";

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
        weight: 42,
        children: [
          { type: "tab", name: "Couriers", component: "list" },
        ],
      },
      {
        type: "tabset",
        weight: 58,
        children: [
          { type: "tab", name: "Detail", component: "detail" },
        ],
      },
    ],
  },
};

const COMPONENT_MAP: Record<string, React.FC> = {
  list: CourierTable,
  detail: CourierDetailPanel,
};

const model = Model.fromJson(LAYOUT_CONFIG);

export function CouriersPage() {
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
