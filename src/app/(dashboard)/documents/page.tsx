"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Trash2, GraduationCap, Brain, Upload } from "lucide-react";
import documentServices from "@/services/documentServices";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingTitle, setUploadingTitle] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [textContent, setTextContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const docs = await documentServices.getDocuments();
      setDocuments(docs || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load documents");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const hasProcessingDocs = documents.some(doc => doc.status === "processing");
    
    if (hasProcessingDocs) {
      interval = setInterval(() => {
        documentServices.getDocuments()
          .then(docs => {
             setDocuments(docs || []);
          })
          .catch(err => console.error("Polling error", err));
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [documents]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string || "Uploading Document...";
    
    setUploadingTitle(title);
    setUploading(true);
    setIsUploadOpen(false);
    
    if (uploadMode === 'text') {
        const textFile = new File([textContent], `${title}.txt`, { type: 'text/plain' });
        formData.set('file', textFile);
    } else if (selectedFile) {
        formData.set('file', selectedFile);
    }
    
    setSelectedFile(null);
    
    const toastId = toast.loading("Uploading document...");
    (e.target as HTMLFormElement).reset();
    setTextContent("");

    try {
      const response = await documentServices.uploadDocument(formData);
      await fetchDocuments();
      toast.success(response.message || "Document uploaded. AI processing started.", { id: toastId, duration: 5000 });
    } catch (err: any) {
       toast.error(err.message || "Failed to upload document", { id: toastId });
    } finally {
      setUploading(false);
      setUploadingTitle("");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      
      if(!confirm("Are you sure you want to delete this document?")) return;

      const toastId = toast.loading("Deleting document...");
      try {
          await documentServices.deleteDocument(id);
          setDocuments(documents.filter(doc => doc._id !== id));
          toast.success("Document deleted", { id: toastId });
      } catch (err: any) {
          toast.error(err.message || "Failed to delete document", { id: toastId });
      }
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Manage your study materials and track your progress.
            </p>
         </div>
         <Dialog open={isUploadOpen} onOpenChange={(open) => {
             setIsUploadOpen(open);
             if (!open) {
                 setSelectedFile(null);
                 setUploadMode('file');
                 setTextContent('');
             }
         }}>
            <DialogTrigger asChild>
                <Button className="shadow-lg hover:shadow-primary/20 transition-all">
                    <Upload className="mr-2 h-4 w-4" />
                    New Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                        Add a PDF, DOCX, or TXT document to your library.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload}>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="title">Document Title</Label>
                            <Input 
                                id="title" 
                                name="title" 
                                placeholder="e.g., Biology Chapter 1" 
                                required 
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5 mb-2">
                            <div className="flex bg-muted/50 p-1 rounded-lg">
                                <button
                                    type="button"
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${uploadMode === 'file' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    onClick={() => setUploadMode('file')}
                                >
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${uploadMode === 'text' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    onClick={() => setUploadMode('text')}
                                >
                                    Paste Text
                                </button>
                            </div>
                        </div>

                        {uploadMode === 'file' ? (
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="file">File</Label>
                                <div
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                                        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="space-y-2 text-center">
                                        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Upload className={`h-6 w-6 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            PDF, DOCX, TXT (max 10MB)
                                        </p>
                                        {selectedFile && (
                                            <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center justify-center gap-2 border border-primary/20">
                                                <FileText className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium truncate max-w-[200px] text-primary">
                                                    {selectedFile.name}
                                                </span>
                                            </div>
                                        )}
                                        <input 
                                            id="file" 
                                            name="file" 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="sr-only" 
                                            onChange={handleFileChange}
                                            accept=".pdf,.docx,.txt,.pptx,.odt"
                                            required={!selectedFile}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid w-full items-center gap-1.5 mt-2">
                                <Label htmlFor="textContent">Document Text</Label>
                                <textarea 
                                    id="textContent"
                                    name="textContent"
                                    placeholder="Paste or type your document text here..."
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none mt-1"
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={uploading} className="w-full">
                            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {uploading ? 'Processing...' : 'Upload Document'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
         </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="border-t pt-4 mt-2">
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 && !uploading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-xl p-8 text-center animate-in fade-in-50">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold">No documents yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Upload your first document to get started with AI-powered summaries, quizzes, and flashcards.
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
                Upload Document
            </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {uploading && (
                <Card className="group flex flex-col justify-between border-primary/30 relative overflow-hidden bg-card/50">
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                    <CardHeader className="pb-2 relative">
                        <div className="flex justify-between items-start mb-2">
                             <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center animate-pulse">
                                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                             </div>
                        </div>
                        <CardTitle className="truncate text-base text-muted-foreground">{uploadingTitle || "Uploading Document..."}</CardTitle>
                        <CardDescription className="text-xs text-primary animate-pulse">
                            Processing document, AI analyzing etc...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 relative">
                        <div className="flex gap-2 flex-wrap">
                            <Skeleton className="h-6 w-20 rounded-full opacity-50" />
                            <Skeleton className="h-6 w-24 rounded-full opacity-50" />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/50 mt-2 relative">
                         <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Uploading...
                         </div>
                         <Button size="sm" disabled className="w-full ml-auto opacity-50">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing
                         </Button>
                    </CardFooter>
                </Card>
             )}
             {documents.map((doc) => (
                <Card key={doc._id} className={`group flex flex-col justify-between transition-all duration-300 border border-border/50 relative overflow-hidden ${doc.status === 'processing' ? 'bg-card/50 border-primary/30' : 'hover:shadow-xl hover:border-primary/30 bg-card'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {doc.status === 'processing' && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
                    <CardHeader className="pb-2 relative">
                        <div className="flex justify-between items-start mb-2">
                             <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${doc.status === 'processing' ? 'bg-muted animate-pulse' : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300'}`}>
                                  {doc.status === 'processing' ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" /> : <FileText className="h-5 w-5 text-white" />}
                             </div>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 z-10 relative" 
                                onClick={(e) => handleDelete(e, doc._id)}
                             >
                                 <Trash2 className="h-4 w-4" />
                             </Button>
                        </div>
                        <CardTitle className="truncate text-base" title={doc.title}>{doc.title}</CardTitle>
                        <CardDescription className={`text-xs ${doc.status === 'processing' ? 'text-primary animate-pulse' : ''}`}>
                            {doc.status === 'processing' ? 'AI is analyzing and extracting content...' : `${(doc.fileSize / 1024).toFixed(1)} KB • ${new Date(doc.createdAt || doc.uploadDate).toLocaleDateString()}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 relative">
                        {doc.status === 'processing' ? (
                            <div className="flex gap-2 flex-wrap">
                                <Skeleton className="h-6 w-20 rounded-full opacity-50" />
                                <Skeleton className="h-6 w-24 rounded-full opacity-50" />
                            </div>
                        ) : (
                            <div className="flex gap-2 flex-wrap">
                                <div className="px-2.5 py-1 bg-gradient-to-r from-purple-500/15 to-purple-500/10 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium flex items-center gap-1.5 border border-purple-500/20">
                                    <GraduationCap className="h-3 w-3" />
                                    {doc.flashcardCount || 0} Cards
                                </div>
                                <div className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/15 to-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-medium flex items-center gap-1.5 border border-emerald-500/20">
                                    <Brain className="h-3 w-3" />
                                    {doc.quizCount || 0} Quizzes
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/50 mt-2 relative flex-col gap-2">
                         {doc.status === 'processing' ? (
                             <div className="flex w-full items-center justify-between">
                                 <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    AI Extracting...
                                 </div>
                                 <Button size="sm" disabled className="w-auto opacity-70 h-8 text-xs px-2.5 bg-primary/10 text-primary hover:bg-primary/10">
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Processing
                                 </Button>
                             </div>
                         ) : doc.status === 'failed' ? (
                             <div className="flex w-full items-center justify-between">
                                 <div className="flex items-center gap-1.5 text-xs text-destructive">
                                    <span className="w-2 h-2 rounded-full bg-destructive"></span>
                                    Failed to process
                                 </div>
                                 <Button size="sm" variant="destructive" className="w-auto h-8 z-10" onClick={(e) => handleDelete(e, doc._id)}>
                                    Delete Document
                                 </Button>
                             </div>
                         ) : (
                             <div className="flex w-full items-center justify-between">
                                 <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Ready to learn
                                 </div>
                                 <Link href={`/documents/${doc._id}`} className="w-auto ml-auto">
                                    <Button size="sm" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 h-8">
                                        View Studio
                                    </Button>
                                 </Link>
                             </div>
                         )}
                    </CardFooter>
                </Card>
             ))}
        </div>
      )}
    </div>
  );
}
