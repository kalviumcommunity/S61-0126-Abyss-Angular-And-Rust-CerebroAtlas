
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { NewPatientComponent } from './components/patients/new-patient/new-patient.component';
import { MedicalRecordsComponent } from './components/medical-records/medical-records.component';
import { ConsentManagementComponent } from './components/consent-management/consent-management.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'patients/new', component: NewPatientComponent },
  { path: 'medical-records', component: MedicalRecordsComponent },
  { path: 'consent-management', component: ConsentManagementComponent },
];
