"use client";

import { useParams } from "next/navigation";
import ExplainConcept from "@/components/feature-tabs/ExplainConceptTab";

export default function DocumentConceptPage() {
  const params = useParams();
  const id = params.id as string;

  return <ExplainConcept documentId={id} />;
}
