"use client";

import { useParams } from "next/navigation";
import { FlashcardsTab } from "@/components/feature-tabs/FlashcardsTab";

export default function DocumentFlashcardsPage() {
  const params = useParams();
  const id = params.id as string;

  return <FlashcardsTab documentId={id} />;
}
