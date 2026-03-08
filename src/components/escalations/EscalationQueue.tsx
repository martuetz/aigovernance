"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { Escalation, RiskLevel } from "@/types";

export function EscalationQueue() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");
  const [resolvedBy, setResolvedBy] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchEscalations() {
    const res = await fetch("/api/escalations");
    const data = await res.json();
    setEscalations(data);
  }

  useEffect(() => {
    fetchEscalations();
  }, []);

  async function handleResolve(resolution: "approved" | "denied") {
    if (!resolveId || !resolveNotes || !resolvedBy) return;
    setLoading(true);

    try {
      await fetch(`/api/escalations/${resolveId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resolution,
          notes: resolveNotes,
          resolvedBy,
        }),
      });
      setResolveId(null);
      setResolveNotes("");
      setResolvedBy("");
      fetchEscalations();
    } finally {
      setLoading(false);
    }
  }

  const pending = escalations.filter((e) => e.status === "pending");
  const resolved = escalations.filter((e) => e.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-heading text-lg font-semibold text-humaine-foreground">
          Pending Review ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending escalations. All clear.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((esc) => (
              <Card key={esc.id} className="border-l-3 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {esc.actionType}
                    </CardTitle>
                    <RiskBadge level={esc.riskLevel as RiskLevel} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {esc.actionDescription}
                  </p>
                  <div>
                    <span className="text-xs font-medium">Reasoning: </span>
                    <span className="text-xs text-muted-foreground">
                      {esc.reasoning.length > 200
                        ? esc.reasoning.substring(0, 200) + "..."
                        : esc.reasoning}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(esc.createdAt).toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setResolveId(esc.id)}
                    >
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {resolved.length > 0 && (
        <div>
          <h3 className="mb-4 font-heading text-lg font-semibold text-humaine-foreground">
            Resolved ({resolved.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {resolved.map((esc) => (
              <Card key={esc.id} className="opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {esc.actionType}
                    </CardTitle>
                    <Badge
                      variant={
                        esc.status === "approved" ? "default" : "destructive"
                      }
                      className="capitalize"
                    >
                      {esc.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {esc.actionDescription}
                  </p>
                  {esc.resolutionNotes && (
                    <p className="text-xs text-muted-foreground">
                      Notes: {esc.resolutionNotes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Resolved by {esc.assignedTo} on{" "}
                    {esc.resolvedAt
                      ? new Date(esc.resolvedAt).toLocaleString()
                      : ""}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={resolveId !== null}
        onOpenChange={() => setResolveId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Escalation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reviewer Name</Label>
              <Input
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Resolution Notes</Label>
              <Textarea
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="Explain your decision..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="default"
                disabled={loading || !resolveNotes || !resolvedBy}
                onClick={() => handleResolve("approved")}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                disabled={loading || !resolveNotes || !resolvedBy}
                onClick={() => handleResolve("denied")}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Deny
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
