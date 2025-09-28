import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api/ai';

  constructor(private http: HttpClient) {}

  analyzeText(text: string) {
    return firstValueFrom(this.http.post(`${this.base}/analyze-text`, { text }));
  }

  analyzeImage(file: Blob) {
    const fd = new FormData();
    fd.append('image', file, 'capture.png');
    return firstValueFrom(this.http.post(`${this.base}/analyze-image`, fd));
  }

  autocomplete(field: string, query: string, context?: any) {
    return firstValueFrom(this.http.post(`${this.base}/autocomplete`, { field, query, context }));
  }
}