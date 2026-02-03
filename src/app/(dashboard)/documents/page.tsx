"use client";

import { useEffect, useState } from "react";
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

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    // documentServices.uploadDocument expects formData
    try {
      await documentServices.uploadDocument(formData);
      // Refresh list
      await fetchDocuments();
      setIsUploadOpen(false); // Close dialog
      // Reset form (optional)
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
         <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
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
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="file">File</Label>
                            <Input id="file" name="file" type="file" required accept=".pdf,.docx,.txt,.pptx,.odt" />
                        </div>
                         {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={uploading} className="w-full">
                            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
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
