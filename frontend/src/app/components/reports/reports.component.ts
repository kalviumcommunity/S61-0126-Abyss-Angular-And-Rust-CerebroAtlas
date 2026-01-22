import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';

interface MedicalReport {
  id: number;
  patientName: string;
  reportType: string;
  date: string;
  status: 'Draft' | 'Completed' | 'Submitted';
  doctor: string;
  description?: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  activeTab = 'overview';
  
  // New Report Modal Properties
  showReportModal = false;
  showReportsList = false;
  editingReport: MedicalReport | null = null;
  
  newReport: Partial<MedicalReport> = {
    patientName: '',
    reportType: 'General',
    doctor: '',
    description: '',
    status: 'Draft'
  };
  
  medicalReports: MedicalReport[] = [
    { id: 1, patientName: 'John Doe', reportType: 'Lab Results', date: '2025-01-20', status: 'Completed', doctor: 'Dr. Smith' },
    { id: 2, patientName: 'Jane Smith', reportType: 'Consultation', date: '2025-01-19', status: 'Submitted', doctor: 'Dr. Sarah' },
    { id: 3, patientName: 'Michael Johnson', reportType: 'Diagnosis', date: '2025-01-18', status: 'Completed', doctor: 'Dr. Ahmed' },
    { id: 4, patientName: 'Emily Brown', reportType: 'Follow-up', date: '2025-01-17', status: 'Draft', doctor: 'Dr. Sarah' },
  ];
  
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

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  getMaxValue(): number {
    return Math.max(...this.diseaseTrendData.map(d => d.value));
  }

  openNewReportModal() {
    this.editingReport = null;
    this.newReport = {
      patientName: '',
      reportType: 'General',
      doctor: '',
      description: '',
      status: 'Draft'
    };
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.editingReport = null;
  }

  saveReport() {
    if (!this.newReport.patientName || !this.newReport.doctor) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.editingReport) {
      // Update existing report
      const index = this.medicalReports.findIndex(r => r.id === this.editingReport!.id);
      if (index !== -1) {
        this.medicalReports[index] = {
          ...this.medicalReports[index],
          patientName: this.newReport.patientName || '',
          reportType: this.newReport.reportType || 'General',
          doctor: this.newReport.doctor || '',
          description: this.newReport.description || '',
          status: this.newReport.status as 'Draft' | 'Completed' | 'Submitted'
        };
      }
    } else {
      // Create new report
      const newId = Math.max(...this.medicalReports.map(r => r.id), 0) + 1;
      const today = new Date().toISOString().split('T')[0];
      this.medicalReports.unshift({
        id: newId,
        patientName: this.newReport.patientName || '',
        reportType: this.newReport.reportType || 'General',
        date: today,
        status: this.newReport.status as 'Draft' | 'Completed' | 'Submitted',
        doctor: this.newReport.doctor || '',
        description: this.newReport.description
      });
    }

    this.closeReportModal();
  }

  editReport(report: MedicalReport) {
    this.editingReport = report;
    this.newReport = { ...report };
    this.showReportModal = true;
  }

  deleteReport(id: number) {
    if (confirm('Are you sure you want to delete this report?')) {
      this.medicalReports = this.medicalReports.filter(r => r.id !== id);
    }
  }

  toggleReportsList() {
    this.showReportsList = !this.showReportsList;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed':
        return '#10b981';
      case 'Submitted':
        return '#3b82f6';
      case 'Draft':
        return '#f97316';
      default:
        return '#6b7280';
    }
  }
}
