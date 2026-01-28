import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
  selector: 'app-consent-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './consent-management.component.html',
  styleUrls: ['./consent-management.component.css']
})
export class ConsentManagementComponent {
  activeTab = 'categories';

  researchUse = [
    { label: 'Public health research', granted: false },
    { label: 'Disease outbreak tracking', granted: true },
    { label: 'Academic studies', granted: false },
  ];

  emergencyAccess = [
    { label: 'Emergency room access', granted: true },
    { label: 'Ambulance services access', granted: true },
    { label: 'Community health workers', granted: true },
  ];

  governmentReporting = [
    { label: 'National health registry', granted: true },
    { label: 'Immunization records', granted: true },
    { label: 'Notifiable diseases', granted: true },
  ];

  patients = [
    {
      id: 'AO',
      name: 'Amara Okonkwo',
      granted: 8,
      denied: 5,
      expiring: 1
    },
    {
      id: 'KM',
      name: 'Kwame Mensah',
      granted: 6,
      denied: 7,
      expiring: 0
    },
    {
      id: 'FH',
      name: 'Fatima Hassan',
      granted: 10,
      denied: 3,
      expiring: 2
    }
  ];

  consentHistory = [
    {
      icon: 'checkmark',
      action: 'Granted',
      description: 'Share with referral hospitals',
      date: '2024-01-10',
      time: '10:30 AM',
      actor: 'Patient'
    },
    {
      icon: 'denied',
      action: 'Revoked',
      description: 'Share with pharmacies',
      date: '2024-01-05',
      time: '2:15 PM',
      actor: 'Patient'
    },
    {
      icon: 'checkmark',
      action: 'Granted',
      description: 'Emergency room access',
      date: '2024-01-03',
      time: '9:00 AM',
      actor: 'Patient'
    },
    {
      icon: 'checkmark',
      action: 'Granted',
      description: 'Disease outbreak tracking',
      date: '2024-01-02',
      time: '11:45 AM',
      actor: 'Healthcare Provider'
    }
  ];

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
