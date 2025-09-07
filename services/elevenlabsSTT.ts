// Simple ElevenLabs Speech-to-Text service using browser MediaRecorder output
// This posts recorded audio to ElevenLabs STT REST API and returns the transcribed text.

const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;

if (!ELEVEN_API_KEY) {
  console.warn('[ElevenLabs STT] VITE_ELEVENLABS_API_KEY is not set. Speech-to-text will be disabled.');
}

export async function transcribeAudio(blob: Blob): Promise<string> {
  if (!ELEVEN_API_KEY) throw new Error('ElevenLabs API key is not configured.');

  // ElevenLabs STT quickstart expects multipart form with file and model_id (e.g., "scribe_v1")
  const form = new FormData();
  form.append('file', blob, 'audio.webm');
  form.append('model_id', 'scribe_v1');

  const resp = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVEN_API_KEY,
    },
    body: form,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`STT request failed: ${resp.status} ${resp.statusText} ${text}`);
  }

  const data = await resp.json();
  // Response typically: { text: string, ... }
  const transcript = data?.text || '';
  return transcript;
}

export type MicPermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export async function checkMicPermission(): Promise<MicPermissionState> {
  try {
    // Not all browsers support navigator.permissions for microphone
    const anyNav: any = navigator as any;
    if (anyNav?.permissions && anyNav.permissions.query) {
      const status = await anyNav.permissions.query({ name: 'microphone' as any });
      return (status.state as MicPermissionState) || 'unknown';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}
