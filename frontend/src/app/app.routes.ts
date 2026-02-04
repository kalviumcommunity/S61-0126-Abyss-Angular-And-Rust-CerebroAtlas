import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { NewPatientComponent } from './components/patients/new-patient/new-patient.component';
import { MedicalRecordsComponent } from './components/medical-records/medical-records.component';
import { MedicalRecordsResolver } from './components/medical-records/medical-records.resolver';
import { ConsentManagementComponent } from './components/consent-management/consent-management.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { AddUserComponent } from './components/administration/add-user/add-user.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardResolver } from './components/dashboard/dashboard.resolver';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], resolve: { dashboardData: DashboardResolver } },
  { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] },
  { path: 'patients/new', component: NewPatientComponent, canActivate: [AuthGuard] },
  { path: 'medical-records', component: MedicalRecordsComponent, canActivate: [AuthGuard], resolve: { medicalRecordsData: MedicalRecordsResolver } },
  { path: 'consent-management', component: ConsentManagementComponent, canActivate: [AuthGuard] },
  { path: 'audit-logs', component: AuditLogsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'administration', component: AdministrationComponent, canActivate: [AuthGuard] },
  { path: 'administration/add-user', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'Adminstration_report', component: AdministrationComponent, canActivate: [AuthGuard] },
];
