import { CalciteChip } from "@esri/calcite-components-react";

interface StatusBadgeProps {
  readonly connected: boolean;
}

export function StatusBadge({ connected }: StatusBadgeProps) {
  return (
    <CalciteChip
      kind={connected ? "brand" : "inverse"}
      appearance="outline-fill"
      icon={connected ? "circle-f" : "exclamation-mark-triangle"}
      scale="s"
      closable={false}
    >
      {connected ? "Live" : "Offline"}
    </CalciteChip>
  );
}
