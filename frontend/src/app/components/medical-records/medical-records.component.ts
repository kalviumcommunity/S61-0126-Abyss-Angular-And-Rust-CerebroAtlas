import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, MedicalRecord, Patient } from '../../services/api.service';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.css']
})
export class MedicalRecordsComponent implements OnInit {
  activeTab = 'all';
  searchQuery = '';
  showNewRecordModal = false;
  showDetailsModal = false;
  showFilters = false;
  dateRangeStart = '';
  dateRangeEnd = '';
  selectedRecord: MedicalRecord | null = null;
  records: MedicalRecord[] = [];
  filteredRecords: MedicalRecord[] = [];
  patients: Patient[] = [];
  loading: boolean = true;
  error: string = '';

  selectedStatuses: { [key: string]: boolean } = {
    'completed': true,
    'pending': true,
    'active': true
  };

  stats = [
    { label: 'Total Records', value: '0', icon: 'consultations' },
    { label: 'Completed', value: '0', icon: 'lab-results' },
    { label: 'Pending', value: '0', icon: 'prescriptions' },
    { label: 'Lab Results', value: '0', icon: 'imaging' },
  ];

  newRecord = {
    title: '',
    record_type: '',
    patient_id: '',
    provider: '',
    description: '',
    date: '',
    status: 'pending'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRecords();
    this.loadPatients();
  }

  loadRecords() {
    this.loading = true;
    this.error = '';
    this.apiService.getRecords().subscribe({
      next: (data) => {
        this.records = data;
        this.filteredRecords = data;
        this.updateStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load medical records';
        this.loading = false;
        console.error('Error loading records:', err);
      }
    });
  }

  loadPatients() {
    this.apiService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
      }
    });
  }

  updateStats() {
    const total = this.records.length;
    const completed = this.records.filter(r => r.status === 'completed').length;
    const pending = this.records.filter(r => r.status === 'pending').length;
    const labs = this.records.filter(r => r.record_type === 'lab').length;

    this.stats = [
      { label: 'Total Records', value: total.toString(), icon: 'consultations' },
      { label: 'Completed', value: completed.toString(), icon: 'lab-results' },
      { label: 'Pending', value: pending.toString(), icon: 'prescriptions' },
      { label: 'Lab Results', value: labs.toString(), icon: 'imaging' },
    ];
  }

  filterRecords() {
    let filtered = this.records;

    if (this.searchQuery.trim()) {
      const term = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.provider.toLowerCase().includes(term) ||
        r.record_type.toLowerCase().includes(term)
      );
    }

    if (this.activeTab === 'completed') {
      filtered = filtered.filter(r => r.status === 'completed');
    } else if (this.activeTab === 'pending') {
      filtered = filtered.filter(r => r.status === 'pending');
    }

    this.filteredRecords = filtered;
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.filterRecords();
  }

  openNewRecordModal() {
    this.showNewRecordModal = true;
  }

  closeNewRecordModal() {
    this.showNewRecordModal = false;
  }

  openDetailsModal(record: MedicalRecord) {
    this.selectedRecord = record;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedRecord = null;
  }

  deleteRecord(id: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.apiService.deleteRecord(id).subscribe({
        next: () => {
          this.loadRecords();
        },
        error: (err) => {
          this.error = 'Failed to delete record';
          console.error('Error deleting record:', err);
        }
      });
    }
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  }

  getCurrentRecords(): MedicalRecord[] {
    return this.filteredRecords;
  }

  getStatusColor(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'active':
        return '#10b981';
      case 'pending review':
      case 'pending':
        return '#f97316';
      default:
        return '#6b7280';
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.filterRecords();
  }

  getPatientInitials(patientId: string): string {
    const name = this.getPatientName(patientId);
    return name.split(' ').map(w => w[0]).join('').toUpperCase();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleStatusFilter(status: string): void {
    if (this.selectedStatuses.hasOwnProperty(status)) {
      this.selectedStatuses[status] = !this.selectedStatuses[status];
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.dateRangeStart = '';
    this.dateRangeEnd = '';
    Object.keys(this.selectedStatuses).forEach(status => {
      this.selectedStatuses[status] = true;
    });
    this.filterRecords();
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.filterRecords();
  }

  exportRecords(): void {
    const records = this.filteredRecords;
    const headers = ['Title', 'Type', 'Patient', 'Provider', 'Date', 'Status', 'Description'];
    const rows = records.map(r => [
      `"${r.title}"`,
      `"${r.record_type}"`,
      `"${this.getPatientName(r.patient_id)}"`,
      `"${r.provider}"`,
      `"${r.date}"`,
      `"${r.status}"`,
      `"${r.description || ''}"`
    ]);

    const csvRows = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `medical-records-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  createRecord() {
    // Optionally validate required fields here
    this.apiService.createRecord(this.newRecord).subscribe({
      next: () => {
        this.loadRecords();
        this.newRecord = {
          title: '',
          record_type: '',
          patient_id: '',
          provider: '',
          description: '',
          date: '',
          status: 'pending'
        };
        this.showNewRecordModal = false;
      },
      error: (err) => {
        this.error = 'Failed to create record';
        console.error('Error creating record:', err);
      }
    });
  }
}
