"use client";

import { useParams } from "next/navigation";
import VoiceChat from "@/components/feature-tabs/VoiceChat";

export default function DocumentVoiceChatPage() {
  const params = useParams();
  const id = params.id as string;

  return <VoiceChat documentId={id} />;
}
