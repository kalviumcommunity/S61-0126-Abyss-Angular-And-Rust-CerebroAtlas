import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, Patient } from '../../services/api.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterModule, Sidebar],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  activeTab: string = 'all';
  loading: boolean = true;
  error: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.error = '';
    this.apiService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load patients: ' + (err.message || 'Unknown error');
        this.loading = false;
        console.error('Error loading patients:', err);
      }
    });
  }

  filterPatients() {
    let filtered = this.patients;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.first_name.toLowerCase().includes(term) ||
        p.last_name.toLowerCase().includes(term) ||
        p.village?.toLowerCase().includes(term) ||
        (p.active_conditions?.some(c => c.toLowerCase().includes(term)) || false)
      );
    }

    // Apply tab filter
    if (this.activeTab === 'active') {
      filtered = filtered.filter(p => p.status === 'active');
    } else if (this.activeTab === 'pending') {
      filtered = filtered.filter(p => p.sync_status === 'pending');
    } else if (this.activeTab === 'critical') {
      filtered = filtered.filter(p => p.critical_flag === true);
    }

    this.filteredPatients = filtered;
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.filterPatients();
  }

  getInitials(patient: Patient): string {
    return (patient.first_name.charAt(0) + patient.last_name.charAt(0)).toUpperCase();
  }

  deletePatient(id: string) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.apiService.deletePatient(id).subscribe({
        next: () => {
          // Remove from local arrays without reloading
          this.patients = this.patients.filter(p => p.id !== id);
          this.filteredPatients = this.filteredPatients.filter(p => p.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete patient';
          console.error('Error deleting patient:', err);
        }
      });
    }
  }

  viewPatient(id: string) {
    // Navigate to patient details if needed
  }
}