import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConsentService, Consent } from '../../services/consent.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
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
    // ngAfterViewInit removed; use ngOnInit for data loading
  activeTab = 'categories';

  consents: Consent[] = [];
  grantedCount = 0;
  deniedCount = 0;
  complianceRate = '0%';

  private routerSub: Subscription | undefined;
  constructor(
    private consentService: ConsentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadConsents();
    // Reload consents on every navigation to this route
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects && event.urlAfterRedirects.includes('consent-management')) {
        this.loadConsents();
      }
    });
  }

  loadConsents() {
    this.consentService.getConsents().subscribe({
      next: (data) => {
        this.consents = data;
        this.updateStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load consents:', err);
        this.consents = [];
        this.updateStats();
      }
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

  onConsentToggle(consent: Consent) {
    const newGranted = !consent.granted;
    this.consentService.updateConsent(consent.id, newGranted).subscribe({
      next: () => {
        // Optimistically update local array
        const idx = this.consents.findIndex(c => c.id === consent.id);
        if (idx !== -1) {
          this.consents[idx].granted = newGranted;
          this.updateStats();
          this.cdr.detectChanges();
        }
      },
      error: () => {
        alert('Failed to update consent');
      }
    });
  }
  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
