import { db } from "@/lib/db";
import { auditLogs, escalations } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DecisionBadge } from "@/components/shared/DecisionBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ShieldCheck, ShieldAlert, AlertTriangle, Ban } from "lucide-react";
import type { Decision, RiskLevel } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const allLogs = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
  const pendingEscalations = await db.query.escalations.findMany({
    where: eq(escalations.status, "pending"),
  });

  const totalDecisions = allLogs.length;
  const approvedCount = allLogs.filter(
    (l) => l.decision === "APPROVE" || l.decision === "APPROVE_WITH_CONDITIONS"
  ).length;
  const blockedCount = allLogs.filter((l) => l.decision === "BLOCK").length;
  const escalatedCount = allLogs.filter(
    (l) => l.decision === "ESCALATE"
  ).length;
  const approvalRate =
    totalDecisions > 0
      ? Math.round((approvedCount / totalDecisions) * 100)
      : 0;

  const recentLogs = allLogs.slice(0, 10);

  const decisionCounts: Record<string, number> = {
    APPROVE: allLogs.filter((l) => l.decision === "APPROVE").length,
    APPROVE_WITH_CONDITIONS: allLogs.filter(
      (l) => l.decision === "APPROVE_WITH_CONDITIONS"
    ).length,
    ESCALATE: escalatedCount,
    BLOCK: blockedCount,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of governance activity and decisions"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Decisions
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDecisions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approval Rate
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Escalations
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${pendingEscalations.length > 0 ? "text-primary" : ""}`}
            >
              {pendingEscalations.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blocked Actions
            </CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No governance decisions yet. Use the Evaluate page to submit
                your first action.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.agentName}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.actionType}
                      </TableCell>
                      <TableCell>
                        <DecisionBadge decision={log.decision as Decision} />
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={log.riskLevel as RiskLevel} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decision Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(decisionCounts).map(([decision, count]) => {
              const percentage =
                totalDecisions > 0
                  ? Math.round((count / totalDecisions) * 100)
                  : 0;
              const colors: Record<string, string> = {
                APPROVE: "bg-primary",
                APPROVE_WITH_CONDITIONS: "bg-accent",
                ESCALATE: "bg-humaine-secondary",
                BLOCK: "bg-humaine-near-black",
              };
              const labels: Record<string, string> = {
                APPROVE: "Approved",
                APPROVE_WITH_CONDITIONS: "Conditional",
                ESCALATE: "Escalated",
                BLOCK: "Blocked",
              };
              return (
                <div key={decision} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{labels[decision]}</span>
                    <span className="text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${colors[decision]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
