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
  dataSharing = [
    { label: 'Share with referral hospitals', granted: true },
    { label: 'Share with specialist clinics', granted: true },
    { label: 'Share with pharmacies', granted: false },
    { label: 'Share with insurance providers', granted: false },
  ];

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
}
