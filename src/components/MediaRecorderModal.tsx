"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Square, Upload, RotateCcw } from "lucide-react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { toast } from "sonner";

interface MediaRecorderModalProps {
    open: boolean;
    onClose: () => void;
    onUpload: (blob: Blob, type: 'audio' | 'video') => Promise<void>;
    type: 'audio' | 'video';
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function MediaRecorderModal({ open, onClose, onUpload, type }: MediaRecorderModalProps) {
    const { isRecording, recordedBlob, recordingTime, startRecording, stopRecording, discardRecording } = useMediaRecorder(type);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!recordedBlob) return;

        setIsUploading(true);
        try {
            await onUpload(recordedBlob, type);
            toast.success(`${type === 'audio' ? 'Audio' : 'Video'} uploaded successfully`);
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(`Failed to upload ${type}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDiscard = () => {
        discardRecording();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => { if (!newOpen) handleDiscard(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record {type === 'audio' ? 'Audio' : 'Video'} Testimonial</DialogTitle>
                    <DialogDescription>
                        Click the button below to start recording. You can record up to 5 minutes.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* Recording Status */}
                    {isRecording && (
                        <div className="flex items-center justify-center gap-4 py-8 bg-red-500/10 rounded-lg border border-red-500/30">
                            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="font-mono font-bold text-red-500">{formatTime(recordingTime)}</span>
                        </div>
                    )}

                    {/* Recording Preview */}
                    {recordedBlob && !isRecording && (
                        <div className="space-y-3">
                            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                                <p className="text-sm text-green-600 font-semibold">Recording saved</p>
                                <p className="text-xs text-green-500/70 mt-1">
                                    {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex gap-3">
                        {!isRecording && !recordedBlob && (
                            <Button
                                onClick={startRecording}
                                className="flex-1 gap-2 h-11"
                                size="lg"
                            >
                                <Mic className="h-5 w-5" />
                                Start Recording
                            </Button>
                        )}

                        {isRecording && (
                            <Button
                                onClick={stopRecording}
                                variant="destructive"
                                className="flex-1 gap-2 h-11"
                                size="lg"
                            >
                                <Square className="h-5 w-5" />
                                Stop Recording
                            </Button>
                        )}

                        {recordedBlob && !isRecording && (
                            <>
                                <Button
                                    onClick={discardRecording}
                                    variant="outline"
                                    className="gap-2 h-11"
                                    size="lg"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                    Retake
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex-1 gap-2 h-11"
                                    size="lg"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5" />
                                            Use This
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Notes */}
                    <p className="text-xs text-muted-foreground text-center">
                        {isRecording
                            ? "Recording in progress. Keep your microphone steady."
                            : recordedBlob
                            ? "Happy with your recording? Upload it as your testimonial."
                            : "Choose a quiet place for best results."}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
