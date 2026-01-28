import { Component, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, MedicalRecord, Patient } from '../../services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  activeTab = 'overview';

  showReportModal = false;
  showReportsList = false;
  editingReport: MedicalRecord | null = null;

  patients: Patient[] = [];
  selectedPatient: Patient | null = null;

  newReport: Partial<MedicalRecord> = {
    patient_id: '',
    record_type: 'General',
    title: '',
    provider: '',
    date: '',
    status: 'Draft',
    description: ''
  };

  medicalReports: MedicalRecord[] = [];

  reportTypes = ['General', 'Lab Results', 'Consultation', 'Diagnosis', 'Follow-up', 'Treatment Plan'];
  doctors = ['Dr. Sarah', 'Dr. Smith', 'Dr. Ahmed', 'Dr. Williams', 'Dr. Brown'];

  stats = [
    { label: 'Total Patients', value: '2,847', change: '+12% vs last month', icon: 'patients', trend: 'up' },
    { label: 'Consultations (MTD)', value: '1,234', change: '+8% vs last month', icon: 'consultations', trend: 'up' },
    { label: 'Avg Wait Time', value: '23 min', change: '-15% vs last month', icon: 'waittime', trend: 'down' },
    { label: 'Data Completeness', value: '94%', change: '+2% vs last month', icon: 'completeness', trend: 'up' },
  ];

  diseaseTrendData = [
    { month: 'Jul', value: 320 },
    { month: 'Aug', value: 365 },
    { month: 'Sep', value: 398 },
    { month: 'Oct', value: 415 },
    { month: 'Nov', value: 452 },
    { month: 'Dec', value: 428 },
    { month: 'Jan', value: 478 }
  ];

  villages = [
    { name: 'Umuahia North', patients: 542, growth: '+12%' },
    { name: 'Aba South', patients: 423, growth: '+8%' },
    { name: 'Ikwuano', patients: 312, growth: '+15%' },
    { name: 'Osisioma', patients: 287, growth: '+5%' },
    { name: 'Umuahia South', patients: 256, growth: '+3%' },
  ];

  conditionData = [
    { condition: 'Malaria', percentage: 35, color: '#14b8a6' },
    { condition: 'Hypertension', percentage: 25, color: '#f97316' },
    { condition: 'Diabetes', percentage: 20, color: '#3b82f6' },
    { condition: 'Respiratory', percentage: 12, color: '#8b5cf6' },
    { condition: 'Other', percentage: 8, color: '#64748b' },
  ];

  isSaving = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadRecords();
    this.loadPatients();
  }


  loadRecords() {
    this.api.getRecords().subscribe(records => {
      this.medicalReports = records;
    });
  }

  loadPatients() {
    this.api.getPatients().subscribe(patients => {
      this.patients = patients;
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  getMaxValue(): number {
    return Math.max(...this.diseaseTrendData.map(d => d.value));
  }

  openNewReportModal() {
    this.editingReport = null;
    this.selectedPatient = null;
    this.newReport = {
      patient_id: '',
      record_type: 'General',
      title: '',
      provider: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      description: ''
    };
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.editingReport = null;
    this.selectedPatient = null;
  }

  saveReport() {
    if (this.isSaving) return; // Prevent double click
    this.isSaving = true;

    const patient = this.patients.find(p => p.id === this.newReport.patient_id);
    if (!patient || !this.newReport.record_type || !this.newReport.provider) {
      alert('Please fill in all required fields');
      this.isSaving = false;
      return;
    }

    const record: Partial<MedicalRecord> = {
      patient_id: this.newReport.patient_id,
      record_type: this.newReport.record_type,
      title: this.newReport.title || `${this.newReport.record_type} Report`,
      provider: this.newReport.provider,
      date: this.newReport.date || new Date().toISOString().split('T')[0],
      status: this.newReport.status || 'Draft',
      description: this.newReport.description
    };

    this.api.createRecord(record)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges(); // 🔥 forces UI refresh
        })
      )
      .subscribe({
        next: (createdRecord) => {
          this.medicalReports.unshift(createdRecord as MedicalRecord);
          this.closeReportModal();
        },
        error: () => {
          alert('Failed to create report');
        }
      });

  }

  editReport(report: MedicalRecord) {
    this.editingReport = report;
    this.selectedPatient = this.patients.find(p => p.id === report.patient_id) || null;
    this.newReport = { ...report };
    this.showReportModal = true;
  }

  deleteReport(id: string) {
    if (confirm('Are you sure you want to delete this report?')) {
      this.api.deleteRecord(id).subscribe(() => {
        this.medicalReports = this.medicalReports.filter(r => r.id !== id);
      });
    }
  }

  toggleReportsList() {
    this.showReportsList = !this.showReportsList;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'Submitted': return '#3b82f6';
      case 'Draft': return '#f97316';
      default: return '#6b7280';
    }
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : '';
  }
}
