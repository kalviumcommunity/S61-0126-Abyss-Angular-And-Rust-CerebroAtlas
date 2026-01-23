import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, Patient, MedicalRecord } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule, Sidebar],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
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

  getPatientAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
