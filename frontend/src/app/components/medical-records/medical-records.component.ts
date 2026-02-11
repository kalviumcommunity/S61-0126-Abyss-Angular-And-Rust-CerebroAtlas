import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, MedicalRecord, Patient, AnalyticsResponse, StatsResponse } from '../../services/api.service';

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
    'active': true,
    'pending review': true
  };

  stats: StatsResponse | null = null;
  statsLoading = true;
  statsError = '';

  newRecord: any = {
    title: '',
    record_type: '',
    patient_id: '',
    provider: '',
    description: '',
    date: '',
    status: 'pending',
    attachments: []
  };

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Use resolver data for initial load
    this.route.data.subscribe((data: any) => {
      if (data.medicalRecordsData) {
        this.records = data.medicalRecordsData.records;
        this.patients = data.medicalRecordsData.patients;
        this.loading = false;
        
        // Initialize filtered records
        this.filterRecords();
        
        // Calculate stats from records
        this.calculateStats();
      } else {
        this.loadRecords();
        this.loadPatients();
      }
      this.loadStats();
    });
  }

  calculateStats() {
    const stats = {
      total_patients: this.patients.length,
      total_records: this.records.length,
      consultations_mtd: this.records.filter(r => r.record_type === 'consultation').length,
      completed: this.records.filter(r => r.status === 'completed').length,
      pending: this.records.filter(r => r.status === 'pending' || r.status === 'pending review').length,
      lab_results: this.records.filter(r => r.record_type === 'lab').length,
      prescriptions: this.records.filter(r => r.record_type === 'prescription').length,
      imaging: this.records.filter(r => r.record_type === 'imaging').length
    };
    
    if (!this.stats) {
      this.stats = stats;
    } else {
      // Merge with backend stats
      this.stats = { ...this.stats, ...stats };
    }
  }

  loadStats() {
    this.statsLoading = true;
    this.statsError = '';
    this.apiService.getAnalytics().subscribe({
      next: (data: AnalyticsResponse) => {
        this.stats = { ...this.stats, ...data.stats };
        this.statsLoading = false;
      },
      error: (err) => {
        this.statsError = 'Failed to load stats';
        this.statsLoading = false;
        console.error('Stats error:', err);
      }
    });
  }

  loadRecords() {
    this.loading = true;
    this.error = '';
    this.apiService.getRecords().subscribe({
      next: (data) => {
        this.records = data;
        this.filterRecords();
        this.calculateStats();
        this.loading = false;
      },
      error: (err: any) => {
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
        this.calculateStats();
      },
      error: (err) => {
        console.error('Error loading patients:', err);
      }
    });
  }

  filterRecords() {
    let filtered = [...this.records];

    // Filter by active tab
    if (this.activeTab !== 'all') {
      const tabTypeMap: { [key: string]: string } = {
        'consultations': 'consultation',
        'lab-results': 'lab',
        'prescriptions': 'prescription',
        'imaging': 'imaging'
      };
      
      const recordType = tabTypeMap[this.activeTab];
      if (recordType) {
        filtered = filtered.filter(r => r.record_type === recordType);
      }
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const term = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.provider.toLowerCase().includes(term) ||
        r.record_type.toLowerCase().includes(term) ||
        this.getPatientName(r.patient_id).toLowerCase().includes(term)
      );
    }

    // Filter by status
    const activeStatuses = Object.keys(this.selectedStatuses).filter(s => this.selectedStatuses[s]);
    if (activeStatuses.length > 0 && activeStatuses.length < Object.keys(this.selectedStatuses).length) {
      filtered = filtered.filter(r => activeStatuses.includes(r.status.toLowerCase()));
    }

    // Filter by date range
    if (this.dateRangeStart) {
      const startDate = new Date(this.dateRangeStart);
      filtered = filtered.filter(r => new Date(r.date) >= startDate);
    }
    if (this.dateRangeEnd) {
      const endDate = new Date(this.dateRangeEnd);
      filtered = filtered.filter(r => new Date(r.date) <= endDate);
    }

    this.filteredRecords = filtered;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.filterRecords();
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.filterRecords();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleStatusFilter(status: string): void {
    this.selectedStatuses[status] = !this.selectedStatuses[status];
    this.filterRecords();
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

  openNewRecordModal() {
    this.newRecord = {
      title: '',
      record_type: 'consultation',
      patient_id: this.patients.length > 0 ? this.patients[0].id : '',
      provider: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      attachments: []
    };
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

  createRecord() {
    if (!this.newRecord.title || !this.newRecord.patient_id || !this.newRecord.date) {
      alert('Please fill in all required fields');
      return;
    }

    this.apiService.createRecord(this.newRecord).subscribe({
      next: () => {
        this.loadRecords();
        this.closeNewRecordModal();
      },
      error: (err) => {
        this.error = 'Failed to create record';
        console.error('Error creating record:', err);
      }
    });
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

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length) {
      const fileArray: File[] = Array.from(files);
      this.newRecord.attachments = fileArray.map(file => file.name);
    } else {
      this.newRecord.attachments = [];
    }
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  }

  getPatientInitials(patientId: string): string {
    const name = this.getPatientName(patientId);
    if (name === 'Unknown') return 'UN';
    return name.split(' ').map(w => w[0]).join('').toUpperCase();
  }

  getCurrentRecords(): MedicalRecord[] {
    return this.filteredRecords;
  }

  getStatusColor(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return '#10b981';
      case 'active':
        return '#3b82f6';
      case 'pending review':
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
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
}