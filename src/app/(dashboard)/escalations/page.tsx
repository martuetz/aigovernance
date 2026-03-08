import { PageHeader } from "@/components/layout/PageHeader";
import { EscalationQueue } from "@/components/escalations/EscalationQueue";

export default function EscalationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Escalation Queue"
        description="Actions requiring human review and approval"
      />
      <EscalationQueue />
    </div>
  );
}
