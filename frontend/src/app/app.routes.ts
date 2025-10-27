import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './components/registration/registration-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'profiling', pathMatch: 'full' },
  { path: 'profiling', component: RegistrationFormComponent },
];