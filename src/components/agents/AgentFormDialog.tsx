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

export function AgentFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<string>("");
  const [representedOrg, setRepresentedOrg] = useState("");
  const [authorityLevel, setAuthorityLevel] = useState<string>("");
  const [approvedScope, setApprovedScope] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          representedOrg,
          authorityLevel,
          approvedScope: approvedScope
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          description: description || undefined,
        }),
      });

      if (res.ok) {
        setOpen(false);
        setName("");
        setType("");
        setRepresentedOrg("");
        setAuthorityLevel("");
        setApprovedScope("");
        setDescription("");
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
        Add Agent
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., AlphaTrader"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                  <SelectItem value="semi-autonomous">
                    Semi-Autonomous
                  </SelectItem>
                  <SelectItem value="supervised">Supervised</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Authority Level</Label>
              <Select
                value={authorityLevel}
                onValueChange={(v) => setAuthorityLevel(v ?? "")}
              >
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
            <Label>Organization</Label>
            <Input
              value={representedOrg}
              onChange={(e) => setRepresentedOrg(e.target.value)}
              placeholder="e.g., Apex Capital"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Approved Scope (comma-separated)</Label>
            <Input
              value={approvedScope}
              onChange={(e) => setApprovedScope(e.target.value)}
              placeholder="e.g., trade_execution, market_analysis"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this agent do?"
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Register Agent
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
