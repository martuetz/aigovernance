import { PageHeader } from "@/components/layout/PageHeader";
import { AuditLogClient } from "@/components/audit-log/AuditLogClient";

export default function AuditLogPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit Log"
        description="Immutable record of all governance decisions"
      />
      <AuditLogClient />
    </div>
  );
}
