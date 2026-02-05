import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, MedicalRecord, Patient, AnalyticsResponse, StatsResponse, VillageDistribution, ConditionDistribution, DiseaseTrend } from '../../services/api.service';

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

  getConditionColor(index: number): string {
    // Use a fixed palette for up to 5 conditions
    const palette = ['#14b8a6', '#f97316', '#3b82f6', '#8b5cf6', '#64748b'];
    return palette[index % palette.length];
  }

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

  stats: StatsResponse | null = null;
  villages: VillageDistribution[] = [];
  conditionData: ConditionDistribution[] = [];
  diseaseTrendData: DiseaseTrend[] = [];
  analyticsLoading = true;
  analyticsError = '';

  isSaving = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe((data: any) => {
      if (data.reportsData) {
        // Analytics
        this.stats = data.reportsData.analytics.stats;
        this.villages = data.reportsData.analytics.villages;
        this.conditionData = data.reportsData.analytics.conditions;
        this.diseaseTrendData = data.reportsData.analytics.disease_trend;
        this.analyticsLoading = false;
        // Records and Patients
        this.medicalReports = data.reportsData.records;
        this.patients = data.reportsData.patients;
      } else {
        this.loadRecords();
        this.loadPatients();
        this.loadAnalytics();
      }
    });
  }

  loadAnalytics() {
    this.analyticsLoading = true;
    this.analyticsError = '';
    this.api.getAnalytics().subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.villages = data.villages;
        this.conditionData = data.conditions;
        this.diseaseTrendData = data.disease_trend;
        this.analyticsLoading = false;
      },
      error: (err) => {
        this.analyticsError = 'Failed to load analytics';
        this.analyticsLoading = false;
      }
    });
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

