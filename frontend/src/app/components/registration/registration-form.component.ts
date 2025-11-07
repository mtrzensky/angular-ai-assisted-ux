import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SpeechService } from '../../services/speech.service';
import { WebcamService } from '../../services/webcam.service';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormField, formFieldsUsingSelects, formFieldsUsingText } from '../../models/formData';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { formFieldsToJSONSchema } from '../../functions/form-fields-to-json-schema';

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
    MatProgressSpinnerModule
  ],
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private fb: FormBuilder = inject(FormBuilder);
  private api: ApiService = inject(ApiService);
  private webcam: WebcamService = inject(WebcamService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  speech = inject(SpeechService);

  formFields = formFieldsUsingSelects;

  form: FormGroup = this.buildForm(this.formFields);

  capturedImage: Blob | null = null;

  imageUrl: SafeUrl | null = null;

  private objectUrl: string | null = null;

  private destroy$ = new Subject<void>();

  // signals for UI state
  isCameraActive = signal(false);
  isProcessing = signal(false);

  videoStream?: MediaStream;
  videoRef!: HTMLVideoElement;

  buildForm(formFields: FormField[]) {
    const group: Record<string, string[]> = {};
    formFields.forEach(field => {
      group[field.formControlName] = [''];
    });

    return this.fb.group(group);
  }

  ngOnInit() {
    this.speech.transcript$.subscribe(async (txt) => {
      this.isProcessing.set(true);
      this.snackBar.open("Analyzing speech...", undefined, { duration: 3000 });
      console.log("Speech recognized:", txt);
      const res = await this.api.analyzeText(txt, formFieldsToJSONSchema(this.formFields)) as { parsed: Record<string, any> };
      this.applyParsedFields(res.parsed);
      this.snackBar.open("Analyzing complete!", undefined, { duration: 3000 });
      this.isProcessing.set(false);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.videoStream?.getTracks().forEach(t => t.stop());
    this.clearImage();
  }

  applyParsedFields(parsed: any) {
    Object.keys(parsed || {}).forEach(k => {
      if (this.form.controls[k] && parsed[k] !== null) {
        this.form.controls[k].setValue(parsed[k]);
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.clearImage();
  }

  toggleRecording() {
    if (!this.speech.isRecording()) {
      this.speech.start();
    } else {
      this.speech.stop();
    }
  }

  toggleCamera(videoEl: HTMLVideoElement) {
    if (this.isCameraActive()) {
      this.stopCamera();
    } else {
      this.startCamera(videoEl).then(() => {
        this.isCameraActive.set(true);
      });
    }
  }

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = undefined;
    }

    if (this.videoRef) {
      this.videoRef.srcObject = null;
    }

    this.isCameraActive.set(false);
  }

  async startCamera(videoEl: HTMLVideoElement) {
    this.clearImage();
    this.videoRef = videoEl;
    this.videoStream = await this.webcam.getStream();
    videoEl.srcObject = this.videoStream;
    await videoEl.play();
  }

  private clearImage() {
    if (this.capturedImage && this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    this.capturedImage = null;
    this.objectUrl = null;
  }

  async captureAndAnalyze() {
    this.isProcessing.set(true);
    this.snackBar.open("Analyzing webcam picture...", undefined, { duration: 3000 });
    const blob = await this.webcam.captureFrame(this.videoRef);
    this.capturedImage = blob;
    this.objectUrl = URL.createObjectURL(blob);
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
    this.stopCamera();
    const res: any = await this.api.analyzeImage(blob, formFieldsToJSONSchema(this.formFields));
    this.snackBar.open("Analyzing complete!", undefined, { duration: 3000 });
    this.isProcessing.set(false);
    this.applyParsedFields(res.parsed);
  }
}
