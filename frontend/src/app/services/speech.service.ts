import { Injectable, NgZone, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private mediaRecorder?: MediaRecorder;
  private chunks: Blob[] = [];
  private stream?: MediaStream;
  private mimeType = 'audio/webm';

  transcript$ = new Subject<string>();
  isRecording = signal(false);
  isTranscribing = signal(false);

  constructor(private ngZone: NgZone, private api: ApiService) {}

  async start() {
    if (this.isRecording()) return;

    this.chunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mimeType = this.pickMimeType();

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: this.mimeType });

    this.mediaRecorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) this.chunks.push(ev.data);
    };

    this.mediaRecorder.onstop = () => this.onRecordingStopped();

    this.mediaRecorder.start();
    this.isRecording.set(true);
    console.log('Recording started', this.mimeType);
  }

  stop() {
    if (!this.isRecording()) return;
    this.mediaRecorder?.stop();
    this.isRecording.set(false);
    console.log('Recording stopped');
  }

  private async onRecordingStopped() {
    this.releaseStream();

    if (!this.chunks.length) return;

    const blob = new Blob(this.chunks, { type: this.mimeType });
    this.chunks = [];

    this.isTranscribing.set(true);
    try {
      const { text } = await this.api.transcribeAudio(blob, this.filenameForMime(this.mimeType));
      this.ngZone.run(() => this.transcript$.next((text || '').trim()));
    } catch (err) {
      console.error('Transcription failed', err);
    } finally {
      this.isTranscribing.set(false);
    }
  }

  private releaseStream() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = undefined;
  }

  private pickMimeType(): string {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
    for (const type of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) return type;
    }
    return 'audio/webm';
  }

  private filenameForMime(mime: string): string {
    if (mime.includes('ogg')) return 'audio.ogg';
    if (mime.includes('mp4')) return 'audio.mp4';
    return 'audio.webm';
  }
}
