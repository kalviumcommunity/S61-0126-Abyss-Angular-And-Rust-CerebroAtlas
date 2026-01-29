import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  stats: AdministrationStats | null = null;
  users: User[] = [];
  roles: Role[] = [];
  adminLoading = true;
  adminError = '';

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

  searchQuery = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadAdministration();
  }

  loadAdministration() {
    this.adminLoading = true;
    this.adminError = '';
    this.api.getAdministration().subscribe({
      next: (data: { stats: AdministrationStats; users: User[]; roles: Role[] }) => {
        this.stats = data.stats;
        this.users = data.users;
        this.roles = data.roles;
        this.adminLoading = false;
      },
      error: (err: any) => {
        this.adminError = 'Failed to load administration data';
        this.adminLoading = false;
      }
    });
  }

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
      this.roles.push({
        name: this.newRole.name,
        description: this.newRole.description,
        color: this.newRole.color,
        icon: this.newRole.icon,
        permissions
      });
      // Optionally update stats if needed
      // Close modal
      this.closeCreateRoleModal();
      // Show success message (you can implement a toast notification here)
      alert('Role created successfully!');
    }
  }

  get filteredUsers() {
    if (!this.users) return [];
    return this.users.filter(user => {
      const name = (user.first_name && user.last_name) ? `${user.first_name} ${user.last_name}`.toLowerCase() : '';
      const email = user.email ? user.email.toLowerCase() : '';
      return name.includes(this.searchQuery.toLowerCase()) || email.includes(this.searchQuery.toLowerCase());
    });
  }
}
