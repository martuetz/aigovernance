import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";
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
import { PolicyFormDialog } from "@/components/policies/PolicyFormDialog";
import type { RiskLevel } from "@/types";

export const dynamic = "force-dynamic";

export default async function PoliciesPage() {
  const allPolicies = await db
    .select()
    .from(policies)
    .orderBy(desc(policies.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Governance Policies"
        description="Define rules that govern AI agent behavior"
      >
        <PolicyFormDialog />
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          {allPolicies.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No policies defined yet. Click &quot;Add Policy&quot; to create
              your first governance rule.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Risk Threshold</TableHead>
                  <TableHead className="max-w-[300px]">Rule</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">
                      {policy.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {policy.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RiskBadge
                        level={policy.riskThreshold as RiskLevel}
                      />
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                      {policy.ruleDefinition}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={policy.isActive ? "default" : "secondary"}
                      >
                        {policy.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
