import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api/ai';

  constructor(private http: HttpClient) {}

  analyzeText(text: string, formStructure: string) {
    return firstValueFrom(this.http.post(`${this.base}/analyze-text`, { text, formStructure }));
  }

  analyzeImage(file: Blob, formStructure: string) {
    const fd = new FormData();
    fd.append('image', file, 'capture.png');
    fd.append('formStructure', formStructure);

    return firstValueFrom(this.http.post(`${this.base}/analyze-image`, fd));
  }
}