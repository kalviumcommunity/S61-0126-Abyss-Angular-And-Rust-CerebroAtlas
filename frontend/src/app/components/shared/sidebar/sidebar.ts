import { Component, Input, OnInit } from '@angular/core';
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
export class Sidebar implements OnInit {
  @Input() userStatus: 'Online' | 'Away' | 'Offline' = 'Online';
  @Input() userName: string = 'Dr. Sarah';
  
  isCollapsed = false;
  private isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined';

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Patients', route: '/patients' },
    { label: 'Medical Records', route: '/medical-records' },
    { label: 'Consent Management', route: '/consent-management' },
    { label: 'Data Sharing', route: '/data-sharing' },
    { label: 'Sync Status', route: '/sync-status' },
    { label: 'Audit Logs', route: '/audit-logs' },
  ];

  ngOnInit(): void {
    const stored = this.getFromStorage('sidebarCollapsed');
    this.isCollapsed = stored === 'true';
    this.applyBodyClass();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.setInStorage('sidebarCollapsed', String(this.isCollapsed));
    this.applyBodyClass();
  }

  private applyBodyClass(): void {
    if (!this.isBrowser) {
      return;
    }
    if (this.isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }

  private getFromStorage(key: string): string | null {
    if (!this.isBrowser || !window.localStorage) {
      return null;
    }
    return window.localStorage.getItem(key);
  }

  private setInStorage(key: string, value: string): void {
    if (!this.isBrowser || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(key, value);
  }

  onSignOut(): void {
    console.log('User signed out');
    // Add sign out logic here
  }
}
