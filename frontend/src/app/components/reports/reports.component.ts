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
        this.processReportsData(data.reportsData);
      } else {
        this.loadAllData();
      }
    });
  }

  processReportsData(data: any) {
    // Process analytics
    if (data.analytics) {
      this.stats = data.analytics.stats || null;
      this.villages = data.analytics.villages || [];
      this.conditionData = data.analytics.conditions || [];
      this.diseaseTrendData = data.analytics.disease_trend || [];
    }
    
    // Process records and patients
    this.medicalReports = data.records || [];
    this.patients = data.patients || [];
    
    this.analyticsLoading = false;
  }

  loadAllData() {
    this.loadAnalytics();
    this.loadRecords();
    this.loadPatients();
  }

  loadAnalytics() {
    this.analyticsLoading = true;
    this.analyticsError = '';
    this.api.getAnalytics().subscribe({
      next: (data: AnalyticsResponse) => {
        this.stats = data.stats;
        this.villages = data.villages;
        this.conditionData = data.conditions;
        this.diseaseTrendData = data.disease_trend;
        this.analyticsLoading = false;
      },
      error: (err) => {
        this.analyticsError = 'Failed to load analytics';
        this.analyticsLoading = false;
        console.error('Analytics error:', err);
      }
    });
  }

  loadRecords() {
    this.api.getRecords().subscribe({
      next: (records) => {
        this.medicalReports = records;
      },
      error: (err) => {
        console.error('Records error:', err);
      }
    });
  }

  loadPatients() {
    this.api.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (err) => {
        console.error('Patients error:', err);
      }
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  // Chart calculation helpers
  getConditionColor(index: number): string {
    const palette = ['#14b8a6', '#f97316', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b'];
    return palette[index % palette.length];
  }

  getConditionPercentage(condition: ConditionDistribution): number {
    if (!this.conditionData || this.conditionData.length === 0) return 0;
    return Math.round(condition.percentage);
  }

  // Calculate donut chart segments
  getDonutSegment(index: number): { offset: number; dasharray: string } {
    if (!this.conditionData || this.conditionData.length === 0) {
      return { offset: 0, dasharray: '0 502.4' };
    }

    const circumference = 502.4; // 2 * PI * 80 (radius)
    
    let cumulativePercentage = 0;
    for (let i = 0; i < index; i++) {
      cumulativePercentage += this.conditionData[i].percentage;
    }
    
    const percentage = this.conditionData[index].percentage;
    const segmentLength = (percentage / 100) * circumference;
    const offset = -(cumulativePercentage / 100) * circumference;
    
    return {
      offset: offset,
      dasharray: `${segmentLength} ${circumference}`
    };
  }

  getMaxDiseaseTrendValue(): number {
    if (!this.diseaseTrendData || this.diseaseTrendData.length === 0) return 100;
    return Math.max(...this.diseaseTrendData.map(d => d.value), 100);
  }

  // Scale value to chart height (300px)
  scaleToChart(value: number): number {
    const maxValue = this.getMaxDiseaseTrendValue();
    return 300 - ((value / maxValue) * 280); // Leave 20px margin
  }

  // Generate trend line points
  getTrendLinePoints(): string {
    if (!this.diseaseTrendData || this.diseaseTrendData.length === 0) {
      return '0,150';
    }
    
    const width = 700;
    const stepX = width / (this.diseaseTrendData.length - 1 || 1);
    
    return this.diseaseTrendData
      .map((d, i) => `${i * stepX},${this.scaleToChart(d.value)}`)
      .join(' ');
  }

  // Modal methods
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
    if (this.isSaving) return;
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
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }))
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
      this.api.deleteRecord(id).subscribe({
        next: () => {
          this.medicalReports = this.medicalReports.filter(r => r.id !== id);
        },
        error: (err) => {
          console.error('Delete error:', err);
        }
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
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  }

  // Y-axis labels for disease trend chart
  getYAxisLabels(): number[] {
    const max = this.getMaxDiseaseTrendValue();
    return [max, Math.floor(max * 0.75), Math.floor(max * 0.5), Math.floor(max * 0.25), 0];
  }
}