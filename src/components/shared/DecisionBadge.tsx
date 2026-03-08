import { Badge } from "@/components/ui/badge";
import type { Decision } from "@/types";

const decisionStyles: Record<Decision, string> = {
  APPROVE: "bg-primary/10 text-primary border-primary/20",
  APPROVE_WITH_CONDITIONS:
    "bg-accent text-humaine-foreground border-accent",
  ESCALATE: "bg-humaine-secondary/20 text-humaine-near-black border-humaine-secondary",
  BLOCK: "bg-humaine-near-black text-white border-humaine-near-black",
};

const decisionLabels: Record<Decision, string> = {
  APPROVE: "Approved",
  APPROVE_WITH_CONDITIONS: "Conditional",
  ESCALATE: "Escalated",
  BLOCK: "Blocked",
};

export function DecisionBadge({ decision }: { decision: Decision }) {
  return (
    <Badge variant="outline" className={`font-heading uppercase tracking-wide ${decisionStyles[decision]}`}>
      {decisionLabels[decision]}
    </Badge>
  );
}
