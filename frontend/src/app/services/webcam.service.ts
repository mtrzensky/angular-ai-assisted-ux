import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebcamService {
  async getStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }

  async captureFrame(videoEl: HTMLVideoElement): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoEl, 0, 0);
    return await new Promise<Blob>((resolve) => canvas.toBlob(resolve as BlobCallback, 'image/png'));
  }
}