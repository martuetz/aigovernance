import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { AgentFormDialog } from "@/components/agents/AgentFormDialog";
import type { RiskLevel } from "@/types";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const allAgents = await db
    .select()
    .from(agents)
    .orderBy(desc(agents.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agent Registry"
        description="Manage registered AI agents and their authority levels"
      >
        <AgentFormDialog />
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          {allAgents.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No agents registered yet. Click &quot;Add Agent&quot; to register
              your first agent.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAgents.map((agent) => {
                  const scope: string[] = JSON.parse(agent.approvedScope);
                  return (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">
                        {agent.name}
                      </TableCell>
                      <TableCell className="capitalize">{agent.type}</TableCell>
                      <TableCell>{agent.representedOrg}</TableCell>
                      <TableCell>
                        <RiskBadge
                          level={agent.authorityLevel as RiskLevel}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {scope.map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={agent.isActive ? "default" : "secondary"}
                        >
                          {agent.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
