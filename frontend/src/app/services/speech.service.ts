import { Injectable, NgZone, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  recognition: SpeechRecognition | undefined;
  transcriptBuffer = '';
  transcript$ = new Subject<string>();
  isRecording = signal(false);

  constructor(private ngZone: NgZone) {
    const win = window as Window;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.continuous = true;

      this.recognition.onresult = (ev: SpeechRecognitionEvent) => {
        this.processTranscript(ev);
        console.log("Speech result received.", ev);
      };

      this.recognition.onerror = (ev: SpeechRecognitionErrorEvent) => {
        console.error("Speech error", ev);
      };

      this.recognition.onend = () => {
        console.log("Speech recognition ended");
        this.sendTranscript();
        this.stop();
      };
    } else {
      console.warn("SpeechRecognition not supported in this browser.");
    }
  }

  start() {
    console.log("Starting speech recognition...");
    this.recognition?.start();
    this.isRecording.set(true);
  }

  stop() {
    console.log("Stopping speech recognition...");
    this.recognition?.stop();
    this.isRecording.set(false);
  }

  processTranscript(ev: SpeechRecognitionEvent) {
    const txt = Array.from(ev.results)
          .map((r: SpeechRecognitionResult) => r[0].transcript)
          .join(' \n');
    this.transcriptBuffer = txt;
  }

  sendTranscript() {
    this.ngZone.run(() => {
      this.transcript$.next(this.transcriptBuffer.trim());
    });
  }
}
