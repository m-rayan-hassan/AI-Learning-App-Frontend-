"use client";

import { useParams } from "next/navigation";
import { QuizTab } from "@/components/feature-tabs/QuizTab";

export default function DocumentQuizPage() {
  const params = useParams();
  const id = params.id as string;

  return <QuizTab documentId={id} />;
}
