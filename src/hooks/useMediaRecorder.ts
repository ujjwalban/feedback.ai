import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface MediaRecorderState {
    isRecording: boolean;
    recordedBlob: Blob | null;
    recordingTime: number;
}

export function useMediaRecorder(type: 'audio' | 'video') {
    const [state, setState] = useState<MediaRecorderState>({
        isRecording: false,
        recordedBlob: null,
        recordingTime: 0,
    });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const constraints = type === 'audio'
                ? { audio: true }
                : { audio: true, video: { width: 1280, height: 720 } };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            chunksRef.current = [];

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const mimeType = type === 'audio' ? 'audio/webm' : 'video/webm';
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setState((prev) => ({ ...prev, recordedBlob: blob }));
            };

            mediaRecorder.start();
            setState((prev) => ({ ...prev, isRecording: true, recordingTime: 0 }));

            // Start timer
            timerRef.current = setInterval(() => {
                setState((prev) => ({ ...prev, recordingTime: prev.recordingTime + 1 }));
            }, 1000);
        } catch (error) {
            console.error('Error accessing media:', error);
            toast.error(`Failed to access ${type}. Please check permissions.`);
        }
    }, [type]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setState((prev) => ({ ...prev, isRecording: false }));
    }, []);

    const discardRecording = useCallback(() => {
        setState((prev) => ({ ...prev, recordedBlob: null, recordingTime: 0 }));
        chunksRef.current = [];
    }, []);

    return {
        ...state,
        startRecording,
        stopRecording,
        discardRecording,
    };
}
