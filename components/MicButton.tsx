import React, { useEffect, useRef, useState } from 'react';
import { transcribeAudio, checkMicPermission, MicPermissionState } from '../services/elevenlabsSTT';

interface MicButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  title?: string;
}

export const MicButton: React.FC<MicButtonProps> = ({ onTranscript, className = '', title = 'Speak your prompt' }) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [perm, setPerm] = useState<MicPermissionState>('unknown');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkMicPermission().then(setPerm).catch(() => setPerm('unknown'));
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType =
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        setLoading(true);
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
          const text = await transcribeAudio(blob);
          if (text) onTranscript(text);
        } catch (e: any) {
          setError(e?.message || 'Failed to transcribe audio');
        } finally {
          setLoading(false);
          stopStream();
        }
      };
      mr.start();
      setRecording(true);
    } catch (e: any) {
      setError(e?.message || 'Microphone access denied');
      setRecording(false);
      stopStream();
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    setRecording(false);
  };

  const onClick = () => {
    if (loading) return;
    if (!recording) startRecording();
    else stopRecording();
  };

  const titleText = loading
    ? 'Transcribing...'
    : recording
    ? 'Stop recording'
    : perm === 'denied'
    ? 'Microphone permission denied'
    : title;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading || perm === 'denied'}
        title={titleText}
        className={`flex items-center gap-2 border rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          recording
            ? 'bg-red-600 text-white border-red-700 hover:bg-red-700'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {recording ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 4.5A2.5 2.5 0 0113 4.5v5a2.5 2.5 0 11-5 0v-5z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3z" />
            <path d="M19 11a1 1 0 10-2 0 5 5 0 11-10 0 1 1 0 10-2 0 7 7 0 0011 5.746V20a1 1 0 102 0v-3.254A7 7 0 0019 11z" />
          </svg>
        )}
        {loading ? 'Transcribing...' : recording ? 'Stop' : 'Speak'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};
