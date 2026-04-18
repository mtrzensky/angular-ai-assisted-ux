import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AnalyzeResponse, ApiService } from '../../services/api.service';
import { SpeechService } from '../../services/speech.service';
import { WebcamService } from '../../services/webcam.service';
import { LanguageService } from '../../services/language.service';
import { FormField, formFieldsUsingSelects } from '../../models/formData';
import { formFieldsToJSONSchema } from '../../functions/form-fields-to-json-schema';

const SNACKBAR_DURATION_MS = 3000;

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly webcam = inject(WebcamService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
  readonly speech = inject(SpeechService);
  readonly language = inject(LanguageService);

  readonly formFields = formFieldsUsingSelects;
  readonly form: FormGroup = this.buildForm(this.formFields);

  readonly isCameraActive = signal(false);
  readonly isProcessing = signal(false);

  capturedImage: Blob | null = null;
  imageUrl: SafeUrl | null = null;
  videoStream?: MediaStream;

  private objectUrl: string | null = null;
  private videoRef?: HTMLVideoElement;
  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.speech.transcript$.pipe(takeUntil(this.destroy$)).subscribe((txt) => {
      void this.runAnalysis('status.analyzingSpeech', () =>
        this.api.analyzeText(txt, formFieldsToJSONSchema(this.formFields)),
      );
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopCamera();
    this.clearImage();
  }

  resetForm() {
    this.form.reset();
    this.clearImage();
  }

  async toggleRecording() {
    if (this.speech.isRecording()) {
      this.speech.stop();
    } else {
      await this.speech.start();
    }
  }

  async toggleCamera(videoEl: HTMLVideoElement) {
    if (this.isCameraActive()) {
      this.stopCamera();
      return;
    }
    await this.startCamera(videoEl);
    this.isCameraActive.set(true);
  }

  async captureAndAnalyze() {
    if (!this.videoRef) return;

    const blob = await this.webcam.captureFrame(this.videoRef);
    this.setCapturedImage(blob);
    this.stopCamera();

    await this.runAnalysis('status.analyzingImage', () =>
      this.api.analyzeImage(blob, formFieldsToJSONSchema(this.formFields)),
    );
  }

  private buildForm(formFields: FormField[]): FormGroup {
    const group: Record<string, string[]> = {};
    for (const field of formFields) {
      group[field.formControlName] = [''];
    }
    return this.fb.group(group);
  }

  private async runAnalysis(statusKey: string, request: () => Promise<AnalyzeResponse>) {
    this.isProcessing.set(true);
    this.notify(statusKey);
    try {
      const { parsed } = await request();
      this.applyParsedFields(parsed);
      this.notify('status.analyzingComplete');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private notify(translationKey: string) {
    this.snackBar.open(this.translate.instant(translationKey), undefined, {
      duration: SNACKBAR_DURATION_MS,
    });
  }

  private applyParsedFields(parsed: Record<string, unknown>) {
    for (const [key, value] of Object.entries(parsed ?? {})) {
      const control = this.form.controls[key];
      if (control && value !== null) control.setValue(value);
    }
  }

  private async startCamera(videoEl: HTMLVideoElement) {
    this.clearImage();
    this.videoRef = videoEl;
    this.videoStream = await this.webcam.getStream();
    videoEl.srcObject = this.videoStream;
    await videoEl.play();
  }

  private stopCamera() {
    this.videoStream?.getTracks().forEach((t) => t.stop());
    this.videoStream = undefined;
    if (this.videoRef) this.videoRef.srcObject = null;
    this.isCameraActive.set(false);
  }

  private setCapturedImage(blob: Blob) {
    this.clearImage();
    this.capturedImage = blob;
    this.objectUrl = URL.createObjectURL(blob);
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
  }

  private clearImage() {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.capturedImage = null;
    this.imageUrl = null;
    this.objectUrl = null;
  }
}
