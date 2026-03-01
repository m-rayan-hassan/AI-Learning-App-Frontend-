"use client";

import { aiServices } from '@/services/aiServices';
import documentServices from '@/services/documentServices';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlayCircle, Video, AlertCircle, RefreshCw, FileVideo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoOverviewTab = ({ documentId }: { documentId: string }) => {
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadVideoUrl = async () => {
            try {
                setLoading(true);
                setError(null);
                const cached = localStorage.getItem(`videoUrl_${documentId}`);
    
                if (cached) {
                    setVideoUrl(cached);
                    setLoading(false);
                    return;
                }

                const res = await aiServices.getVideoOverviewUrl(documentId);
                // Check multiple possible field names based on UIActionsTab patterns
                const dbVideoUrl = res
                if (dbVideoUrl) {
                    localStorage.setItem(`videoUrl_${documentId}`, dbVideoUrl);
                    setVideoUrl(dbVideoUrl);
                }
            } catch (error: any) {
                console.error("Error getting video url", error);
                setError(error.message || "Failed to load video details.");
            } finally {
                setLoading(false);
            }
        };

        if (documentId) loadVideoUrl();
    }, [documentId]);

    const handleVideoGenerate = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await aiServices.generateVideo(documentId);
            
            // Handle both string response and object response for robustness
            const url = typeof res === 'string' ? res : (res?.videoUrl || res?.video_url || res?.data);
            
            if (url) {
                localStorage.setItem(`videoUrl_${documentId}`, url);
                setVideoUrl(url);
            } else {
                setError("Generation appeared successful but no video URL was returned.");
            }
        } catch (error: any) {
            console.error("Error generating video", error);
            setError(error.message || "An error occurred while generating the video.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex flex-col gap-6">
            <Card className="flex-1 flex flex-col min-h-0 border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Video className="w-6 h-6 text-primary" />
                                Video Overview
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Experience a dynamic AI-generated visual walkthrough of your document.
                            </CardDescription>
                        </div>
                       
                    </div>
                </CardHeader>

                <CardContent className="flex-1 px-0 overflow-visible">
                    <AnimatePresence mode="wait">
                        {loading && !videoUrl ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] lg:h-[400px] bg-muted/10 rounded-2xl border-2 border-dashed border-muted-foreground/10"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                                    <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
                                </div>
                                <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
                                    Creating your visual overview...
                                </p>
                            </motion.div>
                        ) : error ? (
                            <motion.div 
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] lg:h-[400px] bg-destructive/5 rounded-2xl border border-destructive/20 p-8 text-center"
                            >
                                <div className="p-3 bg-destructive/10 rounded-full mb-4">
                                    <AlertCircle className="h-8 w-8 text-destructive" />
                                </div>
                                <h4 className="text-lg font-semibold mb-2">Something went wrong</h4>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                                    {error}
                                </p>
                                <Button onClick={handleVideoGenerate} variant="destructive">
                                    Try Again
                                </Button>
                            </motion.div>
                        ) : !videoUrl ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] lg:h-[400px] bg-muted/10 rounded-2xl border-2 border-dashed border-muted-foreground/20 p-8 text-center"
                            >
                                <div className="p-4 bg-primary/10 rounded-3xl mb-6">
                                    <FileVideo className="h-12 w-12 text-primary/60" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No Video Generated</h3>
                                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto mb-8">
                                    Bring your document to life with an AI-powered video summary.
                                </p>
                                <Button 
                                    onClick={handleVideoGenerate} 
                                    className="px-8 h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                                >
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    Generate Video
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="video"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="relative group aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-border/50">
                                    <video 
                                        controls 
                                        className="w-full h-full object-contain"
                                        poster="/video-poster-placeholder.png" // Could be added if available
                                    >
                                        <source src={videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute top-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-white/10">
                                            
                                        </span>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
};

export default VideoOverviewTab;