"use client";

import { useParams, useRouter } from "next/navigation";
import { useDocumentContext } from "../DocumentContext";
import { PDFViewer } from "@/components/PDFViewer";
import { FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentPreviewPage() {
  const { document } = useDocumentContext();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  if (!document) return null;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-none p-2 mb-2">
        <Button variant="ghost" onClick={() => router.push(`/documents/${id}`)}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Notes
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        {document.pdfUrl ? (
          <PDFViewer url={document.pdfUrl} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
            <FileText className="h-10 w-10 opacity-20" />
            <span>PDF not available</span>
          </div>
        )}
      </div>
    </div>
  );
}
