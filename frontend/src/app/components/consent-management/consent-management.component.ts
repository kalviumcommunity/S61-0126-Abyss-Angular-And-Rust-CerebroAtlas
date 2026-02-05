import { Component, OnInit } from '@angular/core';
import { ConsentService, Consent } from '../../services/consent.service';
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
export class ConsentManagementComponent implements OnInit {
  activeTab = 'categories';

  consents: Consent[] = [];
  grantedCount = 0;
  deniedCount = 0;
  complianceRate = '0%';

  constructor(private consentService: ConsentService) {}

  ngOnInit() {
    this.loadConsents();
  }

  loadConsents() {
    this.consentService.getConsents().subscribe(data => {
      this.consents = data;
      this.updateStats();
    });
  }

  updateStats() {
    this.grantedCount = this.consents.filter(c => c.granted).length;
    this.deniedCount = this.consents.filter(c => !c.granted).length;
    this.complianceRate = this.consents.length > 0 ? '100%' : '0%';
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
