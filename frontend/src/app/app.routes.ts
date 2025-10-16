import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './components/registration/registration-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationFormComponent },
  { path: 'profiling', component: RegistrationFormComponent },
];