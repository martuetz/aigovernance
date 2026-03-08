"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DecisionBadge } from "@/components/shared/DecisionBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Loader2 } from "lucide-react";
import type { Agent, Decision, RiskLevel, RiskCategory } from "@/types";

interface EvaluationResult {
  decision: Decision;
  conditions: string | null;
  reasoning: string;
  riskLevel: RiskLevel;
  riskCategories: RiskCategory[];
  policiesEvaluated: string[];
  auditLogId: string;
  escalationId?: string;
}

export function EvaluationForm() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [agentId, setAgentId] = useState("");
  const [actionType, setActionType] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  const [targetParty, setTargetParty] = useState("");
  const [dataInvolved, setDataInvolved] = useState("");
  const [context, setContext] = useState("");

  useEffect(() => {
    fetch("/api/agents?active=true")
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          actionType,
          actionDescription,
          targetParty: targetParty || undefined,
          dataInvolved: dataInvolved || undefined,
          context: context || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Evaluation failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Action Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent">Agent</Label>
              <Select value={agentId} onValueChange={(v) => setAgentId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name} ({agent.representedOrg})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type</Label>
              <Input
                id="actionType"
                placeholder="e.g., pricing_change, data_export, contract_signing"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionDescription">Action Description</Label>
              <Textarea
                id="actionDescription"
                placeholder="Describe what the agent wants to do..."
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetParty">Target Party (optional)</Label>
              <Input
                id="targetParty"
                placeholder="Who or what is affected?"
                value={targetParty}
                onChange={(e) => setTargetParty(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInvolved">Data Involved (optional)</Label>
              <Textarea
                id="dataInvolved"
                placeholder="What data is being accessed or modified?"
                value={dataInvolved}
                onChange={(e) => setDataInvolved(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Context (optional)</Label>
              <Textarea
                id="context"
                placeholder="Additional context about the situation..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !agentId || !actionType || !actionDescription}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                "Evaluate Action"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Governance Decision</CardTitle>
        </CardHeader>
        <CardContent>
          {!result && !error && !loading && (
            <p className="py-12 text-center text-muted-foreground">
              Submit an action request to see the governance decision.
            </p>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Evaluating governance principles...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-humaine-secondary bg-humaine-light-grey p-4">
              <p className="text-sm text-humaine-near-black">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <DecisionBadge decision={result.decision} />
                <RiskBadge level={result.riskLevel} />
              </div>

              {result.conditions && (
                <div className="space-y-1">
                  <h4 className="font-heading text-sm font-medium text-humaine-foreground">Conditions</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.conditions}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-sm font-medium">Reasoning</h4>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {result.reasoning}
                </p>
              </div>

              {result.riskCategories.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-heading text-sm font-medium text-humaine-foreground">Risk Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.riskCategories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-4xl bg-accent/30 px-2.5 py-1 font-heading text-xs capitalize text-humaine-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.policiesEvaluated.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-heading text-sm font-medium text-humaine-foreground">Policies Evaluated</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.policiesEvaluated.map((policy) => (
                      <span
                        key={policy}
                        className="rounded-4xl bg-humaine-light-grey px-2.5 py-1 font-heading text-xs text-humaine-foreground"
                      >
                        {policy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Audit Log ID: {result.auditLogId}
                </p>
                {result.escalationId && (
                  <p className="text-xs text-primary">
                    Escalation ID: {result.escalationId}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
