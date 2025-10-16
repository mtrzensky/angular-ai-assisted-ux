import { Injectable, NgZone, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  recognition: any;
  transcript$ = new Subject<string>();
  recording = signal(false);

  constructor(private ngZone: NgZone) {
    const win = window as Window;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.continuous = false;

      this.recognition.onresult = (ev: any) => {
        this.processTranscript(ev);
        console.log("Speech result received.", ev);
      };

      this.recognition.onerror = (ev: any) => {
        console.error("Speech error", ev);
      };

      this.recognition.onend = () => {
        console.log("Speech recognition ended");
        this.stop();
      };
    } else {
      console.warn("SpeechRecognition not supported in this browser.");
    }
  }

  start() {
    console.log("Starting speech recognition...");
    this.recognition?.start();
    this.recording.set(true);
  }

  stop() {
    console.log("Stopping speech recognition...");
    this.recognition?.stop();
    this.recording.set(false);
  }

  processTranscript(ev: any) {
    const txt = Array.from(ev.results)
          .map((r: any) => r[0].transcript)
          .join(' ');
    this.ngZone.run(() => this.transcript$.next(txt));
  }
}
