import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import type { AdministrationStats, User, Role } from '../../services/api.service';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  activeTab = 'users';
  showCreateRoleModal = false;

  stats: AdministrationStats = {
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    roles: 0
  };
  
  users: User[] = [];
  roles: Role[] = [];
  adminLoading = true;
  adminError = '';
  searchQuery = '';

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

  systemSettings = [
    {
      name: 'Session Timeout',
      description: 'Automatically log out users after period of inactivity',
      type: 'select',
      value: '30 minutes',
      options: ['15 minutes', '30 minutes', '1 hour', '2 hours', '4 hours']
    },
    {
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all user logins',
      type: 'toggle',
      value: true
    },
    {
      name: 'Password Complexity',
      description: 'Enforce strong password requirements',
      type: 'toggle',
      value: true
    },
    {
      name: 'Audit Logging',
      description: 'Log all user actions for compliance',
      type: 'toggle',
      value: true
    },
    {
      name: 'Data Retention',
      description: 'Automatically archive old records',
      type: 'select',
      value: '7 years',
      options: ['1 year', '3 years', '5 years', '7 years', 'Indefinitely']
    },
    {
      name: 'Email Notifications',
      description: 'Send system alerts via email',
      type: 'toggle',
      value: true
    }
  ];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      if (data.administrationData) {
        this.processAdministrationData(data.administrationData);
      } else {
        this.loadAdministration();
      }
    });
  }

  processAdministrationData(data: any) {
    // Handle stats
    this.stats = data.stats || {
      total_users: 0,
      active_users: 0,
      inactive_users: 0,
      roles: 0
    };

    // Handle users - ensure all required fields exist
    this.users = (data.users || []).map((user: any) => ({
      id: user.id || '',
      first_name: user.first_name || 'Unknown',
      last_name: user.last_name || 'User',
      email: user.email || 'no-email@example.com',
      role: user.role || 'User',
      department: user.department || 'General',
      status: user.status || 'inactive',
      last_login: user.last_login || 'Never'
    }));

    // Handle roles
    this.roles = data.roles || [];

    // Update stats based on actual data
    this.updateStats();
    
    this.adminLoading = false;
  }

  updateStats() {
    this.stats.total_users = this.users.length;
    this.stats.active_users = this.users.filter(u => u.status === 'active').length;
    this.stats.inactive_users = this.users.filter(u => u.status === 'inactive').length;
    this.stats.roles = this.roles.length;
  }

  loadAdministration() {
    this.adminLoading = true;
    this.adminError = '';
    
    this.api.getAdministration().subscribe({
      next: (data: any) => {
        this.processAdministrationData(data);
      },
      error: (err: any) => {
        this.adminError = 'Failed to load administration data';
        this.adminLoading = false;
        console.error('Administration error:', err);
      }
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  openCreateRoleModal() {
    this.showCreateRoleModal = true;
    this.resetRoleForm();
  }

  closeCreateRoleModal() {
    this.showCreateRoleModal = false;
  }

  resetRoleForm() {
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

  createRole() {
    if (!this.newRole.name || !this.newRole.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Map camelCase permissions to snake_case for backend compatibility
    const permissions = {
      patient_records: this.newRole.permissions.patientRecords,
      medical_records: this.newRole.permissions.medicalRecords,
      prescriptions: this.newRole.permissions.prescriptions,
      appointments: this.newRole.permissions.appointments,
      lab_results: this.newRole.permissions.labResults,
      reports: this.newRole.permissions.reports,
      user_management: this.newRole.permissions.userManagement,
      system_settings: this.newRole.permissions.systemSettings
    };

    const newRoleObj: Role = {
      name: this.newRole.name,
      description: this.newRole.description,
      color: this.newRole.color,
      icon: this.newRole.icon,
      permissions
    };

    this.roles.push(newRoleObj);
    this.updateStats();
    this.closeCreateRoleModal();
    
    // Show success message
    alert('Role created successfully!');
  }

  get filteredUsers(): User[] {
    if (!this.searchQuery.trim()) {
      return this.users;
    }

    const query = this.searchQuery.toLowerCase();
    return this.users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      const role = user.role.toLowerCase();
      const department = user.department?.toLowerCase() || '';
      
      return fullName.includes(query) || 
             email.includes(query) || 
             role.includes(query) || 
             department.includes(query);
    });
  }

  getUserInitials(user: User): string {
    const firstInitial = user.first_name ? user.first_name[0] : '';
    const lastInitial = user.last_name ? user.last_name[0] : '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  }

  formatLastLogin(lastLogin: string | undefined): string {
    if (lastLogin === 'Never' || !lastLogin) {
      return 'Never logged in';
    }
    
    // If it's a date string, format it nicely
    try {
      const date = new Date(lastLogin);
      if (!isNaN(date.getTime())) {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
          return `${minutes} min ago`;
        } else if (hours < 24) {
          return `${hours} hours ago`;
        } else if (days < 7) {
          return `${days} days ago`;
        } else {
          return date.toLocaleDateString();
        }
      }
    } catch (e) {
      // If parsing fails, return original
    }
    
    return lastLogin;
  }
}