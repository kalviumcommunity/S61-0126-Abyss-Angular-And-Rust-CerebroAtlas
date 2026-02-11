import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  editMode: { [key: string]: boolean } = {};
  editableProfile: any = {};
  private routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

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
          this.editableProfile = JSON.parse(JSON.stringify(data));
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

  navigateBack(): void {
    this.router.navigate(['/patients']);
  }

  toggleEditSection(section: string): void {
    this.editMode[section] = !this.editMode[section];
    if (this.editMode[section]) {
      // Reset editable data to current profile data
      this.editableProfile = JSON.parse(JSON.stringify(this.patientProfile));
    }
  }

  isEditing(section: string): boolean {
    return this.editMode[section] || false;
  }

  cancelEdit(section: string): void {
    this.editMode[section] = false;
    this.editableProfile = JSON.parse(JSON.stringify(this.patientProfile));
  }

  saveEdit(section: string): void {
    // Call API to save the specific section
    const id = this.route.snapshot.params['id'];
    this.http.put(`/api/patients/${id}`, this.editableProfile).subscribe({
      next: (data: any) => {
        this.patientProfile = data;
        this.editableProfile = JSON.parse(JSON.stringify(data));
        this.editMode[section] = false;
        console.log('[PatientProfileComponent] Saved successfully');
      },
      error: (err: any) => {
        console.error('[PatientProfileComponent] Error saving:', err);
        this.error = 'Failed to save changes.';
      }
    });
  }

  addCondition(): void {
    if (!this.editableProfile.active_conditions) {
      this.editableProfile.active_conditions = [];
    }
    this.editableProfile.active_conditions.push('');
  }

  removeCondition(index: number): void {
    this.editableProfile.active_conditions.splice(index, 1);
  }

  addAllergy(): void {
    if (!this.editableProfile.known_allergies) {
      this.editableProfile.known_allergies = [];
    }
    this.editableProfile.known_allergies.push('');
  }

  removeAllergy(index: number): void {
    this.editableProfile.known_allergies.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }
}