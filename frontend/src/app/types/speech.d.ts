interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart?: (this: SpeechRecognition, ev: Event) => any;
  onsoundstart?: (this: SpeechRecognition, ev: Event) => any;
  onspeechstart?: (this: SpeechRecognition, ev: Event) => any;
  onspeechend?: (this: SpeechRecognition, ev: Event) => any;
  onsoundend?: (this: SpeechRecognition, ev: Event) => any;
  onaudioend?: (this: SpeechRecognition, ev: Event) => any;
  onresult?: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
  onnomatch?: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
  onerror?: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
  onstart?: (this: SpeechRecognition, ev: Event) => any;
  onend?: (this: SpeechRecognition, ev: Event) => any;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface Window {
  SpeechRecognition: {
    new (): SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}
