"use client";

import { useParams } from "next/navigation";
import { SummaryTab } from "@/components/feature-tabs/SummaryTab";

export default function DocumentSummaryPage() {
  const params = useParams();
  const id = params.id as string;

  return <SummaryTab documentId={id} />;
}
