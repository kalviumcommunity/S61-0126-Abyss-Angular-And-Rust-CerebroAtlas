import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css'],
  imports: [CommonModule, MatTabsModule, FormsModule, Sidebar],
})

export class PatientProfileComponent implements OnInit, OnDestroy {
  patientProfile: any;
  loading = true;
  error = '';
  selectedTab: string = 'overview';
  editMode: boolean = false;
  editableProfile: any = {};
  private routeSub: Subscription | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.routeSub = this.route.params
      .pipe(
        switchMap(params => {
          const id = params['id'];
          console.log('[PatientProfileComponent] Route param id:', id);
          this.loading = true;
          return this.http.get(`/api/patients/${id}`);
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log('[PatientProfileComponent] Data loaded:', data);
          this.patientProfile = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('[PatientProfileComponent] Error loading patient profile:', err);
          this.error = 'Failed to load patient profile.';
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  getAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 0;
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  onEditProfile() {
    this.editMode = true;
    this.editableProfile = { ...this.patientProfile };
  }

  onCancelEdit() {
    this.editMode = false;
    this.editableProfile = {};
  }

  onSaveEdit() {
    // Here you would call your API to save the changes
    // For now, just update the local profile and exit edit mode
    this.patientProfile = { ...this.editableProfile };
    this.editMode = false;
    // TODO: Add API call to persist changes
  }
}
