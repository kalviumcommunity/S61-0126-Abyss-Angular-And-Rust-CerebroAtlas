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

  stats: any[] = [];
  allLogs: any[] = [];
  accessLogs: any[] = [];
  dataChanges: any[] = [];
  securityAlerts: any[] = [];

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
