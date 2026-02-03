"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, RotateCw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Configure the worker (REQUIRED for react-pdf to work in Next.js)
// We use a CDN link to avoid complex Webpack configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // Track current page based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.scrollHeight / numPages;
      const currentPageNum = Math.floor(scrollTop / itemHeight) + 1;
      setCurrentPage(Math.min(Math.max(currentPageNum, 1), numPages));
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [numPages]);

  // Compute available width for pages and update on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      // account for container padding (p-4 => 16px each side)
      const padding = 32;
      const w = Math.max(container.clientWidth - padding, 0);
      setPageWidth(w);
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-gray-100/50 dark:bg-gray-900/50">
      {/* --- Toolbar --- */}
      <div className="flex items-center justify-between p-2 border-b bg-background shadow-sm z-10">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
            disabled={scale <= 0.5}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((s) => Math.min(s + 0.1, 2.0))}
            disabled={scale >= 2.0}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {currentPage} / {numPages || "--"}
          </span>
        </div>

        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="Rotate"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- Document Area --- */}
      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
              <AlertCircle className="h-10 w-10" />
              <p>Failed to load PDF.</p>
            </div>
          }
          className="flex flex-col items-center"
        >
          {/* Render all pages continuously */}
          <div className="flex flex-col gap-4 w-full">
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className="shadow-lg border rounded-sm overflow-hidden flex justify-center"
              >
                <Page
                  pageNumber={index + 1}
                  width={pageWidth ? Math.round(pageWidth * scale) : undefined}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="bg-white"
                />
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
}
