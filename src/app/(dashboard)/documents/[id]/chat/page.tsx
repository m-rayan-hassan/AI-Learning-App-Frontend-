"use client";

import { useParams } from "next/navigation";
import { ChatTab } from "@/components/feature-tabs/ChatTab";

export default function DocumentChatPage() {
  const params = useParams();
  const id = params.id as string;

  return <ChatTab documentId={id} />;
}
