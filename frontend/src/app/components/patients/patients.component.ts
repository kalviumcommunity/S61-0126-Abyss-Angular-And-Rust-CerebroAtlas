import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, Patient } from '../../services/api.service';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, catchError, startWith, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {
  showFilterDropdown = false;
  private genderFilterSubject = new BehaviorSubject<string>('');
  private statusFilterSubject = new BehaviorSubject<string>('');
  genderFilter: string = '';
  statusFilter: string = '';
  tempGenderFilter: string = '';
  tempStatusFilter: string = '';

  toggleFilterDropdown() {
    this.tempGenderFilter = this.genderFilter;
    this.tempStatusFilter = this.statusFilter;
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  setGenderFilter(val: string) {
    this.tempGenderFilter = val;
  }
  
  setStatusFilter(val: string) {
    this.tempStatusFilter = val;
  }
  
  clearFilters() {
    this.tempGenderFilter = '';
    this.tempStatusFilter = '';
  }
  
  applyFilters() {
    this.genderFilter = this.tempGenderFilter;
    this.statusFilter = this.tempStatusFilter;
    this.genderFilterSubject.next(this.genderFilter);
    this.statusFilterSubject.next(this.statusFilter);
    this.showFilterDropdown = false;
  }

  // State subjects
  private searchTermSubject = new BehaviorSubject<string>('');
  private activeTabSubject = new BehaviorSubject<string>('all');
  readonly activeTab$ = this.activeTabSubject.asObservable();
  private reloadSubject = new BehaviorSubject<void>(undefined);

  // Expose as Observable for async pipe
  patients$: Observable<Patient[]>;
  filteredPatients$: Observable<Patient[]>;
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string>('');

  // Modal state
  showDeleteModal = false;
  patientToDelete: Patient | null = null;

  constructor(private apiService: ApiService, private router: Router) {
    // Fetch patients, handle loading and error
    this.patients$ = this.reloadSubject.pipe(
      tap(() => {
        this.loading$.next(true);
        this.error$.next('');
      }),
      // Switch to API call
      switchMap(() => this.apiService.getPatients().pipe(
        tap(() => this.loading$.next(false)),
        catchError(err => {
          this.error$.next('Failed to load patients: ' + (err.message || 'Unknown error'));
          this.loading$.next(false);
          return of([]);
        })
      )),
      startWith([])
    );

    // Combine patients, search, and tab filters
    this.filteredPatients$ = combineLatest([
      this.patients$,
      this.searchTermSubject.asObservable(),
      this.activeTabSubject.asObservable(),
      this.genderFilterSubject.asObservable(),
      this.statusFilterSubject.asObservable(),
    ]).pipe(
      map(([patients, searchTerm, activeTab, genderFilter, statusFilter]: [Patient[], string, string, string, string]) => {
        let filtered = patients;
        
        // Apply search filter
        if (searchTerm && searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter((p: Patient) =>
            p.first_name.toLowerCase().includes(term) ||
            p.last_name.toLowerCase().includes(term) ||
            (p.village?.toLowerCase().includes(term) ?? false) ||
            (p.active_conditions?.some((c: string) => c.toLowerCase().includes(term)) || false)
          );
        }
        
        // Apply gender filter
        if (genderFilter) {
          filtered = filtered.filter((p: Patient) => p.gender?.toLowerCase() === genderFilter);
        }
        
        // Apply status filter
        if (statusFilter) {
          if (statusFilter === 'critical') {
            filtered = filtered.filter((p: Patient) => p.critical_flag === true);
          } else {
            filtered = filtered.filter((p: Patient) => p.status?.toLowerCase() === statusFilter);
          }
        }
        
        // Apply tab filter
        if (activeTab === 'active') {
          filtered = filtered.filter((p: Patient) => p.status?.toLowerCase() === 'active');
        } else if (activeTab === 'pending') {
          filtered = filtered.filter((p: Patient) => p.sync_status === 'pending');
        } else if (activeTab === 'critical') {
          filtered = filtered.filter((p: Patient) => p.critical_flag === true);
        }
        
        return filtered;
      })
    );
  }

  set searchTerm(val: string) {
    this.searchTermSubject.next(val);
  }
  
  get searchTerm() {
    return this.searchTermSubject.value;
  }

  setTab(tab: string) {
    this.activeTabSubject.next(tab);
  }

  getInitials(patient: Patient): string {
    return (patient.first_name.charAt(0) + patient.last_name.charAt(0)).toUpperCase();
  }

  viewPatient(id: string) {
    this.router.navigate(['/patients', id]);
  }

  confirmDeletePatient(id: string) {
    // Subscribe to get the current patient list and find the patient to delete
    this.patients$.pipe(
      map(patients => patients.find(p => p.id === id)),
      tap(patient => {
        if (patient) {
          this.patientToDelete = patient;
          this.showDeleteModal = true;
        }
      })
    ).subscribe();
  }

  cancelDeletePatient() {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  deletePatientConfirmed() {
    if (this.patientToDelete) {
      this.apiService.deletePatient(this.patientToDelete.id).pipe(
        tap({
          next: () => {
            this.reloadSubject.next();
            this.showDeleteModal = false;
            this.patientToDelete = null;
          },
          error: (err) => {
            this.error$.next('Failed to delete patient: ' + (err.message || 'Unknown error'));
            console.error('Error deleting patient:', err);
            this.showDeleteModal = false;
          }
        })
      ).subscribe();
    }
  }

  addPatient(newPatient: Partial<Patient>) {
    this.apiService.createPatient(newPatient).pipe(
      tap({
        next: () => {
          this.reloadSubject.next();
          this.error$.next('');
        },
        error: (err) => {
          this.error$.next('Failed to add patient: ' + (err.message || 'Unknown error'));
          console.error('Error adding patient:', err);
        }
      })
    ).subscribe();
  }

  updatePatient(id: string, updatedData: Partial<Patient>) {
    this.apiService.updatePatient(id, updatedData).pipe(
      tap({
        next: () => {
          this.reloadSubject.next();
          this.error$.next('');
        },
        error: (err) => {
          this.error$.next('Failed to update patient: ' + (err.message || 'Unknown error'));
          console.error('Error updating patient:', err);
        }
      })
    ).subscribe();
  }
}