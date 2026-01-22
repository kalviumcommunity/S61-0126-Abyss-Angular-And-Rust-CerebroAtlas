import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent {
  activeTab = 'users';
  showCreateRoleModal = false;

  newRole = {
    name: '',
    description: '',
    color: 'teal',
    icon: 'user',
    permissions: {
      patientRecords: { read: false, write: false, delete: false },
      medicalRecords: { read: false, write: false, delete: false },
      prescriptions: { read: false, write: false, delete: false },
      appointments: { read: false, write: false, delete: false },
      labResults: { read: false, write: false, delete: false },
      reports: { read: false, write: false, delete: false },
      userManagement: { read: false, write: false, delete: false },
      systemSettings: { read: false, write: false, delete: false }
    }
  };

  stats = [
    { label: 'Total Users', value: '52', icon: 'users' },
    { label: 'Active Users', value: '48', icon: 'active' },
    { label: 'Inactive Users', value: '4', icon: 'inactive' },
    { label: 'Roles', value: '5', icon: 'roles' },
  ];

  roles = [
    { 
      name: 'Administrator', 
      description: 'Full system access', 
      users: 2,
      color: 'red',
      icon: 'shield'
    },
    { 
      name: 'Physician', 
      description: 'Patient records, prescriptions, consultations', 
      users: 12,
      color: 'teal',
      icon: 'user'
    },
    { 
      name: 'Nurse', 
      description: 'Patient records (read), vitals, appointments', 
      users: 24,
      color: 'blue',
      icon: 'heart'
    },
    { 
      name: 'Lab Technician', 
      description: 'Lab results, patient records (limited)', 
      users: 8,
      color: 'green',
      icon: 'flask'
    },
    { 
      name: 'Receptionist', 
      description: 'Appointments, patient registration', 
      users: 6,
      color: 'amber',
      icon: 'calendar'
    }
  ];

  systemSettings = [
    {
      name: 'Auto Logout Timer',
      description: 'Automatically log out inactive users',
      type: 'select',
      value: '30 minutes',
      options: ['15 minutes', '30 minutes', '1 hour', '2 hours']
    },
    {
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all users',
      type: 'toggle',
      value: true
    },
    {
      name: 'Audit Log Retention',
      description: 'How long to keep audit logs',
      type: 'select',
      value: '1 year',
      options: ['3 months', '6 months', '1 year', '2 years', 'Forever']
    },
    {
      name: 'Password Expiry',
      description: 'Force password change interval',
      type: 'select',
      value: '90 days',
      options: ['30 days', '60 days', '90 days', '180 days', 'Never']
    },
    {
      name: 'Offline Mode',
      description: 'Allow offline data access',
      type: 'toggle',
      value: true
    },
    {
      name: 'Data Encryption',
      description: 'Encrypt all stored data',
      type: 'toggle',
      value: true
    }
  ];

  users = [
    { initials: 'SJ', name: 'Dr. Sarah Johnson', email: 'sarah.j@ruralhealth.org', role: 'Physician', department: 'General Medicine', lastLogin: '2 hours ago', status: 'active' },
    { initials: 'JA', name: 'Dr. James Adeyemi', email: 'james.a@ruralhealth.org', role: 'Physician', department: 'Pediatrics', lastLogin: '1 day ago', status: 'active' },
    { initials: 'MO', name: 'Nurse Mary Obi', email: 'mary.o@ruralhealth.org', role: 'Nurse', department: 'General Ward', lastLogin: '3 hours ago', status: 'active' },
    { initials: 'AU', name: 'Admin User', email: 'admin@ruralhealth.org', role: 'Administrator', department: 'IT', lastLogin: '30 minutes ago', status: 'active' },
    { initials: 'LP', name: 'Lab Tech Peter', email: 'peter.l@ruralhealth.org', role: 'Lab Technician', department: 'Laboratory', lastLogin: '1 week ago', status: 'inactive' },
  ];

  searchQuery = '';

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  openCreateRoleModal() {
    this.showCreateRoleModal = true;
    // Reset form
    this.newRole = {
      name: '',
      description: '',
      color: 'teal',
      icon: 'user',
      permissions: {
        patientRecords: { read: false, write: false, delete: false },
        medicalRecords: { read: false, write: false, delete: false },
        prescriptions: { read: false, write: false, delete: false },
        appointments: { read: false, write: false, delete: false },
        labResults: { read: false, write: false, delete: false },
        reports: { read: false, write: false, delete: false },
        userManagement: { read: false, write: false, delete: false },
        systemSettings: { read: false, write: false, delete: false }
      }
    };
  }

  closeCreateRoleModal() {
    this.showCreateRoleModal = false;
  }

  createRole() {
    if (this.newRole.name && this.newRole.description) {
      // Add new role to the list
      this.roles.push({
        name: this.newRole.name,
        description: this.newRole.description,
        users: 0,
        color: this.newRole.color,
        icon: this.newRole.icon
      });
      
      // Update stats
      this.stats[3].value = String(this.roles.length);
      
      // Close modal
      this.closeCreateRoleModal();
      
      // Show success message (you can implement a toast notification here)
      alert('Role created successfully!');
    }
  }

  get filteredUsers() {
    return this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
