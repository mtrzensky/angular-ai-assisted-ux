import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SpeechService } from '../../services/speech.service';
import { WebcamService } from '../../services/webcam.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormField, formFieldsUsingSelects, formFieldsUsingText } from '../../../../../models/formData';

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
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  form: FormGroup;

  formFields = formFieldsUsingSelects;

  suggestions$ = signal<string[]>([]);

  private destroy$ = new Subject<void>();

  private autocompleteTrigger$ = new Subject<{field:string, value:string}>();

  speech = inject(SpeechService);

  // signals for UI state
  isCameraActive = signal(false);
  isProcessing = signal(false);

  videoStream?: MediaStream;
  videoRef!: HTMLVideoElement;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private webcam: WebcamService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.buildForm(this.formFields);
  }

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
      const res: any = await this.api.analyzeText(txt, this.formFields.map(f => `${f.formControlName}: ${f.type}`).join('\n').toString());
      this.applyParsedFields(res.parsed);
      this.snackBar.open("Analyzing complete!", undefined, { duration: 3000 });
      this.isProcessing.set(false);
    });

    this.autocompleteTrigger$
      .pipe(debounceTime(400), distinctUntilChanged((a,b)=> a.field===b.field && a.value===b.value))
      .subscribe(async ({field, value}) => {
        if (value.length < 3) {
          this.suggestions$.set([]);
          return;
        }
        const ctx = this.form.value;
        const res: any = await this.api.autocomplete(field, value, ctx);
        this.suggestions$.set(res.suggestions || []);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.videoStream?.getTracks().forEach(t => t.stop());
  }

  applyParsedFields(parsed: any) {
    Object.keys(parsed || {}).forEach(k => {
      if (this.form.controls[k] && parsed[k] !== null) {
        this.form.controls[k].setValue(parsed[k]);
      }
    });
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
    this.videoRef = videoEl;
    this.videoStream = await this.webcam.getStream();
    videoEl.srcObject = this.videoStream;
    await videoEl.play();
  }

  async captureAndAnalyze() {
    this.isProcessing.set(true);
    this.snackBar.open("Analyzing webcam picture...", undefined, { duration: 3000 });
    const blob = await this.webcam.captureFrame(this.videoRef);
    const res: any = await this.api.analyzeImage(blob, this.formFields.map(f => `${f.formControlName}: ${f.type}`).join('\n').toString());
    this.snackBar.open("Analyzing complete!", undefined, { duration: 3000 });
    this.isProcessing.set(false);
    this.applyParsedFields(res.parsed);
  }

  // autocomplete input binding
  onInput(field: string, evt: Event) {
    const val = (evt.target as HTMLInputElement).value;
    this.autocompleteTrigger$.next({field, value: val});
  }

  // when user selects a suggestion
  applySuggestion(field: string, val: string) {
    this.form.controls[field].setValue(val);
    this.suggestions$.set([]);
  }

  // manual submit for demo
  submit() {
    console.log("Final form value:", this.form.value);
    alert('Form submitted — check console.');
  }
}
