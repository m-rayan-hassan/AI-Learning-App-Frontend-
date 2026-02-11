"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, FileText, Trash2, GraduationCap, Brain, Upload } from "lucide-react";
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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    setUploading(true);
    const toastId = toast.loading("Uploading document...");

    const formData = new FormData(e.currentTarget);
    
    if (selectedFile) {
        formData.set('file', selectedFile);
    }

    try {
      await documentServices.uploadDocument(formData);
      await fetchDocuments();
      setIsUploadOpen(false);
      setSelectedFile(null);
      (e.target as HTMLFormElement).reset();
      toast.success("Document uploaded successfully!", { id: toastId });
    } catch (err: any) {
       toast.error(err.message || "Failed to upload document", { id: toastId });
    } finally {
      setUploading(false);
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
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-xl p-8 text-center animate-in fade-in-50">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-primary" />
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
             {documents.map((doc) => (
                <Card key={doc._id} className="group flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 relative overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                             <div className="h-10 w-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                  <FileText className="h-5 w-5" />
                             </div>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100" 
                                onClick={(e) => handleDelete(e, doc._id)}
                             >
                                 <Trash2 className="h-4 w-4" />
                             </Button>
                        </div>
                        <CardTitle className="truncate text-base" title={doc.title}>{doc.title}</CardTitle>
                        <CardDescription className="text-xs">
                            {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="flex gap-2 flex-wrap">
                            <div className="px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs rounded-full font-medium flex items-center gap-1.5 border border-purple-500/20">
                                <GraduationCap className="h-3 w-3" />
                                {doc.flashcardCount || 0}
                            </div>
                            <div className="px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-300 text-xs rounded-full font-medium flex items-center gap-1.5 border border-green-500/20">
                                <Brain className="h-3 w-3" />
                                {doc.quizCount || 0}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t bg-muted/20 mt-2">
                         <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Ready to learn
                         </div>
                         <Link href={`/documents/${doc._id}`} className="w-full ml-auto">
                            <Button size="sm" className="w-full bg-background hover:bg-primary hover:text-primary-foreground text-foreground border shadow-sm transition-all duration-300">
                                View Studio
                            </Button>
                         </Link>
                    </CardFooter>
                </Card>
             ))}
        </div>
      )}
    </div>
  );
}
