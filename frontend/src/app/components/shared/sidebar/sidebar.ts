import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() userStatus: 'Online' | 'Away' | 'Offline' = 'Online';
  @Input() userName: string = 'Dr. Sarah';
  
  isCollapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Patients', route: '/patients' },
    { label: 'Medical Records', route: '/medical-records' },
    { label: 'Consent Management', route: '/consent-management' },
    { label: 'Data Sharing', route: '/data-sharing' },
    { label: 'Sync Status', route: '/sync-status' },
    { label: 'Audit Logs', route: '/audit-logs' },
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    
    // Toggle body class for global styling
    if (this.isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }

  onSignOut(): void {
    console.log('User signed out');
    // Add sign out logic here
  }
}
