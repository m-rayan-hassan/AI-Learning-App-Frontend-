"use client";

import { useParams } from "next/navigation";
import VideoOverviewTab from "@/components/feature-tabs/VideoOverviewTab";

export default function DocumentVideoOverviewPage() {
  const params = useParams();
  const id = params.id as string;

  return <VideoOverviewTab documentId={id} />;
}
