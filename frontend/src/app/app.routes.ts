
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { NewPatientComponent } from './components/patients/new-patient/new-patient.component';
import { MedicalRecordsComponent } from './components/medical-records/medical-records.component';
import { ConsentManagementComponent } from './components/consent-management/consent-management.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { AddUserComponent } from './components/administration/add-user/add-user.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'patients/new', component: NewPatientComponent },
  { path: 'medical-records', component: MedicalRecordsComponent },
  { path: 'consent-management', component: ConsentManagementComponent },
  { path: 'audit-logs', component: AuditLogsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'administration', component: AdministrationComponent },
  { path: 'administration/add-user', component: AddUserComponent },
  { path: 'Adminstration_report', component: AdministrationComponent },
];
