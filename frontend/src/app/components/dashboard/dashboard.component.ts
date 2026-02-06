import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, Patient, MedicalRecord } from '../../services/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule, Sidebar],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  recentPatients: Patient[] = [];
  recentRecords: MedicalRecord[] = [];
  loading: boolean = true;
  error: string = '';

  stats = {
    totalPatients: 0,
    patientsChange: 0,
    recordsToday: 0,
    recordsChange: 0,
    appointments: 0,
    appointmentsChange: 0,
    pendingSyncs: 0
  };

  private routerEventsSub: Subscription | null = null;

  userEmail: string = '';
  userName: string = '';
  overviewMessage: string = '';

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Use resolver data for initial load
    this.route.data.subscribe((data: any) => {
      if (data.dashboardData) {
        this.stats.totalPatients = data.dashboardData.patients.length;
        this.recentPatients = data.dashboardData.patients.slice(0, 3);
        this.updateNotifications(data.dashboardData.patients);
        this.stats.recordsToday = data.dashboardData.records.length;
        this.recentRecords = data.dashboardData.records.slice(0, 3);
        this.loading = false;
      } else {
        this.loadDashboardData();
      }
    });
    // Subscribe to router events to reload data when navigating to dashboard
    this.routerEventsSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/dashboard')) {
        this.loadDashboardData();
      }
    });

    // Get user email from localStorage/session
    this.userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    this.userName = this.extractNameFromEmail(this.userEmail);
    this.overviewMessage = `Welcome back, ${this.userName}. Here's today's overview.`;
  }

  ngOnDestroy() {
    if (this.routerEventsSub) {
      this.routerEventsSub.unsubscribe();
    }
  }

  loadDashboardData() {
    this.loading = true;
    this.error = '';

    this.apiService.getPatients().subscribe({
      next: (patients) => {
        this.stats.totalPatients = patients.length;
        this.recentPatients = patients.slice(0, 3);
        this.updateNotifications(patients);
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
        console.error('Error loading patients:', err);
      }
    });

    this.apiService.getRecords().subscribe({
      next: (records) => {
        this.stats.recordsToday = records.length;
        this.recentRecords = records.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading records:', err);
      }
    });
  }

  updateNotifications(patients: Patient[]) {
    this.notifications = [
      {
        message: `Total Patients: ${patients.length}`,
        time: 'Just now',
        type: 'info'
      },
      {
        message: `Active Patients: ${patients.filter(p => p.status === 'active').length}`,
        time: '1 min ago',
        type: 'success'
      },
      {
        message: `Critical Flags: ${patients.filter(p => p.critical_flag).length}`,
        time: '5 min ago',
        type: 'warning'
      }
    ];
  }

  getInitials(patient: Patient): string {
    return (patient.first_name.charAt(0) + patient.last_name.charAt(0)).toUpperCase();
  }

  getPatientInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getPatientAge(dateOfBirth: string): string {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return 'N/A';
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthDateOnly = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (birthDateOnly > todayDateOnly) return 'N/A';
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age === 0) return 'Newborn';
    return age > 0 ? age.toString() : 'N/A';
  }

  extractNameFromEmail(email: string): string {
    if (!email) return 'Doctor';
    const namePart = email.split('@')[0];
    return namePart.split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
