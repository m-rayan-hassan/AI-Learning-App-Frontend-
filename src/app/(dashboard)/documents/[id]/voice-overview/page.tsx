"use client";

import { useParams } from "next/navigation";
import { VoiceOverviewTab } from "@/components/feature-tabs/VoiceOverviewTab";

export default function DocumentVoiceOverviewPage() {
  const params = useParams();
  const id = params.id as string;

  return <VoiceOverviewTab documentId={id} />;
}
