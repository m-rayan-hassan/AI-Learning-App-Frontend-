"use client";

import { useParams } from "next/navigation";
import { NotesTab } from "@/components/feature-tabs/NotesTab";

export default function DocumentNotesPage() {
  const params = useParams();
  const id = params.id as string;

  return <NotesTab documentId={id} />;
}
