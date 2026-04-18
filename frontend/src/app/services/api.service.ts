import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { JSONSchema7 } from 'json-schema';
import { LanguageService } from './language.service';

export interface AnalyzeResponse {
  parsed: Record<string, unknown>;
}

export interface TranscribeResponse {
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:3000/api/ai';
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);

  analyzeText(text: string, formStructure: JSONSchema7): Promise<AnalyzeResponse> {
    return firstValueFrom(
      this.http.post<AnalyzeResponse>(`${this.base}/analyze-text`, {
        text,
        formStructure,
        language: this.language.get(),
      }),
    );
  }

  analyzeImage(file: Blob, formStructure: JSONSchema7): Promise<AnalyzeResponse> {
    const fd = this.buildFormData({ image: [file, 'capture.png'] });
    fd.append('formStructure', JSON.stringify(formStructure));
    return firstValueFrom(this.http.post<AnalyzeResponse>(`${this.base}/analyze-image`, fd));
  }

  transcribeAudio(audio: Blob, filename = 'audio.webm'): Promise<TranscribeResponse> {
    const fd = this.buildFormData({ audio: [audio, filename] });
    return firstValueFrom(this.http.post<TranscribeResponse>(`${this.base}/transcribe-audio`, fd));
  }

  private buildFormData(files: Record<string, [Blob, string]>): FormData {
    const fd = new FormData();
    for (const [key, [blob, name]] of Object.entries(files)) {
      fd.append(key, blob, name);
    }
    fd.append('language', this.language.get());
    return fd;
  }
}
