import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, Sidebar],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  notifications = [
    { message: 'Patient consent expiring: Amara Okonkwo (3 days)', time: '10 min ago', type: 'warning' },
    { message: 'New lab results available for 5 patients', time: '1 hour ago', type: 'info' },
    { message: 'Data sync completed successfully', time: '2 hours ago', type: 'success' }
  ];

  recentPatients = [
    { initials: 'AO', name: 'Amara Okonkwo', age: 34, lastVisit: '2 hours ago', status: 'active' },
    { initials: 'KM', name: 'Kwame Mensah', age: 52, lastVisit: '4 hours ago', status: 'follow-up' },
    { initials: 'FH', name: 'Fatima Hassan', age: 29, lastVisit: '6 hours ago', status: 'new' }
  ];

  stats = {
    totalPatients: 2847,
    patientsChange: 12,
    recordsToday: 48,
    recordsChange: 5,
    appointments: 23,
    appointmentsChange: -2,
    pendingSyncs: 7
  };
}
