"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function PolicyFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [ruleDefinition, setRuleDefinition] = useState("");
  const [riskThreshold, setRiskThreshold] = useState<string>("");
  const [escalationRule, setEscalationRule] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          ruleDefinition,
          riskThreshold,
          escalationRule: escalationRule || undefined,
        }),
      });

      if (res.ok) {
        setOpen(false);
        setName("");
        setDescription("");
        setCategory("");
        setRuleDefinition("");
        setRiskThreshold("");
        setEscalationRule("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button />}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Policy
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Governance Policy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Policy Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Large Financial Transaction"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this policy"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="privacy">Privacy</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="reputational">Reputational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Risk Threshold</Label>
              <Select value={riskThreshold} onValueChange={(v) => setRiskThreshold(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rule Definition</Label>
            <Textarea
              value={ruleDefinition}
              onChange={(e) => setRuleDefinition(e.target.value)}
              placeholder="Describe the rule in natural language. This will be sent to the LLM evaluator."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Escalation Rule (optional)</Label>
            <Input
              value={escalationRule}
              onChange={(e) => setEscalationRule(e.target.value)}
              placeholder="When should this be escalated to a human?"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create Policy
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
