import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  recognition: any;
  transcript$ = new Subject<string>();

  constructor(private ngZone: NgZone) {
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.onresult = (ev: any) => {
        const txt = Array.from(ev.results).map((r: any) => r[0].transcript).join(' ');
        this.ngZone.run(() => this.transcript$.next(txt));
      };
      this.recognition.onerror = (ev: any) => console.error("Speech error", ev);
    } else {
      console.warn("SpeechRecognition not supported in this browser.");
    }
  }

  start() { this.recognition?.start(); }
  stop() { this.recognition?.stop(); }
}