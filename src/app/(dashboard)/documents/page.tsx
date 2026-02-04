"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, FileText, Trash2, GraduationCap, Brain } from "lucide-react";
import documentServices from "@/services/documentServices";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const docs = await documentServices.getDocuments();
      setDocuments(docs || []);
    } catch (err: any) {
      setError(err.message || "Failed to load documents");
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
    setError("");

    const formData = new FormData(e.currentTarget);
    
    // If a file was selected via drag and drop, manually append it if it's not in the formData
    if (selectedFile) {
        formData.set('file', selectedFile);
    }

    try {
      await documentServices.uploadDocument(formData);
      // Refresh list
      await fetchDocuments();
      setIsUploadOpen(false); // Close dialog
      setSelectedFile(null); // Reset file
       (e.target as HTMLFormElement).reset();
    } catch (err: any) {
       setError(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.preventDefault(); // Prevent Link navigation
      e.stopPropagation();
      if(!confirm("Are you sure you want to delete this document?")) return;
      try {
          await documentServices.deleteDocument(id);
          setDocuments(documents.filter(doc => doc._id !== id));
      } catch (err: any) {
          setError(err.message || "Failed to delete document");
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Upload and manage your study materials.
            </p>
         </div>
         <Dialog open={isUploadOpen} onOpenChange={(open) => {
             setIsUploadOpen(open);
             if (!open) {
                 setSelectedFile(null);
                 setError("");
             }
         }}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
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
                                placeholder="Enter document title" 
                                required 
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="file">File</Label>
                            <div
                                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
                                    isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="space-y-1 text-center">
                                    <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <div className="flex text-sm text-muted-foreground">
                                        <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                                            <span>{selectedFile ? 'Change file' : 'Upload a file'}</span>
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
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        PDF, DOCX, TXT, PPTX or ODT up to 500 pages
                                    </p>
                                    {selectedFile && (
                                        <div className="mt-2 p-2 bg-muted rounded-md flex items-center justify-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium truncate max-w-[200px]">
                                                {selectedFile.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                    <DialogFooter className="flex-col gap-2">
                        <Button type="submit" disabled={uploading} className="w-full">
                            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        {uploading && (
                            <p className="text-xs text-center text-muted-foreground animate-pulse">
                                This may take some time if document is large or non-pdf
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
         </Dialog>
      </div>

     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
             <div className="col-span-full flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        ) : (
             documents.map((doc) => (
                <Card key={doc._id} className="flex flex-col justify-between hover:shadow-md transition-all group border-none shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                             <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-2 text-blue-600">
                                  <FileText className="h-5 w-5" />
                             </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={(e) => handleDelete(e, doc._id)}>
                                 <Trash2 className="h-4 w-4" />
                             </Button>
                        </div>
                        <CardTitle className="truncate text-base" title={doc.title}>{doc.title}</CardTitle>
                        <CardDescription>{(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="flex gap-2 flex-wrap">
                            <div className="px-2 py-1 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300 text-xs rounded-md font-medium flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {doc.flashcardCount || 0} Flashcards
                            </div>
                            <div className="px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300 text-xs rounded-md font-medium flex items-center gap-1">
                                <Brain className="h-3 w-3" />
                                {doc.quizCount || 0} Quizzes
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t flex justify-between bg-muted/20">
                         <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                         </div>
                         <Link href={`/documents/${doc._id}`}>
                            <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                View
                            </Button>
                         </Link>
                    </CardFooter>
                </Card>
             ))
        )}
      </div>
    </div>
  );
}
