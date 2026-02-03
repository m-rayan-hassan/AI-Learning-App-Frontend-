"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, GraduationCap } from "lucide-react";
import flashcardsServices from "@/services/flashcardsServices";
import Link from "next/link";

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await flashcardsServices.getAllFlashCardSets();
        setFlashcardSets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, []);

  if (loading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
        <p className="text-muted-foreground">
          Review and study your generated flashcards.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {flashcardSets.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center gap-4">
                 <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                     <BookOpen className="h-8 w-8 text-muted-foreground" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-semibold text-lg">No flashcards yet</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">Go to a document and generate some flashcards to start studying!</p>
                 </div>
                 <Link href="/documents">
                    <Button>Go to Documents</Button>
                 </Link>
            </div>
        ) : (
            flashcardSets.map((set: any, i) => (
                <Card key={set._id || i} className="flex flex-col justify-between hover:shadow-md transition-all group border-none shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-2 text-purple-600">
                             <GraduationCap className="h-5 w-5" />
                        </div>
                        <CardTitle className="truncate text-base" title={set.title || "Untitled Set"}>
                            {set.documentId?.title || "Flashcard Set"}
                        </CardTitle>
                        <CardDescription>Created {new Date(set.createdAt || Date.now()).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                     <CardContent className="pb-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                                {set.cards?.length || 0} Cards
                            </span>
                             {/* Mock Progress - ideally backend provides this */}
                             <span className="px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 text-xs font-medium rounded-md">
                                 0% Mastered
                             </span>
                        </div>
                         {/* Progress Bar Mock */}
                         <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden">
                             <div className="bg-green-500 h-full w-0" />
                         </div>
                         <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                             <span>Progress</span>
                             <span>0/{set.cards?.length || 0} reviewed</span>
                         </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t flex justify-center bg-muted/20">
                         <Link href={`/documents/${set.documentId?._id || set.documentId}`} className="w-full">
                            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="secondary">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Study Now
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
