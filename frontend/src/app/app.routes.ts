import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResponsiveShowcaseComponent } from './components/responsive-showcase/responsive-showcase.component';
import { PatientsComponent } from './components/patients/patients.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'responsive-showcase', component: ResponsiveShowcaseComponent },
  { path: 'patients', component: PatientsComponent },
];
