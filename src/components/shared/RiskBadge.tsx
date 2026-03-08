import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/types";

const riskStyles: Record<RiskLevel, string> = {
  low: "bg-accent/40 text-humaine-foreground border-accent",
  medium: "bg-humaine-secondary/20 text-humaine-near-black border-humaine-secondary",
  high: "bg-primary/10 text-primary border-primary/30",
  critical: "bg-humaine-near-black text-white border-humaine-near-black",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge variant="outline" className={`font-heading uppercase tracking-wide ${riskStyles[level]}`}>
      {level}
    </Badge>
  );
}
