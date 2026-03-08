import { PageHeader } from "@/components/layout/PageHeader";
import { EvaluationForm } from "@/components/evaluate/EvaluationForm";

export default function EvaluatePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Evaluate Action"
        description="Submit an agent action for governance evaluation"
      />
      <EvaluationForm />
    </div>
  );
}
