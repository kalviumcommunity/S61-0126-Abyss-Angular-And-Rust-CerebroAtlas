import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent {
  activeTab = 'all';

  stats = [
    { label: 'Total Events Today', value: '2,847', icon: 'event' },
    { label: 'Failed Logins', value: '15', icon: 'failed' },
    { label: 'Active Sessions', value: '34', icon: 'session' },
    { label: 'Data Exports', value: '8', icon: 'export' },
  ];

  allLogs = [
    { type: 'view', title: 'Record Viewed', role: 'Physician', desc: 'Patient: Amara Okonkwo', user: 'Dr. Sarah Johnson', time: '2024-01-15 10:21:15', ip: '192.168.1.45', level: 'info' },
    { type: 'modify', title: 'Record Modified', role: 'Physician', desc: 'Consultation #1234', user: 'Dr. Sarah Johnson', time: '2024-01-15 10:12:43', ip: '192.168.1.45', level: 'info' },
    { type: 'fail', title: 'Failed Login', role: '', desc: 'System', user: 'Unknown', time: '2024-01-15 10:11:22', ip: '203.45.87.98', level: 'warning' },
    { type: 'consent', title: 'Consent Changed', role: 'Patient', desc: 'Patient: Kwame Mensah', user: 'A Patient', time: '2024-01-15 09:45:00', ip: '192.168.1.182', level: 'info' },
    { type: 'user', title: 'User Created', role: 'Administrator', desc: 'User: New Nurse', user: 'Admin User', time: '2024-01-15 09:16:51', ip: '192.168.1.10', level: 'info' },
    { type: 'export', title: 'Data Export', role: 'Physician', desc: 'Monthly Report', user: 'Dr. James Adjemeni', time: '2024-01-15 09:00:00', ip: '192.168.1.52', level: 'warning' },
    { type: 'deny', title: 'Permission Denied', role: 'Nurse', desc: 'Admin Settings', user: 'Nurse Mary', time: '2024-01-15 08:34:39', ip: '192.168.1.78', level: 'error' },
    { type: 'success', title: 'Login Success', role: 'Physician', desc: 'System', user: 'Dr. Sarah Johnson', time: '2024-01-15 08:30:12', ip: '192.168.1.45', level: 'info' },
  ];

  accessLogs = [
    { type: 'fail', title: 'Failed Login', user: 'Unknown', time: '2024-01-15 10:15:22', ip: '203.45.67.89', status: 'failed' },
    { type: 'success', title: 'Login Success', user: 'Dr. Sarah Johnson', time: '2024-01-15 08:30:00', ip: '192.168.1.45', status: 'success' },
  ];

  dataChanges = [
    { type: 'modify', title: 'Record Modified', desc: 'Consultation #1234', user: 'by Dr. Sarah Johnson', time: '2024-01-15 10:28:43' },
    { type: 'consent', title: 'Consent Changed', desc: 'Patient: Kwame Mensah', user: 'by Patient', time: '2024-01-15 09:45:00' },
    { type: 'user', title: 'User Created', desc: 'User: New Nurse', user: 'by Admin User', time: '2024-01-15 09:30:15' },
  ];

  securityAlerts = [
    { type: 'fail', title: 'Failed Login', desc: 'System', time: '2024-01-15 10:15:22', ip: '203.45.67.89', severity: 'warning' },
    { type: 'export', title: 'Data Export', desc: 'Monthly Report', time: '2024-01-15 09:00:00', ip: '192.168.1.52', severity: 'warning' },
    { type: 'deny', title: 'Permission Denied', desc: 'Admin Settings', time: '2024-01-15 08:45:30', ip: '192.168.1.78', severity: 'error' },
  ];

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
