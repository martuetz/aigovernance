"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DecisionBadge } from "@/components/shared/DecisionBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Decision, RiskLevel } from "@/types";

interface AuditEntry {
  id: string;
  agentName: string;
  representedParty: string;
  actionType: string;
  actionDescription: string;
  targetParty: string | null;
  dataInvolved: string | null;
  decision: Decision;
  conditions: string | null;
  reasoning: string;
  riskLevel: RiskLevel;
  riskCategories: string[];
  policiesEvaluated: string[];
  timestamp: string;
}

export function AuditLogClient() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const limit = 20;

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    if (decisionFilter !== "all") params.set("decision", decisionFilter);
    if (riskFilter !== "all") params.set("riskLevel", riskFilter);

    const res = await fetch(`/api/audit-log?${params}`);
    const data = await res.json();
    setEntries(data.data);
    setTotal(data.total);
  }, [offset, decisionFilter, riskFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={decisionFilter}
          onValueChange={(v) => {
            setDecisionFilter(v ?? "all");
            setOffset(0);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Decision" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Decisions</SelectItem>
            <SelectItem value="APPROVE">Approved</SelectItem>
            <SelectItem value="APPROVE_WITH_CONDITIONS">Conditional</SelectItem>
            <SelectItem value="ESCALATE">Escalated</SelectItem>
            <SelectItem value="BLOCK">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={riskFilter}
          onValueChange={(v) => {
            setRiskFilter(v ?? "all");
            setOffset(0);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          {entries.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No audit log entries found.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Agent</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <Fragment key={entry.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedId(
                            expandedId === entry.id ? null : entry.id
                          )
                        }
                      >
                        <TableCell>
                          {expandedId === entry.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {entry.agentName}
                        </TableCell>
                        <TableCell>{entry.representedParty}</TableCell>
                        <TableCell>{entry.actionType}</TableCell>
                        <TableCell>
                          <DecisionBadge decision={entry.decision} />
                        </TableCell>
                        <TableCell>
                          <RiskBadge level={entry.riskLevel} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                      {expandedId === entry.id && (
                        <TableRow key={`${entry.id}-detail`}>
                          <TableCell colSpan={7}>
                            <div className="space-y-3 py-2 pl-8">
                              <div>
                                <span className="text-sm font-medium">
                                  Description:{" "}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {entry.actionDescription}
                                </span>
                              </div>
                              {entry.conditions && (
                                <div>
                                  <span className="text-sm font-medium">
                                    Conditions:{" "}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {entry.conditions}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="text-sm font-medium">
                                  Reasoning:{" "}
                                </span>
                                <span className="whitespace-pre-wrap text-sm text-muted-foreground">
                                  {entry.reasoning}
                                </span>
                              </div>
                              {entry.riskCategories.length > 0 && (
                                <div>
                                  <span className="text-sm font-medium">
                                    Risk Categories:{" "}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {entry.riskCategories.join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {offset + 1}–{Math.min(offset + limit, total)} of{" "}
                  {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offset + limit >= total}
                    onClick={() => setOffset(offset + limit)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
